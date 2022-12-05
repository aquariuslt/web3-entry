// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.less';
import React, { useState } from 'react';
import { Button, Card, Input, Page, Text, useInput } from '@geist-ui/core';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

const web3 = new Web3(Web3.givenProvider);

const transactionHistoryContract: AbiItem[] = [
  {
    constant: false,
    type: 'function',
    payable: false,
    name: 'transfer',
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'unit256'
      }
    ],
    outputs: []
  }
];

export function App() {

  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const {
    state: signValue,
    setState: setSignValue,
    reset: resetSignValue,
    bindings: signValueBindings
  } = useInput('');
  const [signResult, setSignResult] = useState<string>('');

  const connectMetaMask = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts: any[]) => {
          // get account info
          const account = accounts[0];
          setAddress(account);
          console.log('request account with:', account);

          // query and shows balances
          web3.eth.getBalance(account)
            .then((balance: string) => {
              const formattedBalance = web3.utils.fromWei(balance);
              console.log('balance is :', balance);
              console.log('formatted balance is: ');
              setBalance(formattedBalance);
            });

          // example address with more than 5 histories
          // 0x84d34f4f83a87596cd3fb6887cff8f17bf5a7b83
          // query latest 5 activity
          const sampleContractAddress = '';
          const sampleAccountAddress = '0x84d34f4f83a87596cd3fb6887cff8f17bf5a7b83';
          // const getTransactionHistoryContract = new web3.eth.Contract(transactionHistoryContract, sampleAccountAddress);


          // sample transaction hash is 0xb7b0211af2271dccf2199f71a5b9f00b52b6c2317650ee54be032c5f13197e94
          const sampleTransactionHash = '0xb7b0211af2271dccf2199f71a5b9f00b52b6c2317650ee54be032c5f13197e94';
          web3.eth.getTransaction(sampleTransactionHash)
            .then((result) => {
              console.log('transaction hash result is:', result);
            });


        });
    } else {
      // perform warning
      console.log('MetaMask is installed!');
    }

  };

  const performSign = () => {
    console.log('sign with value:', signValue, web3.utils.utf8ToHex(signValue), 'with address:', address);


    const messageParams = JSON.stringify({
      domain: {
        chainId: 5,
        name: 'Ether Mail',
        version: '1',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
      },
      message: {
        contents: signValue
      },
      primaryType: 'Mail',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
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

    const params = [address, messageParams];
    const signMethod = 'eth_signTypedData_v4';

    window.ethereum.request({
      method: signMethod,
      params: params
    }).then((result: string) => {
      console.log('sign result:', result);
      setSignResult(result);
    }).catch((error: any) => {
      console.warn('sign error:', error);
    })
    ;

  };

  const disconnectMetaMask = ()=>{
    console.log('disconnect MetaMask just hard-reloading all page');
    location.reload();
  }


  return (
    <Page>
      <Text h1>MetaMasky</Text>


      <Text>1. Connect MetaMask & GetBalance</Text>
      <Button onClick={connectMetaMask}>Connect</Button>
      <Text>2. Balance: {balance} </Text>

      <Text>3. Input and Sign with JSON-RPC</Text>

      <div style={{
        marginBottom: 5
      }}>
        <Input placeholder={'Input Here'} {...signValueBindings} />
      </div>
      <div>
        <Button onClick={performSign}>Sign</Button>
      </div>
      <Text>Sign Result: {signResult}</Text>


      <Text>5. Disconnect MetaMask</Text>
      <Button onClick={disconnectMetaMask} type="warning">Disconnect MetaMask</Button>
    </Page>
  );
}

export default App;

