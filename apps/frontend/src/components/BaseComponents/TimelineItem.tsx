import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import removeMd from 'remove-markdown';
import { Proposal, ExtendedSpace, Profile } from 'helpers/interfaces';
import AvatarSpace from 'views/TimelineView/Components/AvatarSpace';
import LabelProposalState from './ProposalsItem/LabelProposalState';
import ProposalsItemTitle from './ProposalsItem/ProposalsItemTitle';
import ProposalsItemBody from './ProposalsItem/ProposalsItemBody';
import ProposalsItemResult from './ProposalsItem/ProposalsItemResult';
import ProposalsItemActive from './ProposalsItem/ProposalsItemActive';
import IconVerifiedSpace from './ProposalsItem/IconVerifiedSpace';
import LinkSpace from './ProposalsItem/LinkSpace';
import { useProfileInfo } from 'hooks/useProfileInfo';
import { ProfilePopover } from 'components/ProfilePopover/ProfilePopover';
import ProposalItemFooter from './ProposalsItem/ProposalsItemActive';
import { staticEndpoints } from 'utils/endPoints';

interface TimelineItemProps {
  proposal: Proposal;
  profiles: { [key: string]: Profile };
  space: ExtendedSpace;
  voted: boolean;
  to: Record<string, unknown>;
  hideSpaceAvatar?: boolean;
  showVerifiedIcon?: boolean;
  creator: any;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  proposal,
  profiles,
  space,
  voted,
  to,
  hideSpaceAvatar,
  showVerifiedIcon,
  creator,
}) => {
  const body = useMemo(() => removeMd(proposal.content), [proposal.content]);
  const {} = useProfileInfo(profiles, creator);

  //console.log(proposal)

  return (
    <div className="border-b border-skin-border transition-colors first:border-t last:border-b-0 md:border-b md:first:border-t-0">
      <div className="block p-3 text-skin-text sm:p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <LinkSpace  spaceId={proposal.space.assetId} domains={undefined} domain={undefined}>
                <div className="flex items-center">
                  <AvatarSpace space={proposal.space} size={28} stamp={staticEndpoints.stamp}/>
                  <span className="ml-2 text-skin-link">{proposal.space.name}</span>
                  {showVerifiedIcon && (
                    <IconVerifiedSpace
                      spaceId={proposal.space.assetId}
                      size="18" verified={undefined}                    />
                  )}
                </div>
              </LinkSpace>
              <span>by</span>
              <ProfilePopover
                creator={creator}
                profiles={profiles}
                hideAvatar={true}
                profile={undefined}
              />
            </div>
            <LabelProposalState state={proposal.scores_state} />
          </div>
        </div>
        <Link
          to={`/${proposal?.space?.domain}/proposal/${proposal?.txid}`}
          key={proposal?.txid}
          reloadDocument={false}
          state={proposal}
        >
          <ProposalsItemTitle proposal={proposal} voted={voted} />

          {body && <ProposalsItemBody>{body}</ProposalsItemBody>}
          {(proposal?.scores_state === 'closed' || proposal?.scores_state === 'final') &&
         <ProposalsItemResult proposal={proposal} />}
        </Link>
        <ProposalItemFooter proposal={proposal} />
      </div>
    </div>
  );
};
