import { NavLink } from 'react-router-dom';
import { staticEndpoints } from 'utils/endPoints';

export const SubGroup = ({ space }) => (
  <div className="my-3 hidden lg:flex">
    <div>
      <h5 className="px-4 font-normal text-skin-text">
        {space?.mainSpace ? 'Main space' : 'Sub space'}
      </h5>
      <NavLink to={space?.mainSpace ? 'Main space' : 'Sub space'} className="whitespace-nowrap">
        <div className="block flex cursor-pointer items-center  whitespace-nowrap px-4 py-2 text-skin-link hover:bg-skin-bg">
          <span className="flex shrink-0 items-center justify-center">
            <img
              className="rounded-full bg-skin-border object-cover"
              alt="avatar"
              style={{ width: 22, height: 22, minWidth: 22, display: 'none' }}
            />
            <img
              src={`${staticEndpoints.stamp}space/${space?.domain}?s=44`}
              className="rounded-full bg-skin-border object-cover"
              alt="avatar"
              style={{ width: 22, height: 22, minWidth: 22 }}
            />
            {/**/}
          </span>
          <span className="mx-2 truncate">{space?.domain}</span>
        </div>
      </NavLink>
    </div>
    {/**/}
  </div>
);
