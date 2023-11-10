import React, { useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import Pipeline, { Escrow } from '@pipeline-ui-2/pipeline/index.js';
import BaseInput from 'components/Input/BaseInput';
import { Button } from 'components/BaseComponents/Button';
import { useXWallet } from 'contexts/XWalletContext';
import BaseMessageBlock from 'views/SpaceView/SpaceProposal/Components/BaseMessageBlock';

const cBuffer = (text) => Uint8Array.from([...text].map((ch) => ch.charCodeAt(0)));
const deBuffer = (uintArray) =>
  uintArray.reduce((str, byte) => str + String.fromCharCode(byte), '');
const pad = (uarray) => Uint8Array.from({ length: 32 }, (_, i) => uarray[i] || 0);
const nonce = new Uint8Array(24).fill(0);

export const PasswordModal = ({ PipeConnectors, switchWallet, setIsXWalletOpen }) => {
  const [password, setPassword] = useState('');
  const [walletFirstCreated, setWalletFirstCreated] = useState(false);
  const [savedMnemonic, setSavedMnemonic] = useState(localStorage.getItem('xMnemonic'));
  const [passwordErrorObj, setPasswordErrorObj] = useState({
    isError: false,
    text: '',
  });

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    setPasswordErrorObj({ isError: false, text: '' }); // Reset the error object when changing the password
  };

  // Inside PasswordModal
  const { setIsWalletUnlocked } = useXWallet();

  const handleSubmit = () => {
    const paddedPassword = pad(cBuffer(password));

    if (savedMnemonic) {
      const decryptedArray = nacl.secretbox.open(cBuffer(savedMnemonic), nonce, paddedPassword);
      if (!decryptedArray) {
        setPasswordErrorObj({ isError: true, text: 'Incorrect password' });
        return;
      }
      const decryptedMnemonic = deBuffer(decryptedArray);
      Escrow.importAccount(decryptedMnemonic);
      console.log('escrow address', Escrow.address);
      setIsWalletUnlocked(true); // <-- set the wallet to unlocked
      Pipeline.pipeConnector = PipeConnectors.XWallet;
      switchWallet();
    } else {
      const account = Escrow.createAccount();
      const encryptedMnemonic = cBuffer(account.mnemonic);
      const encrypted = nacl.secretbox(encryptedMnemonic, nonce, paddedPassword);
      localStorage.setItem('xMnemonic', deBuffer(encrypted));
      localStorage.setItem('xAddress', Escrow.address);
      setWalletFirstCreated(true); // <-- set the wallet to unlocked
      setSavedMnemonic(localStorage.getItem('xMnemonic'));
      Pipeline.pipeConnector = PipeConnectors.XWallet;
      switchWallet();
    }
  };

  useEffect(() => {
    if (!savedMnemonic) setIsXWalletOpen(true);
  }, [savedMnemonic, setIsXWalletOpen]);

  return (
    <>
      <div className="modal-body">
        <div className="min-h-[150px] space-y-3">
          <div className="leading-5 sm:leading-6">
            <div>
              <div className="m-4">
                {passwordErrorObj.isError ? (
                  <BaseMessageBlock level="warning-red">
                    <span>{passwordErrorObj.text}</span>
                  </BaseMessageBlock>
                ) : (
                  <BaseMessageBlock level="info">
                    <span>
                      {savedMnemonic
                        ? 'Unlock your X Wallet'
                        : 'Create a password for your X Wallet'}
                    </span>
                  </BaseMessageBlock>
                )}
              </div>
              <div className="m-4 space-y-1 text-skin-text">
                <BaseInput
                  type="password"
                  value={password}
                  onChange={handlePasswordInput}
                  name={undefined}
                  title={undefined}
                  placeholder={'xxxxxxxxxxx'}
                  maxLength={50}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t p-4 text-center">
        <Button
          disabled={password.length > 0 ? false : true}
          className="button button--primary w-full px-[22px] hover:brightness-95"
          onClick={handleSubmit}
        >
          {savedMnemonic && !walletFirstCreated ? 'Unlock' : 'Create'}
        </Button>
      </div>
    </>
  );
};
