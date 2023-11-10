import React from 'react';
import capitalize from 'lodash/capitalize';
import Tippy from '@tippyjs/react';
import { useIntl } from 'helpers/useIntl';

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const ProposalItemFooter = ({ proposal }) => {
  const { getRelativeProposalPeriod, formatPercentNumber, formatCompactNumber } = useIntl();

  const tooltipContent = new Date(
    (proposal.scores_state === 'pending' ? proposal.start : proposal.end) * 1000,
  ).toLocaleDateString('en-US', options);

  const quorumReached = proposal.quorum !== 0 && proposal.scores_total;

  const relativeProposalPeriod = capitalize(
    getRelativeProposalPeriod(proposal.scores_state, proposal.start, proposal.end),
  );

  const handleClick = (event) => {
    event.preventDefault();
  };

  return (
    <div className="mt-3">
      <Tippy content={tooltipContent}>
        <span className="cursor-help text-sm" onClick={handleClick}>
          {relativeProposalPeriod}
        </span>
      </Tippy>
      {quorumReached && (
        <span>
          {' - '}
          {formatPercentNumber(
            Number(formatCompactNumber(proposal.scores_total / proposal.quorum)),
          )}{' '}
          {'quorumReached'}
        </span>
      )}
    </div>
  );
};

export default ProposalItemFooter;
