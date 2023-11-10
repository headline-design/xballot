import React, { useState } from 'react';
import { Block } from 'components/BaseComponents/Block';
import { LoadingRow } from 'components/BaseComponents/BaseLoading/LoadingRow';
import { Link } from 'react-router-dom';
import { Button } from 'components/BaseComponents/Button';
import { changePrimary, checkMyAsaOpt } from 'orderFunctions';
import { DomainPopover } from 'components/BaseComponents/DomainPopover';
import Pipeline from "@pipeline-ui-2/pipeline/index";
import DomainsListModal from 'components/BaseComponents/BaseListModal/DomainsListModal';
import { BlockButton } from 'components/BaseComponents/BlockButton';
import { reqDomain } from 'orderFunctions';
import toast from 'react-hot-toast';
import { shorten } from 'helpers/utils';

function ProfileDomain({ loading, domains, primeDomain, dd, address, pipeState }) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleOpenModal = (event) => {
    event.preventDefault();
    openModal();
  };

  const sortByCharacterCount = (a, b) => {
    return a.domain.length - b.domain.length;
  };

  const processedDomains = domains.map((domain) => {
    const domainCount = dd[domain].domain.length;
    const domainClass =
      domainCount === 5
        ? 'bg-green'
        : domainCount === 4
        ? 'bg-blue'
        : domainCount === 3
        ? 'bg-purple'
        : domainCount === 2
        ? 'bg-silver'
        : domainCount === 1
        ? 'bg-gold'
        : '';

    return {
      key: domain,
      domain: dd[domain].domain,
      prime: primeDomain === dd[domain].domain ? true : false,
      asset: dd[domain].asset,
      enabled: dd[domain].enabled,
      domainCount,
      domainClass,
    };
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionDisabled, setActionDisabled] = useState(null);

  const reqPrime = (item) => {
    changePrimary(item.key);
  };

  const reqActive = async (item) => {
    try {
      setActionLoading(true);
      setActionDisabled(true);

      try {
        const isOptedIn = await checkMyAsaOpt(item.asset, Pipeline.address, false);

        if (!isOptedIn) {
          try {
            let optTxid = await Pipeline.send(
              Pipeline.address,
              0,
              '',
              undefined,
              undefined,
              item.asset,
            );
            toast(shorten(optTxid));
          } catch (error) {
            console.error('Error checking opted-in status:', error.value);
            console.log(error.value);
          }
        }

        // The following line is now outside of the 'else' block,
        // so it will be executed after the opt-in transaction or if the user is already opted-in.
        reqDomain(item.domain, item.key, item.asset);

      } catch (error) {
        console.error(error);
      } finally {
        setActionDisabled(false);
        setActionLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };


  const actionState = {
    isPrime: {
      text: 'Prime',
      disabled: true,
      handleClick: undefined,
    },
    isActiveNotPrime: {
      text: 'Set prime',
      disabled: false,
      handleClick: reqPrime,
    },
    isPending: {
      text: 'Get domain',
      disabled: false,
      handleClick: reqActive,
    },
  };

  const currentState = actionState.isActiveNotPrime;

  const getDomainState = (domain) => {
   console.log('Domain:', domain);
    if (domain.prime === true && domain.enabled === true) {
      return actionState.isPrime;
    } else if (domain.enabled === true && domain.prime === false) {
      return actionState.isActiveNotPrime;
    } else if (domain.enabled === false) {
      return actionState.isPending;
    }
  };

  //console.log(processedDomains);

  return (
    <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
      {loading ? (
        <LoadingRow />
      ) : (
        <>
          {domains && domains.length > 0 ? (
            <div>
              <div className="space-y-3">
                <Block
                  slim
                  title={'Domains'}
                  counter={domains.length}
                  buttonRight={<BlockButton onClick={handleOpenModal} />}
                >
                  {processedDomains
                    .sort(sortByCharacterCount)
                    .slice(0, 10)
                    .map((domain, i) => {
                      return (
                        <li
                          className="flex justify-between border-t px-4 py-3 first:border-t-0"
                          key={i}
                        >
                          <DomainPopover
                            domain={domain.domain}
                            domainName={undefined}
                            domainImage={undefined}
                            assetId={domain.asset}
                            domainCount={domain.domainCount}
                            domainClass={domain.domainClass}
                          />
                          <div className="space-x-2">
                            {primeDomain !== domain.domain ? (
                              Pipeline.address === address && (
                                <button
                                  className="!text-skin-text hover:!text-skin-link"
                                  onClick={() => {
                                    changePrimary(domain.key);
                                  }}
                                >
                                  Set prime
                                </button>
                              )
                            ) : (
                              <span> Prime</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  <div
                    onClick={handleOpenModal}
                    className="block cursor-pointer rounded-b-none border-t px-4 py-3 text-center md:rounded-b-md"
                  >
                    <span>View all</span>
                  </div>
                </Block>
              </div>
              <div className="relative">
                <div className="absolute h-[10px] w-[10px]" />
              </div>
            </div>
          ) : loading ? (
            <LoadingRow />
          ) : (
            <>
              {domains && domains.length === 0 && (
                <div className="mb-3 text-center">
                  <Block className="pt-1">
                    <div className="mb-3">{'No results found'}</div>
                    <Link
                      to={{
                        pathname: '/setup/step=0',
                      }}
                    >
                      <Button>{'Get domain'}</Button>
                    </Link>
                  </Block>
                </div>
              )}
            </>
          )}
        </>
      )}
      <DomainsListModal
        onClose={closeModal}
        open={isOpen}
        items={processedDomains}
        title={'Domains'}
        searchPlaceholder={undefined}
        getDomainState={getDomainState}
        actionLoading={actionLoading}
        actionDisabled={actionDisabled}
        pipeState={pipeState}
        profileKey={address}      />
    </div>
  );
}

export default ProfileDomain;
