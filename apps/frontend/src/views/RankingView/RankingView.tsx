import React, { useEffect, useState, useContext, useMemo, useCallback, lazy } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Container } from 'components/BaseComponents/Container';
import { Block } from 'components/BaseComponents/Block';
import { shorten } from '../../helpers/utils';
import { useIntl } from 'helpers/useIntl';
import RankingsContext from 'contexts/RankingsContext';

const AvatarSpace = lazy(() => import('components/AvatarSpace'));
const FilterListbox = lazy(() => import('components/FilterListbox'));
const RankingSidebar = lazy(() => import('./Components/Sidebar'));

interface Counts {
  followersCount: number;
  proposalsCount: number;
  votesCount: number;
  proposalsCount7d?: number;
  votesCount7d?: number;
  followersCount7d?: number;
}

interface SpaceProfiles {
  counts: Counts;
}

interface Rankings {
  spaces: Record<string, SpaceProfile>;
  profiles: Record<string, SpaceProfile>;
}

const SpacesRanking = () => {
  const rankings: Rankings = useContext(RankingsContext);
  const { spaces = {}, profiles = {} } = rankings || {};

  const spacesRanking = useMemo(
    () => Object.values(spaces).sort((a, b) => b.counts.followersCount - a.counts.followersCount),
    [spaces],
  );

  const profilesRanking = useMemo(
    () => Object.values(profiles).sort((a, b) => b.counts.followersCount - a.counts.followersCount),
    [profiles],
  );

  const { formatCompactNumber } = useIntl();
  const [membersType, setMembersType] = useState('Members');

  const allSortOptions = useMemo(
    () => [
      {
        filter: 'Trending',
        sorter: (a, b) => b.popularity - a.popularity,
      },
      {
        filter: membersType,
        sorter: (a, b) => b.counts.followersCount - a.counts.followersCount,
      },
      {
        filter: 'Proposals',
        sorter: (a, b) => b.counts.proposalsCount - a.counts.proposalsCount,
      },
      { filter: 'Votes', sorter: (a, b) => b.counts.votesCount - a.counts.votesCount },
    ],
    [membersType],
  );

  const [selectedSortOption, setSelectedSortOption] = useState(allSortOptions[0]);

  const sortedSpacesRanking = useMemo(() => {
    return [...spacesRanking].sort(selectedSortOption.sorter);
  }, [selectedSortOption, spacesRanking]);

  const sortedProfilesRanking = useMemo(() => {
    return [...profilesRanking].sort(selectedSortOption.sorter);
  }, [selectedSortOption, profilesRanking]);

  const RankingViewProps = useMemo(
    () => [
      { label: 'Spaces', link: '/ranking/spaces', value: '0', end: true },
      { label: 'Profiles', link: '/ranking/profiles', value: '1', end: true },
    ],
    [],
  );

  interface FilterListboxProps {
    selectedSortOption: any;
    setSelectedSortOption: (status: any) => void;
    allSortOptions: any[];
  }

  const setDefaultSortOption = useCallback(
    () => setSelectedSortOption(allSortOptions[0]),
    [allSortOptions, setSelectedSortOption],
  );

  const Sidebar = (
    <RankingSidebar
      rankingViews={RankingViewProps}
      className="no-scrollbar flex overflow-y-auto lg:mt-0 lg:block"
      setDefaultSortOption={setDefaultSortOption}
    />
  );

  const MemoizedFilterListbox: React.FC<FilterListboxProps> = React.memo(
    ({ selectedSortOption, setSelectedSortOption, allSortOptions }) => (
      <FilterListbox
        selectedFilter={selectedSortOption}
        setSelectedFilter={setSelectedSortOption}
        allFilters={allSortOptions}
      />
    ),
  );

  const RankingBlock: React.FC<any> = React.memo(({ items, domainType, membersType }) => {
    useEffect(() => {
      setMembersType(membersType);
    }, [membersType]);

    return (
      <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
        <div className="relative mb-3 hidden px-3 md:px-0 lg:flex ">
          <div className="flex-auto">
            <div className="flex flex-auto items-center">
              <h2 className="mb-2">Ranking</h2>
            </div>
          </div>
          <div data-headlessui-state="" className="inline-block h-full text-left">
            <div>
              <MemoizedFilterListbox
                selectedSortOption={selectedSortOption}
                setSelectedSortOption={setSelectedSortOption}
                allSortOptions={allSortOptions}
              />
            </div>
          </div>
        </div>
        <Block slim tableLoading={items && items.length < 1}>
          <div className="flex border-b p-3 text-right">
            <div className="mr-2 w-[40px] text-left">Rank</div>
            <div className="flex-auto text-left">{domainType}</div>
            <div className="w-[120px]">Proposals</div>
            <div className="w-[120px]">Votes</div>
            <div className="w-[120px]">{membersType}</div>
          </div>
          {items.map((item, i) => (
            <Link
              key={item?.appId}
              to={`/${item.type === 'space' ? item?.domain : `profile/${item?.domain}/about`}`}
              className="flex border-b p-3 text-right last:border-b-0"
            >
              <div className="mr-2 mt-2 w-[40px] pt-1 text-center">{i + 1}</div>
              <div className="flex flex-auto space-x-3 text-left">
                <AvatarSpace space={item} size="32" previewFile={undefined} />
                <div>
                  <div>{shorten(item?.name || item?.domain, 16)}</div>
                  <div className="text-skin-text">{shorten(item?.appId, 32)}</div>
                </div>
              </div>
              <div className="w-[120px]">
                <div>{formatCompactNumber(item?.counts.proposalsCount)}</div>
                {item?.counts.proposalsCount7d > 0 && (
                  <div className="text-green">
                    +{formatCompactNumber(item?.counts.proposalsCount7d)}
                  </div>
                )}
              </div>
              <div className="w-[120px]">
                <div>{formatCompactNumber(item?.counts.votesCount)}</div>
                {item?.counts.votesCount7d > 0 && (
                  <div className="text-green">
                    +{formatCompactNumber(item?.counts.votesCount7d)}
                  </div>
                )}
              </div>
              <div className="w-[120px]">
                <div>{formatCompactNumber(item?.counts.followersCount)}</div>
                {item?.counts.followersCount7d > 0 && (
                  <div className="text-green">
                    +{formatCompactNumber(item?.counts.followersCount7d)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </Block>
      </div>
    );
  });

  return (
    <Container slim>
      <div className="relative mb-3 flex px-4 text-center md:flex md:px-0 lg:hidden lg:pt-0">
        <div className="flex flex-auto items-center">
          <h2>Ranking</h2>
        </div>
        <div data-headlessui-state="" className="inline-block h-full text-left">
          <div>
            <MemoizedFilterListbox
              selectedSortOption={selectedSortOption}
              setSelectedSortOption={setSelectedSortOption}
              allSortOptions={allSortOptions}
            />
          </div>
        </div>
      </div>
      {Sidebar}
      <Routes>
        <Route path="*" element={<Navigate to="/ranking/spaces" replace />} />
        <Route
          path="/spaces"
          element={
            <RankingBlock
              domainType={'Space'}
              membersType={'Members'}
              items={sortedSpacesRanking}
            />
          }
        />
        <Route
          path="/profiles"
          element={
            <RankingBlock
              domainType={'Profile'}
              membersType={'Followers'}
              items={sortedProfilesRanking}
            />
          }
        />
      </Routes>
    </Container>
  );
};

export default SpacesRanking;
