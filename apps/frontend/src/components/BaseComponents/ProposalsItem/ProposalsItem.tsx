import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import removeMd from 'remove-markdown';
import { Proposal, ExtendedSpace, Profile } from 'helpers/interfaces';
import LabelProposalState from './LabelProposalState';
import ProposalsItemTitle from './ProposalsItemTitle';
import ProposalsItemBody from './ProposalsItemBody';
import ProposalsItemResult from './ProposalsItemResult';
import ProposalsItemFooter from './ProposalsItemActive';
import { ProfilePopover } from 'components/ProfilePopover/ProfilePopover';

interface ProposalsItemProps {
  proposal: Proposal;
  profiles: { [key: string]: Profile };
  space: ExtendedSpace;
  voted: boolean;
  to: Record<string, unknown>;
  hideSpaceAvatar?: boolean;
  showVerifiedIcon?: boolean;
  creator: any;
}

const ProposalsItem: React.FC<ProposalsItemProps> = ({
  proposal,
  profiles,
  space,
  voted,
  to,
  hideSpaceAvatar,
  showVerifiedIcon,
  creator,
}) => {
  const body = useMemo(() => removeMd(proposal.content || ''), [proposal.content]);

  return (
    <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border transition-colors md:hover:border-skin-text">
      <Link className="block p-3 text-skin-text sm:p-4" to={'proposal/' + proposal.txid}>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-1"   onClick={(e) => e.stopPropagation()}>
              <ProfilePopover creator={creator} profiles={profiles} hideAvatar={false} profile={undefined}  />
            </div>
            <LabelProposalState state={proposal?.scores_state || ''} />
          </div>
          <ProposalsItemTitle proposal={proposal} voted={voted} />

          {body && <ProposalsItemBody>{body}</ProposalsItemBody>}

          {(proposal?.scores_state === 'closed' || proposal?.scores_state === 'final' )  && (
            <ProposalsItemResult proposal={proposal} />
          )}
          <ProposalsItemFooter proposal={proposal} />
        </div>
      </Link>
    </div>
  );
};

export default ProposalsItem;
