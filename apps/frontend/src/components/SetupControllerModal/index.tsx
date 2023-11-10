import { Fragment, useState } from 'react';
import { useNavigation, useNavigate } from 'react-router-dom';
import { useCurrentPosition } from 'views/SetupView/components/order';
import toast from 'react-hot-toast';
import { shorten } from 'helpers/utils';
import { NoticeIcon } from 'icons/NoticeIcon';
import { Modal } from 'components/BaseComponents/Modal';
import Button from 'components/BaseComponents/BaseButton/BaseButton';
import { getEndpoints } from 'utils/endPoints';

export default function ControllerModal({
  appId,
  domain,
  address,
  setControl,
  refSubmit,
  modalLoading,
  loading,
  openModal,
  closeModal,
  isOpen,
  values,
  formik,
  ...props
}) {
  const endPoints = getEndpoints();
  const { index, nextSlug, isLast } = useCurrentPosition();
  const navigate = useNavigate();
  const { disabled } = props;

  const alert = toast;

  return (
    <>
      <div className="flex flex-grow justify-end lg:mt-3 lg:flex-auto lg:justify-center">
        {modalLoading && (
          <button
            type="button"
            className="button button--primary w-full px-[22px] hover:brightness-95"
            data-v-4a6956ba=""
            disabled={true}
          >
            <div className="loading" data-v-4a6956ba="">
              <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 50 50">
                <path
                  className=""
                  d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 25 25"
                    to="360 25 25"
                    dur="0.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          </button>
        )}
        {!modalLoading && (
          <Button
            type="button"
            onClick={openModal}
            disabled={disabled}
            className="button button--primary w-full px-[22px] hover:brightness-95"
            data-v-4a6956ba=""
          >
            Set controller
          </Button>
        )}
      </div>

      <Modal onClose={closeModal} open={isOpen} title={'Confirm action'}>
        <div className="modal-body">
          <div className="m-4 space-y-1 text-skin-text">
            <div className="mb-3 rounded-xl border border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
              <div className="p-4 leading-5 sm:leading-6">
                <div>
                  <NoticeIcon />
                  <div className="leading-5">
                    Setting the controller requires a transaction on the Algorand blockchain which
                    will add a "snapshot" TEXT record to your ALGO domain.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span>XBallot address</span>
              <a
                href={endPoints.explorer + 'application/' + appId}
                target="_blank"
                className="whitespace-nowrap"
                rel="noopener noreferrer"
              >
                <span>{domain}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="1.2em"
                  height="1.2em"
                  className="mb-[2px] ml-1 inline-block text-xs"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
            <div className="flex justify-between">
              <span>Controller</span>
              <a
                href={endPoints.explorer + 'address/' + address}
                target="_blank"
                className="whitespace-nowrap"
                rel="noopener noreferrer"
              >
                <span>{shorten(address)}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="1.2em"
                  height="1.2em"
                  className="mb-[2px] ml-1 inline-block text-xs"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
            <div className="flex justify-between pb-2">
              <span className="mr-3 whitespace-nowrap">Eg. Text record</span>
              <a
                href="https://testnet.algoexplorer.io/tx/ITZQOPA6RXT72EP5OXBA6X74OYR54DZGWMKQNSBVJADPHCQEVN2Q"
                target="_blank"
                className="whitespace-nowrap"
                rel="noopener noreferrer"
              >
                <span> {shorten('ITZQOPA6RXT72EP5OXBA6X74OYR54DZGWMKQNSBVJADPHCQEVN2Q')}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="1.2em"
                  height="1.2em"
                  className="mb-[2px] ml-1 inline-block text-xs"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t p-4 text-center">
          {loading && (
            <button
              type="button"
              className="button button--primary w-full px-[22px] hover:brightness-95"
              data-v-4a6956ba=""
              disabled={true}
            >
              <div className="loading" data-v-4a6956ba="">
                <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 50 50">
                  <path
                    className=""
                    d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 25 25"
                      to="360 25 25"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
            </button>
          )}
          {!loading && (
            <button
              type="submit"
              className="button button--primary w-full px-[22px] hover:brightness-95"
              data-v-4a6956ba=""
              onClick={async () => {
                setControl(formik.values); // Pass formik.values as an argument to setControl
              }}
            >
              Confirm
            </button>
          )}
        </div>
      </Modal>
    </>
  );
}
