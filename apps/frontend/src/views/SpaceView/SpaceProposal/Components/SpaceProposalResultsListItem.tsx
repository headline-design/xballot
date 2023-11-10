import { useState, useEffect } from 'react';
import { shorten } from 'helpers/utils';
import { ExtendedSpace, Proposal, Results, SpaceStrategy } from 'helpers/interfaces';
import SpaceProposalResultsProgressBar from './SpaceProposalResultsProgressBar';

const SpaceProposalResultsListItem = ({ choice, space, proposal, results, strategies }) => {
  const titles = strategies.map((strategy) => strategy.params.symbol || '');

  const [choiceString, setChoiceString] = useState(null);
  const hideAbstain = space?.voting?.hideAbstain ?? false;

  useEffect(() => {
    setChoiceString(document.querySelector(`#choice-${choice.i}`));
  }, [choice.i]);

  const getPercentage = (n, max) => (max ? ((100 / max) * n) / 1e2 : 0);

  const choicePercentage = () => {
    if (proposal.type === 'basic' && hideAbstain) {
      if (choice.i === 0)
        return getPercentage(results.scores[0], results.scores[0] + results.scores[1]);

      if (choice.i === 1)
        return getPercentage(results.scores[1], results.scores[0] + results.scores[1]);
    }

    return getPercentage(results.scores[choice.i], results.scoresTotal);
  };

  const isTruncated = () => {
    if (!choiceString) return false;
    return choiceString.scrollWidth > choiceString.clientWidth;
  };

  const isVisible = () => {
    if (proposal.type === 'basic' && hideAbstain) {
      if (choice.i === 2) return false;
    }
    return true;
  };

  return (
    <>
      {isVisible() && (
        <div>
          <div className="mb-1 flex justify-between text-skin-link">
            <div className="flex overflow-hidden">
              <span
                id={`choice-${choice.i}`}
                data-tippy-content={isTruncated() ? choice.choice : null}
                className="mr-1 truncate"
              >
                {choice.choice}
              </span>
            </div>
            <div className="flex justify-end">
              {proposal.privacy === 'shutter' && proposal.scores_state !== 'final' && (
                <i
                  data-tippy-content='privacy.shutter.tooltip'
                  className="hi-lock-closed mx-auto cursor-help"
                />
              )}
              {proposal.privacy !== 'shutter' || proposal.scores_state === 'final' ? (
                <div className="space-x-2">
                  <span
                    data-tippy-content={results.scoresByStrategy[choice.i]
                      .map((score, index) => `${(score)} ${titles[index]}`)
                      .join(' + ')}
                    className="whitespace-nowrap"
                  >
                    {(results.scores[choice.i])}
                    {shorten(proposal.symbol || space.symbol, 'symbol')}
                  </span>
                  <span>{(choicePercentage())}</span>
                </div>
              ) : null}
            </div>
          </div>
          <SpaceProposalResultsProgressBar
            value={results.scoresByStrategy[choice.i]}
            max={
              proposal.type === 'basic' && hideAbstain
                ? results.scores[0] + results.scores[1]
                : results.scoresTotal
            }
          />
        </div>
      )}
    </>
  );
};

export default SpaceProposalResultsListItem