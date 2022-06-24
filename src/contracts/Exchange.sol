// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Fojini Exchange Smart Contract
/// @author Zvinodashe Mupambirei
/// @notice Import Fojini Token contract
import "./Token.sol";

/// @notice Include ILighthoue interface. Interact with currently deployed interfaces
import "./Ilighthouse.sol";

/// @notice Library SafeMath used to prevent overflows and underflows
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @notice Library Ownable to control certain things only admin/owner can do
import "@openzeppelin/contracts/access/Ownable.sol";

contract Exchange is Ownable {
    using SafeMath for uint;

    /// @notice Address Lighthouse for randomness
    ILighthouse public myLighthouse;

    /// @notice Circuit breaker pattern some functions stop in emergency or only run in emergency
    bool public emergency;

    modifier stopInEmergency() {
        require(!emergency);
        _;
    }

    modifier onlyInEmergency() {
        require(emergency);
        _;
    }

    /// @notice Variables feeAccount receives exchange fees, feePercent the fixed fee percentage
    address public feeAccount;
    uint256 public feePercent;

    address public constant ETHER = address(0); // store Ether in tokens mapping with blank address
    mapping(address => mapping(address => uint256)) public tokens;

    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;
    uint256 public cancelledOrderCount;
    uint256 public filledOrderCount;

    /// @notice Track if order is cancelled struct orderCancelled or filled struct orderFilled using its id
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;

    /// Reentrancy mutex
    bool private locked = false;

    /// @notice Event when amount deposited exchange
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    /// @notice Event when amount withdrawn exchange
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    /// @notice Event when an order is placed on an exchange
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    /// @notice Event when an order is cancelled
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    /// @notice Event when a trade is done, buy , sell matched
    /// Also returns true if the trade was a lucky one, so no fees
    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address userFill,
        uint256 timestamp,
        bool isLucky
    );

    /// Event when exchange is stopped due to emergency
    event StopExchange(address admin, bool isEmergency);
    /// Event when exchange is restarted after emergency
    event StartExchange(address admin, bool isEmergency);
    /// Structs representing an order has unique id, user and amounts to give and ge between two tokens to exchange
    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

    /// @notice Constructor, when exchange is deployed fee account,feePercent, lighthouse address is set
    /// @param _feeAccount address that receives fees
    /// @param _feePercent fee applied per trade
    /// @param _feePercent fee applied per trade
    /// @param _myLighthouse address of Lighthouse
    constructor(
        address _feeAccount,
        uint256 _feePercent,
        ILighthouse _myLighthouse
    ) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
        // Set the address of the lighthouse...
        myLighthouse = _myLighthouse;
    }

    /// @notice Stop some functionality in emergency
    function stopExchange() external onlyOwner stopInEmergency {
        emergency = true;
        emit StopExchange(msg.sender, emergency);
    }

    /// @notice Stop emergency once challenges have been fixed
    function startExchange() external onlyOwner onlyInEmergency {
        emergency = false;
        emit StartExchange(msg.sender, emergency);
    }

    /// @notice Deposit ether into exchange
    /// @dev Zero address used for Ether as it doesnt have contract address
    /// @dev Same Deposit Event used for all tokens, each token is identified by its address
    /// Emit Deposit event
    function depositEther() external payable stopInEmergency {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    /// @notice Withdraw ether from the exchange
    /// @dev Same Withdraw Event used for all tokens, each token is identified by its address
    /// @param _amount of ether to withdraw
    /// Emit Withdraw event
    function withdrawEther(uint _amount) external {
        require(tokens[ETHER][msg.sender] >= _amount);
        require(!locked, "Reentrant call detected!");
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "failed to send amount");
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
        locked = false;
    }

    /// @notice Deposit token into exchange
    /// @dev Token identified by its address
    /// @dev in emergency deposits can stop CIRCUIT BREAKER
    /// @param _token address of token eg DAI contract address,
    /// @param _amount amount of token to deposit into exchange
    /// Emit Deposit event
    /// Insure Exchange supposed to be approved to move tokens
    function depositToken(address _token, uint _amount)
        external
        stopInEmergency
    {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    /// @notice Withdraw token from exchange
    /// @dev Token identified by its address
    /// @param _token address of token eg DAI contract address,
    /// @param _amount amount of token to withdraw from exchange
    /// Emit Withdraw event
    /// Insure Exchange supposed to be approved to move tokens
    function withdrawToken(address _token, uint256 _amount) external {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(Token(_token).transfer(msg.sender, _amount));
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    /// @notice Balance of tokens in exchange for user
    /// @param _token address of token eg FOJINI contract address,
    /// @param _user address of the exchange user
    /// @return The balance remaining for the user
    function balanceOf(address _token, address _user)
        external
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }

    /// @notice create an order on the exchange
    /// @dev in emergency making orders stop > CIRCUIT BREAKER
    /// @param _tokenGet address of token you want to get
    /// @param _amountGet amount of _tokenGet  that you want
    /// @param _tokenGive address token you want to give in exchange for _tokenGet
    /// @param _amountGive amount of _tokenGive you want to give
    /// Emit Order creation event
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) external stopInEmergency {
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    /// @notice Cancel existing order you created
    /// @dev orders can be cancelled in emergency users will be informed
    /// @param _id unique identifier of the order  to cancel
    /// Emit Cancel order event
    function cancelOrder(uint256 _id) external {
        _Order storage _order = orders[_id];
        require(address(_order.user) == msg.sender);
        require(_order.id == _id); // The order must exist
        cancelledOrderCount = cancelledOrderCount.add(1);
        orderCancelled[_id] = true;
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }

    /// @notice Trade function to give and get amount tokens making exchange
    /// @dev in emergency making orders stop > CIRCUIT BREAKER
    /// @param _id unique identifier of the order to fill hence do trade
    /// Emit Trade event
    function fillOrder(uint256 _id) external stopInEmergency {
        require(_id > 0 && _id <= orderCount);
        require(!orderFilled[_id]);
        require(!orderCancelled[_id]);
        _Order storage _order = orders[_id];
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );
        filledOrderCount = filledOrderCount.add(1);
        orderFilled[_order.id] = true;
    }

    /// @dev internal helper trade function with required safety checks
    /// @param _orderId unique identifier of the order to fill hence do trade
    /// @param _user address of user exchanging to get tokens they want in trade
    /// @param _tokenGet address of token you want to get
    /// @param _amountGet amount of _tokenGet  that you want
    /// @param _tokenGive address token you want to give in exchange for _tokenGet
    /// @param _amountGive amount of _tokenGive you want to giv
    /// Internal function to facilitate the trade of tokens
    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {
        bool _isLucky = _rollDiceLucky();
        if (!_isLucky) {
            // Charging fees only if unlucky
            // Fee paid by the user that fills the order, a.k.a. msg.sender.
            uint256 _feeAmount = _amountGet.mul(feePercent).div(100);
            tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(
                _amountGet.add(_feeAmount)
            );
            tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
            tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount].add(
                _feeAmount
            );
            tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(
                _amountGive
            );
            tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(
                _amountGive
            );
        } else {
            uint256 _feeAmount = 0;
            tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender].sub(
                _amountGet.add(_feeAmount)
            );
            tokens[_tokenGet][_user] = tokens[_tokenGet][_user].add(_amountGet);
            tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(
                _amountGive
            );
            tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(
                _amountGive
            );
            // I am thinking In future extend to eg every 100 trade gets eg 1 ETH, share of fees, free trades for next 15 trades etc
        }

        emit Trade(
            _orderId,
            _user,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            msg.sender,
            block.timestamp,
            _isLucky
        );
    }

    /// @return true if rolldie is lucky
    /// dice rolled for every trade! If lucky get number 6 no fee charged for trade
    function _rollDiceLucky() internal view returns (bool) {
        /*
        Get random number from lighthouse
        a random number from 1 to 6 
        */
        uint number;
        bool ok;
        // obtain random number from Rhombus Lighthouse
        (number, ok) = myLighthouse.peekData();
        if (ok && number == 6) {
            return true;
        } else {
            return false;
        }
    }
}
