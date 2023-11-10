import React from 'react';
import { Link } from 'react-router-dom';
import OptButton from 'components/OptButton';
import AvatarSpace from 'components/AvatarSpace';
import { useFormatCompactNumber } from 'utils/useFormatCompactNumber';
import { IconVerifiedSpace } from 'icons/IconVerifiedSpace';

export default function ModalSpacesListItem({ space, spaceKey, appId, domainType }) {
  console.log('listspace', space);
  return (
    <div>
      <Link to={domainType === 'space' ? `/${space.domain}` : `/profile/${space.domain}`}>
        <div className="border-y border-skin-border bg-skin-block-bg text-base hover:border-skin-text md:rounded-xl md:border">
          <div className="p-4 leading-5 sm:leading-6">
            <div className="flex justify-between">
              <div className="flex min-w-0">
                <AvatarSpace space={space} size="44" previewFile={undefined} />
                <div className="ml-3 mr-3 truncate">
                  <div className="flex items-center">
                    <div className="truncate">{space?.domain}</div>
                    {space?.verified && (
                      <IconVerifiedSpace
                        className="ml-1 flex text-primary"
                        space-id={space.id}
                        size="18"
                      />
                    )}
                  </div>
                  <div className="text-xs leading-5 text-skin-text">
                    {useFormatCompactNumber(space?.members?.length || 0)} <span> Member(s)</span>
                  </div>
                </div>
              </div>
              <OptButton
                space={space}
                spaceKey={spaceKey}
                applicationId={space?.appId}
                bg={undefined}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
