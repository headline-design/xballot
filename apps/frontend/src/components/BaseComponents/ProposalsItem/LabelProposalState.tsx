import React from 'react';
import './LabelProposalState.css';

interface LabelProposalStateProps {
  state: string;
  slim?: boolean;
  addMargin?: boolean;
}

const LabelProposalState: React.FC<LabelProposalStateProps> = ({
  state,
  slim = false,
  addMargin = false,
}) => {
  const stateClass = React.useMemo(() => {
    if (state === 'closed') return 'bg-violet-600';
    if (state === 'active') return 'bg-green';
    return 'bg-gray-500';
  }, [state]);

  const baseClass = `State text-white ${stateClass}`;
  const marginRightClass = addMargin ? 'mr-2' : '';
  const slimClass = slim ? 'slim' : '';

  return <span className={`${baseClass} ${slimClass} ${marginRightClass}`}>{!slim && state}</span>;
};

export default LabelProposalState;
