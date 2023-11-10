import { NoticeIcon } from 'icons/NoticeIcon';
import { Link } from 'react-router-dom';

export const WalletWarning = ({ aboutLink }) => (
  <div className="mb-4 space-y-2" data-testid="create-proposal-connect-wallet-warning">
    <div className="rounded-xl rounded-none border border-y border-x-0 border-skin-border !border-skin-text bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
      {/**/}
      {/**/}
      <div className="p-4 leading-5 sm:leading-6">
        <div>
          <NoticeIcon />
          <div className="leading-5">
            <span>You need to pass the proposal validation in order to submit a proposal.</span>
            <div>
              <Link to={aboutLink} className="whitespace-nowrap">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
