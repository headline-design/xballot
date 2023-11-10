import { UPDATE_SPACE_STORE } from './actionTypes';

export const UpdateSpaceStore = (filteredDaos, filteredUsers) => {
  return {
    type: UPDATE_SPACE_STORE,
    payload: {
      filteredDaos: filteredDaos,
      filteredUsers: filteredUsers,
    },
  };
};
