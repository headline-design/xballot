import { Link, useLocation, useParams } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Block } from 'components/BaseComponents/Block';
import NoResults from 'components/NoResults';
import TextAutolinker from 'components/TextAutoLinker';
import { useOgMeta } from 'composables/useDocumentTitle';
import ProposalsItem from 'components/BaseComponents/ProposalsItem/ProposalsItem';
import { TimelineLoaderInner } from 'components/Loaders/TimelineLoader';
import ProposalStateSelect from 'components/BaseComponents/ProposalStateSelect';
import { debounce } from 'lodash';
import { Button } from 'components/BaseComponents/Button';

type SpaceProps = {
  space?: {
    description?: string;
    about?: string;
  };
};

const SpaceDescriptionRow = React.memo(
  ({ space }: SpaceProps) =>
    space?.about &&
    space?.about !== '' && (
      <div className="mb-3 border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
        <div className="p-4 leading-5 sm:leading-6">
          <span>
            <TextAutolinker text={space?.about} />
          </span>
        </div>
      </div>
    ),
);

function SpaceProposals({ appnum, proposals, loading, space, profiles }) {
  const { spaceKey } = useParams();

  const proposalStates = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Closed', value: 'closed' },
  ];

  const [selectedProposalState, setSelectedProposalState] = useState(proposalStates[0]);

  useOgMeta({ space, spaceKey });

  const [moreLoading, setMoreLoading] = useState(false);
  const [visibleProposals, setVisibleProposals] = useState(proposals.slice(0, 10));
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);

  useEffect(() => {
    setVisibleProposals(proposals.slice(0, 10));
    setShowLoadMoreButton(proposals.length > 10);
  }, [proposals]);

  const loadMoreProposals = useCallback(async () => {
    if (proposals.length <= visibleProposals.length) {
      setShowLoadMoreButton(false);
      return;
    }

    setMoreLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
      setVisibleProposals((prevVisibleProposals) => [
        ...prevVisibleProposals,
        ...proposals.slice(prevVisibleProposals.length, prevVisibleProposals.length + 10),
      ]);
    setMoreLoading(false);

      if (proposals.length <= visibleProposals.length + 10) {
        setShowLoadMoreButton(false);
      } else {
        setShowLoadMoreButton(true);
      }
  }, [proposals, visibleProposals.length]);

  const updateFilteredProposals = useCallback(
    debounce(() => {
      let newFilteredProposals = proposals;

      if (selectedProposalState.value !== 'all') {
        newFilteredProposals = newFilteredProposals.filter(
          (proposal) => proposal.scores_state === selectedProposalState.value,
        );
      }

      setVisibleProposals(newFilteredProposals.slice(0, 10));
      setShowLoadMoreButton(newFilteredProposals.length > 10);
    }, 200),
    [proposals, selectedProposalState],
  );

  useEffect(() => {
    updateFilteredProposals();
  }, [selectedProposalState, updateFilteredProposals]);

  useEffect(() => {
    setVisibleProposals(proposals.slice(0, 10));
    setShowLoadMoreButton(proposals.length > 10);
  }, [proposals]);

  return (
    <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
      {loading || moreLoading ? (
        <Block>

    <div
      className="lazy-loading mb-2 rounded-md"
      style={{ width: "60%", height: 28 }}
    />
    <div
      className="lazy-loading rounded-md"
      style={{ width: "50%", height: 28 }}
    />

        </Block>
      ) : (
        <>
          <SpaceDescriptionRow space={space} />
          <div className="relative mb-3 flex px-3 md:px-0">
            <div className="flex-auto">
              <div className="flex--auto flex items-center">
                <h2>Proposals</h2>
              </div>
            </div>
            <div data-headlessui-state="" className="inline-block h-full text-left">
              <div>
                <ProposalStateSelect
                  states={proposalStates}
                  selectedState={selectedProposalState}
                  onSelectState={setSelectedProposalState}
                />
              </div>
            </div>
          </div>

          <div className="my-4 space-y-4">
            {visibleProposals &&
              visibleProposals.map((proposal, i) => (
                <ProposalsItem
                  key={`ProposalCardItem_${i}`}
                  proposal={proposal}
                  creator={proposal?.creator}
                  space={proposal}
                  profiles={profiles}
                  voted={false}
                  to={undefined}
                />
              ))}
            {(loading || moreLoading) && <TimelineLoaderInner />}
            {visibleProposals.length === 0 && !loading && !moreLoading && (
              <NoResults space={undefined} actionType={'Create proposal'} />
            )}
          </div>
          {showLoadMoreButton && (
            <div className="my-4 text-center">
              <Button onClick={loadMoreProposals} className="button mt-4 w-full px-[22px]">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SpaceProposals;
