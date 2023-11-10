import { SidebarLoader } from 'components/Loaders/SidebarLoader';
import ButtonGroup from 'components/ButtonGroup';
import OptButton from 'components/OptButton';
import { CoinGeckoIcon } from 'icons/CoinGeckoIcon';
import { GithubIcon } from 'icons/GithubIcon';
import { GlobeIcon2 } from 'icons/GlobeIcon2';
import { TwitterIcon } from 'icons/Twitter';
import { useMemo } from 'react';
import PostModal from '../SpaceForum/Components/PostModal';
import { SidebarProps } from './types';
import { SubGroup } from './SubGroup';
import { staticEndpoints } from 'utils/endPoints';

const Sidebar: React.FC<SidebarProps> = ({
  items,
  value,
  link,
  activeBackground,
  className,
  defaultBackground,
  activeTextColor,
  defaultTextColor,
  buttonStyle,
  activeButtonStyle,
  isActive,
  spaceName,
  spaceKey,
  membersLength,
  joined,
  verifiedSpace,
  loading,
  imageLink,
  appId,
  space,
  isOptButton,
  isPostButton,
  isSubMenu,
  ...props
}) => {
  const buttonGroup = useMemo(
    () => <ButtonGroup className="mt-4" link={link} items={items} value={value} space={space} />,
    [link, items, value, space],
  );

  const subMenu = useMemo(() => <SubGroup space={undefined} />, [link, items, value, space]);

  const optButton = useMemo(
    () => <OptButton applicationId={appId} space={space} spaceKey={spaceKey} bg={''} />,
    [appId, space, spaceKey],
  );

  const postButton = useMemo(() => <PostModal space={space} appId={appId} />, [appId, space]);

  return (
    <div id="sidebar-left" className="float-left w-full lg:w-1/4">
      <div className="mb-4 lg:fixed lg:mb-0 lg:w-[240px]">
        <div className="overflow-hidden border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
          <div className="leading-5 sm:leading-6">
            <div className="md:sidebar-scrollbar  lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
              {loading ? (
                <SidebarLoader />
              ) : (
                <div className="block px-4 pt-4 text-center md:flex lg:block lg:px-0 lg:pt-0">
                  <div className="flex lg:block">
                    <span
                      className="flex shrink-0 items-center justify-center lg:my-3"
                      symbol-index="space"
                    >
                      <img
                        className="rounded-full bg-skin-border object-cover"
                        alt="avatar"
                        style={{
                          width: 80,
                          height: 80,
                          minWidth: 80,
                          display: 'none',
                        }}
                      />
                      <img
                        src={
                          imageLink ? imageLink : `${staticEndpoints.stamp}space/${spaceKey || spaceName}`
                        }
                        className="rounded-full bg-skin-border object-cover"
                        alt="avatar"
                        style={{ width: 80, height: 80, minWidth: 80 }}
                      />
                    </span>
                    <div className="mx-3 flex flex-col justify-center truncate text-left lg:block lg:text-center">
                      <h3 className="mb-[2px] flex items-center lg:justify-center">
                        <div className="mr-1 truncate">{spaceName ? spaceName : spaceKey}</div>
                        <div className="cursor-help">
                          {verifiedSpace && (
                            <i
                              className="iconfont iconcheck"
                              style={{ fontSize: '20px', lineHeight: '20px' }}
                            />
                          )}
                        </div>
                      </h3>
                      <div className="mb-[12px] text-skin-text">{membersLength} members</div>
                    </div>
                  </div>

                  <div className="flex flex-grow items-start justify-end gap-x-2 lg:mb-4 lg:justify-center">
                    <div>
                      {isOptButton === true && optButton} {isPostButton === true && postButton}
                    </div>
                  </div>
                </div>
              )}
              {buttonGroup}
              {isSubMenu && <>{subMenu}</>}
              <div className="my-3 flex hidden items-center space-x-3 px-4 lg:flex">
                {space?.twitter && (
                  <a
                    href={`https://www.twitter.com/${space?.twitter}`}
                    target="_blank"
                    className="whitespace-nowrap text-md text-skin-text hover:text-skin-link"
                    rel="noopener noreferrer"
                  >
                    <TwitterIcon className={'text-[23px]'} />
                  </a>
                )}
                {space?.github && (
                  <a
                    href={`https://www.github.com/${space?.github}`}
                    target="_blank"
                    className="whitespace-nowrap text-md text-skin-text hover:text-skin-link"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon />
                  </a>
                )}
                {space?.website && (
                  <a
                    href={`${space?.website}`}
                    target="_blank"
                    className="whitespace-nowrap text-md text-skin-text hover:text-skin-link"
                    rel="noopener noreferrer"
                  >
                    <GlobeIcon2 />
                  </a>
                )}
                {space?.coingecko && (
                  <a
                    href={`https://www.coingecko.com/coins/${space?.coingecko}`}
                    target="_blank"
                    className="whitespace-nowrap text-md text-skin-text hover:text-skin-link"
                    rel="noopener noreferrer"
                  >
                    <CoinGeckoIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
