import React from 'react';

interface ProposalsItemBodyProps {
  children: React.ReactNode;
}

const ProposalsItemBody: React.FC<ProposalsItemBodyProps> = ({ children }) => {
  return (
    <p className="mb-2 break-words text-md line-clamp-2">
      {children}
    </p>
  );
};

export const ProposalReviewBody: React.FC<ProposalsItemBodyProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default ProposalsItemBody;