export interface TxListResponse {
  status: string;
  message: string;
  result: TxDetail[];
}


export interface TxDetail {
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  gasused: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}


export const getTransactionListByAddress = async (address: string, apiKey: string) => {
  const endpoint = createTxListEndpoint(address, apiKey);

  const response = await fetch(endpoint, {
    mode: 'cors'
  });

  const responseBody: TxListResponse = await response.json();
  return responseBody.result;
};


const createTxListEndpoint = (address: string, apikey: string) =>
  `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apikey}`;
