

export function SetupStrategyVote() {
    return (
      <>
        <div className="mt-4 space-y-4">
          <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
            <div className="group flex h-[57px] justify-between rounded-t-none border-b border-skin-border px-4 pt-3 pb-[12px] md:rounded-t-lg">
              <h4 className="flex items-center">
                <div>Setup voting strategy</div>
                
                
              </h4>
              <div className="flex items-center"></div>
              
            </div>
            
            <div className="p-4 leading-5 sm:leading-6">
              <div className="flex md:w-2/3">
                <div className="w-full space-y-3">
                  <div className="w-full" data-headlessui-state="">
                    <label
                      id="headlessui-combobox-label-376"
                      data-headlessui-state=""
                      className="block"
                    >
                      <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                        Network
                      </span>
                    </label>
                    <div className="relative">
                      <button
                        id="headlessui-combobox-button-377"
                        type="button"
                        tabIndex={-1}
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        className="w-full"
                        aria-labelledby="headlessui-combobox-label-376 headlessui-combobox-button-377"
                      >
                        <input
                          aria-expanded="false"
                          id="headlessui-combobox-input-378"
                          role="combobox"
                          type="text"
                          tabIndex={0}
                          data-headlessui-state=""
                          className="s-input w-full py-2 pl-3 !pr-[30px] focus:outline-none"
                          spellCheck="false"
                          aria-labelledby="headlessui-combobox-label-376"
                        />
                      </button>
                      <button
                        id="headlessui-combobox-button-379"
                        type="button"
                        tabIndex={-1}
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        className="absolute inset-y-0 right-1 flex items-center px-2 focus:outline-none"
                        aria-labelledby="headlessui-combobox-label-376 headlessui-combobox-button-379"
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
                  <div data-headlessui-state="">
                    <label id="headlessui-listbox-label-381" data-headlessui-state="">
                      <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                        Token standard
                      </span>
                    </label>
                    <div className="relative">
                      <button
                        id="headlessui-listbox-button-382"
                        type="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-headlessui-state=""
                        className="relative h-[42px] w-full truncate rounded-full border border-skin-border pl-3 pr-[40px] text-left text-skin-link hover:border-skin-text"
                        aria-labelledby="headlessui-listbox-label-381 headlessui-listbox-button-382"
                      >
                        <span>ASA</span>
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
                  <div>
                    <div className="w-full">
                      <span className="mb-[2px] flex items-center gap-1 text-skin-text">
                        Token contract
                      </span>
                      <div className="group relative z-10">
                        
                        <input
                          type="text"
                          className="s-input !h-[42px]"
                          placeholder="Enter address"
                        />
                        
                      </div>
                      <div className="s-error -mt-[40px] h-6 opacity-0"> </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="float-right mx-4 md:mx-0">
            <button
              type="button"
              className="button float-right mt-4 !mt-0 px-[22px]"
              data-v-4a6956ba=""
            >
              Skip
            </button>
          </div>
        </div>
      </>
    );
  }
