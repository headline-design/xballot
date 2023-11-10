import { useMediaQuery } from 'utils/useMediaQuery';
import { BasePopoverHover } from 'components/BaseComponents/BasePopoverHover';
import { AvatarUser } from '../BaseComponents/AvatarUser';
import { Button } from '../BaseComponents/Button';
import { Link } from 'react-router-dom';
import { shorten } from 'helpers/utils';
import { ExternalLinkIcon } from 'icons/ExternalLink';
import CopyPaste from 'components/BaseComponents/CopyPaste';
import { useProfileInfo } from '../../hooks/useProfileInfo';
import BaseLink from 'components/BaseComponents/BaseLink';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';
import { useHoverMenu } from 'hooks/useHoverMenu';

export const ForumPopover = ({ profile, creator, profiles, hideAvatar }) => {
  const isXLargeScreen = useMediaQuery('(min-width: 1280px)');
  const { creatorName, creatorAvatar } = useProfileInfo(profiles, creator);
  const endPoints = getEndpoints();
  const hoverMenu = useHoverMenu();

  const label = (
    <div className="flex items-center">
      <AvatarUser
        user={creator}
        src={creatorAvatar || `${staticEndpoints.stamp}space/${creator}`}
        size="48"
        style={{ width: '48px', height: '48px', minWidth: '48px' }}
      />
      <span className="ml-2 text-md text-skin-link">{creatorName || creator}</span>
    </div>
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
                  text={creator}
                  copyText={creator}
                  hideIcon={undefined}
                  shortenText={true}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex w-full">
            <div className="w-1/2 pr-2">
              <Link onClick={hoverMenu.close} to={`/account/${creator}/activity`}>
                <Button primary className="button--primary w-full px-[22px] hover:brightness-95">
                  View Profile
                </Button>
              </Link>
            </div>
            <div className="w-1/2 pr-2">
            <BaseLink
            onClick={hoverMenu.close}
            hideExternalIcon={true}
            target="_blank"
            className="whitespace-nowrap"
            rel="noopener noreferrer"
            link={endPoints.explorer + '/address/' + creator}
          >
            <button className="button w-full px-[22px]" data-v-4a6956ba="">
              See explorer <ExternalLinkIcon className="mb-[2px] inline-block text-xs" />
            </button>
          </BaseLink>
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
