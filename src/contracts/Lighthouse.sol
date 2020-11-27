pragma solidity ^0.5.0;

// Searcher is an interface for contracts that want to be notified of incoming data
contract Searcher {

    // poke is called when new data arrives
    function poke() public;

    // this is called to ensure that only valid Searchers can be added to the Lighthouse - returns an arbitrarily chosen number
    function identify() external pure returns(uint) {
        return 0xda4b055;
    }
}

// for operation of this contract see the readme file.
contract Lighthouse {

    address public auth = msg.sender; // ownable model. No real value in making it transferrable.

    Searcher seeker;                  // a single contract that can be notified of data changes

    uint value;                       // holds all the data bit fiddled into a single 32 byte word.

    uint maxAge;                      // if non zero, sets a limit to data validity

/*--------------------------------- Admin Functions -----------------------------------------------*/

    // Only allows an authorized address to call certain functions
    modifier onlyAuth {
        require(auth == msg.sender, "Unauthorised access");
        _;
    }

    function changeAuth(address newAuth) public onlyAuth {
        auth = newAuth;
    }

    function changeSearcher(Searcher newSeeker) public onlyAuth {
        seeker = newSeeker;
        require(seeker.identify() == 0xda4b055,"invalid searcher");
    }

    function setMaxAge(uint newMaxAge) public onlyAuth {
        maxAge = newMaxAge;
    }

    // Writes a value into the lighthouse. Usually done by a rhombus oracle
    function write(uint  DataValue, uint nonce) external onlyAuth {
        require ((DataValue >> 128) == 0, "Value too large");
        require ((nonce >> 32) == 0, "Nonce too large");
        value = DataValue + (nonce << 192) + (now << 128) ;
        if (address(seeker) != address(0)) {
            seeker.poke();
        }
    }

/*--------------------------------- Public Functions -----------------------------------------------*/

    // Checks if data is within age limit
    function notTooLongSinceUpdated() public view returns (bool) {
        uint since = now - ((value >> 128) &
        0x000000000000000000000000000000000000000000000000ffffffffffffffff);
        return (since < maxAge) || (maxAge == 0);
    }

    // Obtains the data stored inside the lighthouse
    function peekData() external view returns (uint128 v,bool b) {
        v = uint128(value);
        b = notTooLongSinceUpdated() && value != 0;
        return (v, b);
    }

    function peekUpdated()  external view returns (uint32 v,bool b) {
        uint v2 = value >> 128;
        v = uint32(v2);
        b = notTooLongSinceUpdated() && value != 0;
        return (v, b);
    }

    function peekLastNonce() external view returns (uint32 v,bool b) {
        uint v2 = value >> 192;
        v = uint32(v2);
        b = notTooLongSinceUpdated() && value != 0;
        return (v, b);
    }

    function peek() external view returns (bytes32 v ,bool ok) {
        v = bytes32(value & 0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff);
        ok = notTooLongSinceUpdated() && value != 0;
        return (v, ok);
    }

    function read() external view returns (bytes32 x) {
        require(notTooLongSinceUpdated() && value != 0, "Invalid data stored");
        return bytes32(value & 0x00000000000000000000000000000000ffffffffffffffffffffffffffffffff);
    }

}
