// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Fojini ERC20 Contract

/// @notice Library SafeMath used to prevent overflows and underflows
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Token {
    using SafeMath for uint;

    /// variables for the name of token, symbol, decimals aligned with ETH and the totalSupply that define a token
    string public name = "Fojini Token";
    string public symbol = "FJNY";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    ///  Keep track balances and allowances approved using structs for each address
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    /// Events - fire events on state changes etc
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor() {
        totalSupply = 7000000 * (10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    /// @notice transfer amount of tokens to an address
    /// @param _to receiver of token
    /// @param _value amount value of token to send
    /// @return success as true, for transfer
    function transfer(address _to, uint256 _value)
        external
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    /// @dev internal helper transfer function with required safety checks
    /// @param _from, where funds coming the sender
    /// @param _to receiver of token
    /// @param _value amount value of token to send
    /// Internal function transfer can only be called by this contract
    ///  Emit Transfer Event event
    function _transfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        // Ensure sending is to valid address! 0x0 address cane be used to burn()
        require(_to != address(0));
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    /// @notice Approve other to spend on your behalf eg an exchange
    /// @param _spender allowed to spend and a max amount allowed to spend
    /// @param _value amount value of token to send
    /// @return success true, success once address approved
    ///  Emit the Approval event
    /// Allow _spender to spend up to _value on your behalf
    function approve(address _spender, uint256 _value)
        external
        returns (bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /// @notice transfer by approved person from original address of an amount within approved limit, Allow _spender to spend up to _value on your behalf
    /// @param _from, address sending to and the amount to send
    /// @param _to receiver of token
    /// @param _value amount value of token to send
    /// @dev internal helper transfer function with required safety checks
    /// @return success true, success once transfered from original account
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        _transfer(_from, _to, _value);
        return true;
    }
}
