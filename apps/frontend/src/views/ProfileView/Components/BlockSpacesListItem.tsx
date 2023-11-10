import { Link } from 'react-router-dom';
import { IconVerifiedSpace } from 'icons/IconVerifiedSpace';
import AvatarSpace from 'components/AvatarSpace';

type Props = {
  domainType?: any;
  space: {
    domain: string;
    id: string;
    verified: boolean;
    name: string;
  };
};

export default function BlockSpacesListItem({ space, domainType }: Props) {
  return (
    <Link to={domainType === 'space' ? `/${space.domain}` : `/profile/${space.domain}`}>
      <div className="flex justify-center">
        <div className="flex justify-center rounded-full !border-[1px] !border-skin-text p-[2px]">
          <AvatarSpace space={space} symbol-index="space" size="48" previewFile={undefined} />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="truncate text-xs">{space?.name || space?.domain}</div>
        {space?.verified && <IconVerifiedSpace space-id={space.id} className="pl-1 text-primary" />}
      </div>
    </Link>
  );
}
