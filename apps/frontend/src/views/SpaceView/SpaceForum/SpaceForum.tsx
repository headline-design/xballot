import React, { useState, useMemo, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import { CaretOutlineDown } from 'icons/CaretOutlineDown';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import clsx from 'clsx';
import NoResults from './Components/NoResults';
import { PostItem } from 'components/BaseComponents/PostItem';
import { Block } from 'components/BaseComponents/Block';
import { NoticeIcon } from 'icons/NoticeIcon';
import { usePostFetcher } from 'fetcher/fetchers';

export interface PostType {
  appId: number;
  content: string;
  dataType: string;
  hash: string;
  id: string;
  sender: string | any;
  thread: any[];
  subthread?: any[];
  data: {
    content: string;
    title: string;
    type: string;
  };
  ticket: { [key: string]: any };
  title: string;
  type: string;
  timeStamp: any;
}

interface Space {
  name?: string;
  forum?: {
    tokenAmount?: number;
    token?: number;
  };
}

const dates = {
  latest: { label: 'Latest', value: 'Latest' },
  newest: { label: 'Newest', value: 'Newest' },
  oldest: { label: 'Oldest', value: 'Oldest' },
};

const sortPosts = (posts, selectedDate) => {
  if (!posts || typeof posts !== 'object') {
    return [];
  }

  const postsArray = Object.values(posts);

  return postsArray.sort((a, b) => {
    const timeStampA = (a as any)?.timeStamp;
    const timeStampB = (b as any)?.timeStamp;

    if (selectedDate === 'Latest') {
      return timeStampB - timeStampA;
    } else if (selectedDate === 'Oldest') {
      return timeStampA - timeStampB;
    } else {
      return timeStampB - timeStampA;
    }
  });
};

interface ForumDescriptionRowProps {
  space: Space;
}

const ForumDescriptionRow: React.FC<ForumDescriptionRowProps> = ({ space }) => (
  <div className="mb-3 border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
    <div className="p-4 leading-5 sm:leading-6">
      <div>
        <NoticeIcon />
        <div className="leading-5">
          {space?.name} Forum min. token requirement: {space?.forum?.tokenAmount} of ASA#{' '}
          {space?.forum?.token}
        </div>
      </div>
    </div>
  </div>
);

interface SpaceForumProps {
  appId: number;
  space: Space;
  posts: Record<string, PostType>;
  loading: boolean;
  profiles: unknown; // Update with the correct type
}

const SpaceForum: React.FC<SpaceForumProps> = ({ appId, space, posts, loading, profiles }) => {
  const { fetchPosts } = usePostFetcher();
  const [selectedDate, setSelectedDate] = useState<string>('Latest');
  const [fetchedPosts, setFetchedPosts] = useState<PostType[]>([]);

  console.log('appId', appId);

  useEffect(() => {
    const fetchAndSetPosts = async () => {
      if (appId && appId !== 0) {
        // Only fetch posts if appId is valid

        const fetchedData = await fetchPosts(appId, 0);
        console.log('fetchedData', fetchedData);
        setFetchedPosts(fetchedData?.posts);
      }
    };

    // If posts prop is empty, fetch the posts
    if (!posts || Object.keys(posts)?.length === 0) {
      fetchAndSetPosts();
    }
  }, [fetchPosts, appId, posts]);

  const sortedPosts = useMemo(() => {
    if (fetchedPosts && Object.keys(fetchedPosts).length > 0) {
      return sortPosts(fetchedPosts, selectedDate);
    }
    return sortPosts(posts, selectedDate);
  }, [fetchedPosts, posts, selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const countThreadEntries = (thread, subthread, loggedInUserAddress) => {
    let likeCount = 0;
    let reBlastCount = 0;
    let commentCount = 0;
    let userCommentCount = 0;
    let userLikeCount = 0;
    let userReBlastCount = 0;

    // Function to process entries in a thread or subthread
    const processEntries = (entries) => {
      if (entries) {
        Object.values(entries).forEach((postEntry: PostType) => {
          let post = postEntry.data;

          if (post.type === 'like') {
            likeCount++;
            if (postEntry.sender && postEntry.sender === loggedInUserAddress) {
              userLikeCount++;
            }
          } else if (post.type === 'comment') {
            commentCount++;
            if (postEntry.sender && postEntry.sender === loggedInUserAddress) {
              userCommentCount++;
            }
          } else if (post.type === 'reBlast') {
            reBlastCount++;
            if (postEntry.sender && postEntry.sender === loggedInUserAddress) {
              userReBlastCount++;
            }
          }
        });
      }
    };

    // Process the thread and subthread
    processEntries(thread);
    processEntries(subthread);

    return {
      likeCount,
      commentCount,
      reBlastCount,
      userCommentCount,
      userLikeCount,
      userReBlastCount,
    };
  };

  const renderPosts = () => {
    // Filter the posts that have dataType as "post" or "validation"
    const filteredPosts = Object.entries(sortedPosts).filter(
      ([txId, post]: [string, PostType]) => post.type === 'post' || post.type === 'validation',
    );

    if (!filteredPosts || filteredPosts?.length === 0) {
      return <NoResults actionType={'Create post'} space={space} appId={appId} />;
    }

    return (
      <>
        {filteredPosts.map(([txId, postEntry]: [string, PostType], i: number) => {
          let post = postEntry.data;
          let time = postEntry.timeStamp;
          const {
            likeCount,
            commentCount,
            reBlastCount,
            userLikeCount,
            userCommentCount,
            userReBlastCount,
          } = countThreadEntries(postEntry.thread, postEntry.subthread, Pipeline.address);

          //console.log('post', postEntry.thread);

          return (
            <div key={`PostCardItem_${i}`}>
              <PostItem
                txId={postEntry.id}
                creator={postEntry?.sender}
                content={post?.content}
                title={post?.title}
                createdAt={time}
                likeCount={likeCount}
                commentCount={commentCount}
                voted={undefined}
                latestRound={undefined}
                hot={undefined}
                post={postEntry}
                space={space}
                appId={appId}
                isLiked={userLikeCount > 0}
                isCommented={userCommentCount > 0}
                userCommentCount={userCommentCount}
                userLikeCount={userLikeCount}
                isReBlasted={userReBlastCount > 0}
                reBlastCount={reBlastCount}
                userReBlastCount={userReBlastCount}
                profiles={profiles}
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
        {loading && (
          <Block>
            <div className="lazy-loading mb-2 rounded-md" style={{ width: '60%', height: 28 }} />
            <div className="lazy-loading rounded-md" style={{ width: '50%', height: 28 }} />
          </Block>
        )}
        {!loading && (
          <>
            {space?.forum && <ForumDescriptionRow space={space} />}
            <div className="relative mb-3 flex px-3 md:px-0">
              <div className="flex-auto">
                <div className="flex flex-auto items-center">
                  <h2>Forum</h2>
                </div>
              </div>
              <div data-headlessui-state="" className="inline-block h-full text-left">
                <div className="flex space-x-2">
                  <div className="relative">
                    <Listbox value={selectedDate} onChange={handleDateChange}>
                      <div className="mt-2 inline-block h-full w-full text-left xs:w-auto sm:mr-2 md:ml-2 md:mt-0">
                        <Listbox.Button
                          className="button w-full whitespace-nowrap px-[24px] pr-3"
                          data-v-1b931a55=""
                        >
                          <div className="leading-2 flex items-center leading-3">
                            <span> {selectedDate}</span>{' '}
                            <CaretOutlineDown className="ml-1 text-xs text-skin-text" />
                          </div>
                        </Listbox.Button>
                      </div>
                      <Float
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        zIndex={50}
                        offset={5}
                        shift={0}
                        flip={16}
                        placement="bottom-end"
                        portal
                      >
                        <div></div>
                        <Listbox.Options className="z-50 scale-100 transform overflow-hidden rounded-2xl border bg-skin-header-bg opacity-100 shadow-lg outline-none">
                          <div className="no-scrollbar max-h-[300px] overflow-auto">
                            {Object.values(dates).map((date) => (
                              <Listbox.Option
                                key={`DatesOptionItem_${date.label}`}
                                value={date.value}
                                disabled={undefined}
                              >
                                {({ active }) => (
                                  <div // Removed key here
                                    className={clsx(
                                      active
                                        ? 'bg-skin-border text-skin-link'
                                        : 'bg-skin-header-bg text-skin-text',
                                      'cursor-pointer whitespace-nowrap px-3 py-2',
                                    )}
                                  >
                                    <div className="flex">
                                      <span className="mr-3">{date.label}</span>
                                    </div>
                                  </div>
                                )}
                              </Listbox.Option>
                            ))}
                          </div>
                        </Listbox.Options>
                      </Float>
                    </Listbox>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4 space-y-4">
              <div className="my-4 space-y-4">
                <div className="my-4 space-y-4">{renderPosts()}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SpaceForum;
