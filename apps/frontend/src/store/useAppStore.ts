import { create } from 'zustand';
import { UserState } from 'redux/user/userReducers';
import { CHAIN_NETWORK_KEY } from '../utils/constants/common';
import localStore from 'store';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import { getNetworkType } from '../utils/endPoints';

interface AppState {
  theme: any;
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (showAuthModal: boolean) => void;
  isMainNet: boolean;
  setIsMainNet: (isMainNet: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  showSidebar: false,
  setShowSidebar: (showSidebar) => set(() => ({ showSidebar })),
  showAuthModal: false,
  setShowAuthModal: (showAuthModal) => set(() => ({ showAuthModal })),
  theme: true,
  isMainNet: getNetworkType(),
  setIsMainNet: (isMainNet) => {
    localStore.set(CHAIN_NETWORK_KEY, isMainNet);
    Pipeline.main = isMainNet;
    set(() => ({ isMainNet }));
  },
}));

interface AppPersistState {
  user: UserState | null;
  setUser: (user: UserState | null) => void;
}

export const useAppPersistStore = create<AppPersistState>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));
