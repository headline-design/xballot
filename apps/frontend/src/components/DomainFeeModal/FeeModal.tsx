import { useState } from 'react';
import { Modal } from 'components/BaseComponents/Modal';
import { NoticeIcon } from 'icons/NoticeIcon';

const FeeSchedule = () => (
  <>
    {[
      ['5 characters or more', '$1'],
      ['4 characters', '$10'],
      ['3 characters', '$30'],
      ['2 characters', '$50'],
      ['1 character', '$100'],
    ].map(([text, price]) => (
      <div className="flex justify-between" key={text}>
        <span className="mr-1 flex-auto text-skin-text">{text}</span>
        <span>{price}</span>
      </div>
    ))}
  </>
);

const RenewalNotice = () => (
  <div>
    <NoticeIcon />
    <div className="leading-5">
      <span>
        XBallot domains are renewed annually. Yearly renewal Fees are paid in ALGO. The ALGO/USD
        exchange rate is set via API call at time of registry.{' '}
        <a href="/about" target="_blank" className="whitespace-nowrap" rel="noopener noreferrer">
          Learn more
        </a>
      </span>
    </div>
  </div>
);

const Divider = () => (
  <div className="mb-3 mt-3 rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border" />
);

export default function FeeModal(props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div>
        <button
          className="button button--secondary mt-2 w-full px-[22px] hover:brightness-95"
          data-v-4a6956ba=""
          type="button"
          onClick={() => setIsOpen(true)}
        >
          XBallot Fee schedule
        </button>
      </div>

      <Modal onClose={() => setIsOpen(false)} open={isOpen} title={'Fee schedule'}>
        <div className="modal-body">
          <div className="m-4">
            <div className="mb-3 border-y border-skin-border bg-skin-block-bg p-4 text-base text-skin-link md:rounded-xl md:border">
              <div className="leading-5 sm:leading-6">
                <div className="flex items-center justify-between">
                  <h3>Ballot accounts</h3>
                </div>
                <div>
                  <FeeSchedule />
                  <Divider />
                  <RenewalNotice />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className="absolute right-3 top-[20px] flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link"
          onClick={() => setIsOpen(false)}
        >
          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="border-t p-4 text-center">
          <button
            data-v-4a6956ba
            type="button"
            className="button button--primary w-full px-[22px] hover:brightness-95"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
