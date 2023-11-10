import React from 'react';
import { Block } from 'components/BaseComponents/Block';
import BaseIcon from 'components/BaseComponents/ProposalsItem/BaseIcon';
import BaseUser from 'views/SpaceView/SpaceProposal/Components/BaseUser';
import { shorten } from 'helpers/utils';
import { NoticeIcon } from 'icons/NoticeIcon';

const filterAndMapDelegates = (
  delegates,
  spaceKey,
  networkKey,
  profiles,
  currentDelegate,
  currentSpace,
  revokeDelegate,
  type,
  isDelegatedToYou,
) => {
  return delegates
    .map((delegate, i) => {
      if (spaceKey !== 'profileKey' && delegate.space !== spaceKey) return null;
      return (
        <div
          key={i}
          style={i === 0 ? { border: '0 !important' } : {}}
          className="flex border-t px-4 py-3 first:border-0"
        >
          <BaseUser
            address={delegate[type]}
            space={{ network: networkKey }}
            profile={delegate[type]}
            proposal={undefined}
            profiles={profiles}
            hideAvatar={false}
            widthClass={'whitespace-nowrap'}
            creator={delegate[type]}
          />
          <div
            className="flex-auto text-right text-skin-link"
            children={
              delegate.space.length > 30
                ? shorten(delegate.space || 'All spaces')
                : delegate.space || 'All spaces'
            }
          />
          {isDelegatedToYou ? null : ( // Render the button only if not delegated to you
            <button
              className="-mr-2 ml-2 px-2"
              onClick={() => {
                currentDelegate(delegate[type]);
                currentSpace(delegate.space);
                revokeDelegate();
              }}
            >
              <BaseIcon name="close" size="12" />
            </button>
          )}
        </div>
      );
    })
    .filter(Boolean);
};

const DelegateBlock = ({
  delegates,
  delegators,
  getDelegationsAndDelegatesLoading,
  web3Account,
  revokeDelegate,
  networkKey,
  profiles,
  specifySpaceChecked,
  delegatesLoading,
  delegatesWithScore,
  currentDelegate,
  currentSpace,
  spaceKey,
  space,
}) => {
  const mappedDelegates = filterAndMapDelegates(
    delegates,
    spaceKey,
    networkKey,
    profiles,
    currentDelegate,
    currentSpace,
    revokeDelegate,
    'delegate',
    false,
  );
  const mappedDelegators = filterAndMapDelegates(
    delegators,
    spaceKey,
    networkKey,
    profiles,
    currentDelegate,
    currentSpace,
    revokeDelegate,
    'delegator',
    true,
  );

  return (
    <>
      {delegates &&
        delegates.length < 1 &&
        delegators &&
        delegators.length < 1 &&
        !getDelegationsAndDelegatesLoading &&
        web3Account && (
          <Block>
            <div>
              <NoticeIcon />
              <div className="leading-5">
                Can't find your delegations and delegates? Make sure you are connected to the
                correct network.
              </div>
            </div>
          </Block>
        )}

      {mappedDelegates.length > 0 && (
        <Block slim title={'Your delegation(s)'}>
          {mappedDelegates}
        </Block>
      )}

      {mappedDelegators.length > 0 && (
        <Block slim title={'Delegated to you'}>
          {mappedDelegators}
        </Block>
      )}

      {space?.id && specifySpaceChecked && (
        <Block title={'delegate.topDelegates'} loading={delegatesLoading} slim>
          {delegatesWithScore.map((delegate, i) => (
            <div
              key={i}
              style={i === 0 ? { border: '0 !important' } : {}}
              className="flex border-t px-4 py-3 first:border-0"
            >
              <BaseUser
                profile={undefined}
                address={delegate.delegate}
                space={{ network: networkKey }}
                widthClass="w-[160px]"
                proposal={undefined}
                profiles={undefined}
                hideAvatar={false}
                creator={undefined}
              />
              <div
                className="w-[160px] flex-auto text-right text-skin-link"
                children={`${delegate.score >= 0.005 ? shorten(delegate.score) : '< 0.01'} ${
                  space?.symbol
                }`}
              />
            </div>
          ))}
          {!delegatesLoading && delegatesWithScore.length < 1 && (
            <div className="mx-4 flex items-center py-3">No delegates for {[space?.id]}</div>
          )}
        </Block>
      )}
    </>
  );
};

export default DelegateBlock;
