import { useState, useEffect } from 'react';
import {
  ExtendedSpace,
  Proposal,
  Results,
  SpaceStrategy,
  Vote
} from 'helpers/interfaces';
import SpaceProposalResultsListItem from './SpaceProposalResultsListItem';

interface Props {
  space: ExtendedSpace;
  proposal: Proposal;
  results: Results;
  strategies: SpaceStrategy[];
  votes: Vote[];
}

export const SpaceProposalResultsList = (props: Props) => {
  const [choices, setChoices] = useState<{ i: number; choice: string }[]>([]);
  const [showQuorum, setShowQuorum] = useState<boolean>(false);

  useEffect(() => {
    const sortedChoices = props.proposal.choices
      .map((choice, i) => ({ i, choice }))
      .sort((a, b) => props.results.scores[b.i] - props.results.scores[a.i]);
    setChoices(sortedChoices);
    setShowQuorum(
    props.proposal.scores_state === 'final'
    );
  }, [props]);

  return (
    <div className="space-y-3">
      {choices.map((choice) => (
        <SpaceProposalResultsListItem
          key={choice.i}
          choice={choice}
          space={props.space}
          proposal={props.proposal}
          results={props.results}
          strategies={props.strategies}
        />
      ))}
    </div>
  );
};