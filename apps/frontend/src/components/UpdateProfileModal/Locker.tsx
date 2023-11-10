import { InputInfo } from "icons/Info";
import { staticEndpoints } from "utils/endPoints";

export const Locker = ({pipeState, closeModal}) => {
    return (
      <>
        <div className="modal-body">
          <div className="min-h-[150px] space-y-3">
            <div className="leading-5 sm:leading-6">
              <div className="space-y-2 p-4">
                <div className="flex justify-center">
                  <div>
                    <div className="relative">
                      <span className="flex shrink-0 items-center justify-center">
                        <img
                          className="disabled rounded-full bg-skin-border object-cover"
                          alt="avatar"
                          style={{ width: 80, height: 80, minWidth: 80, display: 'none' }}
                        />
                        <img
                          src={`${staticEndpoints.stamp}avatar/` + pipeState.myAddress}
                          className="rounded-full bg-skin-border object-cover"
                          alt="avatar"
                          style={{ width: 80, height: 80, minWidth: 80 }}
                        />
                      </span>
                      <div className="group absolute right-0 left-0 top-0 bottom-0 flex cursor-not-allowed items-center justify-center rounded-full transition-colors ease-out hover:bg-skin-border hover:opacity-80">
                        <div className="hidden transition-all ease-out group-hover:block">
                          Locked
                        </div>
                      </div>
                      <div className="absolute right-0 bottom-[2px] rounded-full bg-skin-heading p-1">
                        <svg
                          viewBox="0 0 24 24"
                          width="1.2em"
                          height="1.2em"
                          className="text-skin-bg-2 text-[12px]"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <input
                    disabled
                    type="file"
                    accept="image/jpg, image/jpeg, image/png"
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="group relative z-10 flex pt-3">
                  <InputInfo className="mr-1" width={'1.2em'} height={'1.2em'} />{' '}
                  <p>XBallot domain required to modify profile.</p>
                </div>
                <div className="w-full">
                  <span className="mb-[2px] flex items-center gap-1 text-skin-text">Name</span>
                  <div className="group relative z-10 cursor-not-allowed">
                    <input
                      disabled
                      type="text"
                      className="disabled s-input !h-[42px] cursor-not-allowed"
                      maxLength={32}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="s-error -mt-[40px] h-6 opacity-0"> </div>
                </div>
                <div>
                  <span className="mb-[2px] flex items-center gap-1 text-skin-text">Bio</span>
                  <textarea
                    disabled
                    className="disabled s-input !mt-1 h-auto w-full cursor-not-allowed rounded-3xl !rounded-3xl border border-skin-border py-3 px-4 focus-within:!border-skin-text "
                    maxLength={256}
                    placeholder="Tell your story"
                    style={{ resize: 'none', height: 65, overflow: 'hidden' }}
                    defaultValue={''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t p-4 text-center">
          <button
            data-v-4a6956ba
            type="button"
            className="button button--primary w-full px-[22px] hover:brightness-95"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </>
    );
  };