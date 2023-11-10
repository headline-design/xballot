import React from 'react';

const GreenBadge = () => <div className="bg-green-600 State text-white mr-2" data-v-f27e3bae="">Live</div>;
const PurpleBadge = () => <div className="bg-violet-600 State text-white mr-2" data-v-f27e3bae="">Ended</div>;
const GreyBadge = () => <div className="bg-gray-500 State text-white mr-2" data-v-f27e3bae="">Pending</div>;

export const StatusBadge = ({ proposal }) => {
  const start = proposal.start;
  const end = proposal.end;
  const state = proposal.state;
  const now = Date.now() / 1000;

  let proposalStatus = 'pending';
  if (now >= start && now < end && state === 'active') {
    proposalStatus = 'active';
  } else if (now >= end || state === 'closed') {
    proposalStatus = 'closed';
  }

  return (
    <>
      {proposalStatus === 'active' && <GreenBadge />}
      {proposalStatus === 'closed' && <PurpleBadge />}
      {proposalStatus === 'pending' && <GreyBadge />}
    </>
  );
};