import BaseLink from 'components/BaseComponents/BaseLink';
import { PowerWarning } from './PowerWarning';
import BaseButtonIcon from './BaseButtonIcon';
import { RefreshIcon } from 'icons/Refresh';
import Tippy from '@tippyjs/react';
import { shorten } from 'helpers/utils';
import { format } from 'util';
import { LoadingSpinner } from 'components/Loaders/LoadingSpinner';
import BaseMessageBlock from './BaseMessageBlock';
import { WarningIcon } from 'icons/Warning';

export const VoteDetails = ({
  hasVotingPowerFailed,
  hasVotingValidationFailed,
  votingPower,
  decimals,
  fetchVotingPower,
  isValidationAndPowerLoaded,
  isValidationAndPowerLoading,
  totalVotingPower,
  votingPowerByStrategy,
  symbols,
  proposal,
  currentRoundNumber,
  selectedChoices,
  isUserOpted,
  isMaxRoundFuture,
  isValidVoter,
  votingPowerFormatted,
  space,
  pipeState,
  currentRound,
  error,
  endPoints,
  formatCompactNumber,
  hasVoted,
}) => {
  return (
    <>
      <div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">Choice</span>
          <Tippy content={selectedChoices}>
            <span
              className="ml-4 truncate text-right"
              data-tip={format(selectedChoices).length > 30 ? format(selectedChoices) : null}
            >
              {format(selectedChoices)}
            </span>
          </Tippy>
        </div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">Max round</span>
          {proposal?.maxRound < currentRoundNumber ? (
            <BaseLink
              link={endPoints.explorer + '/block/' + Number(proposal?.maxRound)}
              className="float-right"
            >
              {Number(proposal?.maxRound)}
            </BaseLink>
          ) : (
            <span className="float-right">{Number(proposal?.maxRound)}</span>
          )}
        </div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">Your voting power</span>
          {hasVotingPowerFailed || hasVotingValidationFailed ? (
            <span className="item-center flex">
              <BaseButtonIcon
                className="p-0 pr-2"
                onClick={() => fetchVotingPower}
                loading={undefined}
              >
                <RefreshIcon className="text-sm" />
              </BaseButtonIcon>
              <WarningIcon  />
            </span>
          ) : !isValidationAndPowerLoaded && !isValidationAndPowerLoading ? (
            <span
              data-tip={
                votingPowerByStrategy &&
                votingPowerByStrategy.length > 0 &&
                votingPowerByStrategy
                  .map(
                    (score, index) =>
                      `${formatCompactNumber(votingPower === 0 ? 0 : score)} ${symbols[index]}`,
                  )
                  .join(' + ')
              }
            >
              {totalVotingPower / Math.pow(10, decimals)}{' '}
              {shorten(proposal?.tokenData?.unitName || space.symbol, 'symbol')}
            </span>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
      {isUserOpted ? (
        <>
          {!isValidationAndPowerLoading && (
            <div className="mb-2">
              {hasVoted ? (
                <BaseMessageBlock level="success">
                  You have already voted on this proposal.
                </BaseMessageBlock>
              ) : (
                <>
                  {!isMaxRoundFuture ? (
                    <>
                      {isValidVoter ? (
                        votingPowerFormatted > 0 ? (
                          <BaseMessageBlock level="info">
                            Your voting power is{' '}
                            <span className="font-semibold">{votingPowerFormatted}</span>. Please
                            sign transaction to cast your{' '}
                            <span>{space?.name || space?.domain}</span> vote.
                          </BaseMessageBlock>
                        ) : (
                          <BaseMessageBlock level="info">
                            Your voting power is{' '}
                            <span className="font-semibold">{votingPowerFormatted}</span>.
                            Unfortunately, you do not have enough voting power to cast a{' '}
                            <span>{space?.name || space?.domain}</span> vote.
                          </BaseMessageBlock>
                        )
                      ) : (
                        <PowerWarning
                          currentRound={currentRound}
                          endPoints={endPoints}
                          pipeState={pipeState}
                        />
                      )}
                    </>
                  ) : (
                    <BaseMessageBlock level="info">
                      Times up! You can no longer vote on this proposal. Max round{' '}
                      <span className="font-semibold">{proposal?.maxRound}</span>
                    </BaseMessageBlock>
                  )}

                  {error && (
                    <div className="mt-4">
                      <BaseMessageBlock level="error">{error}</BaseMessageBlock>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <BaseMessageBlock level="info">
          You are not a member of this space. Please opt into the space app [
          <span className="font-semibold">{proposal?.appId}</span>] to continue.
        </BaseMessageBlock>
      )}
    </>
  );
};
