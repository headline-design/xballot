import React, { lazy, Suspense, useContext, useEffect, useMemo, useState } from 'react';
import Footer from 'components/Footer';
import { spaceTypes } from 'utils/constants/schemas/spaceTypes';
import { updateSpaces } from '../../redux/global/global';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useLocation } from 'react-router-dom';
import useInterval from '../../hooks/useInterval';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { DEBOUNCE_MS, LATEST_SPACES_SEARCH_KEY } from '../../utils/constants/common';
import localStore from 'store';
import ProfilesContext from 'contexts/ProfilesContext';
import DomainContext from 'contexts/DomainContext';
import { useInView } from 'react-cool-inview';
import CategoriesListbox from './Components/CategoriesListbox';
import Searchbar from './Components/Searchbar';
import StrategyCard from 'components/ExploreCard/StrategyCard';
import { ExploreLoader } from 'components/Loaders/ExploreLoader';
import { getEndpoints } from 'utils/endPoints';
import {
  useGetSpacesAndNetworksData,
  useLoadMoreCards,
  useGetSearchOptions,
  filterSpacesBySearchQuery,
  updateCategories,
} from './exploreFunctions';
import { sortBy } from 'lodash';
import { ExtendedSpace } from 'helpers/interfaces';

const staticIcon = `QmVQYAVMMwwEQ3MAZpqF5XJn8srus7MBZ9WninAE4AyEvZ`;

const NetworkCard = lazy(() => import('components/ExploreCard/NetworkCard'));
const ProfileCard = lazy(() => import('components/ExploreCard/ProfileCard'));
const SpaceCard = lazy(() => import('components/ExploreCard/SpaceCard'));

let prevQuery;

function UnsuspensedExploreView() {
  const endPoints = getEndpoints();
  const types = useMemo(() => spaceTypes, []);
  const [selectedType, setSelectedType] = useState(types[0]);
  const [secData, setSecData] = useState(false);
  const [filteredSpaces, setFilteredSpaces] = useState({
    spaces: {},
    profiles: {},
    strategies: {},
    networks: {},
  });
  const [categories, setCategories] = useState([
    {
      name: 'All',
      count: 0,
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const dispatch = useAppDispatch();
  const profiles = useContext(DomainContext);
  const { search } = useLocation();
  const { spaces } = useAppSelector((state) => state.global);
  const [searchText, setSearchText] = useState(localStore.get(LATEST_SPACES_SEARCH_KEY) || '');
  const [searchQuery, setSearchQuery] = useState(localStore.get(LATEST_SPACES_SEARCH_KEY) || '');
  const debouncedSearchValue = useDebouncedValue(searchText, DEBOUNCE_MS);
  const [debouncedValueLoader, setDebouncedValueLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    if (spaces) {
      updateCategories(spaces, setCategories);
    }
  }, [spaces]);

  useEffect(() => {
    setFilteredSpaces(filterSpacesBySearchQuery(spaces, searchQuery));
  }, [searchQuery, spaces]);

  useEffect(() => {
    if (selectedCategory && spaces?.spaces) {
      if (selectedCategory.name === 'All') {
        setFilteredSpaces({
          ...spaces,
        });
      } else {
        const filteredSpaces = {};
        for (const s in spaces.spaces) {
          const space = spaces.spaces[s];
          if (space.categories?.length > 0) {
            for (const c of space.categories) {
              if (c.name === selectedCategory.name) {
                filteredSpaces[s] = space;
                break;
              }
            }
          }
        }
        setFilteredSpaces({
          ...spaces,
          spaces: filteredSpaces,
        });
      }
    }
  }, [selectedCategory, spaces]);

  const { getSpacesAndNetworksData } = useGetSpacesAndNetworksData(
    endPoints,
    dispatch,
    filterSpacesBySearchQuery,
    setFilteredSpaces,
    updateSpaces,
  );
  const { loadMoreCards } = useLoadMoreCards(
    filteredSpaces,
    selectedType,
    setMoreLoading,
    setSecData,
    setVisibleCards,
  );
  const { searchOptions } = useGetSearchOptions();

  useInterval(
    () => {
      console.log('----- GET SPACES interval');
      getSpacesAndNetworksData(searchQuery, true, (prevQuery = searchQuery));
    },
    25000,
    false,
  );

  useEffect(() => {
    if (debouncedSearchValue !== undefined) {
      setSearchQuery(debouncedSearchValue);
    }
    setDebouncedValueLoader(false);
  }, [debouncedSearchValue]);

  const handleSearchInputChange = (newValue: string) => {
    setDebouncedValueLoader(true);
    localStore.set(LATEST_SPACES_SEARCH_KEY, newValue);
    setSearchText(newValue);
  };

  useEffect(() => {
    const abortController = new AbortController();

    const getSpaces = async () => {
      try {
        setLoading(true);
        await getSpacesAndNetworksData(
          searchQuery,
          prevQuery !== searchQuery && Object.values(spaces.spaces).length === 0,
          (prevQuery = searchQuery),
        );
      } catch (e) {
        console.log('----- ERROR Get Spaces:', e);
      } finally {
        setLoading(false);
      }
    };

    console.log('----- GET Spaces');
    const timeoutId = setTimeout(() => {
      getSpaces();
    }, 1000); // 1 second timeout

    return () => {
      prevQuery = undefined;
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [getSpacesAndNetworksData, searchQuery, spaces.spaces]);

  const CardsGrid = React.memo(function CardsGrid({
    type,
    data,
    visibleCards,
  }: {
    type: any;
    data: any;
    visibleCards: any;
  }) {
    const renderCard = (item, i) => {

      switch (type) {
        case 'spaces':
          return <SpaceCard key={`spacesItem_${i + 1}`} space={item} />;
        case 'profiles':
          return (
            <ProfileCard
              domainKey={item?.creator}
              profiles={profiles}
              link={item?.domain?.toLowerCase()}
              domain={item}
            />
          );
        case 'networks':
          return (
            <NetworkCard
              key={`spacesItem_${i + 1}`}
              name={item?.name}
              logo={item?.logo}
              chainId={item?.chainId}
              length={visibleCards.length}
              endPoints={endPoints}
            />
          );
        case 'strategies':
          return (
            <StrategyCard
              key={`spacesItem_${i + 1}`}
              name={item?.name}
              logo={item?.logo || staticIcon}
              id={item?.chainId}
              length={Object.keys(data).length}
              endPoints={endPoints}
            />
          );
        default:
          return null;
      }
    };

    const gridClassName =
      type === 'spaces' || type === 'profiles'
        ? 'grid gap-4 md:grid-cols-3 lg:grid-cols-4'
        : 'grid gap-4 md:grid-cols-2 lg:grid-cols-3';

    return (
      <div className={gridClassName}>{(visibleCards || Object.values(data)).map(renderCard)}</div>
    );
  });

  useEffect(() => {
    let visibleCards;

    if (selectedType?.action === 'spaces') {
      if (filteredSpaces && filteredSpaces.spaces) {
        const sortedSpaces = sortBy(Object.values(filteredSpaces.spaces), (space: ExtendedSpace) =>
          space && space.members ? -space.members.length : 0,
        );
        visibleCards = sortedSpaces.slice(0, 12);
      }
    } else if (selectedType.action === 'networks') {
      visibleCards =
        filteredSpaces && filteredSpaces[selectedType?.action]
          ? Object.values(filteredSpaces?.[selectedType?.action]).slice(0, 12)
          : [];
    } else if (selectedType.action === 'strategies') {
      visibleCards =
        filteredSpaces && filteredSpaces[selectedType?.action]
          ? Object.values(filteredSpaces?.[selectedType?.action]).slice(0, 12)
          : [];
    } else if (selectedType.action === 'profiles') {
      visibleCards =
        filteredSpaces && filteredSpaces[selectedType?.action]
          ? Object.values(filteredSpaces?.[selectedType?.action]).slice(0, 12)
          : [];
    } else {
      visibleCards =
        filteredSpaces && filteredSpaces.spaces
          ? Object.values(filteredSpaces.spaces).slice(0, 12)
          : [];
    }

    setVisibleCards(visibleCards);
  }, [filteredSpaces, selectedType, setVisibleCards]);

  const hasAllItemsLoaded = useMemo(() => {
    if (selectedType && filteredSpaces[selectedType.action]) {
      return visibleCards.length === Object.values(filteredSpaces[selectedType.action]).length;
    }
    return false;
  }, [visibleCards, filteredSpaces, selectedType]);

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (inView && !loading && !moreLoading && secData && !hasAllItemsLoaded) {
        loadMoreCards();
      }
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const query = params.get('q') || '';
    const filter = params.get('filter');

    setSearchQuery(query);
    setSelectedType(searchOptions.find((option) => option.action === filter) || types[0]);
  }, [search, searchOptions, types]);

  //console.log('selected', selectedType);

  return (
    <>
      <div id="content" className="pb-6 pt-4">
        <>
          <div className="mx-auto mb-4 flex max-w-[1012px] flex-col flex-wrap items-center px-4 xs:flex-row md:flex-nowrap">
            <div className="w-full md:max-w-[420px]">
              <Searchbar
                loading={debouncedValueLoader}
                searchOptions={searchOptions}
                onChange={handleSearchInputChange}
                setSelectedType={setSelectedType}
              />
            </div>
            {selectedType?.action === 'spaces' && (
              <div className="mt-2 inline-block h-full w-full text-left xs:w-auto sm:mr-2 md:ml-2 md:mt-0">
                <CategoriesListbox
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                />
              </div>
            )}

            <div className="mt-2 whitespace-nowrap text-right text-skin-text xs:ml-auto">
              {selectedType?.action === 'spaces' && (
                <p>{`${Object.keys(filteredSpaces.spaces).length}.0 space(s)`}</p>
              )}
              {selectedType?.action === 'profiles' && (
                <p>{`${Object.keys(filteredSpaces.profiles).length}.0 profile(s)`}</p>
              )}
              {selectedType?.action === 'networks' && (
                <p>{`${Object.keys(filteredSpaces.networks).length}.0 network(s)`}</p>
              )}
              {selectedType?.action === 'strategies' && (
                <p>{`${Object.keys(filteredSpaces.strategies).length}.0 strategies`}</p>
              )}
            </div>
          </div>
          <div className="mx-auto max-w-[1012px] px-0 md:px-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                <ExploreLoader />
              </div>
            ) : (
              <CardsGrid
                type={selectedType?.action}
                data={filteredSpaces?.[selectedType?.action]}
                visibleCards={visibleCards}
              />
            )}
            {moreLoading && (
              <div className="mt-4 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                <ExploreLoader />
              </div>
            )}
            {visibleCards && <>{visibleCards.length > 0 && <div ref={observe}> </div>}</>}
            <div className="px-4 text-center md:px-0">
              <button
                type="button"
                className="button mt-4 w-full px-[22px]"
                data-v-1b931a55=""
                onClick={loadMoreCards}
              >
                Load more
              </button>
            </div>
          </div>
        </>
      </div>
      <Footer />
    </>
  );
}

function ExploreView() {
  return (
    <>
      <Suspense fallback={<Suspense />}>
        <UnsuspensedExploreView />
      </Suspense>
    </>
  );
}

export default ExploreView;
