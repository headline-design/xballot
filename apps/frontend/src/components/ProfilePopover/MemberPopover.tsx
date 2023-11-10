import { useMediaQuery } from 'utils/useMediaQuery';
import { BasePopoverHover } from 'components/BaseComponents/BasePopoverHover';
import { AvatarUser } from '../BaseComponents/AvatarUser';
import { Button } from '../BaseComponents/Button';
import { Link } from 'react-router-dom';
import { shorten } from 'helpers/utils';
import { ExternalLinkIcon } from 'icons/ExternalLink';
import CopyPaste from 'components/BaseComponents/CopyPaste';
import BaseLink from 'components/BaseComponents/BaseLink';
import { useProfileInfo } from 'hooks/useProfileInfo';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';
import BaseBadge from 'components/BaseComponents/ProposalsItem/BaseBadge';
import { useHoverMenu } from 'hooks/useHoverMenu';

export const MembersListPopover = ({ item, creator, profiles, widthClass, close}) => {
  const hoverMenu = useHoverMenu();
  const isXLargeScreen = useMediaQuery('(min-width: 1280px)');
  const { creatorName, creatorAvatar } = useProfileInfo(profiles, creator);
  const endPoints = getEndpoints();


  const label = (
    <BaseLink link={undefined} hideExternalIcon onClick={(e) => e.stopPropagation()}>
      <div className={[widthClass, 'flex flex-nowrap items-center space-x-1'].join(' ')}>
        <AvatarUser
          user={item}
          src={creatorAvatar || `${staticEndpoints.stamp}space/${creator}`}
          size="18"
        />
        <span className="w-full truncate text-skin-link">{creatorName || shorten(creator)}</span>
        <BaseBadge address={item} members={undefined} />
      </div>
    </BaseLink>
  );

  const content = (
        <div className="p-4">
          <div className="flex">
            <AvatarUser
              src={creatorAvatar || `${staticEndpoints.stamp}space/${creator}`}
              size={'69'}
              style={{ width: '69px', height: '69px', minWidth: '69px' }}
            />
            <div>
              <div className="truncate px-3 text-lg font-semibold leading-10 text-skin-heading">
                {creatorName || shorten(creator)}
              </div>
              <div className="flex space-x-2 px-3 leading-5">
                <CopyPaste
                  text={item?.member}
                  copyText={item?.member}
                  hideIcon={undefined}
                  shortenText={true}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full">
            <div className="w-1/2 pr-2">
              <Link to={`/account/${item?.member}/activity`} onClick={hoverMenu.close}>
                <Button

                  primary
                  className="button--primary w-full px-[22px] hover:brightness-95"
                >
                  View Profile
                </Button>
              </Link>
            </div>
            <div className="w-1/2 pr-2">
              <a
                target="_blank"
                className="whitespace-nowrap"
                rel="noopener noreferrer"
                href={endPoints.explorer + 'address/' + item?.member}
              >
                <button onClick={close} className="button w-full px-[22px]" data-v-4a6956ba="">
                  See explorer <ExternalLinkIcon className="mb-[2px] inline-block text-xs" />
                </button>
              </a>
            </div>
          </div>
        </div>
  );

  return (
    <BasePopoverHover
    zIndex={75}
      placement={isXLargeScreen ? 'bottom' : 'bottom-start'}
      label={label}
      children={content}
      show={hoverMenu.show}
      open={hoverMenu.open}
      delayClose={hoverMenu.delayClose}
    />
  );
};
