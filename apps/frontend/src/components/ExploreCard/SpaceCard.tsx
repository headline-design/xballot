import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OptButton from 'components/OptButton';
import { getCacherImageUrl, getFallbackSrc } from '../../utils/functions';
import ImageWithFallback from '../ImageWithFallback';
import { Sizes } from '../../utils/constants/common';
import { staticEndpoints } from 'utils/endPoints';

function SpaceCard({ space }) {
  const appId = parseInt(space?.appId);
  const appIdString = appId?.toString();
  const spaceKey = space?.domain?.toLowerCase();
  const title = space?.name || space?.domain?.toLowerCase();
  const members = space?.members?.length;
  const imageLink = space?.avatar || `${staticEndpoints.stamp}space/${space?.domain}`;
  const link = space?.domain?.toLowerCase();
  const [opted, setOpted] = useState(null);

  useEffect(() => {
    if (localStorage.getItem(appIdString)) {
      setOpted(appId);
    }
  }, [appId]);

  return (
    <>
      <Link to={link} className="">
        <div
          className="mb-0 flex items-center justify-center border-y border-skin-border bg-skin-block-bg text-center text-base transition-all hover:border-skin-text md:rounded-xl md:border"
          style={{ height: 266 }}
        >
          <div className="p-4 leading-5 sm:leading-6">
            <div className="relative mb-2 inline-block">
              <span className="mb-1 flex shrink-0 items-center justify-center" symbol-index="space">
                <img
                  className="rounded-full bg-skin-border object-cover"
                  alt="avatar"
                  style={{ width: 82, height: 82, display: 'none' }}
                />

                <ImageWithFallback
                  className="rounded-full bg-skin-border object-cover"
                  style={{ width: Sizes.avatar, height: Sizes.avatar }}
                  src={getCacherImageUrl(
                    imageLink || `${staticEndpoints.stamp}space/${link}`,
                    Sizes.avatarImage,
                  )}
                  fallbackSrc={getFallbackSrc(imageLink || `${staticEndpoints.stamp}space/${link}`)}
                  alt={'avatar'}
                />
              </span>
            </div>
            <h3 className="mb-0 mt-0 !h-[32px] overflow-hidden pb-0 text-[22px]">{title}</h3>
            <div className="mb-[12px] text-skin-text">
              {members && (
                <span>
                  {members}
                  {''} members{' '}
                </span>
              )}
            </div>

            <div>
              <OptButton
                bg={'button--secondary'}
                space={space}
                applicationId={appId}
                spaceKey={spaceKey}
              />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default React.memo(SpaceCard);
