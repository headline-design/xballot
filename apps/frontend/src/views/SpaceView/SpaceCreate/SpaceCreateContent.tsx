import React, { useEffect, useRef } from 'react';
import useState from 'react-usestateref';
import { Field } from 'formik';
import Sidebar from 'components/SpaceSidebar';
import Markdown from 'components/CreateProposalMarkdown';
import { Formik, Form } from 'formik';
import { GlobeIconAlt } from 'icons/GlobeIconAlt';
import { SpaceCreateVotingDateStart } from './components/SpaceCreateVotingDateStart';
import { SpaceCreateVotingDateEnd } from './components/SpaceCreateVotingDateEnd';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import { Block } from 'components/BaseComponents/Block';
import { WalletWarning } from 'components/BaseComponents/WalletWarning';
import { DisplayFormikState } from 'components/DisplayFormik';
import FormikInput from 'components/Input/FormikInput';
import FormikIconInput from 'components/Input/FormikIconInput';
import { updateProposalSchema, uploadRecord } from './proposalUtils';
import { getIn } from 'formik';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import PageLoader from 'components/Loaders/LoadingPage';
import InputSelectVotingType from 'components/VotingStrategyModal/InputSelectVotingType';
import InputChoices from './InputChoices';
import { getRound } from 'orderFunctions';
import PostCreateProposalModal from './components/PostCreateProposalModal';
import { useModal } from 'composables/useModal';
import { getEndpoints, staticValues } from 'utils/endPoints';
import { ReviewForm } from './ProposalReviewForm';
import { BackButton } from 'components/BaseComponents/BackButton';

interface FormErrors {
  title?: string;
  token?: string;
  content?: string;
}
function SpaceCreateProposal({ domainData, space, appId, rawSettings = false, ...props }) {

  document.addEventListener('wheel', function (event) {
    if ((document.activeElement.type as any) === 'number') {
      document.activeElement.blur();
    }
  });

  const endPoints = getEndpoints();
  const { isModalPostCreateProposalOpen, setIsModalPostCreateProposalOpen } = useModal();
  const { spaceKey } = useParams();
  const [upStreamEnder, setUpStreamEnder] = useState();
  const [proposalId, setProposalId] = useState();
  const [maxRound, setMaxRound] = useState(null);

  async function unixToRound(unix) {
    const secondsInThreeDays = 3 * 24 * 60 * 60;
    let roundRange = secondsInThreeDays / staticValues.roundTime;
    let current = await getRound();
    let endRound = current + roundRange;
    return endRound.toFixed(0);
  }

  useEffect(() => {
    async function fetchDefaultMaxRound() {
      const defaultUnix = Date.now() + 72 * 60 * 60 * 1000;
      const defaultMaxRound = await unixToRound(defaultUnix);
      setMaxRound(defaultMaxRound);
    }
    fetchDefaultMaxRound();
  }, []);

  const [proposalAvailability, setProposalAvailability] = useState(false);
  const [currentMaxRound, setCurrentMaxRound] = useState(null);

  useEffect(() => {
    async function checkProposalCreateAvailability() {
      const currentRound = await getRound();
      const proposalRound = space?.proposals?.[0]?.maxRound;
      if (proposalRound === null || proposalRound === undefined || proposalRound <= currentRound) {
        setProposalAvailability(true);
      } else if (proposalRound > currentRound) {
        setProposalAvailability(false);
        let millisecondsToGo = (proposalRound - currentRound) * staticValues.roundTime * 1000; // Convert roundsToGo directly to milliseconds
        let maxRoundDate = new Date(Date.now() + millisecondsToGo).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        });
        setCurrentMaxRound(maxRoundDate);
      }
    }
    checkProposalCreateAvailability();
  }, [space?.proposals]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (space?.domain !== undefined) {
      const timeout = setTimeout(() => {
        setDataLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [space]);

  const defaultFormData = {
    title: '',
    content: space?.proposal?.template || '',
    discussion: '',
    choices: [
      { key: 0, id: 'choice-1', choice: '' },
      { key: 1, id: 'choice-2', choice: '' },
    ],
    start: parseInt((Date.now() / 1e3).toFixed(), 10),
    end: parseInt((Date.now() / 1e3 + 3 * 24 * 60 * 60).toFixed(), 10),
    metadata: {},
    strategyType: {
      text: 'single-choice',
      title: 'Single choice voting',
      description: 'Each voter may select only one choice.',
    },
    token: space?.proposal?.token || null,
  };

  const defaultOpenFormData = {
    choices: [{ key: 0, id: 'choice-1', label: '' }],
  };

  const [preview, setPreview] = useState(false);
  const [choices, setChoices] = useState('');
  const [step, setStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleContinue = async (token) => {
    const response = await fetch(endPoints.indexer + 'assets/' + token);
    if (!response.ok) {
      toast.error('Token is invalid');
    } else if (response.ok) {
      setStep(2);
    }
  };

  const [formData, setFormData] = useState(defaultFormData);
  const formDataRefOpen = useRef(defaultOpenFormData);
  const formDataRefSingle = useRef(defaultFormData);
  const formDataRefApproval = useRef(defaultFormData);
  const formDataRefQuadratic = useRef(defaultFormData);
  const formDataRefWeighted = useRef(defaultFormData);
  const formDataRefRankedChoice = useRef(defaultFormData);
  const [formBody, setFormBody] = useState(space?.proposal?.template);
  const [source, setSource] = useState(space?.proposal?.template);

  const handleBack = () => {
    setStep(1);
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleReview = () => {
    setStep(3);
  };

  useEffect(() => {
    setFormData({ ...formData, content: source });
  }, [source]);

  const handleChoices = (newChoices) => {
    setChoices(newChoices);
  };

  const closeAndNavigateProposal = () => {
    setIsModalPostCreateProposalOpen(false);
    navigate(`/${spaceKey}/proposal/${proposalId}`);
  };

  const closeAndNavigateHome = () => {
    setIsModalPostCreateProposalOpen(false);
    navigate(`/${spaceKey}`);
  };

  const MemoizedReviewForm = React.memo(ReviewForm);

  const choicesArr = Array.isArray(choices) ? choices : [];

  const isChoiceEmpty =
    step === 2 && (formData.strategyType.text !== 'open' && formData.strategyType.text !== 'basic' ) &&
    (choicesArr.length === 0 || choicesArr.some((choice) => choice.choice.trim() === ''));

  const isLabelEmpty =
    step === 2 &&
    formData.strategyType.text === 'open' &&
    (choicesArr.length === 0 || choicesArr.some((choice) => choice.label?.trim() === ''));

  const hasError = ( step === 2 && (formData.strategyType.text !== 'open' && formData.strategyType.text !== 'basic' )) ? choicesArr.some((choice) => choice.error !== null) : false;

  return (
    <>
      {dataLoading ? (
        <div id="content-left" className="relative mb-5 w-full lg:w-8/12 lg:pr-5">
          <PageLoader />{' '}
        </div>
      ) : (
        <div className="lg:flex">
          <Formik
            initialValues={defaultFormData}
            validationSchema={updateProposalSchema}
            onSubmit={(values) => {
              console.log('VALUES', values);
            }}
            validate={(values) => {
              const errors: FormErrors = {};
              if (!values.title) {
                errors.title = 'Title is required';
              }
              if (!values.token) {
                errors.token = 'Token is required';
              }
              if (!values.content) {
                errors.content = 'Content is required';
              }
              setIsFormValid(Object.keys(errors).length === 0);
              return errors;
            }}
          >
            {(formik) => {
              const { values, handleChange, setFieldValue } = formik;
              const localTitle = getIn(values, 'title');
              setTitle(localTitle);
              const localSource = getIn(values, 'content');
              setSource(localSource);
              setFormBody(localSource);
              const createVote = async () => {
                setLoading(true);
                let response = await uploadRecord(formik.values);
                if (response?.path) {
                  console.log('IPFS data', response);
                  let txId = await Pipeline.appCall(
                    appId,
                    ['start', response.path, parseInt(maxRound)],
                    [Pipeline.address],
                  );
                  if (txId) {
                    setProposalId(txId);
                    setIsModalPostCreateProposalOpen(true);
                    setLoading(false);
                  } else {
                    toast('failed');
                  }
                } else {
                  toast('failed');
                  setLoading(false);
                }
              };
              return (
                <>
                  <div id="content-left" className="relative mb-5 w-full lg:w-8/12 lg:pr-5">
                    {step === 1 && <BackButton />}
                    {!Pipeline.address ? <WalletWarning aboutLink={`/${spaceKey}/about`} /> : null}
                    <div>
                      <Form>
                        {step === 1 && (
                          <div className="mb-5 flex flex-col space-y-3 px-4 md:px-0">
                            <div className="w-full">
                              {!preview && (
                                <FormikInput
                                  type="text"
                                  name="title"
                                  title="Title"
                                  value={formData.title}
                                  maxLength={38}
                                  placeholder={undefined}
                                  id={title}
                                  count={true}
                                  ref={undefined}
                                  errorTag={formik.touched.title && formik.errors.title}
                                  errorField={formik.errors.title}
                                />
                              )}
                            </div>
                            <Field name={'content'} className="group relative z-10">
                              {({ field, form }) => (
                                <Markdown
                                  setFormBody={setFormBody}
                                  formBody={formBody}
                                  formikField={field}
                                  formikForm={form}
                                  preview={preview}
                                  form={form}
                                  source={source}
                                  count={14000}
                                  handleChange={handleChange}
                                  title={title}
                                  Content={undefined}
                                />
                              )}
                            </Field>
                            {!preview ? (
                              <>
                                <FormikIconInput
                                  name="discussion"
                                  title="Discussion (optional)"
                                  placeholder="https://forum.algorand.org/proposal"
                                  value={formData.discussion}
                                  icon={<GlobeIconAlt />}
                                  maxLength={50}
                                  count={true}
                                  id={undefined}
                                  ref={undefined}
                                  errorTag={formik.touched.discussion && formik.errors.discussion}
                                  errorField={formik.errors.discussion}
                                />
                                <div className="w-full">
                                  <FormikInput
                                    type="number"
                                    name={'token'}
                                    title={'Asset Id'}
                                    value={formData.token}
                                    maxLength={16}
                                    id={undefined}
                                    placeholder="e.g. 137594422"
                                    ref={undefined}
                                    errorTag={formik.touched.token && formik.errors.token}
                                    errorField={formik.errors.token}
                                    count={true}
                                  />
                                </div>
                              </>
                            ) : null}
                          </div>
                        )}
                        {step === 2 && (
                          <>
                            <div className="mb-5 space-y-4">
                              <Block title="Voting">
                                <div className="w-full">
                                  <InputSelectVotingType
                                    onUpdateType={(value) => {
                                      formik.setFieldValue('strategyType', value);
                                      if (value.text === 'basic') {
                                        formik.setFieldValue('choices', [
                                          { key: 0, id: 'choice-1', choice: 'For' },
                                          { key: 1, id: 'choice-2', choice: 'Against' },
                                          { key: 2, id: 'choice-3', choice: 'Abstain' },
                                        ]);
                                        setFormData({ ...formData, strategyType: value });
                                      }
                                      if (value.text === 'open') {
                                        formik.setFieldValue('choices', [
                                          { key: 0, id: 'choice-1', choice: '', label: '' },
                                        ]);
                                        setFormData({ ...formData, strategyType: value });
                                      }
                                      if (value.text !== 'basic' && value.text !== 'open') {
                                        formik.setFieldValue('choices', [
                                          { key: 0, id: 'choice-1' },
                                          { key: 1, id: 'choice-2' },
                                        ]);
                                        setFormData({ ...formData, strategyType: value });
                                      }

                                    }}
                                    formik={values}
                                  />
                                </div>
                                <h4 className="mt-3 mb-1">Choices</h4>
                                <div className="flex">
                                  <div className="w-full overflow-hidden">
                                    <InputChoices
                                      domainData={domainData}
                                      space={space}
                                      appId={appId}
                                      textValue={
                                        values?.strategyType?.text ||
                                        values?.strategyType?.[0]?.text
                                      }
                                      values={values}
                                      setFormData={setFormData}
                                      formData={formData}
                                      setFieldValue={setFieldValue}
                                      formDataRefOpen={formDataRefOpen}
                                      handleChoices={handleChoices}
                                      formDataRefSingle={formDataRefSingle}
                                      formDataRefApproval={formDataRefApproval}
                                      formDataRefQuadratic={formDataRefQuadratic}
                                      formDataRefWeighted={formDataRefWeighted}
                                      formDataRefRankedChoice={formDataRefRankedChoice}
                                    />
                                  </div>
                                </div>
                              </Block>
                              <Block
                                title="Voting period"
                                labelTooltip={true}
                                label="This is the time period in which users will be able to vote. The proposal will be visible and pending before the start of the voting period."
                              >
                                <div className="space-y-2 md:flex md:space-x-3 md:space-y-0">
                                  <div className="w-full">
                                    <SpaceCreateVotingDateStart
                                      upStreamStart={(timestamp) =>
                                        formik.setFieldValue('start', timestamp)
                                      }
                                    />
                                  </div>
                                  <div className="w-full">
                                    <SpaceCreateVotingDateEnd
                                      upStreamEnd={(timestamp) =>
                                        formik.setFieldValue('end', timestamp)
                                      }
                                      disabled={!formData.start}
                                      handleClick={() => formik.setFieldValue('end', upStreamEnder)}
                                      onMaxRound={(maxRound) => {
                                        setMaxRound(maxRound);
                                      }}
                                    />
                                  </div>
                                </div>
                              </Block>
                            </div>
                          </>
                        )}
                        {step === 3 && (
                          <MemoizedReviewForm formikValues={values} formData={formData} />
                        )}
                        {rawSettings && <DisplayFormikState {...formik} />}
                      </Form>
                    </div>
                  </div>
                  <Sidebar
                    textPrimary={
                      proposalAvailability !== false
                        ? (step === 1 && 'Continue') ||
                          (step === 2 && 'Review') ||
                          (step === 3 && 'Submit')
                        : currentMaxRound
                    }
                    handlePrimary={() =>
                      step === 1
                        ? handleContinue(values.token)
                        : step === 2
                        ? handleReview()
                        : step === 3
                        ? createVote()
                        : null
                    }
                    textSecondary={
                      (step === 1 && `${preview ? 'Edit' : 'Preview'}`) ||
                      (step === 2 && 'Back') ||
                      (step === 3 && 'Edit')
                    }
                    handleSecondary={
                      (step === 1 && handlePreview) ||
                      (step === 2 && handleBack) ||
                      (step === 3 && handleBack)
                    }
                    disabled={
                      (step === 1 && (!proposalAvailability || !isFormValid)) ||
                      (step === 2 && ((formik.values.strategyType.text === 'open' && isLabelEmpty) || (isChoiceEmpty || hasError))) ||
                      (step === 3 && loading)
                    }
                    handleAppChange={undefined}
                    appId={appId}
                    appIdRef={undefined}
                    domainData={domainData}
                    loading={loading}
                  />
                </>
              );
            }}
          </Formik>
        </div>
      )}
      {isModalPostCreateProposalOpen && (
        <PostCreateProposalModal
          viewProposal={closeAndNavigateProposal}
          open={isModalPostCreateProposalOpen}
          onClose={closeAndNavigateHome}
          txId={
            proposalId ||
            null
          }
        />
      )}
    </>
  );
}

export default SpaceCreateProposal;