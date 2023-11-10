import React, { useState, useEffect, useCallback } from 'react';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import { Button } from 'components/BaseComponents/Button';
import { isOptedButton } from 'orderFunctions';
import { useAppDispatch } from 'redux/hooks';
import { useSelector } from 'react-redux';
import { updateMySpaces } from 'redux/global/global';
import algosdk from 'algosdk';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';

Pipeline.alerts = false;

export interface OptButtonProps {
  spaceKey: string;
  space: any;
  applicationId: string;
  bg: string;
  setIsUserOpted: any;
}

const VoteOptInButton = React.memo(
  ({ spaceKey, space, applicationId, setIsUserOpted }: OptButtonProps) => {
    const endPoints = getEndpoints();
    let algodClient = new algosdk.Algodv2('', endPoints.node, '');
    const dispatch = useAppDispatch();
    const mySpaces = useSelector((state: any) => state.global.mySpaces);

    const [opted, setOpted] = useState(() =>
      mySpaces.find((space) => space?.appId === applicationId) ? true : false,
    );
    const [loading, setLoading] = useState(false);

    const checkOpted = useCallback(() => {
      setOpted(mySpaces.find((space) => space?.appId === applicationId) ? true : false);
    }, [applicationId, mySpaces]);

    useEffect(() => {
      checkOpted();
    }, [checkOpted]);

    const optIn = useCallback(async () => {
      setLoading(true);
      try {
        const isOptedIn = await isOptedButton(Pipeline.address, applicationId);
        if (!isOptedIn) {
          let txId = await Pipeline.optIn(parseInt(applicationId), ['register']);
          let response = await algosdk.waitForConfirmation(algodClient, txId, 1000);
          if (response['confirmed-round']) {
            console.log('TXN WAIT RESPONSE ' + response['confirmed-round']);
            console.log(txId);
          }
          if (txId) {
            const nextSpace = {
              appId: applicationId,
              _id: mySpaces.length + 1,
              domain: spaceKey,
              content: space?.avatar || `${staticEndpoints.stamp}avatar/algo:${spaceKey}?s=100`,
            };
            dispatch(updateMySpaces([...mySpaces, nextSpace]));
          } else {
            console.log('----- optiIn txId ERROR:', txId);
          }
        } else {
          console.log('Already opted in');
        }
        checkOpted();
      } catch (error) {
        console.error(error);
      } finally {
        setIsUserOpted(true);
        setLoading(false);
      }
    }, [applicationId, checkOpted, space, spaceKey, mySpaces]);

    const handleClick = () => {
      optIn();
    };

    return (
      <Button
        loading={loading}
        type="button"
        className="button button--primary w-full px-[22px] hover:brightness-95"
        onClick={handleClick}
      >
        <span>Opt in</span>
      </Button>
    );
  },
);

export default VoteOptInButton;
