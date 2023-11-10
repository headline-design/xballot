import { useState, useEffect, useCallback } from 'react';
import localStore from 'store';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import { MY_SPACES_KEY } from 'utils/constants/common';
import { useAppDispatch } from 'redux/hooks';
import { updateMySpaces } from 'redux/global/global';
import algosdk from 'algosdk';
import { sendTxns } from '@pipeline-ui-2/pipeline/utils';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';
import { isOptedButton } from 'orderFunctions';

export function useOptSpace(applicationId: string, space?: any, spaceKey?: string, type?: string) {
  const [opted, setOpted] = useState<boolean | null>(false);
  const dispatch = useAppDispatch();
  const [loadingOpt, setLoadingOpt] = useState(false);
  const endPoints = getEndpoints();

  const checkOpted = useCallback(() => {
    let mySpaces = localStore.get(MY_SPACES_KEY);
    if (!mySpaces) {
      mySpaces = [];
      dispatch(updateMySpaces(mySpaces));
      return;
    }
    try {
      const index = mySpaces.find((space) => space?.appId === applicationId);
      if (index?.appId) {
        setOpted(true);
      } else {
        setOpted(false);
      }
    } catch (error) {
      console.error('Error in checkOpted:', error);
    }
  }, [applicationId]);

  const optIn = useCallback(async () => {
    const mySpaces = localStore.get(MY_SPACES_KEY) || [];
    try {
      setLoadingOpt(true);
      const isOptedIn = await isOptedButton(Pipeline.address, applicationId);
      if (!isOptedIn) {
        let txId = await Pipeline.optIn(parseInt(applicationId), ['register']);
        if (txId) {
          const nextIndex = mySpaces.length + 1;
          mySpaces.push({
            appId: applicationId,
            _id: nextIndex,
            domain: spaceKey,
            content: space?.avatar || `${staticEndpoints.stamp}avatar/algo:${spaceKey}?s=100`,
            type: type || 'space',
          });
          dispatch(updateMySpaces(mySpaces));
          setOpted(true); // Set opted state immediately
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOpt(false);
    }
  }, [applicationId, space?.avatar, spaceKey, type, dispatch, staticEndpoints.stamp]);

  const optOut = useCallback(async () => {
    try {
      setLoadingOpt(true);
      const mySpaces = localStore.get(MY_SPACES_KEY) || [];
      const index = mySpaces.findIndex((space) => space.appId === applicationId);
      const transServer = endPoints.node + '/v2/transactions';
      const params = await Pipeline.getParams();
      const appId = parseInt(applicationId);
      const txn = algosdk.makeApplicationClearStateTxn(Pipeline.address, params, appId);
      const signedTxn = await Pipeline.sign(txn, false);
      const txid = await sendTxns(signedTxn, transServer, false, '', true);
      if (index !== -1 && txid) {
        mySpaces.splice(index, 1);
        dispatch(updateMySpaces(mySpaces));
        localStorage.removeItem('appId');
        setOpted(false); // Set opted state immediately
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOpt(false);
    }
  }, [applicationId, space, spaceKey, endPoints.node, dispatch]);

  useEffect(() => {
    checkOpted();
  }, [checkOpted]);

  return {
    opted,
    loadingOpt,
    optIn,
    optOut,
  };
}
