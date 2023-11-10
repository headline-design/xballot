import React from 'react';
import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import { Link } from 'react-router-dom';
import { ButtonTheme } from '../../../components/BaseComponents/ButtonTheme';
import { staticEndpoints } from '../../../utils/endPoints';

const AboutNavMenu = ({navButtons}) => {

  return (
    <Popover>
      {({ close }) => (
        <>
          <Float
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            placement={'bottom-end'}
            offset={4}
            shift={16}
            flip={16}
            zIndex={50}
            portal
          >
            <Popover.Button
              as="button"
              className="w-8 h-8 flex items-center justify-center text-skin-text hover:text-skin-link "
            >
              <div className="-my-1 ml-2 pr-[30px] lg:hidden">
                <svg width={24} height={24} fill="none" aria-hidden="true">
                  <path
                    d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div
                  style={{
                    position: 'fixed',
                    top: 1,
                    left: 1,
                    width: 1,
                    height: 0,
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    borderWidth: 0,
                    display: 'none',
                  }}
                />
              </div>
            </Popover.Button>

            <Popover.Panel
              static
              className="right-0 z-10 mt-1  w-screen max-w-sm transform sm:max-w-sm sm:px-0 "
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="overflow-hidden rounded-2xl border bg-skin-header-bg shadow-lg">
                <div className="no-scrollbar max-h-[85vh] overflow-y-auto overscroll-contain">
                  <div>
                    <div className="m-4 flex justify-between">
                      <div>
                        <ButtonTheme />
                      </div>
                      <div
                        data-headlessui-state=""
                        className="inline-block h-full !h-[42px] text-left"
                      >
                        <button
                          type="button"
                          className="button flex !h-[44px] w-full items-center px-[22px] !text-skin-text hover:!text-skin-link"
                          data-v-4a6956ba=""
                        >
                          <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="mr-2">
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2a2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2a2 2 0 1 0 4 0a2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          English
                        </button>

                        <div
                          style={{
                            position: 'absolute',
                            zIndex: 50,
                            inset: '0px auto auto 0px',
                            transform: 'translate(0px, 0px)',
                          }}
                        />
                      </div>
                    </div>
                    <div className="group m-4 my-[30px]">
                      <>
                        {navButtons.map((item) => (
                          <Link key={item.label} to={item.link} onClick={() => close()}>
                            <button className="block cursor-pointer py-1 text-xl text-skin-link hover:!text-skin-link hover:!opacity-100 group-hover:text-skin-text group-hover:opacity-70">
                              {item.label}
                            </button>
                          </Link>
                        ))}
                      </>

                    </div>

                    <div className="mt-4 border-t">
                      <div className="m-4 flex items-center justify-between">
                        <div className="flex inline-flex items-center justify-start justify-center space-x-3 pt-2 !pt-0 md:mt-4 md:justify-start lg:mt-0 lg:justify-end">
                          <span>
                            <a
                              href="https://twitter.com/headline_crypto"
                              target="_blank"
                              className="whitespace-nowrap"
                              rel="noopener noreferrer"
                            >
                              <div className="text-skin-text hover:text-skin-link">
                                <svg
                                  width="1.2em"
                                  height="1.2em"
                                  fill="currentColor"
                                  viewBox="0 0 30 30"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-[24px]"
                                >
                                  <path d="M25.2688 9.53141C25.2846 9.76543 25.2846 9.99945 25.2846 10.2356C25.2846 17.432 19.9588 25.7316 10.2203 25.7316V25.7273C7.34353 25.7316 4.52651 24.884 2.10474 23.2857C2.52304 23.3375 2.94345 23.3634 3.3649 23.3645C5.74893 23.3666 8.06482 22.5438 9.94038 21.0286C7.67482 20.9844 5.68812 19.4648 4.99409 17.2465C5.78772 17.404 6.60546 17.3716 7.38441 17.1527C4.91441 16.6394 3.1374 14.407 3.1374 11.8145C3.1374 11.7907 3.1374 11.7681 3.1374 11.7454C3.87337 12.1671 4.6974 12.4011 5.5403 12.427C3.21393 10.8277 2.49683 7.64416 3.90167 5.15514C6.58974 8.55759 10.5558 10.626 14.8133 10.8449C14.3866 8.95337 14.9695 6.97122 16.345 5.64151C18.4774 3.57955 21.8312 3.68524 23.8357 5.87769C25.0214 5.6372 26.1579 5.18965 27.1979 4.55553C26.8026 5.81622 25.9755 6.8871 24.8705 7.56759C25.9199 7.44034 26.9452 7.15132 27.9108 6.71024C27.2 7.80592 26.3047 8.76034 25.2688 9.53141Z" />
                                </svg>
                              </div>
                            </a>
                          </span>
                          <span>
                            <a
                              href="https://discord.gg/DvdPQT7u4t"
                              target="_blank"
                              className="whitespace-nowrap"
                              rel="noopener noreferrer"
                            >
                              <div className="text-skin-text hover:text-skin-link">
                                <svg
                                  width="1.2em"
                                  height="1.2em"
                                  fill="currentColor"
                                  viewBox="0 0 71 55"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-[23px]"
                                >
                                  <g>
                                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                                  </g>
                                  <defs />
                                </svg>
                              </div>
                            </a>
                          </span>
                          <span>
                            <a
                              href="https://t.me/headline_crypto"
                              target="_blank"
                              className="whitespace-nowrap"
                              rel="noopener noreferrer"
                            >
                              <div className="text-skin-text hover:text-skin-link">
                                <svg
                                  width="1.2em"
                                  height="1.2em"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  role="img"
                                  preserveAspectRatio="xMidYMid meet"
                                  viewBox="0 0 512 512"
                                  className="text-[21px]"
                                >
                                  <path d="M470.435 45.423L16.827 221.249c-18.254 8.188-24.428 24.585-4.412 33.484l116.37 37.173l281.368-174.79c15.363-10.973 31.091-8.047 17.557 4.024L186.053 341.075l-7.591 93.076c7.031 14.371 19.905 14.438 28.117 7.295l66.858-63.589l114.505 86.187c26.595 15.826 41.066 5.613 46.788-23.394l75.105-357.47c7.798-35.705-5.5-51.437-39.4-37.757z" />
                                </svg>
                              </div>
                            </a>
                          </span>
                          <span>
                            <a
                              href="https://www.youtube.com/algorand"
                              target="_blank"
                              className="whitespace-nowrap"
                              rel="noopener noreferrer"
                            >
                              <div className="text-skin-text hover:text-skin-link">
                                <svg
                                  width="1.2em"
                                  height="1.2em"
                                  fill="currentColor"
                                  viewBox="0 0 30 30"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-[25px]"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M25.9386 5.78563C27.144 6.10831 28.0914 7.05561 28.414 8.26106C28.9972 10.4438 28.9995 15.0005 28.9995 15.0005C28.9995 15.0005 28.9995 19.5572 28.414 21.7399C28.0914 22.9454 27.144 23.8927 25.9386 24.2153C23.756 24.8008 14.9997 24.8008 14.9997 24.8008C14.9997 24.8008 6.24356 24.8008 4.06085 24.2153C2.85542 23.8927 1.90812 22.9454 1.58544 21.7399C1 19.5572 1 15.0005 1 15.0005C1 15.0005 1 10.4438 1.58544 8.26106C1.90812 7.05561 2.85542 6.10831 4.06085 5.78563C6.24356 5.2002 14.9997 5.2002 14.9997 5.2002C14.9997 5.2002 23.756 5.2002 25.9386 5.78563ZM19.4713 15.001L12.1971 19.2004V10.8015L19.4713 15.001Z"
                                  />
                                </svg>
                              </div>
                            </a>
                          </span>
                        </div>
                        <div className="text-sm leading-4 opacity-40">
                          <a
                            href={staticEndpoints.headlineGithub}
                            target="_blank"
                            className="whitespace-nowrap"
                            rel="noopener noreferrer"
                          >
                            v0.1
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
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Float>
        </>
      )}
    </Popover>
  );
};

export default AboutNavMenu;
