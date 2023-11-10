import React, { useMemo, useState, useCallback } from 'react';
import moment from 'moment';
import { shorten } from 'helpers/utils';
import BaseLink from 'components/BaseComponents/BaseLink';
import AnimatedBlock from 'components/BaseComponents/AnimatedBlock';
import ModalProposalStrategies from './ModalProposalStrategies';
import { AlgoIcon } from 'icons/AlgoIcon';
import { PlusIcon } from 'icons/Plus';
import { MinusIcon } from 'icons/MinusIcon';
import PropTypes from 'prop-types';
import { getEndpoints } from 'utils/endPoints';

const InfoRow = ({ label, value, link, isLink, isIcon, onClick }) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <div>
      <b>{label}</b>
      <span
        className={`float-right${isIcon ? ' flex cursor-pointer' : ''} text-skin-link`}
        onClick={handleClick}
      >
        {isLink ? (
          <BaseLink link={link} className="float-right" hideExternalIcon={!isIcon}>
            {value}
          </BaseLink>
        ) : (
          value
        )}
      </span>
    </div>
  );
};

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]).isRequired,
  link: PropTypes.string,
  isLink: PropTypes.bool,
  isIcon: PropTypes.bool,
  onClick: PropTypes.func,
};

InfoRow.defaultProps = {
  link: undefined,
  isLink: false,
  isIcon: false,
  onClick: undefined,
};

const SpaceProposalInformation = ({ space, proposal, loaded, spaceKey, round }) => {
  const [isModalProposalStrategiesOpen, setIsModalProposalStrategiesOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const endPoints = getEndpoints();

  const infoRows = useMemo(
    () => [
      {
        label: 'Strategies',
        value: proposal?.strategyType ? <AlgoIcon /> : null,
        onClick: () => setIsModalProposalStrategiesOpen(true),
        isLink: false,
        isIcon: true,
      },
      {
        label: 'IPFS',
        value: proposal?.ipfsHash ? `#${proposal?.ipfsHash.slice(0, 5)}` : '#infura',
        link: `${endPoints.ipfs + proposal?.ipfsHash}`,
        isLink: true,
        isIcon: true,
      },
      {
        label: 'Voting System',
        value: proposal?.strategyType?.title,
        isLink: false,
      },
      {
        label: 'Start Date',
        value: moment.unix(proposal?.start).format('MMM D, YYYY, h:mm A'),
        isLink: false,
      },
      {
        label: 'End Date',
        value: moment.unix(proposal?.end).format('MMM D, YYYY, h:mm A'),
        isLink: false,
      },
      {
        label: 'Max round',
        value: Number(proposal?.maxRound),
        isLink: false,
      },
      {
        label: 'App Id',
        value: Number(proposal?.appId),
        link: `${endPoints.explorer}application/${proposal?.appId}`,
        isLink: true,
        isIcon: true,
      },
    ],
    [
      proposal?.strategyType,
      proposal?.ipfsHash,
      proposal?.start,
      proposal?.end,
      proposal?.maxRound,
      proposal?.appId,
      endPoints.ipfs,
      endPoints.explorer,
    ],
  );

  const handleToggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const validationInfoRow =
    proposal?.validation && Date.now() > proposal?.end ? (
      <InfoRow
        label="Validation"
        value={shorten(proposal?.validation?.id)}
        link={`${endPoints.explorer}tx/${proposal?.validation?.id}`}
        isLink={true}
        isIcon={true}
      />
    ) : (
      <InfoRow label="Validation" value="pending" link={undefined} isLink={false} isIcon={false} />
    );

  return (
    <>
      <AnimatedBlock
        slim
        loading={loaded}
        title="Information"
        isCollapsable={true}
        isOpen={isOpen}
        setIsOpen={handleToggleOpen}
        buttonRight={
          <button
            className="text-skin-text transition-colors duration-200 hover:text-skin-link"
            onClick={handleToggleOpen}
          >
            {!isOpen ? <PlusIcon /> : <MinusIcon />}
          </button>
        }
        collapsableContent={
          <>
            <InfoRow
              label="Vote token name"
              value={proposal?.tokenData?.name}
              link={undefined}
              isLink={false}
              isIcon={false}
            />
            <InfoRow
              label="Vote token"
              value={Number(proposal?.tokenData?.assetId)}
              link={`${endPoints.explorer}asset/${proposal?.tokenData?.assetId}`}
              isLink={true}
              isIcon={undefined}
            />
            {validationInfoRow}
          </>
        }
      >
        <>
          {proposal?.privacy && (
            <div>
              <b>Privacy</b>
              <BaseLink
                link={proposal?.privacy?.url}
                className="float-right cursor-pointer text-skin-link"
              >
                {proposal?.privacy?.label}
              </BaseLink>
            </div>
          )}
          {infoRows.map((row, index) => (
            <InfoRow key={index} {...row} />
          ))}
        </>
      </AnimatedBlock>
      <ModalProposalStrategies
        open={isModalProposalStrategiesOpen}
        proposal={proposal}
        onClose={() => setIsModalProposalStrategiesOpen(false)}
        strategies={proposal?.strategyTypes}
        spaceKey={spaceKey}
        endPoints={endPoints}
      />
    </>
  );
};

SpaceProposalInformation.propTypes = {
  space: PropTypes.object.isRequired,
  proposal: PropTypes.any.isRequired,
  loaded: PropTypes.bool.isRequired,
  spaceKey: PropTypes.any.isRequired,
};

export default SpaceProposalInformation;
