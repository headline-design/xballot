import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCurrentPosition } from '../components/order';
import { GitbookIcon } from 'icons/GitbookIcon';
import { staticEndpoints } from 'utils/endPoints';

export const SetupIntro = () => {
  const { index, nextSlug, isLast } = useCurrentPosition();
  const navigate = useNavigate();

  return (
    <>
      <>
        <div>
          <div className="px-4 md:px-0">
            XBallot is a platform for Algorand community governance. Create your own space now and
            start making decisions!
          </div>
          <div className="mt-4 border-y border-skin-border bg-skin-block-bg text-base text-skin-text md:rounded-xl md:border">
          <div className="p-4 leading-5 sm:leading-6">
    <div>
    <GitbookIcon />
      <div className="leading-5">
      Not sure how to setup your space? Learn more in the <a
                    href={staticEndpoints.xBallotDocs}
                    target="_blank"
                    className="whitespace-nowrap"
                    rel="noopener noreferrer"
                  >
                    {' '}
                    documentation

                    <svg
                      viewBox="0 0 24 24"
                      width="1.2em"
                      height="1.2em"
                      className="ml-1 mb-[2px] inline-block text-xs"
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
                    {' '}
                  </a>
                  or join XBallot{' '}
                  <a
                    href={staticEndpoints.xBallotDiscord}
                    target="_blank"
                    className="whitespace-nowrap"
                    rel="noopener noreferrer"
                  >
                    Discord
                    <svg
                      viewBox="0 0 24 24"
                      width="1.2em"
                      height="1.2em"
                      className="ml-1 mb-[2px] inline-block text-xs"
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
                  </a>.
      </div>
    </div>
    {/**/}
  </div>
          </div>
          <div className="px-4 md:px-0">
            <button
              type="button"
              className="button button--primary float-right mt-4 w-full px-[22px] hover:brightness-95"
              data-v-4a6956ba=""
              onClick={(values) => {
                navigate(isLast ? '/' : `/setup/${nextSlug}`, {
                  state: { fromForm: true },
                });
              }}
            >
              Get started
            </button>
          </div>
        </div>
      </>
      <div className="lg:flex"></div>
    </>
  );
};
