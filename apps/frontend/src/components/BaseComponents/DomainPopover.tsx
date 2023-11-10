import { useMediaQuery } from 'utils/useMediaQuery';
import { BasePopoverHover } from 'components/BaseComponents/BasePopoverHover';
import { AvatarUser } from './AvatarUser';
import { Button } from './Button';
import DomainPill from './DomainPill';
import { Link } from 'react-router-dom';
import CopyPaste from 'components/BaseComponents/CopyPaste';
import { useHoverMenu } from 'hooks/useHoverMenu';
import { staticEndpoints } from 'utils/endPoints';

export const DomainPopover = ({
  domainClass,
  domain,
  domainName,
  domainImage,
  assetId,
  domainCount,
}) => {
  const isXLargeScreen = useMediaQuery('(min-width: 1280px)');
  const hoverMenu = useHoverMenu();

  const label = (
    <div className="flex items-center">
      <div className="relative min-w-[52px]">
        <AvatarUser
          user={domain}
          src={domainImage || `${staticEndpoints.stamp}space/${domain + '.algo'}`}
          size="44"
        />
      </div>
      <div className="ml-3">
        <div className="text-left text-xs leading-5 text-skin-text">
          {assetId}
          {domainCount <= 5 && <DomainPill>{domainCount}</DomainPill>}
        </div>
        <div className="truncate pr-2 text-left text-skin-heading">{domainName || domain}</div>
      </div>
    </div>
  );

  const content = (

        <div className="p-4">
          <div className="flex">
            <AvatarUser
              src={domainImage || `${staticEndpoints.stamp}space/${domain + '.algo'}`}
              size={'69'}
            />
            <div>
              <div className="truncate px-3 text-lg font-semibold leading-10 text-skin-heading">
                {domain}
              </div>
              <div className="flex space-x-2 px-3 leading-5">
                <CopyPaste
                  text={assetId}
                  copyText={assetId}
                  hideIcon={undefined}
                  shortenText={false}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex w-full">
            <div className="w-1/2 pr-2">
              <Link to={`/account/${domain}/activity`} onClick={hoverMenu.close}>
                <Button primary className="button--primary w-full px-[22px] hover:brightness-95">
                  View Profile
                </Button>
              </Link>
            </div>
            <div className="w-1/2 pl-2">
              <Link to={`/${domain}`} onClick={hoverMenu.close}>
                <Button primary className="button w-full px-[22px]" data-v-4a6956ba="">
                  View Space
                </Button>
              </Link>
            </div>
          </div>
        </div>

  );

  return (
    <BasePopoverHover
      placement={isXLargeScreen ? 'bottom' : 'bottom-start'}
      label={label}
      children={content}
      show={hoverMenu.show}
      open={hoverMenu.open}
      delayClose={hoverMenu.delayClose}
    />
  );
};
