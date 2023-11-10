
const TabsButtonGroup = (props: any) => (
  <div onClick={props.onClick}
    className={
      props.isActive
        ? 'block cursor-pointer whitespace-nowrap px-4  py-2 text-skin-link hover:bg-skin-bg'
        : 'border-l-[0px] border-b-[3px] !pl-[21px] lg:border-b-[0px] lg:border-l-[3px]'
    }
  >
    {props.label}
  </div>
);

export default TabsButtonGroup;
