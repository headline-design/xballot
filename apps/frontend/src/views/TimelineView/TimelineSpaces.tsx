import React, { useState, useEffect, useCallback } from 'react';
import { Proposals } from 'utils/constants/templates/proposal';
import { TimelineItem } from 'components/BaseComponents/TimelineItem';
import { useInView } from 'react-cool-inview';
import { NoResults } from './Components/TimelineNoResults';
import { TimelineLoaderInner } from '../../components/Loaders/TimelineLoader';

const Template = Proposals[0];

const MemoizedTimelineItem = React.memo(TimelineItem);
function TimelineSpaces({ proposals, loading, space, profiles }) {
  useEffect(() => {
    document.title = `Timeline | XBallot`;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      (descriptionTag as HTMLMetaElement).content = space?.about?.slice(0, 160) || '';
    }
  }, [space?.name, space?.about]);
  const [moreLoading, setMoreLoading] = useState(false);
  const [visibleProposals, setVisibleProposals] = useState(proposals.slice(0, 10));

  useEffect(() => {
    setVisibleProposals(proposals.slice(0, 10));
  }, [proposals]);

  const loadMoreProposals = useCallback(async () => {
    setMoreLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVisibleProposals((prevVisibleProposals) => [
      ...prevVisibleProposals,
      ...proposals.slice(prevVisibleProposals.length, prevVisibleProposals.length + 10),
    ]);
    setMoreLoading(false);
  }, [proposals]);

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (inView && !loading && !moreLoading) {
        loadMoreProposals();
      }
    },
  });

  return (
    <>
      <div className="my-4 space-y-4">
        <div className="border-skin-border bg-skin-block-bg md:rounded-lg md:border">
          {visibleProposals &&
            visibleProposals.map((proposal, i) => (
              <MemoizedTimelineItem
                space={space}
                key={`ProposalCardItem_${i}`}
                proposal={proposal}
                creator={proposal?.creator}
                profiles={profiles}
                voted={false}
                to={undefined}
              />
            ))}
          {(loading || moreLoading) && <TimelineLoaderInner />}
          {visibleProposals.length === 0 && !loading && !moreLoading && <NoResults />}
        </div>
        {visibleProposals && <>{visibleProposals.length > 0 && <div ref={observe}> </div>}</>}
      </div>
    </>
  );
}

export default TimelineSpaces;
