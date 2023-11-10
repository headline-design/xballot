export const CtaForm = () => (
    <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border my-3">
      <div className="p-4 leading-5 sm:leading-6">
        <div>
          <div className="mb-2 text-skin-link">
           Join XBallot newsletter
          </div>
          <form
            action="#mailing-list"
            method="post"
            target="_blank"
            autoComplete="off"
            className="flex"
          >
            <input type="hidden" name="tags" defaultValue={6449077} />
            <div className="w-full">
              <div className="group relative z-10">
                <input
                  name="EMAIL"
                  className="!pr-[66px] s-input !h-[42px]"
                  type="email"
                  placeholder="Your email"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <button
                    type="submit"
                    name="subscribe"
                    className="absolute right-0 h-[42px] rounded-r-full px-3"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="1.2em"
                      height="1.2em"
                      className="rotate-90 text-skin-link"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m12 19l9 2l-9-18l-9 18l9-2Zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="s-error -mt-[40px] h-6 opacity-0"> </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
