import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { setLocalStorage } from 'localStorage/localStorage';
import { useNavigate } from 'react-router-dom';
import { Block } from 'components/BaseComponents/Block';
import FormikInput from 'components/Input/FormikInput';
import SpaceSettingsSidebar from 'components/SpaceSidebar/SpaceSettingsSidebar';
import FormikTextArea from 'components/Input/FormikTextArea';
import FormikIconInput from 'components/Input/FormikIconInput';
import { TwitterIcon } from 'icons/Twitter';
import { CoinGeckoIcon } from 'icons/CoinGeckoIcon';
import { GithubIcon } from 'icons/GithubIcon';
import { GlobeIcon2 } from 'icons/GlobeIcon2';
import FormikListboxMultiple from 'components/ListboxMultiple/FormikListboxMultiple';
import { ViewOnlyNotice } from './ViewOnlyNotice';
import { strategies } from './strategies';
import { DisplayFormikState } from 'components/DisplayFormik';
import SaveSettingsBtn from 'components/BaseComponents/SaveButton';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import SettingsNavSidebar from './SettingsNavSidebar';
import { BackButton } from 'components/BaseComponents/BackButton';
import { SettingsAvatar } from './SettingsAvatar';
import ControllerModal from 'components/SetupControllerModal';
import { shorten } from 'helpers/utils';
import PageLoader from 'components/Loaders/LoadingPage';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';
import SettingsTreasuryBlock from './SettingsTreasuryBlock';
import handleFileUpload from 'utils/handleFileUpload';
import StrategySettingsBlock from './StrategySettingsBlock';
import { useTransactionModal } from 'contexts/TransactionModalContext';

const updateSettingsSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Name should be at least 1 characters')
    .max(30, 'Name should not exceed 30 characters')
    .required('Name is required'),
  about: Yup.string()
    .min(10, 'About should be at least 5 characters')
    .max(500, 'About should not exceed 750 characters')
    .required('About is required'),
  token: Yup.string()
    .min(3, 'Token should be at least 3 characters')
    .max(18, 'Token should not exceed 18 characters'),
  twitter: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid character')
    .notOneOf(['www', 'http', 'https', '.com'], 'Invalid character')
    .min(4, 'Min. 4 characters')
    .max(25, 'Max 25 characters')
    .optional(),
  github: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid character')
    .notOneOf(['www', 'http', 'https', '.com'], 'Invalid character')
    .min(4, 'Min. 4 characters')
    .max(25, 'Max 25 characters')
    .optional(),
  coingecko: Yup.string()
    .matches(/^[a-zA-Z0-9_-]+$/, 'Invalid character')
    .notOneOf(['www', 'http', 'https', '.com'], 'Invalid character')
    .min(4, 'Min. 4 characters')
    .max(25, 'Max 25 characters')
    .optional(),
  website: Yup.string()
    .matches(
      /^https:\/\/www\.[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/i,
      'Website should be in the format https://www.example.com',
    )
    .required('Website is required'),
  terms: Yup.string()
    .matches(
      /^https:\/\/www\.[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/i,
      'URL should be in the format https://www.example.com',
    )
    .optional(),
  controller: Yup.string()
    .min(58, 'Controller address should contain exactly 58 characters')
    .max(58, 'Controller address should contain exactly 58 characters')
    .optional(),
  strategies: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one strategy')
    .max(5, 'You can select a maximum of 5 strategies')
    .required('Please select at least one strategy'),
  categories: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one category')
    .max(5, 'You can select a maximum of 5 categories')
    .required('Please select at least one category'),
  treasuries: Yup.object().shape({
    name: Yup.string()
      .min(1, 'Name should be at least 1 characters')
      .max(30, 'Name should not exceed 30 characters')
      .required('Name is required'),
    address: Yup.string()
      .min(58, 'Treasury address should contain exactly 58 characters')
      .max(58, 'Treasury address should contain exactly 58 characters')
      .required('Treasury address is required'),
  }),
  forum: Yup.object().shape({
    token: Yup.string()
      .min(3, 'Token should be at least 3 characters')
      .max(18, 'Token should not exceed 18 characters')
      .optional(),
    tokenAmount: Yup.number()
      .min(0, 'Token amount cannot be negative')
      .max(10000000000000, 'Token amount cannot be greater than 10000000000000')
      .optional(),
    about: Yup.string()
      .min(10, 'Forum about section should contain at least 10 characters')
      .max(750, 'Forum about section should not exceed 750 characters')
      .optional(),
  }),
  voting: Yup.object().shape({
    delay: Yup.number()
      .min(0, 'Delay cannot be negative')
      .max(7, 'Delay cannot be greater than 7')
      .optional(),
    hideAbstain: Yup.boolean().optional(),
    period: Yup.number()
      .min(1, 'Voting period should be at least 1 day')
      .max(30, 'Voting period cannot be greater than 30 days')
      .optional(),
    quorum: Yup.number()
      .min(0, 'Quorum cannot be negative')
      .max(100, 'Quorum cannot be greater than 100')
      .optional(),
    type: Yup.string().optional(),
    privacy: Yup.string().optional(),
  }),

  symbol: Yup.string()
    .min(2, 'Symbol should contain at least 2 characters')
    .max(5, 'Symbol should not exceed 5 characters'),
});

const treasuries = [
  {
    id: 1,
    address: '',
    name: '',
    network: 'Algorand',
  },
  {
    id: 2,
    address: '',
    name: '',
    network: 'Ethereum',
  },
  {
    id: 3,
    address: '',
    name: '',
    network: 'Ripple',
  },
];

function SpaceSettings(props) {
  const endPoints = getEndpoints();
  const {
    spaceData = {},
    handleDisabled = () => {},
    appId = '',
    navLink = '',
    sideBar = true,
    adminSideBar = spaceData?.creator === Pipeline.address ||
      spaceData?.controller === Pipeline.address,
    sideBarContainer = true,
    viewOnly = true,
    header = true,
    strategy = true,
    plugins = true,
    treasury = true,
    rawSettings = false,
    ipfsTest = false,
    callbacks = {},
    ...otherProps
  } = props;
  const initialValues = {
    name: spaceData?.name || '',
    about: spaceData?.about || '',
    token: spaceData?.token || '',
    avatar: spaceData?.avatar || '',
    creator: spaceData?.creator || '',
    controller: spaceData?.controller || '',
    appId: appId || '',
    assetId: spaceData?.asset || '',
    domain: spaceData?.domain || '',
    github: spaceData?.github || '',
    coingecko: spaceData?.coingecko || '',
    twitter: spaceData?.twitter || '',
    website: spaceData?.website || '',
    network: spaceData?.network || 1,
    description: spaceData?.about || '',
    userName: spaceData?.name || '',
    strategies: spaceData?.strategies || [],
    categories: spaceData?.categories || [],
    treasuries: spaceData?.treasuries || [],
    admins: spaceData?.admins || [],
    members: spaceData?.members || [],
    plugins: spaceData?.plugins || {},
    filters: {
      minScore: spaceData?.filters?.minScore || 0,
      onlyMembers: spaceData?.filters?.onlyMembers || false,
    },
    forum: {
      token: spaceData?.forum?.token || null,
      tokenAmount: spaceData?.forum?.tokenAmount || null,
      about: spaceData?.forum?.about || '',
    },
    proposal: {
      token: spaceData?.proposal?.token || null,
      template: spaceData?.proposal?.template || '',
    },
    voting: {
      delay: spaceData?.voting?.delay || 0,
      hideAbstain: spaceData?.voting?.hideAbstain || false,
      period: spaceData?.voting?.period || 0,
      quorum: spaceData?.voting?.quorum || 0,
      type: spaceData?.voting?.type || '',
      privacy: spaceData?.voting?.privacy || '',
    },
    symbol: spaceData?.symbol || '',
    terms: spaceData?.terms || '',
    parent: spaceData?.parent || null,
    children: spaceData?.children || [],
    private: spaceData?.private || false,
    skin: spaceData?.skin || '',
    guidelines: spaceData?.guidelines || '',
    template: spaceData?.template || '',
  };

  const [dataLoading, setDataLoading] = useState(true);
  useEffect(() => {
    if (spaceData?.domain !== undefined) {
      const timeout = setTimeout(() => {
        setDataLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [spaceData]);

  const [displayAvatar, setDisplayAvatar] = useState();
  const [hash, setHash] = useState('');
  const [ipfsImageLink, setIpfsImageLink] = useState('url');
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState();

  function updateSpaceInfo(data) {
    setLocalStorage('userAccount', data.name);
    navigate('/items');
  }

  const { isTransactionModalOpen } = useTransactionModal();
  console.log('isTransaction', isTransactionModalOpen);

  const handleCoverFileChange = async (e, setFieldValue) => {
    await handleFileUpload(
      e,
      setFieldValue,
      setDisplayAvatar,
      setHash,
      setIpfsImageLink,
      setSelectedAvatar,
      'avatar',
      '',
    );
  };

  const handleCallbacks = {
    onSubmitting: () => {
      console.log('---Submitting');
    },

    onSuccess: () => {
      console.log('Success');
      toast.success('Saved!');
    },

    onError: () => {
      console.error('Error');
      toast.error('Error occured');
    },
  };

  const [settingsData, setSettingsData] = useState({ step: 1 });

  const setStep = (step) => {
    setSettingsData({ ...settingsData, step });
  };

  const isAdmin =
    spaceData?.creator === Pipeline.address || spaceData?.controller === Pipeline.address;
  const [txId, setTxId] = useState(null);

  function closeModal() {
    setIsOpen(false);
    setModalLoading(false);
  }

  function openModal() {
    setIsOpen(true);
    setModalLoading(true);
  }

  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [onController, setOnController] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const setControl = async (values) => {
    // console.log(values.controller);

    setLoading(true);
    let txId = await Pipeline.appCall(parseInt(appId), ['control'], [values.controller]);
    toast(txId ? shorten(txId) : 'Transaction cancelled');
    setTxId(txId);
    setOnController(true);
    setIsOpen(false);
    setLoading(false);
    setModalLoading(false);
  };

  const [treasuriesData, setTreasuriesData] = useState([spaceData?.treasuries]);
  console.log(treasuriesData);

  return (
    <>
      {header && (
        <div className="sm:block lg:hidden">
          <div className="mb-3 px-4 md:px-0 ">
            <BackButton/>
          </div>

          <div className="px-4 md:px-0">
            <h1 className="mb-4">Settings</h1>
          </div>
        </div>
      )}
      {sideBar && <SettingsNavSidebar setStep={setStep} formData={settingsData} />}

      {dataLoading ? (
        <div
          id="content-right"
          className={sideBarContainer && 'relative float-right w-full pl-0 lg:w-3/4 lg:pl-5'}
        >
          <PageLoader />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={updateSettingsSchema}
          onSubmit={(values) => {
            console.log('VALUES', values);
            updateSpaceInfo(values.avatar);
          }}
        >
          {(formik) => {
            const { setFieldValue } = formik;
            return (
              <Form>
                <>
                  <div
                    id="content-right"
                    className={
                      sideBarContainer && 'relative float-right w-full pl-0 lg:w-3/4 lg:pl-5'
                    }
                  >
                    <div className="space-y-3">
                      {header && (
                        <div className="hidden lg:block">
                          <div className="mb-3 px-4 md:px-0 ">
                           <BackButton/>
                          </div>

                          <div className="px-4 md:px-0">
                            <h1 className="mb-4">Settings</h1>
                          </div>
                        </div>
                      )}
                      {!isAdmin && viewOnly && <ViewOnlyNotice />}
                      {settingsData.step === 1 && (
                        <>
                          <Block title="Profile">
                            <div className="space-y-2">
                              <div className="flex flex-col-reverse sm:flex-row">
                                <div className="mt-3 w-full space-y-2 sm:mt-0">
                                  <div className="flex w-full">
                                    <div>
                                      <div className="flex justify-center">
                                        <SettingsAvatar
                                          displayAvatar={displayAvatar}
                                          spaceData={
                                            spaceData?.avatar ||
                                            staticEndpoints.stamp + 'avatar/' + spaceData?.domain
                                          }
                                          handleCoverFileChange={handleCoverFileChange}
                                          setFieldValue={setFieldValue}
                                          name={undefined}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <FormikInput
                                    type="text"
                                    name="name"
                                    value={initialValues.name}
                                    id="name"
                                    maxLength={30}
                                    title={'Name'}
                                    placeholder={'Name'}
                                    ref={undefined}
                                    errorTag={formik.touched.name && formik.errors.name}
                                    errorField={formik.errors.name}
                                    count={true}
                                  />
                                  <FormikTextArea
                                    name="about"
                                    maxLength={750}
                                    title={'About'}
                                    placeholder={'About'}
                                    value={initialValues.about}
                                    id={undefined}
                                    errorTag={formik.touched.about && formik.errors.about}
                                    errorField={formik.errors.about}
                                    count={true}
                                    style={undefined}
                                  />
                                  <FormikListboxMultiple
                                    name="categories"
                                    title="Categories"
                                    errorTag={formik.touched.categories && formik.errors.categories}
                                    errorField={formik.errors.categories}
                                  />
                                  <FormikIconInput
                                    icon={<GlobeIcon2 className="text-[16px]" />}
                                    name="website"
                                    maxLength={50}
                                    title={'Website'}
                                    placeholder={'Website'}
                                    value={initialValues.website}
                                    id={undefined}
                                    ref={undefined}
                                    errorTag={formik.touched.website && formik.errors.website}
                                    errorField={formik.errors.website}
                                    count={true}
                                  />
                                  <FormikIconInput
                                    icon={<GlobeIcon2 className="text-[16px]" />}
                                    name="terms"
                                    maxLength={50}
                                    title={'Terms of service'}
                                    placeholder={'e.g. https://example.com/terms'}
                                    value={initialValues.terms}
                                    id={undefined}
                                    ref={undefined}
                                    errorTag={formik.touched.terms && formik.errors.terms}
                                    errorField={formik.errors.terms}
                                    count={true}
                                  />
                                </div>
                              </div>
                            </div>
                          </Block>
                          <Block title="Social accounts">
                            <div className="space-y-3">
                              <div className="space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
                                <FormikIconInput
                                  name="twitter"
                                  title="Twitter"
                                  placeholder="e.g. elonmusk"
                                  maxLength="32"
                                  icon={<TwitterIcon className="text-[16px]" />}
                                  value={initialValues.twitter}
                                  id={undefined}
                                  ref={undefined}
                                  errorTag={formik.touched.twitter && formik.errors.twitter}
                                  errorField={formik.errors.twitter}
                                  count={false}
                                />
                                <FormikIconInput
                                  name="github"
                                  title="Github"
                                  placeholder="e.g. pipeline-ui"
                                  maxLength="32"
                                  icon={<GithubIcon />}
                                  value={initialValues.github}
                                  id={undefined}
                                  ref={undefined}
                                  errorTag={formik.touched.github && formik.errors.github}
                                  errorField={formik.errors.github}
                                  count={false}
                                />
                                <FormikIconInput
                                  name="coingecko"
                                  title="CoinGecko"
                                  placeholder="e.g. tinyman"
                                  maxLength="32"
                                  icon={<CoinGeckoIcon />}
                                  value={initialValues.coingecko}
                                  id={undefined}
                                  ref={undefined}
                                  errorTag={formik.touched.coingecko && formik.errors.coingecko}
                                  errorField={formik.errors.coingecko}
                                  count={false}
                                />
                              </div>
                            </div>
                          </Block>
                        </>
                      )}
                      {settingsData.step === 2 && (
                        <StrategySettingsBlock
                          items={strategies}
                          formik={formik}
                          endPoints={endPoints}
                          space={spaceData}
                          context={undefined}
                          isViewOnly={undefined}
                        />
                      )}
                      {settingsData.step === 3 && (
                        <Block title="Proposal">
                          <div className="space-y-2">
                            <FormikInput
                              type="number"
                              id="token"
                              name="proposal.token"
                              title="Vote token"
                              placeholder="e.g. 137594422"
                              maxLength="58"
                              value={initialValues.proposal.token}
                              ref={undefined}
                              errorTag={
                                formik.touched.proposal?.token && formik.errors.proposal?.token
                              }
                              errorField={formik.errors.proposal?.token}
                              count={true}
                            />
                            <FormikTextArea
                              placeholder="## Intro
## Body
## Conclusion"
                              style={{ resize: 'none', height: '105px', overflow: 'hidden' }}
                              name="proposal.template"
                              title="Template"
                              maxLength="749"
                              value={initialValues?.proposal?.template}
                              id={undefined}
                              errorTag={
                                formik.touched.proposal?.template &&
                                formik.errors.proposal?.template
                              }
                              errorField={formik.errors.proposal?.template}
                              count={true}
                            />
                          </div>
                        </Block>
                      )}
                      {settingsData.step === 4 && (
                        <Block title="Controller">
                          <div className="space-y-2">
                            <div className="space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
                              <FormikInput
                                type="text"
                                id="controller"
                                name="controller"
                                title="Controller"
                                placeholder="e.g. K3NSXYMHPRCK7PMYT3QUQXUGPZJ4MKWJXW2HJRYPVMQUMKJAOJEIEO4HK4"
                                maxLength="58"
                                value={initialValues.controller}
                                ref={undefined}
                                errorTag={formik.touched.controller && formik.errors.controller}
                                errorField={formik.errors.controller}
                                count={false}
                              />
                            </div>
                            {adminSideBar && (
                              <ControllerModal
                                appId={appId}
                                domain={spaceData?.domain}
                                disabled={
                                  formik.touched.controller && formik.errors.controller
                                    ? true
                                    : false
                                }
                                address={formik.values.controller}
                                setControl={setControl}
                                modalLoading={modalLoading}
                                loading={loading}
                                openModal={openModal}
                                closeModal={closeModal}
                                isOpen={isOpen}
                                formik={formik}
                                refSubmit={undefined}
                                values={formik.values.controller}
                              />
                            )}
                          </div>
                        </Block>
                      )}
                      {settingsData.step === 6 && (
                        <>
                          <SettingsTreasuryBlock
                            items={treasuries}
                            context={undefined}
                            isViewOnly={undefined}
                            formik={formik}
                          />
                        </>
                      )}

                      {settingsData.step === 5 && (
                        <Block title="Forum rules">
                          <div className="space-y-2">
                            <div className="space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
                              <FormikInput
                                type="number"
                                id="forum.token"
                                name="forum.token"
                                title="Token"
                                placeholder="e.g. 137594422"
                                maxLength="58"
                                value={initialValues.forum.token}
                                ref={undefined}
                                errorTag={formik.touched.forum?.token && formik.errors.forum?.token}
                                errorField={formik.errors.forum?.token}
                                count={true}
                              />
                              <FormikInput
                                type="number"
                                id="forum.tokenAmount"
                                name="forum.tokenAmount"
                                title="Min. balance"
                                placeholder="e.g. 500000"
                                maxLength="32"
                                value={initialValues.forum.tokenAmount}
                                errorTag={
                                  formik.touched.forum?.tokenAmount &&
                                  formik.errors.forum?.tokenAmount
                                }
                                errorField={formik.errors.forum?.tokenAmount}
                                count={true}
                                ref={undefined}
                              />
                            </div>
                            <FormikTextArea
                              name="forum.about"
                              title="About"
                              placeholder="e.g. A place for discourse."
                              maxLength="749"
                              value={initialValues.forum.about}
                              id={undefined}
                              errorTag={formik.touched.forum?.about && formik.errors.forum?.about}
                              errorField={formik.errors.forum?.about}
                              count={true}
                              style={undefined}
                            />
                          </div>
                        </Block>
                      )}

                      {rawSettings && <DisplayFormikState {...formik} />}
                      {adminSideBar && (
                        <SpaceSettingsSidebar
                          handleSecondary={(e) => formik.resetForm()}
                          textSecondary={'Reset'}
                          appId={appId}
                          send={true}
                          data={formik.values}
                          buttonType={'describe'}
                          callbacks={handleCallbacks}
                          secondaryType="button"
                          navLink={spaceData?.domain}
                          disabled={loading}
                          loading={loading}
                        />
                      )}
                      {ipfsTest && (
                        <div className="flex gap-5 px-4 pt-2 md:px-0">
                          <SaveSettingsBtn
                            loading={loading}
                            data={formik.values}
                            disabled={handleDisabled}
                            type={'describe'}
                            send={true}
                            appId={appId}
                            title={'Save'}
                            max={undefined}
                            navLink={navLink}
                            onSubmitting={callbacks.onSubmitting}
                            onError={callbacks.onError}
                            onSuccess={callbacks.onSuccess}
                            openModal={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
}

export default SpaceSettings;
