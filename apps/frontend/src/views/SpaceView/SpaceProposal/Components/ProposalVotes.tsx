import React, { useState, useCallback, useEffect } from 'react';
import { shorten, calcPercentageOfSum, ordinalSuffix } from 'helpers/utils';
import { Choice, Proposal } from 'helpers/interfaces';
import { useMediaQuery } from 'utils/useMediaQuery';
import { SelectedButton } from 'components/BaseComponents/ButtonSelect';
import OpenInput from 'components/BaseComponents/OpenInput';
import { Formik } from 'formik';
import { DisplayFormikState } from 'components/DisplayFormik';
import * as Yup from 'yup';
import { Button } from 'components/BaseComponents/Button';
import { ReactSortable } from 'react-sortablejs';
import BaseIcon from 'components/BaseComponents/ProposalsItem/BaseIcon';

interface Props {
  proposal: Proposal;
  userChoice: Record<string, any> | null | number | string | any;
  onSelectChoice: (selectedChoices: any | number[]) => void;
}

interface RankedChoiceProps {
  proposal: any | Proposal;
  userChoice: any | number[] | null;
  onSelectChoice: (choices: any | number[]) => void;
}

type ApprovalChoiceListProps = {
  proposal: Proposal;
  userChoice: number[] | null;
  onSelectChoice: (selectedChoices: string | null) => void;
};

export const SpaceProposalVoteSingleChoice = React.memo<Props>(
  ({ proposal, userChoice, onSelectChoice }) => {
    const [selectedChoice, setSelectedChoice] = useState<number | null>(
      userChoice as number | null,
    );

    const selectChoice = useCallback(
      (choice: number) => {
        setSelectedChoice(choice);
        //console.log(i)
        let selectedChoice = choice;
        onSelectChoice(selectedChoice);
        //console.log(selectedChoice);
      },
      [onSelectChoice],
    );

    //console.log(proposal?.choices)

    return (
      <div className="mb-3">
        {proposal?.choices.map(({ choice }, i) => (
          <SelectedButton
            key={i}
            text={shorten(choice, 32)}
            selected={selectedChoice === choice}
            onClick={() => selectChoice(choice)}
          />
        ))}
      </div>
    );
  },
);

export const SpaceProposalVoteOpenChoice = ({ proposal, userChoice, onSelectChoice }) => {
  const [selectedChoice, setSelectedChoice] = useState<any | null>(userChoice as any | null);

  const validationSchema = Yup.object().shape({
    choice: Yup.string().max(58, 'Choice must be at most 58 characters long'),
  });

  const selectChoice = useCallback(
    (choice: any) => {
      setSelectedChoice(choice);
      onSelectChoice(choice);
    },
    [onSelectChoice],
  );

  //console.log('choices', proposal?.choices);
  return (
    <div className="mb-3">
      <Formik
        initialValues={{ choice: '' }}
        validationSchema={validationSchema}
        onSubmit={undefined}
      >
        {(formik) => (
          <>
            {proposal?.choices.map((choice: any, i) => (
              <OpenInput
                name={'choice'}
                selectChoice={selectChoice}
                title={choice.label}
                errorTag={undefined}
                errorField={undefined}
                maxLength={58}
                count={false}
                placeholder={'Insert choice'}
                id={undefined}
                ref={undefined}
                value={undefined}
                type={undefined}
              />
            ))}

            <div style={{ display: 'none' }}>
              <DisplayFormikState {...formik} />
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export const SpaceProposalVoteApproval: React.FC<ApprovalChoiceListProps> = ({
  proposal,
  userChoice,
  onSelectChoice,
}) => {
  const [selectedChoices, setSelectedChoices] = useState<number[]>(userChoice || []);

  const selectChoice = useCallback(
    (choice: number) => {
      if (selectedChoices.includes(choice)) {
        setSelectedChoices(selectedChoices.filter((c) => c !== choice));
      } else {
        setSelectedChoices([...selectedChoices, choice]);
      }
    },
    [selectedChoices],
  );

  useEffect(() => {
    onSelectChoice(selectedChoices.join(", "));
  }, [selectedChoices, onSelectChoice]);

  return (
    <div className="mb-3">
      {proposal.choices.map(({ choice }, i) => (
        <SelectedButton
          key={i}
          text={shorten(choice, 32)}
          selected={selectedChoices.includes(choice)}
          onClick={() => selectChoice(choice)}
        />
      ))}
    </div>
  );
};

export const SpaceProposalVoteRankedChoice: React.FC<RankedChoiceProps> = ({
  proposal,
  userChoice,
  onSelectChoice,
}) => {
  const [selectedChoices, setSelectedChoices] = useState<Choice[]>([]);

  useEffect(() => {
    if (userChoice) {
      setSelectedChoices(userChoice);
    }
  }, [userChoice]);

  const selectChoice = (choiceObj: Choice) => {
    setSelectedChoices((prevChoices) => [...prevChoices, choiceObj]);
  };

  const choicesString = selectedChoices
    .map((choice, i) => `${ordinalSuffix(i + 1)} ${choice.choice}`)
    .join(', ');

  useEffect(() => {
    onSelectChoice(choicesString);
  }, [selectedChoices, onSelectChoice, choicesString]);

  const removeChoice = (event: React.MouseEvent, choiceObj: Choice) => {
    event.stopPropagation();
    setSelectedChoices((prevChoices) => prevChoices.filter((choice) => choice.id !== choiceObj.id));
  };

  //console.log(selectedChoices);

  return (
    <div className="mb-3">
      <div className={selectedChoices?.length > 0 ? 'mb-5' : ''}>
        <ReactSortable
          list={selectedChoices}
          setList={setSelectedChoices}
          animation={150}
          onEnd={() => onSelectChoice(selectedChoices)}
        >
          {selectedChoices.map((choiceObj, i) => (
            <div key={choiceObj.id}>
              <Button className="mb-2 flex w-full items-center justify-between !border-skin-link !px-3">
                <div className="min-w-[60px] text-left">({i + 1})</div>
                <div className="mx-2 w-full truncate text-center">{choiceObj.choice}</div>
                <div
                  className="ml-[40px] min-w-[20px] text-right"
                  onClick={(e) => removeChoice(e, choiceObj)}
                >
                  <BaseIcon name="close" size="12" />
                </div>
              </Button>
            </div>
          ))}
        </ReactSortable>
      </div>
      <div>
        {proposal?.choices.map((choiceObj, i) => {
          if (!selectedChoices.some((selectedChoice) => selectedChoice.id === choiceObj.id)) {
            return (
              <Button
                key={choiceObj.id || i + 1}
                className="mb-2 block w-full"
                onClick={() => selectChoice(choiceObj)}
              >
                <span className="truncate">{choiceObj.choice}</span>
              </Button>
            );
          } else return null;
        })}
      </div>
    </div>
  );
};

export const SpaceProposalVoteQuadratic: React.FC<Props> = ({
  proposal,
  userChoice,
  onSelectChoice,
}) => {
  const isSmallScreen = useMediaQuery('(max-width: 543px)');

  const [selectedChoices, setSelectedChoices] = useState<{ [key: string]: number }>({});

  const percentage = (i: number) =>
    Math.round(
      (calcPercentageOfSum(selectedChoices[i + 1], Object.values(selectedChoices)) * 1000) / 10,
    );

  const addVote = (i: number) => {
    setSelectedChoices({ ...selectedChoices, [i]: (selectedChoices[i] || 0) + 1 });
  };

  const removeVote = (i: number) => {
    setSelectedChoices({ ...selectedChoices, [i]: Math.max((selectedChoices[i] || 0) - 1, 0) });
  };

  useEffect(() => {
    setSelectedChoices(userChoice?.choice || {});
  }, [userChoice]);

  const formatQuadraticChoicesString = (selectedChoices: { [key: string]: number }) => {
    const totalVotes = Object.values(selectedChoices).reduce((sum, count) => sum + count, 0);

    const choiceStrings = Object.entries(selectedChoices).map(([key, value]) => {
      const percentage = ((value / totalVotes) * 100).toFixed(1);
      return `${percentage}% for ${proposal.choices[Number(key) - 1].choice}`;
    });

    return choiceStrings.join(', ');
  };

  const quadraticChoicesString = formatQuadraticChoicesString(selectedChoices);

  useEffect(() => {
    onSelectChoice(quadraticChoicesString);
  }, [selectedChoices, onSelectChoice, quadraticChoicesString]);

  //console.log('proposal choices', proposal.choices)

  return (
    <div className="mb-3" data-testid="quadratic-choice-list">
      {proposal.choices.map((choiceObject, i) => (
        <div
          data-v-1b931a55=""
          key={i}
          className={`button mb-2 flex w-full cursor-pointer items-center justify-between overflow-hidden px-[22px] ${
            selectedChoices[i + 1] > 0 ? '!border-skin-link' : ''
          }`}
          data-testid={`quadratic-choice-button-${i}`}
        >
          <div className="truncate pr-3 text-left">{choiceObject.choice}</div>
          <div className="flex items-center justify-end">
            <button
              data-v-d467aacc=""
              disabled={!selectedChoices[i + 1]}
              className="btn-choice"
              data-testid={`quadratic-remove-button-${i}`}
              onClick={() => removeVote(i + 1)}
            >
              -
            </button>
            {!isSmallScreen && (
              <input
                value={selectedChoices[i + 1] || ''}
                onChange={(e) =>
                  setSelectedChoices({ ...selectedChoices, [i + 1]: Number(e.target.value) })
                }
                className="input text-center"
                style={{ width: '40px', height: '44px' }}
                placeholder="0"
                type="number"
                data-testid={`quadratic-input-${i}`}
              />
            )}
            {isSmallScreen && (
              <div style={{ minWidth: '56px', textAlign: 'center' }}>{percentage(i) + '%'}</div>
            )}
            <button
              data-v-d467aacc=""
              className="btn-choice"
              data-testid={`quadratic-add-button-${i}`}
              onClick={() => addVote(i + 1)}
            >
              +
            </button>
            {!isSmallScreen && (
              <div style={{ minWidth: '52px', marginRight: '-5px' }} className="text-right">
                {percentage(i) + '%'}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
