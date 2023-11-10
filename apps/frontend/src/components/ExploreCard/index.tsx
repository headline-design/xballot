import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pipeline from '@pipeline-ui-2/pipeline/index';
import { staticEndpoints } from 'utils/endPoints';

function ExploreCard(props) {
  const [joined, setAppJoined] = useState(false);

  function checkJoined() {
    if (localStorage.getItem(props.applicationId)) {
      setAppJoined(true);
    }
  }

  useEffect(checkJoined, []);

  async function register() {
    let opted = localStorage.getItem(props.applicationId);
    if (!opted) {
      let txId = await Pipeline.optIn(parseInt(props.applicationId), ['register']);
      alert(txId);
      if (txId.length === 52) {
        localStorage.setItem(props.applicationId, true.toString());
      }
    } else {
      alert('you are already opted in');
    }
  }

  return (
    <>
      <Link to={props.link} className="">
        <span style={{ display: 'none' }}>{props.applicationId}</span>
        <div
          key={props.key}
          className="mb-0 flex items-center justify-center border-y border-skin-border bg-skin-block-bg text-center text-base transition-all hover:border-skin-text md:rounded-xl md:border"
          style={{ height: 266 }}
        >
          <div className="p-4 leading-5 sm:leading-6">
            <div className="relative mb-2 inline-block">
              <span className="mb-1 flex shrink-0 items-center justify-center" symbol-index="space">
                <img
                  className="rounded-full bg-skin-border object-cover"
                  alt="avatar"
                  style={{ width: 82, height: 82, minWidth: 82, display: 'none' }}
                />

                <img
                  src={props.imageLink || `${staticEndpoints.stamp}space/${props.link}`}
                  className="rounded-full bg-skin-border object-cover"
                  alt="avatar"
                  style={{ width: 82, height: 82, minWidth: 82 }}
                />
              </span>
            </div>
            <h3 className="mb-0 mt-0 !h-[32px] overflow-hidden pb-0 text-[22px]">{props.title}</h3>
            <div className="mb-[12px] text-skin-text"> {props.members}</div>

            <div>
              {!joined ? (
                <button
                  type="button"
                  className="button group !mb-0 min-w-[120px] px-[22px]"
                  data-v-4a6956ba=""
                  onClick={(event) => {
                    event.preventDefault();
                    register();
                  }}
                >
                  <span>Join</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="button group !mb-0 min-w-[120px] px-[22px] hover:!border-red hover:!bg-red hover:!bg-opacity-5 hover:!text-red"
                  data-v-4a6956ba=""
                >
                  <span>
                    <span className="flex items-center gap-2 group-hover:hidden">
                      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="text-green">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m5 13l4 4L19 7"
                        />
                      </svg>{' '}
                      Joined
                    </span>
                    <span className="hidden group-hover:block">Leave</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default ExploreCard;
