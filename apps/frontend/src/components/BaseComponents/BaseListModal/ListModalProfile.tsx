import { AvatarUser } from '../AvatarUser';
import BaseBadge from '../ProposalsItem/BaseBadge';
import { ListModalPopover } from './ListModalPopover';
import BaseLink from '../BaseLink';
import { staticEndpoints } from 'utils/endPoints';

const ListModalProfile = ({item, widthClass, shorten}) =>  {

  return (
    <>
    <ListModalPopover item={item} >
    <BaseLink link={undefined} hideExternalIcon onClick={(e) => e.stopPropagation()}>
      <div className={[widthClass, 'flex flex-nowrap items-center space-x-1'].join(' ')}>
        <AvatarUser
     user={item}
     src={item?.avatar || `${staticEndpoints.stamp}space/${item?.domain  + '.algo'}`}
          size="18"
        />
         <span className="w-full truncate text-skin-link">
            {item?.name || item?.domain || shorten(item?.address)}
          </span>
          <BaseBadge address={item} members={undefined} />
      </div>
    </BaseLink>
  </ListModalPopover>
        </>
  );
};

export default ListModalProfile;


