import { Block } from 'components/BaseComponents/Block';
import { Proposal, Choice, Vote } from 'helpers/interfaces';
import {
  SpaceProposalVoteSingleChoice,
  SpaceProposalVoteApproval,
  SpaceProposalVoteQuadratic,
  SpaceProposalVoteRankedChoice,
  SpaceProposalVoteOpenChoice,
} from './ProposalVotes';
import React, { useEffect, useState } from 'react';

interface Props {
  proposal: Proposal | any;
  modelValue: Choice | any;
  userVote: Vote | null | any;
  onVoteSelect: any;
  selected: any;
  submitButton: any;
  web3: any;
  loading: any;
  vote: any;
  onVoteChoiceSelect: (choice: any) => void;
  onSelectedChoice: any;
  children: any;
}

const VoteBlock: React.FC<Props> = ({
  proposal,
  modelValue,
  userVote,
  onVoteSelect,
  selected,
  submitButton,
  web3,
  loading,
  vote,
  children,
  onVoteChoiceSelect,
  onSelectedChoice,
}) => {
  const [selectedChoices, setSelectedChoices] = useState(0);
  const [validatedUserChoice, setValidatedUserChoice] = useState<Choice | null>(null);
  const [voting, setVoting] = useState(null);

  useEffect(() => {
    if (Array.isArray(modelValue)) setSelectedChoices(modelValue.length);
    else if (typeof modelValue === 'object' && modelValue !== null)
      setSelectedChoices(Object.keys(modelValue).length);
    else setSelectedChoices(modelValue);
  }, [modelValue]);

  useEffect(() => {
    //console.log('User Vote Choice:', userVote?.choice);
    // ...
  }, [userVote]);

  useEffect(() => {
    if (!userVote?.choice) {
      setValidatedUserChoice(null);
      return;
    }
    if (voting[proposal?.strategyType].isValidChoice(userVote.choice, proposal?.choices)) {
      setValidatedUserChoice(userVote.choice);
      onVoteChoiceSelect(userVote.choice); // pass selected choice up to ProposalView
      //console.log('Selected Choice:', userVote.choice); // log selected choice
      return;
    }
    setValidatedUserChoice(null);
  }, [userVote]);

  const onSelectChoice = (selectedChoice: any) => {
    //console.log('Selected Choice:', selectedChoice);
    onSelectedChoice(selectedChoice);
  };


  //console.log(proposal?.strategyType?.text)

  return (
    <>
      <Block className="mb-4" title={'Cast your vote'}>
        <>
          {proposal?.strategyType?.text === 'single-choice' ||
          proposal?.strategyType?.text === 'basic' ? (
            <SpaceProposalVoteSingleChoice
              proposal={proposal}
              userChoice={validatedUserChoice as number}
              onSelectChoice={onSelectChoice}
            />
          ) : null}
          {proposal?.strategyType?.text === 'open' ? (
            <SpaceProposalVoteOpenChoice
              proposal={proposal}
              userChoice={validatedUserChoice as number}
              onSelectChoice={onSelectChoice}
            />
          ) : null}
          {proposal?.strategyType?.text === 'approval' ? (
            <SpaceProposalVoteApproval
              proposal={proposal}
              userChoice={validatedUserChoice as number[]}
              onSelectChoice={onSelectChoice}
            />
          ) : null}
          {proposal?.strategyType?.text === 'quadratic' || proposal?.strategyType?.text === 'weighted' ? (
            <SpaceProposalVoteQuadratic
              proposal={proposal}
              userChoice={validatedUserChoice as number}
              onSelectChoice={onSelectChoice}
            />
          ) : null}
          {proposal?.strategyType?.text === 'ranked-choice' ? (
            <SpaceProposalVoteRankedChoice
              proposal={proposal}
              userChoice={validatedUserChoice as number}
              onSelectChoice={onSelectChoice}
            />
          ) : null}
          {children}
        </>
      </Block>
    </>
  );
};

export default VoteBlock;
