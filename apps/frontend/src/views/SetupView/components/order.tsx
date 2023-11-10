import React, { lazy, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SetupIntro } from '../steps/SetupIntro';
import PipeStateContext from 'contexts/PipeStateContext';
const SetupDomain = lazy(() => import('../steps/SetupDomain'));
const SetupController = lazy(() => import('../steps/SetupController'));
const SetupProfile = lazy(() => import('../steps/SetupProfile'));

export const stepOrder = [
  {
    path: 'step=0',
    element: <SetupIntro />,
  },
  {
    path: 'step=1',
    element: null, // We'll replace this with <SetupDomain /> later
  },
  {
    path: 'step=2',
    element: null, // We'll replace this with <SetupController /> later
  },
  {
    path: 'step=3',
    element: null, // We'll replace this with <SetupProfile /> later
  },
];

export const StepsWrapper = () => {
  const pipeState = useContext(PipeStateContext);
  const updatedStepOrderArray = [...stepOrder];

  const [ticket, setTicket] = useState();

  const handleRegistrationTicket = (data) => {
    console.log('Registration completed:', data);

    const updatedTicket = {
      ...data,
      creator: pipeState.myAddress,
      domain: data.domain,
      assetId: data.assetId,
      forum: {
        token: null,
        tokenAmount: null,
        about: '',
      },
    };

    setTicket(updatedTicket);
  };

  if (ticket !== undefined) {
    console.log(ticket);
  }

  updatedStepOrderArray[1].element = (
    <SetupDomain pipeState={pipeState} onRegistrationComplete={handleRegistrationTicket} />
  );
  updatedStepOrderArray[2].element = <SetupController ticket={ticket} />;
  updatedStepOrderArray[3].element = <SetupProfile ticket={ticket} />;

  return updatedStepOrderArray;
};

const pathOrder = stepOrder.map((o) => o.path);

export const useCurrentPosition = () => {
  // access slug from the URL and find its step number
  const urlSlug = useParams()['*']?.toLowerCase();
  // note: will be -1 if slug is invalid, so replace with 0
  const index = urlSlug ? pathOrder.indexOf(urlSlug) || 0 : 0;

  const slug = pathOrder[index];

  // prev and next might be undefined, depending on the index
  const previousSlug = pathOrder[index - 1];
  const nextSlug = pathOrder[index + 1];

  return {
    slug,
    index,
    isFirst: previousSlug === undefined,
    isLast: nextSlug === undefined,
    previousSlug,
    nextSlug,
  };
};
