import React from 'react';
import { SpaceStrategy } from 'helpers/interfaces';
import { Modal } from 'components/BaseComponents/Modal';
import { Block } from 'components/BaseComponents/Block';
import { getEndpoints, getTerms } from 'utils/endPoints';
import { useFormatCompactNumber } from 'utils/useFormatCompactNumber';
import { PlayIcon } from 'icons/PlayIcon';

interface Props {
  open: boolean;
  strategies: SpaceStrategy[];
  proposal: any;
  onClose: () => void;
  spaceKey: string;
  endPoints: any;
}

interface StrategyBlockProps {
  strategy: SpaceStrategy;
  proposal: any;
  spaceKey: any;
  endPoints: any;
}

const StrategyBlock: React.FC<StrategyBlockProps> = ({ strategy, proposal, spaceKey, endPoints }) => {
const terms = getTerms();
  return (
  <Block slim className="mb-3 p-4 text-skin-link">
    <div className="leading-5 sm:leading-6">
      <div className="items-center justify-between sm:flex">
        <h3 className="my-0 leading-5">asa-balance-of-with-delegation</h3>
        <div className="flex">
          <div className="-mx-[8px] my-2 flex shrink flex-row-reverse items-center gap-3 sm:my-0 sm:flex-row">
            <button className="flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link">
              <PlayIcon />
            </button>
            <button className="flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link">
              <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          <span className="mr-1 flex-auto text-skin-text"> network </span>
          <span>{terms.chainTitle}</span>
        </div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">symbol</span>
          <span className="ml-2 truncate">{proposal?.tokenData?.unitName}</span>
        </div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">address</span>
          <a
            href={endPoints.explorer + `asset/${proposal?.tokenData?.assetId}`}
            target="_blank"
            className="block whitespace-nowrap"
            rel="noopener noreferrer"
          >
            <span>{proposal?.tokenData?.assetId}</span>
            <svg
              viewBox="0 0 24 24"
              width="1.2em"
              height="1.2em"
              className="mb-[2px] ml-1 inline-block text-xs"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">decimals</span>
          <span className="ml-2 truncate">{proposal?.tokenData?.decimals}</span>
        </div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">max supply</span>
          <span className="ml-2 truncate"> {`${useFormatCompactNumber(proposal?.tokenData?.total / Math.pow(10, proposal?.tokenData?.decimals))}`}</span>
        </div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">delegationSpace</span>
          <span className="ml-2 truncate">{spaceKey}</span>
        </div>
        <div className="flex">
          <span className="mr-1 flex-auto text-skin-text">delegationNetwork</span>
          <span className="ml-2 truncate">Algorand</span>
        </div>
      </div>

    </div>
  </Block>
  )
  };

const ModalProposalStrategies: React.FC<Props> = ({ open, strategies = [], proposal, onClose, spaceKey }) => {
  //console.log(proposal)
  const endPoints = getEndpoints();

  return (
    <Modal title="Strategies" open={open} onClose={onClose}>
      {Array.isArray(strategies) &&
        strategies.map((strategy, i) => (
          <div className="m-4">
            <StrategyBlock key={i} strategy={strategy} proposal={proposal} spaceKey={spaceKey} endPoints={endPoints} />
          </div>
        ))}
      <div className="m-4">
        <StrategyBlock strategy={proposal?.strategyType || {}} proposal={proposal} spaceKey={spaceKey} endPoints={endPoints} />
      </div>
    </Modal>
  );
};

export default ModalProposalStrategies;
