import React, { useEffect, useState } from 'react';
import { Button, Card, Code, Input, Page, Spacer, Table, Text, useInput } from '@geist-ui/core';
import Web3 from 'web3';
import { connectAndGetMetaMaskAccountAddress, signMetaMaskMessageRequest } from '../api/metamask.api';
import { getBalance } from '../api/web3.api';
import { getTransactionListByAddress } from '../api/etherscan.api';

const web3 = new Web3(Web3.givenProvider);


const SIGN_MESSAGE_PLACEHOLDER = 'Message from MetaMask';

export function App() {

  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const {
    state: signValue,
    bindings: signValueBindings
  } = useInput(SIGN_MESSAGE_PLACEHOLDER);
  const [signResult, setSignResult] = useState<string>('');
  const [latestRawActivity, setLatestRawActivity] = useState<any[]>([]);

  const connectMetaMask = async () => {
    const addressResult = await connectAndGetMetaMaskAccountAddress();
    setConnected(true);
    setAddress(addressResult);
    const balanceResult = await getBalance(addressResult);
    setBalance(balanceResult);
  };

  const sendSignMessage = async () => {
    console.log('sign with value:', signValue, web3.utils.utf8ToHex(signValue), 'with address:', address);

    const signResult = await signMetaMaskMessageRequest(address, signValue);
    setSignResult(signResult);
  };

  const queryTransactionHistory = async () => {
    console.log('query transaction history using eth.filter for address:', address);

    const txHistories = await getTransactionListByAddress(address);
    const latestActivities = txHistories.slice(0, 5);
    setLatestRawActivity(latestActivities);
  };

  const disconnect = () => {
    disconnect();
  };

  useEffect(() => {
    if (address !== '') {
      console.log('query latest transaction history');
      queryTransactionHistory()
        .then();
    }
  }, [address]);


  return (
    <Page>
      <Text h1>MetaMasky</Text>


      <Text h3>1. Connect MetaMask & GetBalance</Text>
      <Button
        onClick={connectMetaMask}
        disabled={connected}
        type={connected ? 'default' : 'success'}
      >
        {
          connected ? 'Connected' : 'Connect'
        }
      </Button>

      <Spacer />

      <Text h3>2. Account Details</Text>
      <Text>Address: {address}</Text>
      <Text>Balance: {balance}</Text>

      <Text h3>3. Input and Sign with JSON-RPC</Text>

      <div style={{
        marginBottom: 5
      }}>
        <Input placeholder={SIGN_MESSAGE_PLACEHOLDER}
               disabled={!connected}
               width='100%'
               {...signValueBindings} />
      </div>
      <div>
        <Button onClick={sendSignMessage}>Sign & Send Message</Button>
      </div>
      <Text>Sign Result:</Text>

      {
        signResult &&
        <Card>
          <Code style={{
            wordWrap: 'break-word'
          }}> {signResult}</Code>
        </Card>
      }

      <Spacer />
      <Text h3>4. Latest Activity </Text>

      <Table data={latestRawActivity}>
        <Table.Column prop='timeStamp' label='TimeStamp'
                      render={(raw) => <p>{(new Date(Number(raw) * 1000).toDateString())}</p>} />
        <Table.Column prop='from' label='From' />
        <Table.Column prop='to' label='To' />
        <Table.Column prop='value' label='Value' render={(raw) => <p> {web3.utils.fromWei(raw)} eth</p>} />
        <Table.Column prop='blockNumber' label='Block Number' />
        <Table.Column prop='hash' label='Tx. Hash' />
        <Table.Column prop='gas' label='Gas' />
      </Table>

      <Spacer />
      <Text h3>5. Disconnect MetaMask</Text>
      <Button onClick={disconnect} type='warning'>Disconnect MetaMask</Button>
    </Page>
  );
}

export default App;

