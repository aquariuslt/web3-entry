import Web3 from 'web3';


const web3 = new Web3(Web3.givenProvider);


export const getBalance = async (address: string) => {
  const balance = await web3.eth.getBalance(address);
  return `${web3.utils.fromWei(balance)} ETH`;
};
