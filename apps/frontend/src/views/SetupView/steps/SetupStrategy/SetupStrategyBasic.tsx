import { NoticeIcon } from 'icons/NoticeIcon';

export function SetupStrategyBasic() {
  return (
    <>
      <div>
        <div className="mb-3 rounded-xl rounded-none border border-y border-x-0 border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
          <div className="p-4 leading-5 sm:leading-6">
            <div>
              <NoticeIcon />
              <div className="leading-5">Each vote is equal and no token is required</div>
            </div>
          </div>
        </div>
        <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
          <div className="group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-4 pt-3 pb-[12px] md:rounded-t-lg">
            <h4 className="flex items-center">
              <div>Setup voting strategy</div>
            </h4>
            <div className="flex items-center"></div>
          </div>

          <div className="p-4 leading-5 sm:leading-6">
            <div className="space-y-3">
              <div className="space-y-3 md:w-2/3">
                <div className="w-full" data-headlessui-state="">
                  <label id="headlessui-listbox-label-384" data-headlessui-state="">
                    <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                      Strategy
                    </span>
                  </label>
                  <div className="relative">
                    <button
                      id="headlessui-listbox-button-385"
                      type="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                      data-headlessui-state=""
                      className="relative h-[42px] w-full truncate rounded-full border border-skin-border pl-3 pr-[40px] text-left text-skin-link hover:border-skin-text"
                      aria-labelledby="headlessui-listbox-label-384 headlessui-listbox-button-385"
                    >
                      <span>Ticket voting</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[12px]">
                        <svg
                          viewBox="0 0 24 24"
                          width="1.2em"
                          height="1.2em"
                          className="text-[14px] text-skin-text"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m19 9l-7 7l-7-7"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  <span className="mb-[2px] flex items-center gap-1 text-skin-text">Symbol</span>
                  <div className="group relative z-10">
                    <input type="text" className="s-input !h-[42px]" placeholder="" />
                  </div>
                  <div className="s-error -mt-[40px] h-6 opacity-0"> </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="float-right mx-4 md:mx-0">
          <button
            type="button"
            className="button button--primary float-right mt-4 px-[22px] hover:brightness-95"
            data-v-4a6956ba=""
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
