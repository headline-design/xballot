import React from 'react';
import { Proposal } from 'helpers/interfaces';
import LabelProposalVoted from './LabelProposalVoted';

interface ProposalsItemTitleProps {
  proposal: Proposal;
  voted: boolean;
}

const ProposalsItemTitle: React.FC<ProposalsItemTitleProps> = ({ proposal, voted }) => {
  return (
    <div className="relative mb-1 break-words pr-[80px] leading-7">
      <h3 className="inline pr-2">{proposal.title}</h3>
      {voted && <LabelProposalVoted />}
    </div>
  );
};

export default ProposalsItemTitle;
