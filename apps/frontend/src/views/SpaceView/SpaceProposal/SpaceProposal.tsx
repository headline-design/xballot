import { Link, useParams } from 'react-router-dom';
import { ButtonShare } from 'components/BaseComponents/ButtonShare';
import { Markdown } from 'components/BaseComponents/Markdown';
import { ButtonMore } from 'components/BaseComponents/ButtonMore';
import { BackButton } from 'components/BaseComponents/BackButton';
import React, { useEffect, useRef, useState, useContext, useCallback, useMemo } from 'react';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import SpaceProposalInformation from './Components/SpaceProposalInformation';
import SpaceProposalResults from './Components/SpaceProposalResults';
import PageLoader from 'components/Loaders/LoadingPage';
import { Button } from 'components/BaseComponents/Button';
import { DiscussionBlock } from './Components/DiscussionBlock';
import VoteBlock from './Components/SpaceProposalVote';
import { ProposalPopover } from 'components/ProfilePopover/ProposalPopover';
import SpaceProposalVotesList from './Components/SpaceProposalVotesList';
import { getAppIdFromDomain, getRound, isOpted } from 'orderFunctions';
import LabelProposalState from 'components/BaseComponents/ProposalsItem/LabelProposalState';
import PipeStateContext from 'contexts/PipeStateContext';
import VoteModal from './Components/ModalVote';
import { TypeSafeProposal, ExtendedSpace } from 'helpers/interfaces';
import { useLoginModal } from 'contexts/LoginModalContext';
import PostVoteModal from './Components/ModalPostVote';
import { useModal } from 'composables/useModal';
import { useTerms } from 'composables/useTerms';
import ModalTerms from './Components/ModalTerms';
import { reloadProposal, publish } from './SpaceProposalUtils';
import toast from 'react-hot-toast';
import ReportModal from 'components/BaseComponents/ReportModal';
import { useProposalFetcher, useIndexerProposalFetcher } from 'fetcher/fetchers';
import { staticEndpoints } from 'utils/endPoints';
import VotersListModal from 'components/BaseComponents/BaseListModal/VotersListModal';
import { useProfileInfo } from 'hooks/useProfileInfo';
import OopsProposalRow from 'components/BaseComponents/BaseLoading/OopsProposalRow';
import { shorten } from 'helpers/utils';

interface ProposalProps {
  open: boolean;
  space: ExtendedSpace;
  proposal: TypeSafeProposal;
  pipeState: any;
  proposals: any;
  appId: any;
  tallies: any;
  votes: any;
  total: any;
  reload: any;
  profiles: any;
  selectedChoices: any | number | number[] | Record<string, any> | null;
  currentRound: any;
  spaceDomain: any;
}

export const SpaceProposal: React.FC<ProposalProps> = ({ space, appId, profiles, proposals }) => {

  const pipeState = useContext(PipeStateContext);
  const { openLoginModal } = useLoginModal();

  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const { spaceKey, proposalKey } = useParams();
  const [proposal, setProposal] = useState<TypeSafeProposal>();
  const [showFullMarkdownBody, setShowFullMarkdownBody] = useState(false);
  const markdownBody = useRef<HTMLDivElement>(null);
  const [prop1, setProp1] = useState('');
  const [txId, setTxId] = useState('');
  const [validationLoading, setValidationLoading] = useState(false);
  const [isUserOpted, setIsUserOpted] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [round, setRound] = useState();

  const chainData = useCallback(async () => {
    let round = await getRound();
    setRound(round);
  }, [setRound]);

  const { fetchProposal } = useProposalFetcher();
  const { fetchIndexerProposal } = useIndexerProposalFetcher();
  const [error, setError] = useState(null);

  const fetchAndSetProposalCallback = useCallback(async () => {
    const localAppId = await getAppIdFromDomain(spaceKey);
    console.log(localAppId)
    if (localAppId) {
      try {
        const fetchedIndexerProposal = await fetchIndexerProposal(localAppId, proposalKey);
        console.log(fetchedIndexerProposal)
        if (fetchedIndexerProposal) {
          console.log('firing 1', fetchedIndexerProposal);
          setProposal(fetchedIndexerProposal);
          chainData();
          setLoading(false);
        } else {
          const fetchedProposal = await fetchProposal(localAppId, proposalKey);
          console.log('firing 2', fetchedProposal);
          setProposal(fetchedProposal);
          chainData();
          setLoading(false);
        }
      } catch (e) {
        setError(e.message);
        setLoading(false);
        console.error(e);
      }
    } else {
      setError('Could not retrieve appId from domain');
      setLoading(false);
    }
  }, [chainData, fetchIndexerProposal, fetchProposal, proposalKey, spaceKey]);

  useEffect(() => {
    if (proposals && proposals.length > 0) {
      const selectedProposal = proposals.find((p) => p.txid === proposalKey);
      if (selectedProposal) {
        setProposal(selectedProposal);
        selectedProposal.fetcher = 'worker';
        chainData();
        setLoading(false);
      } else {
        fetchAndSetProposalCallback();
      }
    } else if (!proposals) {
      fetchAndSetProposalCallback();
    }
  }, [appId, proposalKey, proposals, spaceKey, fetchAndSetProposalCallback, chainData]);

  function handleVoteSelect(selectedChoice) {
    setProp1(selectedChoice);
  }
  const voteItems = proposal?.votes?.votes;
  const voteArray = voteItems ? Object.values(voteItems) : [];

  Object.keys(proposal?.spaces?.spaces ?? {}).forEach((key) => {
    voteArray.push(key);
  });

  async function vote() {
    setVoteLoading(true);
    let token = parseInt(proposal?.tokenData?.assetId);
    let txId = await Pipeline.appCall(Number(appId), ['vote', prop1], undefined, [token]);
    setVoteLoading(false);
    console.log(txId);
  }

  const handleVote = () => {
    if (!pipeState.myAddress) {
      openLoginModal();
    } else {
      setIsModalVoteOpen(true);
    }
  };

  useEffect(() => {
    if (!showFullMarkdownBody) window.scrollTo(0, 0);
  }, [showFullMarkdownBody]);

  const truncateMarkdownBody = markdownBody.current
    ? markdownBody.current.clientHeight > 400
    : false;

  const { isModalVoteOpen, setIsModalVoteOpen, setIsModalPostVoteOpen, isModalPostVoteOpen } =
    useModal();
  const { modalTermsOpen, setModalTermsOpen, termsAccepted, acceptTerms } = useTerms(space.id);
  const [isModalReportOpen, setIsModalReportOpen] = useState(false);
  let [isModalVotersListOpen, setIsModalVotersListOpen] = useState(false);

  function closeModalVotersList() {
    setIsModalVotersListOpen(false);
  }

  const handleUpStream = (txId) => {
    setTxId(txId);
  };

  const fetchUpdatedData = async () => {
    console.log('fetching...');
  };

  const handleValidate = async () => {
    setValidationLoading(true);
    await publish(appId, proposalKey).then((d) => toast(d));
    setValidationLoading(false);
  };

  const handleReport = async () => {
    setIsModalReportOpen(true);
  };

  const handleReload = async () => {
    reloadProposal(fetchIndexerProposal, appId, proposalKey, setReloading, setProposal, chainData);
  };

  //console.log(proposal)

  useEffect(() => {
    async function checkIsOpted() {
      let opted = await isOpted(Pipeline.address, Number(appId));
      setIsUserOpted(opted);
    }

    checkIsOpted();
  }, [appId]);

  const ProcessedVote = ({ vote, profiles, proposal }) => {
    const { creatorName } = useProfileInfo(profiles, vote);

    return {
      key: vote,
      domain: creatorName || null,
      address: vote,
      votes: proposal?.scores?.votes[vote]?.votes,
      signature: proposal?.scores?.votes[vote]?.signature,
      option: proposal?.scores?.votes[vote]?.option,
    };
  };

  const processedVotes =
    proposal?.scores?.votes &&
    Object.keys(proposal?.scores.votes).map((vote) => {
      return ProcessedVote({ vote, profiles, proposal });
    });

  const [isExpanded, setIsExpanded] = useState(false);
  const [upStreamVoter, setUpStreamVoter] = useState(null);

  function handleUpStreamVoter(voter) {
    setUpStreamVoter(voter);
    setIsExpanded(true);
    setIsModalVotersListOpen(true);
  }

  function handleModalVotersListOpen() {
    setUpStreamVoter(null);
    setIsExpanded(false);
    setIsModalVotersListOpen(true);
  }

console.log('proposal', proposal)
console.log('space', space)
  return (
    <>
      {error ? (
        <div id="content-left" className="relative w-full lg:w-8/12 lg:pr-5">
          <OopsProposalRow spaceKey={spaceKey} />
        </div>
      ) : loading ? (
        <div id="content-left" className="relative w-full lg:w-8/12 lg:pr-5">
          <PageLoader />
        </div>
      ) : (
        <div className="lg:flex">
          <div className="relative w-full lg:w-8/12 lg:pr-5">
            <div className="mb-3 px-3 md:px-0">
              <Link to={`/${spaceKey}`}>
                <BackButton />
              </Link>
            </div>

            <div className="px-3 md:px-0">
              <h1 className="mb-3 break-words text-xl leading-8 sm:!text-2xl">
                {proposal?.title || 'Hello World'}
              </h1>

              <div className="mb-4 flex flex-col sm:flex-row sm:space-x-1">
                <div className="flex items-center sm:mb-0">
                  <LabelProposalState
                    state={proposal?.scores_state}
                    slim={false}
                    addMargin={true}
                  />
                  <Link
                    to={`/${spaceKey}`}
                    className="router-link-active group whitespace-nowrap text-skin-text"
                  >
                    <div className="flex items-center">
                      <span className="flex shrink-0 items-center justify-center">
                        <img
                          className="rounded-full bg-skin-border object-cover"
                          alt="avatar"
                          style={{ width: 28, height: 28, minWidth: 28, display: 'none' }}
                        />
                        <img
                          src={
                            space?.avatar
                              ? space?.avatar
                              : `${staticEndpoints.stamp}space/${spaceKey || space?.name}`
                          }
                          className="rounded-full bg-skin-border object-cover"
                          alt="avatar"
                          style={{ width: 28, height: 28, minWidth: 28 }}
                        />
                      </span>
                      <span className="ml-2 group-hover:text-skin-link">{shorten(space?.name, 18)}</span>
                    </div>
                  </Link>
                </div>
                <div className="flex grow items-center space-x-1">
                  <span>by </span>
                  <div data-headlessui-state="">
                    <ProposalPopover
                      creator={proposal?.creator}
                      profiles={profiles}
                      creatorBadge={
                        <div className="ml-1 rounded-full border px-[7px] text-xs text-skin-text">
                          Core
                        </div>
                      }
                    />
                    {/**/}
                  </div>
                  <div data-headlessui-state="" className="!ml-auto inline-block pl-3 text-left">
                    <ButtonShare space={space} shareText={true} />
                  </div>

                  <ButtonMore
                    postId={121 || proposal?.id}
                    username={proposal?.creator || proposal?.creator?.name}
                    className={undefined}
                    width={undefined}
                    height={undefined}
                    share={undefined}
                    report={handleReport}
                  />
                </div>
              </div>

              <div className={`relative ${proposal?.body?.length ? '' : 'd-none'}`}>
                {!showFullMarkdownBody && truncateMarkdownBody && (
                  <div className="absolute bottom-0 h-[80px] w-full bg-gradient-to-t from-skin-bg" />
                )}
                {truncateMarkdownBody && (
                  <div
                    className={`absolute flex w-full justify-center ${
                      showFullMarkdownBody ? '-bottom-[64px]' : '-bottom-[14px]'
                    }`}
                  >
                    <Button
                      className="z-10 !bg-skin-bg"
                      onClick={() => setShowFullMarkdownBody(!showFullMarkdownBody)}
                    >
                      {showFullMarkdownBody ? 'Show less' : 'Show more'}
                    </Button>
                  </div>
                )}
                <div
                  className={`overflow-hidden ${
                    !showFullMarkdownBody && truncateMarkdownBody
                      ? 'mb-[56px] h-[420px]'
                      : showFullMarkdownBody
                      ? 'mb-[92px]'
                      : 'mb-[56px]'
                  }`}
                >
                  <div ref={markdownBody}>
                    <Markdown source={proposal?.content || ''} />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {proposal?.discussion ? (
                <div className="px-3 md:px-0">
                  <h3 className="prop-h3">Discussion</h3>
                  <DiscussionBlock
                    description={proposal?.discussion?.text}
                    link={proposal?.discussion}
                  />
                </div>
              ) : null}

              <VoteBlock
                proposal={proposal}
                modelValue={0}
                userVote={undefined}
                onVoteSelect={handleVoteSelect}
                selected={prop1}
                web3={pipeState}
                loading={voteLoading}
                vote={vote}
                onVoteChoiceSelect={function (choice: any): void {}}
                onSelectedChoice={handleVoteSelect}
                submitButton={undefined}
              >
                <Button
                  loading={voteLoading}
                  onClick={handleVote}
                  className="button button--primary block w-full px-[22px] hover:brightness-95"
                  type="button"
                  disabled={isModalVoteOpen ? true : !prop1 ? true : voteLoading ? true : false} // enable button when a button is selected
                  data-v-4a6956ba=""
                >
                  Vote
                </Button>
                <VoteModal
                  appId={appId}
                  votes={proposal?.scores?.votes}
                  isUserOpted={isUserOpted}
                  setIsUserOpted={setIsUserOpted}
                  open={isModalVoteOpen}
                  proposal={proposal}
                  onClose={() => setIsModalVoteOpen(false)}
                  space={space}
                  pipeState={pipeState}
                  selectedChoices={prop1}
                  strategies={[]}
                  onReload={fetchUpdatedData}
                  onOpenPostVoteModal={() => setIsModalPostVoteOpen(true)}
                  currentRound={round}
                  decimals={proposal?.tokenData?.decimals}
                  upStream={handleUpStream}
                  upStreamComment={undefined}
                  spaceKey={spaceKey}
                />

                <ModalTerms
                  open={modalTermsOpen}
                  space={space}
                  action={'modalTerms'}
                  onClose={() => setModalTermsOpen(false)}
                  onAccept={() => {
                    acceptTerms();
                  }}
                />
                <PostVoteModal
                  open={isModalPostVoteOpen}
                  space={space}
                  proposal={proposal}
                  selected-choices={prop1}
                  onClose={() => setIsModalPostVoteOpen(false)}
                  selectedChoices={prop1}
                  pipeState={undefined}
                  txId={txId || ''}
                />
              </VoteBlock>
              <SpaceProposalVotesList
                votes={processedVotes}
                loaded={loading}
                profiles={profiles}
                proposal={proposal}
                space={space}
                handleModalOpen={handleModalVotersListOpen}
                close={undefined}
                expandVoter={handleUpStreamVoter}
              />
              <VotersListModal
                onClose={closeModalVotersList}
                open={isModalVotersListOpen}
                items={processedVotes}
                actionLoading={undefined}
                profiles={profiles}
                proposal={proposal}
                space={space}
                upStreamVoter={upStreamVoter}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
              />
            </div>
          </div>
          <div id="sidebar-right" className="w-full lg:w-4/12 lg:min-w-[321px]">
            <div className="mt-4 space-y-4 lg:mt-0">
              <SpaceProposalInformation
                spaceKey={spaceKey}
                space={space}
                round={round}
                proposal={proposal}
                loaded={false}
              />
              <SpaceProposalResults
                    reload={handleReload}
                    reloading={reloading}
                    loading={loading}
                    validationLoading={validationLoading}
                    proposal={proposal}
                    handleValidate={handleValidate}
                    pipeState={pipeState}
                    strategyType={proposal.strategyType}              />
              <ReportModal
                targetArray={{ appId: parseInt(space?.appId), txid: proposal?.txid }}
                targetType={'proposal'}
                appId={space?.appId}
                onClose={() => setIsModalReportOpen(false)}
                isOpen={isModalReportOpen}
                setIsOpen={setIsModalReportOpen}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpaceProposal;
