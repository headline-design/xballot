import React, { useState, useEffect } from 'react';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import algosdk from 'algosdk';

const SpaceRequest = (props) => {
  const [appAddress, setAppAddress] = useState('');

  useEffect(() => {
    let appAddress = algosdk.getApplicationAddress(parseInt(props.appId));
    setAppAddress(appAddress);
    props.callback();
  }, []);

  const send = async () => {
    let txid = await Pipeline.send(
      appAddress,
      0,
      document.getElementById('requestMessage').value,
      undefined,
      undefined,
      0
    );
    console.log('Message sent with txid: ' + txid);
    props.callback();
  };

  return (
    <div>
      <input type="text" id="requestMessage" />
      <button onClick={send}>Send Request</button>
    </div>
  );
};

export default SpaceRequest;