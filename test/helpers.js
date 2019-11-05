export const tokenFormat = (numTokens) => {
    return new web3.utils.BN(web3.utils.toWei(numTokens.toString(), 'ether'));
}

export const EVM_REVERT = 'VM Exception while processing transaction: revert';