import { Dispatch } from 'react';
import algorandGlobalActions from '../algorand/global/globalActions';
import { clearLocalStorageExcept, setLocalStorage } from '../../localStorage/localStorage';
import { IS_DARK_THEME_KEY, TOKEN_KEY, X_ADDRESS, X_MNEMONIC } from '../../utils/constants/common';

const prefix = 'AUTH';

const authActions = {
  AUTH_START: `${prefix}_START`,
  AUTH_SUCCESS: `${prefix}_SUCCESS`,
  AUTH_ERROR: `${prefix}_ERROR`,

  doSignIn: (token: string) => (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: authActions.AUTH_START });
      setLocalStorage(TOKEN_KEY, token);
      dispatch({
        type: authActions.AUTH_SUCCESS,
        payload: {
          token: token,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: authActions.AUTH_ERROR,
      });
    }
  },

  doSignOut: () => (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: authActions.AUTH_START });
      clearLocalStorageExcept([IS_DARK_THEME_KEY, X_ADDRESS, X_MNEMONIC]);
      dispatch(algorandGlobalActions.doPipeConnectChange({}));
      dispatch({
        type: authActions.AUTH_SUCCESS,
        payload: {
          token: null,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: authActions.AUTH_ERROR,
      });
    }
  },
};

export default authActions;
