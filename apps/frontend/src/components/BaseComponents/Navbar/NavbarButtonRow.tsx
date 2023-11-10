export function NavbarButtonRow({ connected, disconnectWallet, viewProfile, viewAbout, reload }) {
    return (
      <div className="border-t p-4 text-center">
        {!connected ? (
          <>
            <div className="float-left w-2/4 pr-2">
              <button
                data-v-4a6956ba=""
                className="button flex w-full items-center justify-center px-[22px]"
                onClick={reload}
              >
                Refresh
              </button>
            </div>
            <div className="float-left w-2/4 pl-2">
              <button
                onClick={viewAbout}
                className="button button--primary flex w-full items-center justify-center px-[22px]"
                data-v-4a6956ba=""
              >
                Learn more
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="float-left w-2/4 pr-2">
              <button
                className="button button--secondary w-full px-[22px] hover:brightness-95"
                data-v-4a6956ba=""
                onClick={disconnectWallet}
              >
                Log out
              </button>
            </div>
            <div className="float-left w-2/4 pl-2">
              <button
                className="button button--primary w-full px-[22px] hover:brightness-95"
                data-v-4a6956ba=""
                onClick={viewProfile}
              >
                View profile
              </button>
            </div>
          </>
        )}
      </div>
    );
  }