export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

export const EVM_REVERT = "VM Exception while processing transaction: revert";

// Helpers to format eth & token to full decimals wei and like wei
export const etherFormat = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), "ether"));
};

// Same as ether
export const tokenFormat = (n) => etherFormat(n);
