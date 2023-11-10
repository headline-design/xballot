import React, { useState, useCallback, useMemo } from 'react';
import { LabelCardValue } from 'types/select';
import ButtonCardGroup from 'components/ButtonCardGroup';
import { SetupStrategyAdvanced } from './SetupStrategy/SetupStrategyAdvanced';
import { SetupStrategyBasic } from './SetupStrategy/SetupStrategyBasic';
import { SetupStrategyVote } from './SetupStrategy/SetupStrategyVote';
import { Button } from 'components/BaseComponents/Button';

enum StrategyViewEnum {
  CHOOSE,
  TOKEN_VOTING,
  ONE_PERSON_ONE_VOTE,
  ADVANCED,
}

function VotingStep() {
  const [selectedStrategyView, selectStrategyView] = useState<StrategyViewEnum>(
    StrategyViewEnum.CHOOSE,
  );

  const strategyViews: LabelCardValue<StrategyViewEnum>[] = useMemo(
    () => [
      {
        label: 'Token weighted voting',
        description:
          'Votes are weighted by a token. The token can be an ASA, ARC 69 or ARC 19 token standard',
        value: StrategyViewEnum.TOKEN_VOTING,
      },
      {
        label: 'One person, one vote',
        description:
          'Manage a whitelist of people who can vote or simply allow any address to vote. Every vote is equal and no token is required',
        value: StrategyViewEnum.ONE_PERSON_ONE_VOTE,
      },
      {
        label: 'Custom setup',
        description:
          "Select up to 8 strategies with a wide range of options. If you can't find the right strategy for your use case, you can create your own",
        value: StrategyViewEnum.ADVANCED,
      },
    ],
    [],
  );

  return (
    <div>
      {selectedStrategyView === StrategyViewEnum.CHOOSE && (
        <div>
          <div className="px-4 md:px-0"></div>
          <div className="space-y-3">
            <ButtonCardGroup
              items={strategyViews}
              value={selectedStrategyView}
              onChange={selectStrategyView}
            />
          </div>

          <div className="px-4 md:px-0"></div>
        </div>
      )}
      {selectedStrategyView === StrategyViewEnum.ONE_PERSON_ONE_VOTE && <SetupStrategyVote />}
      {selectedStrategyView === StrategyViewEnum.TOKEN_VOTING && <SetupStrategyBasic />}
      {selectedStrategyView === StrategyViewEnum.ADVANCED && <SetupStrategyAdvanced />}
      <div className="px-4 md:px-0">

        <Button title={"Back"} onClick={() => selectStrategyView(StrategyViewEnum.CHOOSE)} > Back </Button>
      </div>
    </div>
  );
}

export default VotingStep;
