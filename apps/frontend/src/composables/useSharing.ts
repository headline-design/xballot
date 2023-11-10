
import { useCopy } from './useCopy';
import { ExtendedSpace, Proposal } from 'helpers/interfaces';

export function useSharing() {

  let share
  let isSupported

  const sharingItems = [
    {
      text: 'Twitter',
      action: 'shareProposalTwitter',
      extras: { icon: 'twitter' }
    },
    {
      text: 'Copy link',
      action: 'shareToClipboard',
      extras: { icon: 'link' }
    }
  ];

  function proposalUrl(key, proposal) {
    return `https://${window.location.hostname}/${key}/proposal/${proposal.txid}`;
  }
  function encodedProposalUrl(key, proposal) {
    return encodeURIComponent(proposalUrl(key, proposal));
  }

  function shareProposal(space, proposal) {
    share({
      title: '',
      text: `${space.name} - ${proposal.title}`,
      url: proposalUrl(space.domain, proposal)
    });
  }

  function shareVote(
    shareTo: 'twitter' | 'lenster',
    payload: { space: ExtendedSpace; proposal: Proposal; choices: string }
  ) {
    const postText = getSharingText(shareTo, payload);

    if (isSupported.value)
      return share({
        title: '',
        text: postText,
        url: proposalUrl(payload.space.domain, payload.proposal)
      });
    if (window && shareTo === 'twitter') return shareTwitter(postText);
  }

  function getSharingText(shareTo: 'twitter' | 'lenster', payload): string {
    const isSingleChoice =
      payload.proposal.type === 'single-choice' ||
      payload.proposal.type === 'basic';
    const isPrivate = payload.proposal.privacy === 'shutter';
    const votedText =
      payload.choices && isSingleChoice && !isPrivate
        ? `I just voted "${payload.choices}" on`
        : `I just voted on`;

    const spaceHandle = payload.space.twitter
      ? `@${payload.space.twitter}`
      : payload.space.name;

    if (isSupported.value)
      return `${votedText} "${payload.proposal.title}" ${spaceHandle} @XBallot`;
    if (shareTo === 'twitter')
      return `${encodeURIComponent(votedText)}%20"${encodeURIComponent(
        payload.proposal.title
      )}"%20${encodedProposalUrl(
        payload.space.domain,
        payload.proposal
      )}%20${spaceHandle}%20@XBallot`;
    if (shareTo === 'lenster')
      return `${encodeURIComponent(votedText)}%20"${encodeURIComponent(
        payload.proposal.title
      )}"%20${encodedProposalUrl(
        payload.space.domain,
        payload.proposal
      )}&hashtags=XBallot`;
    return `${votedText} "${payload.proposal.title}"`;
  }

  function shareTwitter(text) {
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank')?.focus();
  }

  function shareProposalTwitter(space, proposal) {
    console.log("shareProposalTwitter called with: ", space, proposal); // add this line
    const handle = space.twitter ? `@${space.twitter}` : space.name;
    shareTwitter(
      `${encodeURIComponent(proposal.title)}%20${encodedProposalUrl(
        space.domain,
        proposal
      )}%20${handle}%20@XBallot`
    );
  }

  const { copyToClipboard } = useCopy();

  function shareToClipboard(space, proposal) {
    copyToClipboard(proposalUrl(space.domain, proposal));
  }

  return {
    shareProposalTwitter,
    shareToClipboard,
    proposalUrl,
    shareProposal,
    shareVote,
    sharingIsSupported: isSupported,
    sharingItems
  };
}
