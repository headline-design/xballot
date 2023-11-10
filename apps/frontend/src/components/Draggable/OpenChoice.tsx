export const OpenVoting = ({label}) => (
    <>
      <div className="group w-full rounded-3xl">
        <div className="relative z-10 flex w-full rounded-3xl border border-skin-border bg-skin-bg px-3 text-left leading-[42px] outline-none transition-colors focus-within:border-skin-text">
          <div className="mr-2 whitespace-nowrap text-skin-text">
            <div className="drag-handle flex cursor-grab cursor-not-allowed items-center active:cursor-grabbing active:cursor-not-allowed">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 7.09565 10.806"
                width="16px"
                height="12px"
                stroke="currentColor"
                className="iconfont icondraggable mr-[12px]"
              >
                <path
                  d="M1.2,9.606v-.006m0-4.194v-.006M1.2,1.206v-.006m0,7.806c.33137,0,.6,.26863,.6,.6s-.26863,.6-.6,.6-.6-.26863-.6-.6,.26863-.6,.6-.6Zm0-4.2c.33137,0,.6,.26863,.6,.6s-.26863,.6-.6,.6-.6-.26863-.6-.6,.26863-.6,.6-.6ZM1.2,.606c.33137,0,.6,.26863,.6,.6s-.26863,.6-.6,.6-.6-.26863-.6-.6,.26863-.6,.6-.6Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.2"
                />
                <path
                  d="M5.89565,9.6v-.006m0-4.194v-.006m0-4.194v-.006m0,7.806c.33137,0,.6,.26863,.6,.6s-.26863,.6-.6,.6-.6-.26863-.6-.6,.26863-.6,.6-.6Zm0-4.2c.33137,0,.6,.26863,.6,.6s-.26863,.6-.6,.6-.6-.26863-.6-.6,.26863-.6,.6-.6ZM5.89565,.6c.33137,0,.6,.26863,.6,.6s-.26863,.6-.6,.6-.6-.26863-.6-.6,.26863-.6,.6-.6Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.2"
                />
              </svg>
             <input placeholder="label"></input>
            </div>
          </div>
          <input
            placeholder=""
            type="text"
            className="input w-full flex-auto cursor-not-allowed"
            maxLength={32}
          />
          <span className="hidden text-xs text-skin-text group-focus-within:block">3/32</span>
        </div>
      </div>
    </>
  );
