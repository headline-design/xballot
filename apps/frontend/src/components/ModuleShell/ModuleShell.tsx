export const ModuleShell = (componentTitle, childComponent, baseComponent) => (
  <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
    <div className="p-4 leading-5 sm:leading-6">
      {baseComponent}
      <h4 className="mt-3 mb-1">{componentTitle}</h4>
      <div className="flex">
        <div className="w-full overflow-hidden">
          <div className="space-y-2">{childComponent}</div>
        </div>
      </div>
    </div>
  </div>
);

export const ModuleShellHeader = (props) => {
  return (
    <>
      <div className="group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-4 pt-3 pb-[12px] md:rounded-t-lg">
        <h4 className="flex items-center">
          <div>{props.moduleTitle}</div>
        </h4>
        <div className="flex items-center"></div>
      </div>
    </>
  );
};
