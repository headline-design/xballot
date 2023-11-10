import { useMemo } from 'react';
import { useFormatCompactNumber } from 'utils/useFormatCompactNumber';
import { shorten } from 'helpers/utils';
import { Button } from 'components/BaseComponents/Button';
import { defaultChoices } from 'utils/constants/templates/choices';

function SpaceProposalResults({
  proposal,
  loading,
  handleValidate,
  validationLoading,
  pipeState,
  reload,
  reloading,
  strategyType,
}) {
  const tallies = useMemo(() => {
    if (proposal?.scores?.tallies) {
      let newObj = {};
      for (let key in proposal.scores.tallies) {
        newObj[key.toLowerCase()] = proposal.scores.tallies[key];
      }
      return newObj;
    }
  }, [proposal?.scores?.tallies]);
  const votes = useMemo(
    () => Object.keys(proposal?.scores?.votes || {}),
    [proposal?.scores?.votes],
  );
  const total = useMemo(() => proposal?.scores?.total, [proposal?.scores?.total]);
  const quorum = useMemo(() => proposal?.quorum, [proposal?.quorum]);
  const proposalEndTime = proposal?.end * 1000;

  function ResultsHeader() {
    return (
      <div className="group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-4 pb-[12px] pt-3 md:rounded-t-lg">
        <h4 className="flex items-center">
          <div>{proposalEndTime > Date.now() ? 'Current results' : 'Results'}</div>
        </h4>
        <div className="flex items-center"></div>
      </div>
    );
  }

  function ResultsRow({ raw, percent, label }) {
    const formattedRaw = useFormatCompactNumber(raw);
    const unitName = proposal?.tokenData?.unitName || 'VOTE';

    return (
      <div>
        <div className="mb-1 flex justify-between text-skin-link">
          <div className="flex overflow-hidden">
            <span className="mr-1 truncate normal-case">{label}</span>
          </div>
          <div className="flex justify-end">
            <div className="space-x-2">
              <span className="whitespace-nowrap">{`${formattedRaw} ${unitName}`}</span>
              <span>{percent}</span>
            </div>
          </div>
        </div>
        <div className="relative flex h-2 overflow-hidden rounded-full">
          <div className="z-5 absolute h-full w-full bg-[color:var(--border-color)]" />
          <div className="z-10 h-full bg-primary" style={{ width: percent }} />
        </div>
      </div>
    );
  }

  return (
    <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
      <ResultsHeader />
      <div className="p-4 leading-5 sm:leading-6">
        <div className="space-y-3">
          {!loading && votes.length !== 0
            ? strategyType.text === 'open'
              ? Object.entries(tallies)
                  .sort(([, a], [, b]) => (b as any) - (a as any))
                  .slice(0, 5)
                  .map(([choice, tally], i) => {
                    let rawValue = (
                      Number(tally) / Math.pow(10, proposal?.tokenData?.decimals)
                    ).toFixed(3);
                    let percentValue = ((Number(tally) / total) * 100).toFixed(2) + '%';

                    return (
                      <ResultsRow
                        key={i}
                        raw={rawValue}
                        percent={percentValue}
                        label={shorten(choice, 32)}
                      />
                    );
                  })
              : proposal?.choices.map((choiceObject, i) => {
                  let calcChoice = choiceObject.choice.toLowerCase();
                  let choice = choiceObject.choice;
                  let tally = tallies[calcChoice] || 0;
                  let rawValue = (tally / Math.pow(10, proposal?.tokenData?.decimals)).toFixed(3);
                  let percentValue = ((tally / total) * 100).toFixed(2) + '%';

                  return (
                    <ResultsRow
                      key={i}
                      raw={rawValue}
                      percent={percentValue}
                      label={shorten(choice, 32)}
                    />
                  );
                })
            : strategyType.text === 'open'
            ? defaultChoices.map(({ choice }, i) => (
                <ResultsRow key={i} raw={0} percent={'0%'} label={shorten(choice, 32)} />
              ))
            : proposal?.choices.map(({ choice }, i) => (
                <ResultsRow key={i} raw={0} percent={'0%'} label={shorten(choice, 32)} />
              ))}

          {quorum === true && (
            <div className="text-skin-link">
              Quorum <span className="float-right">14.8M / 10M HDL</span>
            </div>
          )}
        </div>
      </div>

      {proposal?.scores_state === 'closed' &&
        proposal?.creator === pipeState?.myAddress &&
        proposal?.validation === '' && (
          <Button
            dataId="data-v-1b931a58"
            loading={validationLoading}
            onClick={handleValidate}
            disabled={validationLoading}
          >
            <span>Validate</span>
          </Button>
        )}
    </div>
  );
}

export default SpaceProposalResults;
