import { MenuDots } from 'icons/MenuDots';
export default function BlockSpacesListButtonMore({ onClick }) {
  return (
    <button onClick={onClick} className="ml-4 h-full cursor-pointer bg-skin-bg text-skin-link">
      <div className="flex justify-center">
        <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border hover:border-skin-text">
          <MenuDots />
        </div>
      </div> 
      <div className="text-center text-xs">See all</div>
    </button>
  );
}
