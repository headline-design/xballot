import React, { useState, useEffect, useCallback } from 'react';
import BaseMessageBlock from 'views/SpaceView/SpaceProposal/Components/BaseMessageBlock';
import { Block } from 'components/BaseComponents/Block';
import WalletListbox from './Components/WalletListbox';
import { Formik, getIn } from 'formik';
import * as Yup from 'yup';
import FormikInput from 'components/Input/FormikInput';
import { shorten } from 'helpers/utils';
import { DisplayFormikState } from 'components/DisplayFormik';
import { useLoginModal } from 'contexts/LoginModalContext';
import { optInToApp, optInToAsset, sendTransaction } from './Components/WalletUtils';
import { useTransactionModal } from 'contexts/TransactionModalContext';
import { getWalletBalances } from 'utils/functions';
import QRModal from 'components/BaseComponents/QRModal';
import { PlusButtonIcon } from 'icons/PlusButton';
import { getEndKeys } from 'utils/endPoints';
import BaseMenuDots from 'components/BaseComponents/BaseMenu/BaseMenuDots';

const WalletExpandedAccount = ({ wallet, pipeState, rawSettings = false }) => {
  const { openTransactionModal } = useTransactionModal();
  const { openLoginModal, setXWalletOpen } = useLoginModal();
  const endKeys = getEndKeys();

  const updateProposalSchema = Yup.object({
    input1: Yup.string()
      .min(1, 'Title should be at least 1 characters')
      .max(38, 'Title should not exceed 30 characters')
      .required('Title is required'),
  });

  const [loading, setLoading] = useState(false);
  const [input1, setInput1] = useState(null);
  const [input2, setInput2] = useState(null);
  const [input3, setInput3] = useState(null);
  const [savedMnemonic, setSavedMnemonic] = useState(() => localStorage.getItem('xMnemonic'));
  const [walletAssets, setWalletAssets] = useState([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const optItems = [
    {
      id: 1,
      name: 'Opt-in to app',
      input1: 'appId',
      input1Title: 'App Id',
      description1: 'Opt-in to application',
      buttonTitle: 'Opt-in',
      description2: 'Required for app interaction',
      send: 'optInToApp',
      defaultFormData: 'defaultFormData',
    },
    {
      id: 2,
      name: 'Opt-in to asset',
      input1: 'assetId',
      input1Title: 'Asset Id',
      description1: 'Opt-in to asset',
      buttonTitle: 'Opt-in',
      description2: 'Required for asset transfers',
      send: 'optInToAsset',
    },
  ];

  const items = [
    {
      id: 1,
      name: 'Opt-in to app',
      entities: 'app',
      input1: 'appId',
      input1Title: 'App Id',
      description1: 'Opt-in to application',
      buttonTitle: 'Opt-in',
      description2: 'Required for app interaction',
      send: 'optInToApp',
      defaultFormData: 'defaultFormData',
    },
    {
      id: 2,
      name: 'Opt-in to asset',
      entities: 'asset',
      input1: 'assetId',
      input1Title: 'Asset Id',
      description1: 'Opt-in to asset',
      buttonTitle: 'Opt-in',
      description2: 'Required for asset transfers',
      send: 'optInToAsset',
    },
    {
      id: 3,
      name: 'Send transaction',
      entities: 'algo/asa',
      input1: 'amount',
      input1Type: 'number',
      input1Title: 'Amount',
      input2Type: 'text',
      input2: 'address',
      input2Title: 'Recipient address',
      input3Title: 'Assets',
      description1: 'Send transaction to another address',
      description2: 'On-chain asset transfers',
      buttonTitle: 'Send',
      send: 'sendTransaction',
    },
    {
      id: 4,
      name: 'Generate QR code',
      entities: 'address',
      input1Title: 'Address',
      description1: 'Generate QR code for the address',
      buttonTitle: 'Generate',
      description2: 'QR code for incoming transfers',
      send: 'generateQR',
      defaultFormData: 'defaultQRFormData',
    },
    {
      id: 5,
      name: 'Delegate',
      entities: 'address',
      input1Title: 'Delegate to',
      description1: 'Delegate voting power to another address',
      buttonTitle: 'Delegate',
      description2: 'Voting power delegation',
      send: 'delegateAddress',
      defaultFormData: 'defaultDelegateFormData',
    },
  ];

  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [selectedAssetItem, setSelectedAssetItem] = useState(walletAssets[0]);
  const [xAddress, setXAddress] = useState('');
  const [transactionObject, setTransactionObject] = useState(selectedItem);
  const defaultFormData = {
    input1: transactionObject?.id === 3 ? pipeState.myAddress : null,
    input2: null,
    input3: null,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [tAssetObject, setTAssetObject] = useState(selectedItem);
  const { isTransactionModalOpen } = useTransactionModal();
  console.log('isTransaction', isTransactionModalOpen);

  useEffect(() => {
    setTAssetObject(selectedAssetItem);
  }, [selectedAssetItem]);

  useEffect(() => {
    const getAccountData = async () => {
      let assets = await getWalletBalances(pipeState.myAddress, [], true);
      console.log('assets', assets);
      if (assets) {
        setWalletAssets(assets);
      }
      if (localStorage.getItem('xAddress')) {
        setXAddress(localStorage.getItem('xAddress'));
      }
    };
    getAccountData();
  }, [pipeState.myAddress]);

  console.log(input1);

  const functionMapping = {
    optInToApp: () =>
      optInToApp(
        openLoginModal,
        setXWalletOpen,
        input1,
        setLoading,
        callbacks.onSubmitting,
        callbacks.onError,
        callbacks.onSuccess,
        true,
        undefined,
        openTransactionModal,
        undefined,
        pipeState,
      ),
    optInToAsset: () =>
      optInToAsset(
        openLoginModal,
        setXWalletOpen,
        input1,
        setLoading,
        callbacks.onSubmitting,
        callbacks.onError,
        callbacks.onSuccess,
        true,
        undefined,
        openTransactionModal,
        undefined,
        pipeState,
      ),
    sendTransaction: () =>
      sendTransaction(
        openLoginModal,
        setXWalletOpen,
        input2,
        Number(input1) * Math.pow(10, tAssetObject?.decimals),
        input3,
        setLoading,
        callbacks.onSubmitting,
        callbacks.onError,
        callbacks.onSuccess,
        true,
        undefined,
        openTransactionModal,
        undefined,
        pipeState,
      ),
    generateQR: () => setIsQRModalOpen(true),
  };

  console.log('transactionObject', input2, input1, input3);

  const handleUpStream = useCallback(async (data) => {
    setTransactionObject(data);
  }, []);

  const handleOptItemsUpStream = useCallback(async (data) => {
    setTransactionObject(data);
  }, []);

  console.log('walletAssets', walletAssets);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMnemonicDecoded, setIsMnemonicDecoded] = useState(false);

  useEffect(() => {
    if (savedMnemonic && !isMnemonicDecoded) {
      setIsPasswordModalOpen(true);
    }
  }, [savedMnemonic, isMnemonicDecoded]);

  const callbacks = {
    onSubmitting: () => {
      console.log('---Submitting');
    },

    onSuccess: () => {
      console.log('---Success');
    },

    onError: () => {
      console.log('---Error');
    },
  };

  useEffect(() => {
    let newFormData = {};
    if (transactionObject.id === 1) {
      newFormData = {
        input1: endKeys.appId,
        input2: null,
        input3: null,
      };
    } else if (transactionObject.id === 2) {
      newFormData = {
        input1: endKeys.assetId,
        input2: null,
        input3: null,
      };
    } else if (transactionObject.id === 3) {
      newFormData = {
        input1: null,
        input2: null,
        input3: null,
      };
    } else if (transactionObject.id === 4) {
      newFormData = {
        input1: pipeState.myAddress,
        input2: null,
        input3: null,
      };
    } else if (transactionObject.id === 5) {
      newFormData = {
        input1: xAddress || pipeState.myAddress,
        input2: null,
        input3: null,
      };
    }
    setFormData(newFormData);
  }, [endKeys.appId, endKeys.assetId, xAddress, pipeState.myAddress, transactionObject.id]);

  console.log('xAddress', xAddress);

  return (
    <div>
      <Block
        title={shorten(wallet?.address)}
        buttonRight={<BaseMenuDots items={items} onSelect={handleUpStream} />}
      >
        <Formik
          initialValues={formData}
          validationSchema={updateProposalSchema}
          onSubmit={(values) => {
            console.log('VALUES', values);
          }}
          enableReinitialize
        >
          {(formik) => {
            const { values } = formik;
            const localInput1 = getIn(values, 'input1');
            const localInput2 = getIn(values, 'input2');
            const localInput3 = getIn(values, 'input3');
            if (localInput1 !== input1) {
              setInput1(localInput1);
            }
            if (localInput2 !== input2) {
              setInput2(localInput2);
            }
            if (localInput3 !== input3) {
              setInput3(localInput3);
            }

            return (
              <>
                <div className="space-y-3">
                  <div className="mb-4 w-full space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
                    {(transactionObject?.id === 1 || transactionObject?.id === 2) && (
                      <WalletListbox
                        upStream={handleOptItemsUpStream}
                        items={optItems}
                        title="Transactions"
                      />
                    )}
                    {transactionObject?.id === 5 && (
                      <>
                        <div className="group w-full rounded-3xl">
                          <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                            Delegate from
                          </span>
                          <button
                            data-v-4571bf26=""
                            type="button"
                            className="button flex w-full items-center gap-1 px-[22px]"
                            onClick={() => console.log('hello world')}
                          >
                            {' '}
                            Connect Wallet 2
                          </button>
                        </div>
                      </>
                    )}
                    {transactionObject?.id === 3 && (
                      <WalletListbox
                        upStream={async (data) => {
                          setTAssetObject(data);
                          formik.setFieldValue('input3', data.assetId);
                        }}
                        items={walletAssets}
                        title="Select asset"
                      />
                    )}

                    <FormikInput
                      type="text"
                      name="input1"
                      title={transactionObject?.input1Title}
                      value={formData.input1}
                      maxLength={undefined}
                      placeholder={undefined}
                      id={input1}
                      count={false}
                      ref={undefined}
                      errorTag={undefined}
                      errorField={undefined}
                    />
                  </div>
                  {transactionObject?.id === 3 && (
                    <div className="w-full space-y-2 pb-4 sm:flex sm:space-x-4 sm:space-y-0">
                      <FormikInput
                        type={transactionObject?.input2Type}
                        name="input2"
                        title={transactionObject?.input2Title}
                        value={formData.input2}
                        maxLength={undefined}
                        placeholder={undefined}
                        id={input2}
                        count={false}
                        ref={undefined}
                        errorTag={undefined}
                        errorField={undefined}
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-1">
                      <h4>{transactionObject.description1}</h4>
                      <span className="text-sm text-xs hover:text-skin-link">
                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2c2.21 0 4 1.343 4 3c0 1.4-1.278 2.575-3.006 2.907c-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="-mt-[3px] text-sm"> ({transactionObject.description2}) </div>
                  </div>
                  <div>
                    <button
                      data-v-4571bf26=""
                      type="button"
                      className="button flex w-full items-center gap-1 px-[22px]"
                      onClick={functionMapping[transactionObject.send]}
                    >
                      <PlusButtonIcon /> {transactionObject.buttonTitle}
                    </button>
                  </div>
                </div>
                {rawSettings && <DisplayFormikState {...formik} />}
                {formik.touched.input1 && formik.errors.input1 && (
                  <div className="mt-3">
                    <BaseMessageBlock level="warning-red">
                      <span>{formik.errors.input1}</span>
                    </BaseMessageBlock>
                  </div>
                )}
              </>
            );
          }}
        </Formik>
      </Block>
      {transactionObject?.id === 4 && (
        <QRModal open={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} address={input1} />
      )}
    </div>
  );
};

export default WalletExpandedAccount;
