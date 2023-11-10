import { useCallback, useMemo } from 'react';
import { staticStrategies } from './Static/staticStrategies';
import { staticNetworks } from './Static/staticNetworks';
import { ExtendedSpace } from 'helpers/interfaces';

export function filterSpacesBySearchQuery(spaces, searchQuery) {
  if (searchQuery) {
    const regex = new RegExp(searchQuery, 'i');
    const filtered = {};
    for (const key in spaces.spaces) {
      const result = regex.test(spaces.spaces[key]?.name);
      if (result) {
        filtered[key] = spaces.spaces[key];
      }
    }
    return {
      ...spaces,
      spaces: filtered,
    };
  } else {
    return spaces;
  }
}

export function updateCategories(newSpaces, setCategories) {
  const tmpCategories = {
    All: Object.keys(newSpaces.spaces).length,
  };
  for (const s in newSpaces.spaces) {
    const space = newSpaces.spaces[s];
    if (space.categories?.length > 0) {
      for (const c of space.categories) {
        if (c.name) {
          tmpCategories[c.name] =
            tmpCategories[c.name] === undefined ? 1 : tmpCategories[c.name] + 1;
        }
      }
    }
  }

  const newCategories = [];
  for (const [key, value] of Object.entries(tmpCategories)) {
    newCategories.push({ name: key, count: value });
  }
  setCategories(newCategories);
}

export const useGetSpacesAndNetworksData = (
  endPoints,
  dispatch,
  filterSpacesBySearchQuery,
  setFilteredSpaces,
  updateSpaces,
) => {
  const getSpacesAndNetworksData = useCallback(
    async (searchQuery, shouldUpdate = false, prevQuery) => {
      try {
        prevQuery = searchQuery;
        let currentSpaces;
        let currentProfiles;
        if (shouldUpdate) {
          const spacesResp = await fetch(endPoints.worker + 'v1/domains?spaces=true');
          currentSpaces = await spacesResp.json();
          const profilesResp = await fetch(endPoints.worker + 'v1/domains?profiles=true');
          currentProfiles = await profilesResp.json();
          if (currentSpaces && currentProfiles) {
            const newSpaces = {
              spaces: currentSpaces,
              profiles: currentProfiles,
              strategies: staticStrategies,
              networks: staticNetworks,
            };
            setFilteredSpaces(filterSpacesBySearchQuery(newSpaces, searchQuery));
            dispatch(updateSpaces(newSpaces));
            return [{ spaces: newSpaces, networks: staticNetworks }];
          }
        }
      } catch (e) {
        console.log('----- spaces fetch ERROR:', e);
      }
    },
    [endPoints.worker, setFilteredSpaces, filterSpacesBySearchQuery, dispatch, updateSpaces],
  );

  return { getSpacesAndNetworksData };
};

export const useLoadMoreCards = (
  filteredSpaces,
  selectedType,
  setMoreLoading,
  setSecData,
  setVisibleCards,
) => {
  const loadMoreCards = useCallback(async () => {
    setMoreLoading(true);
    setSecData(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVisibleCards((prevVisibleCards) => [
      ...prevVisibleCards,
      ...Object.values(filteredSpaces[selectedType.action]).slice(
        prevVisibleCards.length,
        prevVisibleCards.length + 8,
      ),
    ]);
    setMoreLoading(false);
  }, [filteredSpaces, selectedType, setMoreLoading, setSecData, setVisibleCards]);

  return { loadMoreCards };
};

export const useGetSpaceByAppId = (spaces) => {
  const getSpaceByAppId = useCallback(
    (appId) => {
      if (appId) {
        const spaceArr = Object.values(spaces.spaces).filter((space: ExtendedSpace) => space.appId === appId);
        if (spaceArr?.length === 1) {
          return spaceArr[0];
        }
      }
      return null;
    },
    [spaces],
  );

  return { getSpaceByAppId };
};

export const useGetSearchOptions = () => {
  const searchOptions = useMemo(
    () => [
      { text: 'Spaces', action: 'spaces', extras: { selected: false } },
      { text: 'Profiles', action: 'profiles', extras: { selected: false } },
      { text: 'Networks', action: 'networks', extras: { selected: false } },
      { text: 'Strategies', action: 'strategies', extras: { selected: false } },
    ],
    [],
  );

  return { searchOptions };
};
