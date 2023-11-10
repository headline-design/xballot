import { NavLink } from 'react-router-dom';
import { ButtonRounded } from '../BaseComponents/ButtonRounded';

const ActiveSlider = () => (
  <div className="absolute left-[-4px] !h-[20px] h-[8px] w-[8px] rounded-full bg-skin-link transition-all duration-300 group-hover:bg-skin-link" />
);

const HoverSlider = () => (
  <div className="absolute left-[-4px] h-[8px] w-[8px] rounded-full transition-all duration-300 group-hover:h-[10px] group-hover:bg-skin-link" />
);

function MenuItem(space: any) {
  return (
    <>
      <ButtonRounded>
        <img
          className="rounded-full bg-skin-border object-cover"
          src={space.image}
          alt={space.name}
          style={{ width: 44, height: 44, minWidth: 44 }}
        />
      </ButtonRounded>
    </>
  );
}

function DraggableSpace(props: any) {
  return (
    <>
      {props.spaces.map((space, index) => (
        <NavLink
          to={`/${space.name}`}
          key={index}
          className={({ isActive }) =>
            isActive ? 'active-sb-link mt-2 px-2' : 'sb-link mt-2 px-2'
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? <ActiveSlider /> : <HoverSlider />}
              <>
                <MenuItem name={space.name} image={space.image} space={space} />
              </>
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}

export default DraggableSpace;
