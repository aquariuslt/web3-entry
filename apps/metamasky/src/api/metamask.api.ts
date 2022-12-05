export const ensureMetaMaskInstalled = () => {
  if (typeof window.ethereum == 'undefined') {
    throw new Error('MetaMask is not install');
  }
};

export const connectAndGetMetaMaskAccountAddress = async () => {
  ensureMetaMaskInstalled();
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

  if (accounts.length === 0) {
    return '';
  }

  return accounts[0];
};

export const disconnectMetaMask = () => {
  location.reload();
};

export const signMetaMaskMessageRequest = async (address: string, contents: string) => {
  ensureMetaMaskInstalled();
  const message = createSimpleSignMessageParams(contents);
  const params = [address, message];
  const signMethod = 'eth_signTypedData_v4';

  return await window.ethereum.request({
    method: signMethod,
    params: params
  });
};


const createSimpleSignMessageParams = (contents: string) => {
  return JSON.stringify({
    domain: {
      chainId: 1,
      name: 'Simple Sign Message',
      version: '1',
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    },
    message: {
      contents: contents
    },
    primaryType: 'Mail',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
      ],
      // Not an EIP712Domain definition
      Group: [
        { name: 'name', type: 'string' },
        { name: 'members', type: 'Person[]' }
      ],
      // Refer to PrimaryType
      Mail: [
        { name: 'contents', type: 'string' }
      ],
      // Not an EIP712Domain definition
      Person: [
        { name: 'name', type: 'string' }
      ]
    }
  });
};
