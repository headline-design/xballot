import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import OptButton from 'components/OptButton';
import { getCacherImageUrl, getFallbackSrc } from '../../utils/functions';
import ImageWithFallback from '../ImageWithFallback';
import { Sizes } from '../../utils/constants/common';
import { staticEndpoints } from 'utils/endPoints';

function ProfileCard({ domain, profiles, link, ...props }) {
  return (
    <>
      <Link to={'/profile/' + domain?.domain} className="">
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
                    domain?.avatar || `${staticEndpoints.stamp}space/${domain?.domain + '.algo'}`,
                    Sizes.avatarImage,
                  )}
                  fallbackSrc={getFallbackSrc(
                    props.imageLink || `${staticEndpoints.stamp}space/${props.link}`,
                  )}
                  alt={'avatar'}
                />
              </span>
            </div>
            <h3 className="mb-0 mt-0 !h-[32px] overflow-hidden pb-0 text-[22px]">
              {domain?.domain}
            </h3>
            <div className="mb-[12px] text-skin-text">

                <span>
                  {domain?.members?.length}
                  {''} followers{' '}
                </span>

            </div>

            <div>
              <OptButton
                optInLabel="Follow"
                optOutLabel="Unfollow"
                optedLabel="Following"
                bg={'button--secondary'}
                space={domain}
                applicationId={parseInt(domain?.appId)}
                spaceKey={domain?.domain}
              />
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default React.memo(ProfileCard);
