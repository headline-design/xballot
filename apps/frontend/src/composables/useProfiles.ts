import { PROFILES_QUERY } from 'helpers/queries';
import { Profile } from 'helpers/interfaces';
import { useMemo, useRef } from 'react';

export function useProfiles() {
  const profiles = useRef<{ [address: string]: Profile }>({});
  const loadingProfiles = useRef(false);
  const reloadingProfile = useRef(false);

  const profilesCreated = useMemo(() => {
    const profilesWithCreatedAndAvatar = Object.values(profiles.current).filter(
      (profile) => profile.avatar && profile.created,
    );
    const profilesCreatedWithinLastWeek = profilesWithCreatedAndAvatar.filter(
      (profile) => profile.created ?? 0 > Date.now() - 1000 * 60 * 60 * 24 * 7,
    );
    const addressCreatedObject = profilesCreatedWithinLastWeek.reduce(
      (acc, profile) => ({
        ...acc,
        [profile.id as string]: profile.created,
      }),
      {},
    );
    return addressCreatedObject;
  }, [profiles.current]);

  const loadProfiles = async (addresses: string[]) => {
    const addressesToAdd = addresses.filter(
      (address) => !Object.keys(profiles.current).includes(address) && address !== '',
    );

    let profilesRes: any = {};
    if (addressesToAdd.length > 0) {
      loadingProfiles.current = true;
      Object.keys(profilesRes[0]).forEach((address) => {
        profilesRes[0][address] = {
          ...{ ALGO: profilesRes[0][address] },
          ...(profilesRes[1]?.data?.profiles?.find((p: any) => p.id === address) ?? {}),
        };
      });
    }

    profiles.current = { ...profilesRes[0], ...profiles.current };
    loadingProfiles.current = false;
    reloadingProfile.current = false;
  };

  const reloadProfile = (address: string) => {
    const profile = profiles.current[address];
    if (profile) {
      delete profiles.current[address];
    }
    reloadingProfile.current = true;
    loadProfiles([address]);
  };

  return {
    profiles: profiles.current,
    loadProfiles,
    reloadProfile,
    loadingProfiles: loadingProfiles.current,
    reloadingProfile: reloadingProfile.current,
    profilesCreated,
  };
}
