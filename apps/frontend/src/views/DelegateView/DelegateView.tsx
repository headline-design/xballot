import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Networks } from 'utils/constants/common';
import { Container } from 'components/BaseComponents/Container';
import { Block } from 'components/BaseComponents/Block';
import BaseLink from 'components/BaseComponents/BaseLink';
import LoadingPage from 'components/Loaders/LoadingPage';
import { DisplayFormikState } from 'components/DisplayFormik';
import { shorten } from 'helpers/utils';
import PipeStateContext from 'contexts/PipeStateContext';
import ProfilesContext from 'contexts/ProfilesContext';
import DelegatesContext from 'contexts/DelegatesContext';
import DomainContext from 'contexts/DomainContext';
import { useLoginModal } from 'contexts/LoginModalContext';
import { BackButton } from 'components/BaseComponents/BackButton';
import BaseIcon from 'components/BaseComponents/ProposalsItem/BaseIcon';
import DelegateBlock from './DelegatesBlock';
import ModalDelegation from './ModalDelegateActions';
import DelegateForm, { validationSchema } from './DelegateForm';
import DelegateActions from './DelegateActions';
import { getAppIdFromDomain, getRound } from 'orderFunctions';

const DelegateView = ({ spaceKey }) => {
  const navigate = useNavigate();
  const { openLoginModal } = useLoginModal();
  const pipeState = useContext(PipeStateContext);
  const profiles = useContext(ProfilesContext);
  const delegatesArray = useContext(DelegatesContext);
  const domainData = useContext(DomainContext);

  //console.log('delegatesArray', delegatesArray);

  const [isSpaceSpecified, setIsSpaceSpecified] = useState(spaceKey === 'profileKey' ? true : false);
  const [loading, setLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentAppId, setCurrentAppId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [delegatesLoading, setDelegatesLoading] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);

  const formikRef = useRef(null);

  const [currentDelegate, setCurrentDelegate] = useState(null);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [modalData, setModalData] = useState({});
  const userProfiles = useMemo(() => profiles?.[currentDelegate], [profiles, currentDelegate]);
  const assetId = useMemo(
    () => (userProfiles ? Object.keys(userProfiles)[0] : null),
    [userProfiles],
  );
  const userProfile = useMemo(
    () => (assetId ? userProfiles[assetId] : null),
    [assetId, userProfiles],
  );
  const userName = useMemo(
    () => userProfile?.settings?.name || shorten(currentDelegate),
    [userProfile, currentDelegate],
  );

  const revokeModalData = useMemo(
    () => ({
      title: 'Remove delegation',
      notice: 'remove your delegation',
      action: 'delete',
    }),
    [],
  );

  const updateModalData = useMemo(
    () => ({
      title: 'Update delegations',
      notice: 'delegate voting power',
      action: 'add',
    }),
    [],
  );

  const formik = useFormik({
    initialValues: {
      address: '',
      space: isSpaceSpecified ? (spaceKey !== 'profileKey' ? spaceKey : '') : '',
      appId: currentAppId || null,
      round: currentRound || 0,
      isSpecifySpaceChecked: isSpaceSpecified,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setDelegatesLoading(true);
      let localCurrent = await getRound();
      setCurrentRound(localCurrent);
      if (formik.values.space !== '') {
        console.log('hello world');
        let localAppId = await getAppIdFromDomain(formik.values.space);
        setCurrentAppId(localAppId);
      } else {
        setCurrentAppId(null);
      }
      setCurrentDelegate(formik.values.address);
      setCurrentSpace(formik.values.space);
      handleUpdateDelegations();
    },
  });

  formikRef.current = formik;

  useEffect(() => {
    if (formikRef.current) {
      setIsValidForm(formikRef.current.isValid && formikRef.current.dirty);
    }
  }, [formikRef.current?.isValid, formikRef.current?.dirty]);

  let networkSupportsDelegate = true;
  let viewFormikState = false;
  let delegatesWithScore: '';
  let networkKey = '';

  const handleCurrentDelegate = useCallback((currentDelegate) => {
    setCurrentDelegate(currentDelegate);
  }, []);

  const handleCurrentSpace = useCallback((currentSpace) => {
    setCurrentSpace(currentSpace);
  }, []);

  const handleUpdateDelegations = useCallback(() => {
    setModalData(updateModalData);
    setModalOpen(true);
  }, [updateModalData]);

  const handleRevokeDelegations = useCallback(() => {
    setModalData(revokeModalData);
    setModalOpen(true);
  }, [revokeModalData]);

  useEffect(() => {
    if (spaceKey !== 'profileKey') {
      setIsSpaceSpecified(true);
    } else if (spaceKey === 'profileKey') {
      setIsSpaceSpecified(false);
    }
  }, [spaceKey]);

  const filteredDelegates = useMemo(() => {
    let delegations = [];

    if (delegatesArray) {
      // Finding delegations
      Object.keys(delegatesArray).forEach((userAddress) => {
        if (userAddress !== pipeState.myAddress) {
          return;
        }
        Object.keys(delegatesArray[userAddress]).forEach((appDelegateKey) => {
          delegations = [
            ...delegations,
            ...delegatesArray[userAddress][appDelegateKey].delegations,
          ];
        });
      });
    }

    return delegations;
  }, [delegatesArray, pipeState.myAddress]);

  const filteredDelegators = useMemo(() => {
    let delegators = [];

    if (delegatesArray) {
      // Finding delegators
      Object.keys(delegatesArray).forEach((userAddress) => {
        Object.keys(delegatesArray[userAddress]).forEach((appDelegateKey) => {
          delegatesArray[userAddress][appDelegateKey].delegations.forEach((delegation) => {
            if (delegation.delegate === pipeState.myAddress) {
              // Adding each delegator as an object with `delegator` and `space` properties
              delegators = [...delegators, { delegator: userAddress, space: delegation.space }];
            }
          });
        });
      });
    }

    return delegators;
  }, [delegatesArray, pipeState.myAddress]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setDelegatesLoading(false);
  }, []);

  return (
    <>
      <Container
        classNameT1={spaceKey !== 'profileKey' ? 'pt-0' : null}
        className={spaceKey !== 'profileKey' ? 'md:px-0' : null}
      >
        <div className="lg:flex">
          <div id="content-left" className="relative w-full lg:w-8/12 lg:pr-5">
            <div className="mb-3 px-4 md:px-0">
              <BackButton />
              {loaded && <h1>Delegate</h1>}
            </div>
            {loaded ? (
              !networkSupportsDelegate ? (
                <Block>
                  <BaseIcon name="warning" />
                  {Networks?.[networkKey]?.shortName ?? 'theCurrentNetwork'}
                  <BaseLink
                    className="ml-1 whitespace-nowrap"
                    link={'https://docs.xballot.net/guides/delegation#supported-networks'}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more
                  </BaseLink>
                </Block>
              ) : (
                <div className="space-y-3">
                  <Block>
                    <DelegateForm
                      formik={formik}
                      isSpecifySpaceChecked={isSpaceSpecified}
                      setIsSpecifySpaceChecked={setIsSpaceSpecified}
                      spaceKey={spaceKey}
                    />
                    {viewFormikState && <DisplayFormikState {...formik} />}
                  </Block>
                  <DelegateBlock
                    delegates={filteredDelegates}
                    getDelegationsAndDelegatesLoading={undefined}
                    web3Account={pipeState.myAddress}
                    networkKey={networkKey}
                    profiles={profiles}
                    specifySpaceChecked={isSpaceSpecified}
                    delegatesLoading={delegatesLoading}
                    delegatesWithScore={delegatesWithScore}
                    revokeDelegate={handleRevokeDelegations}
                    delegators={filteredDelegators}
                    space={undefined}
                    currentDelegate={handleCurrentDelegate}
                    currentSpace={handleCurrentSpace}
                    spaceKey={spaceKey}
                  />
                </div>
              )
            ) : (
              <LoadingPage />
            )}
          </div>
          <div id="sidebar-right" className="mt-3 w-full lg:mt-0 lg:w-4/12 lg:min-w-[321px]">
            {networkSupportsDelegate && (
              <DelegateActions
                isValidForm={isValidForm}
                pipeState={pipeState}
                openLoginModal={openLoginModal}
                formikRef={formikRef}
                delegatesLoading={delegatesLoading}
                navigate={navigate}
              />
            )}
          </div>
        </div>
        {networkSupportsDelegate && loaded && (
          <ModalDelegation
            open={modalOpen}
            delegate={currentDelegate}
            profile={profiles?.[currentDelegate]}
            closeModal={handleCloseModal}
            userName={userName}
            space={currentSpace}
            domainData={domainData}
            modalData={modalData}
            onReload={undefined}
            currentRound={currentRound}
            currentAppId={currentAppId}
            onError={(error) => {
              console.error('Error:', error);
              setDelegatesLoading(false);
            }}
            onSuccess={(txId) => {
              console.log('Transaction successful:', txId);
              setDelegatesLoading(false);
            }}
          />
        )}
      </Container>
    </>
  );
};

export default DelegateView;
