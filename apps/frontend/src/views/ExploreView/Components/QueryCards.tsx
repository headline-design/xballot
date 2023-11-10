import NetworkCard from 'components/ExploreCard/NetworkCard';
import SpaceCard from 'components/ExploreCard/SpaceCard';
import UserCard from 'components/ExploreCard/ProfileCard';

export const filteredSpaces = {
  spaces: [],
  profiles: [],
};

export const filteredNetworks = {
  networks: [],
};

export function QuerySpaceCard({ filteredSpaces, selectedType }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredSpaces[selectedType.action].map((item) => (
          <div key={`SpacesItem_${item.key + 1}`}>
            <SpaceCard
              applicationId={item.key}
              link={item.domain.toLowerCase()}
              title={item.domain}
              spaceId={1}
              members={item.optedList.length}
              imageLink={item.imageLink}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export function QueryUserCard({ filteredSpaces, selectedType }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredSpaces[selectedType.action].map((item) => (
          <div key={`SpacesItem_${item.key + 1}`}>
            <UserCard
              applicationId={item.key}
              link={item.domain.toLowerCase()}
              title={item.domain}
              spaceId={1}
              members={1}
              imageLink={item.imageLink}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export function QueryNetworkCard({ filteredNetworks, selectedType, spaces }) {
  const network = filteredNetworks[selectedType.action][0];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div key={`networksItem_${network?.key}`}>
          <NetworkCard
            name={network?.name}
            logo={network?.logo}
            key={'Chain #' + network?.chainId}
            length={spaces.length}
            chainId={undefined}
            endPoints={undefined}
          />
        </div>
      </div>
    </>
  );
}
