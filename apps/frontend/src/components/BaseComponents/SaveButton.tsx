import { create } from 'ipfs-http-client';
import { Button } from 'components/BaseComponents/Button';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import React, { useState, useCallback, useEffect } from 'react';
import { useTransactionModal } from 'contexts/TransactionModalContext';

export interface SaveButtonProps {
  data: any;
  appId: any;
  type: any;
  max?: any;
  send: any;
  disabled: any;
  loading: any;
  title: any;
  onError: any;
  onSuccess: any;
  onSubmitting: any;
  navLink: any;
  openModal?: any;
  openBody?: any;
}

const template = {
  Title: '',
  Description: '',
  daoDescription: '',
  imageLink: '',
};

const ptemplate = {
  Title: '',
  Description: '',
  daoDescription: '',
  imageLink: '',
};

const ipfsClient = (() => {
  const infuraProjectId = '2DBKADXQkjmd1KDSg7kq4ext7D3';
  const infuraProjectSecret = '08c9d9923e313326c20a3d163193ab60';

  return create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: `Basic ${Buffer.from(infuraProjectId + ':' + infuraProjectSecret).toString(
        'base64',
      )}`,
    },
  });
})();

async function uploadRecord(object) {
  try {
    const returnedData = await ipfsClient.add(Buffer.from(JSON.stringify(object)));
    return returnedData;
  } catch (error) {
    console.error(error);
    return { path: null }; // Return an object with a null path when an error occurs
  }
}

async function describe(hash, appId, type, max) {
  try {
    const txId = await Pipeline.appCall(
      appId,
      type === 'describe' ? [type, hash] : ['start', hash, max],
    );
    return txId;
  } catch (error) {
    console.error(error);
  }
}

const SaveSettingsBtn = React.memo(
  ({
    data,
    appId,
    type,
    max,
    send,
    disabled,
    loading,
    title,
    onSubmitting,
    onError,
    onSuccess,
    navLink,
    openModal,
    openBody,
  }: SaveButtonProps) => {
    const { openTransactionModal, openTransactionBody } = useTransactionModal();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
      setButtonDisabled(false);
    }, [disabled]);

    const handleClick = useCallback(async () => {
      try {
        setButtonLoading(true);
        setButtonDisabled(true);

        const record = await uploadRecord(data);

        if (record.path === null) {
          setButtonLoading(false);
          setButtonDisabled(false);
          onError();
          return;
        }

        const { path: hash } = record;

        if (send) {
          const localAppId = typeof appId !== 'number' ? appId : JSON.stringify(appId);
          const txId = await describe(hash, localAppId, type, max);

          if (txId) {
            const modalProps = {
              onSuccess: () => onSuccess(txId),
              navigationLink: navLink || '',
            };
            console.log('navLink', navLink);
            onSubmitting(txId);
            if (openModal) {
              openTransactionModal(txId, modalProps.onSuccess, modalProps.navigationLink);
            } else if (openBody) {
              openTransactionBody(txId, modalProps.onSuccess, modalProps.navigationLink);
            }
          } else {
            onError('Error occurred');
          }
        }

        setButtonLoading(false);
        setButtonDisabled(false);
      } catch (error) {
        setButtonLoading(false);
        setButtonDisabled(false);
        onError(error);
      }
    }, [
      data,
      send,
      onError,
      appId,
      type,
      max,
      navLink,
      onSubmitting,
      openModal,
      openBody,
      onSuccess,
      openTransactionModal,
      openTransactionBody,
    ]);

    return (
      <>
        <Button
          loading={loading || buttonLoading}
          disabled={disabled || buttonDisabled}
          className="button button--primary block w-full px-[24px] hover:brightness-95"
          data-v-1b931a55
          primary
          onClick={handleClick}
        >
          {title}
        </Button>
      </>
    );
  },
);

export default SaveSettingsBtn;
export { template, ptemplate };
