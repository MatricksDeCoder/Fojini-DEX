# Design Patterns

Smart contracts are very critical software as they hold and interact with real value and funds. The following design patterns were considered in developing this exchange.

##### 1. Restricting Access

Only admin of the exchange can implement circuit breaker in event of problem using access modifier.

```
    address public admin;
    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }
```

Helper functions in the contracts are made internal so they cant be called outside contract.

##### 2. Fail early and fail loud and guard checks

Many functions in the smart contracts use _require_ to ensure they fail early if certain conditions are met. This not only ensures early throws but security to ensure function logic runs when it must. Examples used include requiring sufficient balances before withdrawals, filling Orders ie trading on only existing open orders that are not cancelled or traded yet.

In ecxchange contract we use transfer() over send() which has a shortcoming of failing silently.
Guards like require(\_token != ETHER) when depositing token ensure token and not Ether is deposited and vice versa when depositing Ether.

#### 3. Circuit Breaker

Gives the admin of the exchange ability to stop functionality or ensure functionality during a problem or emergencies like critical bugs so contract can be stopped.

```sh
   bool private emergency;
    modifier stopInEmergency {
        require(!emergency);
        _;
    }
    modifier onlyInEmergency {
        require(emergency);
        _;
    }
   // Deposits, orders and trades will be stopped in emergency and order book will be cleared e.g
   function depositToken(address _token, uint _amount)  stopInEmergency public {...
```

#### 4. Pull over Push Payments

```sh
// Users make pull payments themselves msg.sender.transfer()
// this pattern is more secure against Reentrancy and Denial of Service Attack
 function withdrawEther(uint _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        msg.sender.transfer(_amount)
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }
```

### 5. Checks Effects Interactions

In contracts we always validated arguments first, checked using requires to throw errors early, make changes to state and lastly did transfers. Eg below in
withdrawToken we ensure right token not Ether is being withdrawn, user has sufficient balance, reduce user balance first to change state and then do the transfer()

```sh
 function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(Token(_token).transfer(msg.sender, _amount));
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
```

### 6. Oracle and Randomness

To give information random number in this case with Rhombus Lighthouse as randomness is hard or hackacble on the blockchain.
