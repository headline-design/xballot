import React from 'react';
import { ISVotedIcon } from 'icons/ISVotedIcon';

const LabelProposalVoted = () => {

    return (
        <span className="absolute inline-flex items-center gap-1 whitespace-nowrap py-[1px] text-sm text-skin-text">
            <ISVotedIcon />
            Voted
        </span>
    );
};

export default LabelProposalVoted;