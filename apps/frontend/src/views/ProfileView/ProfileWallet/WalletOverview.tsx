import { ForwardArrow } from 'icons/ForwardArrow';
import { useNavigate, useParams } from 'react-router-dom';

const WalletOverview = () => {
  const navigate = useNavigate();
  const { domainKey } = useParams();

  return (
    <div id="content-right" className="relative float-right w-full pl-0 lg:w-3/4 lg:pl-5">
      <div className="px-4 md:px-0">
        <h1 className="mb-4">XBallot Wallet</h1>
      </div>
      <div className="px-4 md:px-0">
        <h4 className="mb-1">How can you use the XBallot wallet?</h4>
        <p className="mb-3">You can check out these features now (more coming soon).</p>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => navigate(`/account/${domainKey}/wallet/accounts`)}
          className="relative w-full border-y border-skin-border p-4 py-[18px] pr-[80px] text-left hover:border-skin-text md:rounded-xl md:border-x"
        >
          <h4 className="leading-2 mb-1 mt-0">Zero signature transactions (hot wallet)</h4>Delegate
          your voting power to a zero-signature wallet and vote without ever moving your tokens or
          signing transactions
          <ForwardArrow />
        </button>
        <button className="relative w-full border-y border-skin-border p-4 py-[18px] pr-[80px] text-left hover:border-skin-text md:rounded-xl md:border-x">
          <h4 className="leading-2 mb-1 mt-0">Claim token rewards</h4>Use your standard Algorand
          wallet or XBallot hot wallet to claim your token rewards for voting and other protocol
          activities
          <ForwardArrow />
        </button>
      </div>
    </div>
  );
};

export default WalletOverview;
