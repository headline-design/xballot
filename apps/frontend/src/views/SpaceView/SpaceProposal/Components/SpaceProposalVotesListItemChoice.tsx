import Tippy from '@tippyjs/react';

export const SpaceProposalVotesListItemChoice = ({ vote }) => {
  return (
    <>
      <Tippy content={vote.option}>
        <div className="flex-auto truncate px-2 text-center text-skin-link">
          <div className="cursor-text truncate text-center text-skin-link">{vote.option}</div>
        </div>
      </Tippy>
    </>
  );
};
