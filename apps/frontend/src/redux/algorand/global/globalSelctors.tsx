import { createSelector } from 'reselect'

const selectRaw = (state: any) => state.algorand.global

const selectCurrentPipeConnectState = createSelector(
    [selectRaw],
    global => global.pipeConnectState
)

const selectSignedIn = createSelector(
    [selectCurrentPipeConnectState],
    pipeConnectState =>
        Boolean(pipeConnectState.myAddress) &&
        Boolean(pipeConnectState.provider)
)

const selectCurrentIndexer = createSelector(
    [selectRaw],
    global => global.indexer
)

const selectPipeConnectState = createSelector(
    [selectRaw],
    (raw: any) => raw.pipeConnectState
)

const selectLoading = createSelector([selectRaw], (raw: any) =>
    Boolean(raw.loading)
)

const selectUsdAlgoPrice = createSelector(
    [selectRaw],
    (raw: any) => raw.usdAlgoPrice
)

const globalSelectors = {
    selectCurrentPipeConnectState,
    selectCurrentIndexer,
    selectPipeConnectState,
    selectSignedIn,
    selectLoading,
    selectUsdAlgoPrice,
    selectRaw,
}

export default globalSelectors
