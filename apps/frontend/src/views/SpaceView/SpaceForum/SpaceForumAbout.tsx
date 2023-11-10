import { useEffect, useMemo } from 'react';
import { getUrl } from 'helpers/utils';
import { Block } from 'components/BaseComponents/Block';
import BaseLink from 'components/BaseComponents/BaseLink';
import TextAutolinker from 'components/TextAutoLinker';

export default function SpaceForumAbout({ space }) {

  return (
    <>
      <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
        <div className="mb-3 flex px-4 md:px-0">
          <h2>About</h2>
        </div>

        <Block title="Overview">
          <div className="space-y-3">
            <div>
              <TextAutolinker text={space?.forum?.about} />
            </div>
            {space?.forum?.terms && (
              <div>
                <h4 className="mb-1 text-skin-link">Terms</h4>

                <BaseLink
                  link={getUrl(space?.forum?.terms)}
                  className="flex items-center text-skin-text hover:text-skin-link"
                >
                  <div className="max-w-[300px] truncate">{space?.forum?.terms}</div>
                </BaseLink>
              </div>
            )}
          </div>
        </Block>
      </div>
    </>
  );
}
