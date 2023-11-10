import { useMemo, useState } from 'react';
import { ExtendedSpace } from 'helpers/interfaces';
import { useProfiles } from 'composables/useProfiles';
import { getUrl } from 'helpers/utils';
import { Block } from 'components/BaseComponents/Block';
import BaseLink from 'components/BaseComponents/BaseLink';
import BasePill from 'components/BaseComponents/BasePill';
import AboutMembersListItem from 'components/AboutMembersListItem';
import SpaceAboutStrategiesList from 'components/SpaceAboutStrategiesList';
import TextAutolinker from 'components/TextAutoLinker';
import { ProfilePopover } from 'components/ProfilePopover/ProfilePopover';
import MembersListModal from 'components/BaseComponents/BaseListModal/MembersListModal';
import { useProfileInfo } from 'hooks/useProfileInfo';

interface Moderator {
  id: string;
  roles: string[];
}

interface Props {
  space: any | ExtendedSpace;
  members: string[];
  profiles: any;
}

const defaultStrategies = [
  {
    text: 'single-choice',
    title: 'Single choice voting',
    description: 'Each voter may select only one choice.',
  },
];

const AboutSpace: React.FC<Props> = ({ space, members, profiles }) => {
  const { loadProfiles } = useProfiles();

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

  const spaceMembers = useMemo<Moderator[]>(() => {
    const authors = (space?.members ?? []).map((member) => ({ id: member, roles: ['author'] }));
    const admins = (space?.admins ?? []).map((admin) => ({ id: admin, roles: ['admin'] }));
    const allMembers = authors.concat(admins);

    return allMembers.reduce((acc: Moderator[], curr) => {
      const existing = acc.find((member) => member.id === curr.id);
      if (existing) {
        existing.roles = existing.roles.concat(curr.roles);
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as Moderator[]);
  }, [space?.members, space?.admins]);

  const strategies = useMemo(() => space?.strategies || defaultStrategies, [space?.strategies]);

  const processedMembers =
    space?.members &&
    space?.members.map((member, i) => {
      return {
        key: i + 1,
        domain: member.address,
        member: member.address,
      };
    });

  //console.log('processedMembers', processedMembers)

  const [actionLoading, setActionLoading] = useState(false);

  return (
    <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
      <div className="mb-3 flex px-4 md:px-0">
        <h2>About</h2>
      </div>

      <Block title="Overview">
        <div className="space-y-3">
          <div>
            <TextAutolinker text={space?.about} />
          </div>

          {space?.terms && (
            <div>
              <h4 className="mb-1 text-skin-link">Terms</h4>

              <BaseLink
                link={getUrl(space.terms)}
                className="flex items-center text-skin-text hover:text-skin-link"
              >
                <div className="max-w-[300px] truncate">{space.terms}</div>
              </BaseLink>
            </div>
          )}
        </div>
      </Block>

      {strategies.length > 0 && (
        <Block title="Strategies" className="mt-3" slim>
          <SpaceAboutStrategiesList strategies={strategies} />
        </Block>
      )}

      {space?.members && (
        <Block title="Members" counter={space?.members?.length} className="mt-3" slim>
          {space?.members.slice(0, 8).map((member) => (
            <AboutMembersListItem key={member.address}>
              <ProfilePopover
                creator={member.address}
                profiles={profiles}
                hideAvatar={false}
                profile={undefined}
              />
              <div className="space-x-2">
                {member.address === space?.controller ||
                  (member.address === space?.creator && (
                    <BasePill
                      v-tippy="{ content: $t('settings.admins.information') }"
                      className="cursor-help py-1"
                    >
                      admin
                    </BasePill>
                  ))}
                {member.address === space?.creator && (
                  <BasePill
                    v-tippy="{ content: $t('settings.authors.information') }"
                    className="cursor-help py-1"
                  >
                    author
                  </BasePill>
                )}
              </div>
            </AboutMembersListItem>
          ))}
          <div
            onClick={handleOpenModal}
            className="block cursor-pointer rounded-b-none border-t px-4 py-3 text-center md:rounded-b-md"
          >
            <span>View all</span>
          </div>
        </Block>
      )}
      <MembersListModal
        onClose={closeModal}
        onOpen={isOpen}
        items={processedMembers}
        searchPlaceholder={undefined}
        actionLoading={actionLoading}
        profiles={profiles}
      />
    </div>
  );
};

export default AboutSpace;
