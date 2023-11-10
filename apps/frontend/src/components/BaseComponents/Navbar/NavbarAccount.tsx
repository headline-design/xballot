import React, { useCallback, useEffect, useState } from 'react';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import { Button } from '../Button';
import authActions from 'redux/auth/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Networks, PipeConnectors } from 'utils/constants/common';
import { useNavigate } from 'react-router-dom';
import algorandGlobalSelectors from 'redux/algorand/global/globalSelctors';
import { getCurrentGlobalPipeState } from 'utils/functions';
import algorandGlobalActions from 'redux/algorand/global/globalActions';
import { toast } from 'react-hot-toast';
import { shorten } from 'helpers/utils';
import NavbarModal from './NavbarModal';
import { TransactionModal } from '../TransactionModal';
import NavbarMenu from './NavbarMenu';
import { isEmpty } from 'lodash';
import authSelectors from 'redux/auth/authSelectors';
import { staticEndpoints } from 'utils/endPoints';

import { useLoginModal } from 'contexts/LoginModalContext';
import { useTransactionModal } from 'contexts/TransactionModalContext';

const MemoizedNavbarMenu = React.memo(NavbarMenu);
const MemoizedNavbarModal = React.memo(NavbarModal);
const MemoizedTransactionModal = React.memo(TransactionModal);

function Avatar({ domainData }) {
  const avatar = domainData?.avatar
    ? domainData.avatar
    : `${staticEndpoints.stamp}avatar/algo:${Pipeline.address}?s=36`;

  return (
    <img
      src={avatar}
      className="rounded-full bg-skin-border object-cover"
      alt="avatar"
      style={{ width: 18, height: 18, minWidth: 18 }}
    />
  );
}

const MemoizedAvatar = React.memo(Avatar);

interface GlobalPipeState {
  provider: string;
  myAddress: string;
  mainNet: any;
  // Include other properties of the global pipe state object as needed
}

let wallet;

function NavbarAccount({ onLoadingChange, domainData, className, upStream, children, navbar }) {
  const [connected, setConnected] = useState(false);
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();
  const globalPipeState = useSelector(algorandGlobalSelectors.selectCurrentPipeConnectState);
  const isSignedIn = useSelector(algorandGlobalSelectors.selectSignedIn);
  const token = useSelector(authSelectors.selectToken);
  const [accountAddress, setAccountAddress] = useState('');

  const [pipeState, setPipeState] = useState<GlobalPipeState>({
    provider: '',
    myAddress: '',
    mainNet: Networks.MainNet,
  });

  const { isLoginModalOpen, openLoginModal, closeLoginModal } = useLoginModal();
  const { isTransactionModalOpen, closeTransactionModal } = useTransactionModal();

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      openLoginModal();
    },
    [openLoginModal],
  );
  const [loading, setLoading] = useState(true);

  const disconnectWallet = useCallback(() => {
    dispatch(authActions.doSignOut());
    navigate('/');
    window.location.reload();
  }, [dispatch, navigate]);

  const viewProfile = useCallback(() => {
    navigate(`/account/${pipeState.myAddress}/about`);
    closeLoginModal();
  }, [navigate, pipeState.myAddress, closeLoginModal]);

  const viewAbout = useCallback(() => {
    navigate('/about');
    closeLoginModal();
  }, [navigate, closeLoginModal]);

  const switchWallet = useCallback(async () => {
    let address;
    let wallet = Pipeline.init();
    if (wallet) {
      try {
        address = await Pipeline.connect(wallet);
        if (address) {
          Pipeline.address = address;
          setAccountAddress(address);
          dispatch(
            algorandGlobalActions.doPipeConnectChange({
              ...getCurrentGlobalPipeState(globalPipeState),
              myAddress: address,
              provider: Pipeline.pipeConnector,
            }),
          );
          closeLoginModal();
        } else {
          toast('Sign-in canceled');
        }
      } catch (err) {
        console.log('----- Pipeline.connect ERROR:', err);
        setAccountAddress('');
        toast(JSON.stringify(err['message']));
        dispatch(authActions.doSignOut());
      }
    } else {
      console.log('----- Pipeline init Error:', wallet);
    }
  }, [dispatch, globalPipeState]);

  function reload() {
    localStorage.clear();
    window.location.reload();
  }

  useEffect(() => {
    upStream(globalPipeState);
  }, [globalPipeState, upStream]);

  const refresh = useCallback(() => {
    if (Pipeline.pipeConnector && pipeState.myAddress) {
      if (Pipeline.address !== '') {
        setConnected(true);
        setLoading(false);
      }
    }
  }, [pipeState.myAddress]);

  const checkConnected = useCallback(() => {
    setLoading(true);
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (pipeState.myAddress) {
      const cleanup = checkConnected();
      return cleanup;
    }
  }, [pipeState.myAddress, checkConnected]);

  useEffect(() => {
    if (globalPipeState) {
      Pipeline.pipeConnector = globalPipeState.provider;
      Pipeline.address = globalPipeState.myAddress;
      setPipeState((prevState) => ({
        ...prevState,
        myAddress: globalPipeState.myAddress,
        checked: globalPipeState.mainNet,
        labelNet: globalPipeState.mainNet ? Networks.MainNet : Networks.TestNet,
      }));
      setLoading(false);
    }
  }, [globalPipeState]);

  useEffect(() => {
    wallet = Pipeline.init();
    if (token !== null) {
      navigate('/items');
    }
  }, [navigate, token]);

  useEffect(() => {
    onLoadingChange(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    if (isSignedIn && !isEmpty(globalPipeState)) {
      Pipeline.main = globalPipeState.isMainNet;
      Pipeline.pipeConnector = globalPipeState.provider;
      Pipeline.address = globalPipeState.myAddress;
    }
  }, [globalPipeState, isSignedIn]);

  const handleTransactionSuccess = useCallback(() => {
    console.log('----- Transaction Success');
  }, []);

  switch (true) {
    case loading && navbar:
      return <Button loading />;
    case connected && !loading:
      return (
        <>
          <MemoizedNavbarMenu
            domainData={domainData}
            Avatar={MemoizedAvatar}
            pipeState={pipeState}
            shorten={shorten}
            disconnectWallet={disconnectWallet}
            openModal={handleClick}
          />
          <MemoizedNavbarModal
             domainData={domainData}
             closeModal={closeLoginModal}
             isOpen={isLoginModalOpen}
             connected={connected}
             pipeState={pipeState}
             Pipeline={Pipeline}
             disconnectWallet={disconnectWallet}
             viewProfile={viewProfile}
             viewAbout={viewAbout}
             reload={reload}
             PipeConnectors={PipeConnectors}
             switchWallet={switchWallet}
          />
          {isTransactionModalOpen && (
            <MemoizedTransactionModal
              open={isTransactionModalOpen}
              onClose={closeTransactionModal}
              onSuccess={handleTransactionSuccess}
            />
          )}
        </>
      );
    case !connected && !loading:
      return (
        <>
          <Button
            type="button"
            aria-label="Connect wallet"
            className={className}
            data-v-4a6956ba=""
            onClick={handleClick}
          >
            {children}
          </Button>
          <MemoizedNavbarModal
            domainData={domainData}
            closeModal={closeLoginModal}
            isOpen={isLoginModalOpen}
            connected={connected}
            pipeState={pipeState}
            Pipeline={Pipeline}
            disconnectWallet={disconnectWallet}
            viewProfile={viewProfile}
            viewAbout={viewAbout}
            reload={reload}
            PipeConnectors={PipeConnectors}
            switchWallet={switchWallet}
          />
          {isTransactionModalOpen && (
            <MemoizedTransactionModal
              open={isTransactionModalOpen}
              onClose={closeTransactionModal}
              onSuccess={handleTransactionSuccess}
            />
          )}
        </>
      );
  }
}

export default NavbarAccount;
