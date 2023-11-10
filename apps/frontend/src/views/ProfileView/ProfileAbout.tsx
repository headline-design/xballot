import BlockSpacesList from './Components/BlockSpacesList';
import ProfileAboutBiography from './Components/ProfileAboutBiography';
import React from 'react';
import { ExtendedSpace } from 'helpers/interfaces';
import { getTerms } from "utils/endPoints";

interface DomainData {
  about?: string;
}

interface Props {
  domainData: DomainData;
  createdSpaces: ExtendedSpace[];
  joinedSpaces: ExtendedSpace[];
  followedProfiles: ExtendedSpace[];
  loading: any;
}

const ProfileAbout: React.FC<Props> = ({ domainData, createdSpaces, joinedSpaces, followedProfiles, loading }) => {
const terms = getTerms();
const MemoizedBlockSpacesList = React.memo(BlockSpacesList)
  return (
    <>
      <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
        <div>
          <div className="space-y-4">
            {domainData?.about && <ProfileAboutBiography about={domainData.about} />}

            <MemoizedBlockSpacesList
              emptyContent="Hasn't created any spaces yet"
              spaces={createdSpaces}
              title={'Created spaces'}
              loading={loading}
              domainType={"space"}
            ></MemoizedBlockSpacesList>
            <MemoizedBlockSpacesList
              emptyContent="Hasn't joined any spaces yet"
              spaces={joinedSpaces}
              title={'Joined spaces'}
              loading={loading}
              domainType={"space"}
            ></MemoizedBlockSpacesList>
                        <MemoizedBlockSpacesList
              emptyContent="Hasn't followed any profiles yet"
              spaces={followedProfiles}
              title={'Followed profiles'}
              loading={loading}
              domainType={"profile"}
            ></MemoizedBlockSpacesList>
            <div>
              <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
                <div className="group flex h-[57px] justify-between rounded-t-none border-b border-b-0 border-skin-border px-4 pt-3 pb-[12px] md:rounded-t-lg">
                  <h4 className="flex items-center">
                    <div>Delegator for</div>
                  </h4>
                  <div className="flex items-center">
                    <div className="cursor-help text-xs text-skin-link">
                    {terms.chainTitle}
                    </div>
                  </div>
                </div>

                <div className="leading-5 sm:leading-6">
                  <div className="border-t p-4">
                    No delegators on {terms.chainTitle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileAbout;
