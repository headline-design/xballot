import { ExternalLinkIcon } from 'icons/ExternalLink';
import { NoticeIcon } from 'icons/NoticeIcon';
import { Link } from 'react-router-dom';

export function NavbarNotice({ connected, terms }) {
  return (
    <div className="m-4 space-y-1 text-skin-text">
      <div className="mb-3 rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
        <div className="p-4 leading-5 sm:leading-6">
          <div>
            <NoticeIcon />
            <div className="leading-5">
              {!connected ? (
                <>
                  Welcome to {terms.protocolTitle}. To learn more about the protocol visit our{' '}
                  <Link
                    to="/about"
                    className="whitespace-nowrap"
                    rel="noopener noreferrer"
                    tabIndex={0}
                  >
                    About
                    <ExternalLinkIcon className="mb-[2px] ml-1 inline-block text-xs" />
                  </Link>{' '}
                  section today! XBallot docs coming soon.
                </>
              ) : (
                <>
                  {' '}
                  Did you know that Algorand is a carbon-negative blockchain? Learn more about
                  Algorand by watching{' '}
                  <a
                    href="https://www.youtube.com/@TheReCoop"
                    target="_blank"
                    className="whitespace-nowrap"
                    rel="noopener noreferrer"
                    tabIndex={0}
                  >
                    The ReCoop
                    <ExternalLinkIcon className="mb-[2px] ml-1 inline-block text-xs" />
                  </a>{' '}
                  today!{' '}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
