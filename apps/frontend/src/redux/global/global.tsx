import { createSlice } from '@reduxjs/toolkit';
import { isArray } from 'lodash';
import { prettyRound } from 'utils/functions';
import localStore from 'store';
import {
  DOMAIN_DATA_KEY,
  EXPLORE_DATA_KEY,
  MY_SPACES_KEY,
  NETWORKS_KEY,
  SPACE_DATA_KEY,
  SPACES_KEY,
  USER_DATA_KEY,
} from '../../utils/constants/common';

// Slice

const slice = createSlice({
  name: 'searchData',
  initialState: {
    spaces: localStore.get(SPACES_KEY) || {
      spaces: {},
      profiles: {},
      strategies: [],
    },
    networks: localStore.get(NETWORKS_KEY) || {
      networks: [],
    },
    mySpaces: localStore.get(MY_SPACES_KEY) || [],
    userData: { apps: {} },
    domainData: localStore.get(DOMAIN_DATA_KEY) || {},
    spaceData: localStore.get(SPACE_DATA_KEY) || {},
    exploreData: localStore.get(EXPLORE_DATA_KEY) || {},
    algoUsdPrice: 0,
    btcUsdPrice: 0,
    ethUsdPrice: 0,
  },
  reducers: {
    changeSpaces: (state, action) => {
      state.spaces = action.payload;
    },
    changeNetworks: (state, action) => {
      state.networks = action.payload;
    },
    changeMySpaces: (state, action) => {
      state.mySpaces = action.payload;
    },
    changeUserData: (state, action) => {
      state.userData = action.payload;
    },
    changeDomainData: (state, action) => {
      state.domainData = action.payload;
    },
    changeSpaceData: (state, action) => {
      state.spaceData = action.payload;
    },
    changeExploreData: (state, action) => {
      state.exploreData = action.payload;
    },
    changeAlgoUsdPrice: (state, action) => {
      state.algoUsdPrice = action.payload;
    },
    changeBtcUsdPrice: (state, action) => {
      state.btcUsdPrice = action.payload;
    },
    changeEthUsdPrice: (state, action) => {
      state.ethUsdPrice = action.payload;
    },
  },
});

export default slice.reducer;

// Actions

const {
  changeSpaces,
  changeNetworks,
  changeMySpaces,
  changeUserData,
  changeDomainData,
  changeSpaceData,
  changeExploreData,
  changeAlgoUsdPrice,
  changeBtcUsdPrice,
  changeEthUsdPrice,
} = slice.actions;

export const updateSpaces: any = (spaces) => (dispatch) => {
  localStore.set(SPACES_KEY, spaces);
  dispatch(changeSpaces(spaces));
};

export const updateNetworks: any = (networks) => (dispatch) => {
  localStore.set(NETWORKS_KEY, networks);
  dispatch(changeNetworks(networks));
};

export const updateMySpaces: any = (mySpaces) => (dispatch) => {
  localStore.set(MY_SPACES_KEY, mySpaces);
  dispatch(changeMySpaces(mySpaces));
};

export const updateUserData: any = (userData) => (dispatch) => {
  localStore.set(USER_DATA_KEY, userData);
  dispatch(changeUserData(userData));
};

export const updateDomainData: any = (domainData) => (dispatch) => {
  localStore.set(DOMAIN_DATA_KEY, domainData);
  dispatch(changeDomainData(domainData));
};

export const updateSpaceData: any = (spaceData) => (dispatch) => {
  localStore.set(SPACE_DATA_KEY, spaceData);
  dispatch(changeSpaceData(spaceData));
};

export const updateExploreData: any = (exploreData) => (dispatch) => {
  localStore.set(EXPLORE_DATA_KEY, exploreData);
  dispatch(changeExploreData(exploreData));
};

export const updateAlgoUsdPrice = () => async (dispatch) => {
  const now = Math.floor(Date.now() / 1000);
  const start = now - 86400;
  const data = await fetch(
    `https://price.algoexplorerapi.io/price/algo-usd/history?since=${start}&until=${now}&interval=1H`,
  );
  if (data) {
    const dataJson = await data.json();
    if (dataJson?.history) {
      const newPrice = dataJson.history[dataJson.history.length - 1].high;
      dispatch(changeAlgoUsdPrice(prettyRound(newPrice, 2)));
    }
  }
};

export const updateBtcUsdPrice = () => async (dispatch) => {
  const now = Math.floor(Date.now() / 1000);
  const start = now - 86400;
  const data = await fetch(
    `https://price.algoexplorerapi.io/price/btc-usd/history?since=${start}&until=${now}&interval=1H`,
  );
  if (data) {
    const dataJson = await data.json();
    if (dataJson?.history) {
      const newPrice = dataJson.history[dataJson.history.length - 1].high;
      dispatch(changeBtcUsdPrice(prettyRound(newPrice, 2)));
    }
  }
};

export const updateEthUsdPrice = () => async (dispatch) => {
  const data = await fetch('https://api.myalgo.com/asset/prices');
  if (data) {
    const dataJson = await data.json();
    if (isArray(dataJson)) {
      const filtered = dataJson.filter((item) => item.assetId === 386195940);
      if (filtered?.length === 1) {
        const price = prettyRound(filtered[0].averagePrice, 2);
        dispatch(changeEthUsdPrice(price));
      }
    }
  }
};
