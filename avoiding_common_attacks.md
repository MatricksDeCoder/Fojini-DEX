# Avoiding Common Attacks, Dangers and the Security Considerations

Smart contracts are very critical software as they hold and interact with real value and funds. As such a lot of common attacks were kept in mind and safeguarded against in addition to various security considerations and checks.

##### 1. Reentrancy Attacks

The process of sending ether to an address, requires the contract to submit an external call, this can lead to hijack that can reenter the contract.
<strike> a. .trasnsfer() is pereferred by us over .call() as its limited to 2300 gas. </strike>
Due to new information [Stop Using solidity transfer](https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/) all transfer will be replaced with
call e.g (bool success, ) = msg.sender.call.value(amount)("") and rely on Check Effects Interactions and Reentrancy Guards!
b. We do internal work in contracts prior to external calls. The safeguard is aligned to the Check Effects Interactions design pattern we use. For example in our function below, balances ie state are updated before the transfer.
c. Reentrancy guards

**_OLD_**

```
    function withdrawEther(uint _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        msg.sender.transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }
```

NEW

```
    bool locked = false;

    function withdrawEther(uint _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        require(!locked, "Reentrant call detected!");
        locked = true;
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        msg.sender.call.value(_amount)("");
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
        locked = false;
    }
```

##### 2. Overflows and underflows

The EVM has fixed size data types eg uint8 can only store numbers in the range [0,255]. If balances exceed 255 we go back to 0. Library SafeMath form Open Zeppelin is used to prevent overflows and underflows. Example in function below update to state for balances uses functions like .add() or .sub() to add or subtract with overflow and underflow safety

```
    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(Token(_token).transfer(msg.sender, _amount));
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

// Even without SafeMath  we avoided mistakes like below were balance can still
// withdraw due to underflow
function withdrawToken(address _token, uint256 _amount) public {
    require(tokens[_token][msg.sender] - _value >= 0);
    ...
  }
```

##### 3. Visibility Specifiers

Functions that need to be internal are marked as so to avoid them being called maliciously from outside e.g our \_trade() function in Exchange and \_transfer() in Token.

##### 4. Deterministic Transition and lack of randomness

There is no real randomness in the blockchain as state transitions are done in a calculable way that is hackable. Some trades if lucky will not pay fees, to generate randomness that cant be hacked we use Oracles, Rhombus Lighthouse to give us random numbers.

##### 5. Testing

JavaScript testing of all the smart contracts used was use to ensure contracts behave as expected.
See test folder

##### 6. Single party risk admin

Admin has all the power to implement circut breaker pattern and stop functionality of exchange. **In future we look to implement multisig contracts that involve the users of the exchange.**

##### 7. Eth sent to contracts

We use fallback functions, any ETH incorrectly, mistakenly or maliciously sent to contract as not expected is sent back. Although ETH can still be sent forcibly sent to us, we made sure none of our code or functions seem vulnerable to that attack.

```
    function() external {
        revert();
    }
```

##### 8. Security Analysis tools

Static analysis, vulnerability checking, smart contract auditing, formal verification, symbolic analysis., security bug checking tools like [Mythx](https://mythx.io/), [SmartCheck](https://tool.smartdec.net/) and [Mythril](https://github.com/ConsenSys/mythril) will be used.

SmartCheck recommended external functions over public, we adjusted.
SmartCheck did not recommend Using SafeMath library, we still used it as we still did balance checks and we considered severity low  
SmartCheck also recommended using fixed compiler version and we adjusted.

##### 8. Avoided tx.origin

As this references the original sender and can be manipulated so is never used for authorization. msg.sender always prefered...
