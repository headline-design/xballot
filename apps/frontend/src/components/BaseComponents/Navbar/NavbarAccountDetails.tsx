import CopyPasteText from "components/LiteComponents/copy-paste";
import { shorten } from "helpers/utils";
import { ExternalLinkIcon } from "icons/ExternalLink";

export function NavbarAccountDetails({ endPoints, domainData, pipeState }) {
    return (
      <div className="p-4 pt-0 leading-5 sm:leading-6">
        <div className="flex justify-between">
          <span>XBallot domain</span>
          {domainData?.name || domainData?.domain ? (
            <a
              href={endPoints.explorer + 'asset/' + domainData?.asset}
              target="_blank"
              className="whitespace-nowrap"
              rel="noopener noreferrer"
            >
              <span>
                {' '}
                {domainData?.name} <ExternalLinkIcon className="mb-[2px] ml-1 inline-block text-xs" />
              </span>
            </a>
          ) : (
            'N/A'
          )}
        </div>
        <div className="flex justify-between">
          <span>AlgoExplorer</span>
          <a
            href={endPoints.explorer + 'address/' + pipeState.myAddress}
            target="_blank"
            className="whitespace-nowrap"
            rel="noopener noreferrer"
          >
            <span>{shorten(pipeState.myAddress)}</span>
            <ExternalLinkIcon className="mb-[2px] ml-1 inline-block text-xs" />
          </a>
        </div>
        <div className="flex justify-between pb-2">
          <span className="mr-3 whitespace-nowrap">Copy address</span>
          <span className="truncate text-skin-link">
            <CopyPasteText copyText={pipeState.myAddress} text="" hideIcon={false} />
          </span>
        </div>
      </div>
    );
  }