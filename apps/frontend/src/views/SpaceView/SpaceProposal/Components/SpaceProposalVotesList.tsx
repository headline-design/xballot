import BaseUser from './BaseUser';
import { SpaceProposalVotesListItemChoice } from './SpaceProposalVotesListItemChoice';
import BasePopover from 'components/BaseComponents/BasePopover';
import { Block } from 'components/BaseComponents/Block';
import { useState } from 'react';
import { LoadingRow } from 'components/BaseComponents/BaseLoading/LoadingRow';
import { useFormatCompactNumber } from 'utils/useFormatCompactNumber';

export const SpaceProposalVotesListItemRow = ({
  vote,
  creatorId,
  profiles,
  proposal,
  space,
  itemRef,
  close,
  expand,
}) => {
  //console.log(proposal);
  return (
    <div
      className="flex items-center gap-3 border-t px-3 py-[14px] first:border-0"
      ref={itemRef}
      onClick={expand}
    >
      <BaseUser
        close={close}
        creator={creatorId}
        profiles={profiles}
        address={vote?.voter}
        space={space}
        proposal={proposal}
        widthClass="w-[110px] min-w-[110px] xs:w-[130px] xs:min-w-[130px] text-left"
        hideAvatar={undefined}
        profile={undefined}
      />

      <SpaceProposalVotesListItemChoice vote={vote} />
      <div className="flex w-[110px] min-w-[110px] items-center justify-end whitespace-nowrap text-right text-skin-link xs:w-[130px] xs:min-w-[130px]">
        <span>
          {`${useFormatCompactNumber(vote?.votes / Math.pow(10, proposal?.tokenData?.decimals))} ${
            proposal?.tokenData?.unitName
          }`}
        </span>
        <BasePopover zIndex={60} vote={vote} />
      </div>
    </div>
  );
};

const SpaceProposalVotesList = ({
  votes,
  loaded,
  profiles,
  proposal,
  space,
  close,
  expandVoter,
  handleModalOpen,
}) => {
  const PAGE_SIZE = 6;
  const totalVotes = Object.keys(votes || {}).length;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const displayedVotes = Object.keys(votes || {})
    .filter((key) => votes[key]?.votes !== undefined)
    .slice(0, page * PAGE_SIZE);

  const handleLoadMore = () => {
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  const isZero = () => {
    if (!loaded) return true;
    if (votes?.length > 0) return true;
  };

  return isZero() ? (
    <>
      {displayedVotes.length > 0 && (
        <Block title="Votes" counter={totalVotes} tableLoading={votes && votes.length < 1} slim>
          <div className="leading-5 sm:leading-6">
            {!votes ? (
              <LoadingRow />
            ) : (
              <>
                {displayedVotes.map((key, index) => {
                  const vote = votes[key];

                  return (
                    <SpaceProposalVotesListItemRow
                      close={close}
                      key={index}
                      vote={vote}
                      creatorId={vote.address}
                      profiles={profiles}
                      proposal={proposal}
                      space={space}
                      itemRef={undefined}
                      expand={() => expandVoter(vote)}
                    />
                  );
                })}

                {Object.keys(votes).length > 6 && (
                  <div
                    onClick={handleModalOpen}
                    className="block cursor-pointer rounded-b-none border-t px-4 py-3 text-center md:rounded-b-md"
                  >
                    {!loading ? <span>See more</span> : <LoadingRow />}
                  </div>
                )}
              </>
            )}
          </div>
        </Block>
      )}
    </>
  ) : null;
};

export default SpaceProposalVotesList;
