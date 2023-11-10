import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../Modal';
import { LoadingSpinner } from 'components/Loaders/LoadingSpinner';
import { useInView } from 'react-cool-inview';
import ModalSearch from './ListModalSearch';
import BackButton from './ListModalBack';
import { shorten } from 'helpers/utils';
import { getEndpoints, getTerms, staticEndpoints } from 'utils/endPoints';
import { Button } from '../Button';
import { useProfileInfo } from 'hooks/useProfileInfo';
import { useHoverMenu } from 'hooks/useHoverMenu';
import { SpaceProposalVotesListItemRow } from 'views/SpaceView/SpaceProposal/Components/SpaceProposalVotesList';

const VotersListModal = ({
  open,
  onClose,
  items,
  actionLoading,
  profiles,
  proposal,
  space,
  upStreamVoter,
  isExpanded,
  setIsExpanded,
}) => {
  const { close } = useHoverMenu();
  const endPoints = getEndpoints();
  const [query, setQuery] = useState('');
  const [visibleItems, setVisibleItems] = useState([]);
  const [moreLoading, setMoreLoading] = useState(false);
  const [expandedVoter, setExpandedVoter] = useState(null);
  const terms = getTerms();

  useEffect(() => {
    if (open) {
      setQuery('');
      setVisibleItems([]);
    }
  }, [open]);

  useEffect(() => {
    if (items) {
      setVisibleItems(items.slice(0, 10));
    }
  }, [items]);

  const loadMoreItems = useCallback(async () => {
    setMoreLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setVisibleItems((prevVisibleItems) => [
      ...prevVisibleItems,
      ...items
        .sort(sortByCharacterCount)
        .slice(prevVisibleItems.length, prevVisibleItems.length + 10),
    ]);
    setMoreLoading(false);
  }, [items]);

  const searchFunction = (searchQuery) => {
    if (!searchQuery) {
      return null;
    }
    return items.filter(
      (item) =>
        item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const sortByCharacterCount = (a, b) => {
    return a.domain?.length - b.domain?.length;
  };

  useEffect(() => {
    if (open) {
      setQuery('');
      setVisibleItems([]);
    }
  }, [open]);

  useEffect(() => {
    setVisibleItems(items?.sort(sortByCharacterCount).slice(0, 10));
  }, [items]);

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (inView && !moreLoading) {
        loadMoreItems();
      }
    },
  });

  const searchResults = searchFunction(query);

  const clearInput = () => {
    setQuery('');
  };

  function ActionButton({ item }) {
    //console.log(currentState);
    return (
      <Button
        data-v-4a6956ba=""
        className="button button--primary block w-full px-[22px] hover:brightness-95"
        loading={actionLoading}
        type="button"
        primary
        data-testid="confirm-button"
        onClick={onClose}
      >
        Close
      </Button>
    );
  }

  function ExpandedView({ item }) {
    const { creatorName, creatorAvatar } = useProfileInfo(profiles, item.address);
    const isProfile = profiles[item.address];
    return (
      <>
        <div className="modal-body">
          <div
            className="flex h-full min-h-full flex-col overflow-auto"
            style={{ minHeight: '420px' }}
          >
            <div className="m-4">
              <div className="group mb-3 border-y border-skin-border bg-skin-block-bg p-4 text-base text-skin-link md:rounded-xl md:border">
                {/**/}
                {/**/}
                <div className="leading-5 sm:leading-6">
                  <div className="items-center justify-between sm:flex">
                    <h3> {creatorName || shorten(item.address)}</h3>
                    <div className="my-3 flex">
                      <div className="flex shrink flex-row-reverse items-center gap-3 sm:my-0 sm:flex-row">
                        {/**/}
                        {/**/}
                        <button className="flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link">
                          <img
                            className="rounded-full bg-skin-border object-cover"
                            alt="avatar"
                            style={{
                              width: '24px',
                              height: '24px',
                              minWidth: '24px',
                              display: 'none',
                            }}
                          />
                          <img
                            src={creatorAvatar || `${staticEndpoints.stamp}space/${item.address}`}
                            className="rounded-full bg-skin-border object-cover"
                            alt="avatar"
                            style={{ width: '24px', height: '24px', minWidth: '24px' }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="mr-1 flex-auto text-skin-text"> network </span>
                      <span>{terms.chainTitle}</span>
                    </div>
                    <div className="flex">
                      <span className="mr-1 flex-auto text-skin-text">address</span>
                      <span className="ml-2 truncate">{shorten(item.key)}</span>
                    </div>
                    <div className="flex">
                      <span className="mr-1 flex-auto text-skin-text">type</span>
                      <span className="ml-2 truncate">
                        {isProfile ? 'user profile' : 'algorand addr.'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="mr-1 flex-auto text-skin-text">status</span>
                      <span className="ml-2 truncate">{isProfile ? 'active' : 'inactive'}</span>
                    </div>
                    <div className="flex">
                      <span className="mr-1 flex-auto text-skin-text">voter URL</span>
                      <a
                        href={`${endPoints.explorer}address/${item?.address} `}
                        target="_blank"
                        className="block whitespace-nowrap"
                        rel="noopener noreferrer"
                      >
                        <span>{'AlgoExplorer'}</span>
                        <svg
                          viewBox="0 0 24 24"
                          width="1.2em"
                          height="1.2em"
                          className="mb-[2px] ml-1 inline-block text-xs"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                  {/**/}
                </div>
              </div>
            </div>
          </div>
          <BackButton
            handleBack={() => {
              setIsExpanded(false);
              setExpandedVoter(null);
            }}
          />
        </div>

        <div className="border-t p-4 text-center">
          <ActionButton item={expandedVoter} />
        </div>
      </>
    );
  }

  return (
    <Modal
      title={!isExpanded ? 'Votes' : 'Voter details'}
      open={open}
      onClose={onClose || close}
      style={{ '--2bc02e52': '420px' }}
    >
      {!isExpanded ? (
        <>
          <div className="flex flex-col content-center items-center justify-center gap-x-4">
            <ModalSearch
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={'Search: Address or XBD'}
              clearInput={clearInput}
              className="flex min-h-[60px] w-full flex-auto items-center border-b bg-skin-bg px-3 px-4 py-3 pb-3"
            />
          </div>
          <div className="modal-body">
            <div
              className="flex h-full min-h-full flex-col overflow-auto"
              style={{ minHeight: '420px' }}
            >
              {(searchResults ? searchResults : visibleItems)?.length === 0 ? (
                <span className="my-4 text-center">Oops, we can't find any results</span>
              ) : (
                (searchResults ? searchResults : visibleItems)?.map((item, i) => {
                  const isLastItem = i === visibleItems?.length - 1;
                  const itemRef = isLastItem ? observe : null;
                  const status = item.asset;
                  return (
                    <SpaceProposalVotesListItemRow
                      expand={() => {
                        setIsExpanded(true);
                        setExpandedVoter(item);
                      }}
                      key={i}
                      close={close}
                      creatorId={item.address}
                      profiles={profiles}
                      proposal={proposal}
                      space={space}
                      itemRef={itemRef}
                      vote={item}
                    />
                  );
                })
              )}
            </div>

            <div className="block min-h-[50px] rounded-b-none border-t px-4 py-3 text-center md:rounded-b-md">
              {moreLoading && <LoadingSpinner />}
            </div>
          </div>
        </>
      ) : (
        <ExpandedView item={expandedVoter || upStreamVoter} />
      )}
    </Modal>
  );
};

export default VotersListModal;
