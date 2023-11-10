import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { clone } from 'lodash';

interface ProposalForm {
  name: string;
  body: string;
  discussion: string;
  choices: { key: number; text: string }[];
  start: number;
  end: number;
  snapshot: number;
  type: string;
  metadata: {
    plugins: {
      safeSnap?: { valid: boolean };
    };
  };
}

const EMPTY_PROPOSAL: ProposalForm = {
  name: '',
  body: '',
  discussion: '',
  choices: [
    { key: 0, text: '' },
    { key: 1, text: '' }
  ],
  start: parseInt((Date.now() / 1e3).toFixed()),
  end: 0,
  snapshot: 0,
  metadata: {
    plugins: {}
  },
  type: 'single-choice'
};

const EMPTY_PROPOSAL_DRAFT = {
  name: '',
  body: '',
  choices: [
    { key: 0, text: '' },
    { key: 1, text: '' }
  ],
  isBodySet: false
};

export function useFormSpaceProposal() {
  const location = useLocation();

  const [form, setForm] = useState<ProposalForm>(clone(EMPTY_PROPOSAL));
  const [formDraft, setFormDraft] = useState(clone(EMPTY_PROPOSAL_DRAFT));
  const [userSelectedDateStart, setUserSelectedDateStart] = useState(false);
  const [userSelectedDateEnd, setUserSelectedDateEnd] = useState(false);
  const [sourceProposalLoaded, setSourceProposalLoaded] = useState(false);

  const sourceProposal = location.state?.sourceProposal;

  useEffect(() => {
    if (sourceProposal && !sourceProposalLoaded) {
      // Load source proposal data
      setSourceProposalLoaded(true);
    }
  }, [sourceProposal, sourceProposalLoaded]);

  function resetForm() {
    setFormDraft(clone(EMPTY_PROPOSAL_DRAFT));
    setForm(clone(EMPTY_PROPOSAL));
    setSourceProposalLoaded(false);
    setUserSelectedDateEnd(false);
    setUserSelectedDateStart(false);
  }

  return {
    form,
    setForm,
    formDraft,
    setFormDraft,
    userSelectedDateStart,
    setUserSelectedDateStart,
    userSelectedDateEnd,
    setUserSelectedDateEnd,
    sourceProposalLoaded,
    sourceProposal,
    resetForm,
  };
}
