import { NoticeIcon } from "icons/NoticeIcon";

export const ViewOnlyNotice = () => (
  <div className="mx-4 mb-3 rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:mx-0 md:rounded-xl md:border">
    <div className="p-4 leading-5 sm:leading-6">
      <div>
      <NoticeIcon />
        <div className="leading-5">
          You are in view only mode, to modify space settings connect with a controller or admin
          wallet.
        </div>
      </div>
    </div>
  </div>
);
