import React, { useMemo } from 'react';
import { Proposal } from 'helpers/interfaces';
import { shorten } from 'helpers/utils';
import { CheckmarkIcon } from 'icons/Checkmark';
import { useFormatCompactNumber } from 'utils/useFormatCompactNumber';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'utils/useMediaQuery';
import { defaultChoices } from 'utils/constants/templates/choices';

interface ProposalDisplayProps {
  proposal: Proposal;
}

// Move utility function out of the component
function LocalNumber({ raw, unitName }) {
  const formattedRaw = useFormatCompactNumber(raw);
  return <>{formattedRaw + ' ' + unitName}</>;
}

LocalNumber.propTypes = {
  raw: PropTypes.any.isRequired,
  unitName: PropTypes.string.isRequired,
};

// Extract repeated parts into a separate component
const ProposalChoice = ({
  choice,
  isWinner,
  rawValue,
  unitName,
  widthPercentage,
  isSmallScreen,
  isMedScreen,
  isMedLgScreen,
}) => (
  <div className="relative mt-1 w-full">
    <div className="absolute ml-3 flex items-center leading-[43px] text-skin-link">
      {isWinner && <CheckmarkIcon className="-ml-1 mr-2 text-sm" />}
      {shorten(choice, isSmallScreen ? 12 : isMedScreen ? 16 : isMedLgScreen ? 24 : 32)}
      <span className="ml-1 text-skin-text">
        <LocalNumber raw={rawValue} unitName={unitName} />
      </span>
    </div>
    <div
      className="absolute right-0 ml-2 pl-2 pr-3 leading-[40px] text-skin-link"
      children={widthPercentage + '%'}
    />
    <div style={{ width: `${widthPercentage}%` }} className="h-[40px] rounded-md bg-skin-border" />
  </div>
);

const ProposalsItemResult: React.FC<ProposalDisplayProps> = ({ proposal }) => {
  const winningChoices = useMemo(() => {
    if (proposal?.scores && proposal?.scores?.tallies) {
      const sortedEntries = Object.entries(proposal?.scores?.tallies).sort(
        ([, a], [, b]) => Number(b) - Number(a),
      );
      const highestScore = sortedEntries[0][1];
      return sortedEntries.filter(([, value]) => value === highestScore).map(([key]) => key);
    }
    return [];
  }, [proposal?.scores]);

  const tallies = useMemo(() => {
    return proposal?.scores?.tallies
      ? Object.entries(proposal.scores.tallies).reduce((acc, [key, value]) => {
          acc[key.toLowerCase()] = value;
          return acc;
        }, {})
      : {};
  }, [proposal?.scores?.tallies]);

  const total = proposal?.scores?.total;
  const isSmallScreen = useMediaQuery('(max-width: 380px)');
  const isMedScreen = useMediaQuery('(max-width: 480px)');
  const isMedLgScreen = useMediaQuery('(max-width: 620px)');

  const strategyType = proposal?.strategyType?.text;

  const renderProposalChoice = (key, i, isWinner, tally) => {
    let widthPercentage = total !== 0 ? ((tally / total) * 100).toFixed(2) : 0;
    const rawValue = (tally / Math.pow(10, proposal?.tokenData?.decimals)).toFixed(3);

    return (
      <ProposalChoice
        key={`choice-${i}`}
        choice={key}
        isWinner={isWinner}
        rawValue={rawValue}
        unitName={proposal?.tokenData?.unitName}
        widthPercentage={widthPercentage}
        isSmallScreen={isSmallScreen}
        isMedScreen={isMedScreen}
        isMedLgScreen={isMedLgScreen}
      />
    );
  };


  return (
    <div>
      {total > 0
        ? strategyType === 'open'
          ? Object.keys(tallies)
              .sort((a, b) => tallies[b] - tallies[a])
              .map((key, i) =>
                renderProposalChoice(key, i, winningChoices.includes(key), tallies[key]),
              )
          : proposal?.choices.map((choiceObject, i) => {
              const tally = tallies[choiceObject.choice.toLowerCase()] || 0;
              return renderProposalChoice(
                choiceObject.choice,
                i,
                winningChoices.includes(choiceObject.choice),
                tally,
              );
            })
        : strategyType === 'open'
        ? defaultChoices.map((choiceObject, i) =>
            renderProposalChoice(choiceObject.choice, i, false, 0),
          )
        : proposal?.choices.map((choiceObject, i) =>
            renderProposalChoice(choiceObject.choice, i, false, 0),
          )}
    </div>
  );
};

export default ProposalsItemResult;
