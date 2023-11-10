import SetupButtonNext from "views/SetupView/components/SetupButtonNext";

export function SetupStrategyAdvanced(props: any) {
    return (
      <>
        <div>
          <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
            <div className="group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-4 pt-3 pb-[12px] md:rounded-t-lg">
              <h4 className="flex items-center">
                <div>Setup voting strategy</div>
                
                
              </h4>
              <div className="flex items-center"></div>
              
            </div>
            
            <div className="p-4 leading-5 sm:leading-6">
              <div className="mb-4 w-full space-y-2 sm:flex sm:space-y-0 sm:space-x-4">
                <div className="w-full" data-headlessui-state="">
                  <label
                    id="headlessui-combobox-label-387"
                    data-headlessui-state=""
                    className="block"
                  >
                    <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                      Network
                      <span className="text-xs hover:text-skin-link">
                        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2c2.21 0 4 1.343 4 3c0 1.4-1.278 2.575-3.006 2.907c-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </span>
                    </span>
                  </label>
                  <div className="relative">
                    <button
                      id="headlessui-combobox-button-388"
                      type="button"
                      tabIndex={-1}
                      aria-haspopup="true"
                      aria-expanded="false"
                      data-headlessui-state=""
                      className="w-full"
                      aria-labelledby="headlessui-combobox-label-387 headlessui-combobox-button-388"
                    >
                      <input
                        aria-expanded="false"
                        id="headlessui-combobox-input-389"
                        role="combobox"
                        type="text"
                        tabIndex={0}
                        data-headlessui-state=""
                        className="s-input w-full py-2 pl-3 !pr-[30px] focus:outline-none"
                        spellCheck="false"
                        aria-labelledby="headlessui-combobox-label-387"
                      />
                    </button>
                    <button
                      id="headlessui-combobox-button-390"
                      type="button"
                      tabIndex={-1}
                      aria-haspopup="true"
                      aria-expanded="false"
                      data-headlessui-state=""
                      className="absolute inset-y-0 right-1 flex items-center px-2 focus:outline-none"
                      aria-labelledby="headlessui-combobox-label-387 headlessui-combobox-button-390"
                    >
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
                    </button>
                    
                  </div>
                </div>
                <div className="w-full">
                  <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                    Symbol
                    <span className="text-xs hover:text-skin-link">
                      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2c2.21 0 4 1.343 4 3c0 1.4-1.278 2.575-3.006 2.907c-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </span>
                  </span>
                  <div className="group relative z-10">
                    
                    <input
                      type="text"
                      className="s-input !h-[42px]"
                      maxLength={16}
                      placeholder="e.g. HDL"
                    />
                    
                  </div>
                  <div className="s-error -mt-[40px] h-6 opacity-0"> </div>
                </div>
              </div>
              <div className="mb-4 grid gap-3">
                <div className="flex items-center gap-1">
                  <h4>Select up to 8 strategies</h4>
                  <span className="text-xs text-sm hover:text-skin-link">
                    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2c2.21 0 4 1.343 4 3c0 1.4-1.278 2.575-3.006 2.907c-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </span>
                </div>
                <sub className="-mt-[10px] text-sm"> (Voting power is cumulative) </sub>
                <div className="flex h-full truncate">
                  <button className="flex w-full items-center justify-between rounded-md border p-4">
                    <div className="flex items-center gap-2 truncate pr-[20px] text-left">
                      <h4 className="truncate">ticket</h4>
                      <span className="rounded-full bg-skin-text px-2 text-center text-xs leading-5 text-white">
                        {' '}
                        $VOTE
                      </span>
                    </div>
                  </button>
                  <button className="-mr-2 flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link">
                    <i className="iconfont iconclose" style={{ fontSize: 14, lineHeight: 14 }} />
                  </button>
                </div>
              </div>
              
              <button type="button" className="button block w-full px-[22px]" data-v-4a6956ba="">
                Add strategy
              </button>
            </div>
          </div>
          <div className="mx-4 md:mx-0">
    </div>
        </div>
      </>
    );
  }
