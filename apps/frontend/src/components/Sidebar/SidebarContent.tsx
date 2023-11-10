import { memo } from "react";
import Sidebar from "./Sidebar";
import clsx from "clsx";


const SidebarContent: React.FC<{
    showSidebar: boolean;
    setShowSidebar: (arg0: boolean) => void;
  }> = memo(({ showSidebar, setShowSidebar }) => (
    <div id="sidebar" className="flex flex-col">
      <div
        className={clsx(
          'sticky top-0 z-40 h-screen max-w-[60px] overflow-hidden bg-skin-bg transition-all sm:w-auto',
          { 'max-w-0 sm:max-w-none': !showSidebar },
        )}
      >
        <Sidebar className="border-r border-skin-border" showSidebar={() => setShowSidebar(false)} loading={undefined} />
      </div>
    </div>
  ));

  export default SidebarContent