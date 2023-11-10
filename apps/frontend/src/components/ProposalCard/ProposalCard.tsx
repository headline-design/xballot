import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Block } from '../BaseComponents/Block';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ProfilePopover } from '../ProfilePopover/ProfilePopover';
import { useHasMounted } from '../../composables/useHasMounted';
import moment from 'moment';

dayjs.extend(relativeTime);

function ProposalCard({url, creator, profiles, voted, createdAt, title, proposal}) {
  const hasMounted = useHasMounted();

  return (
    <>
      <Block className="border-y border-skin-border bg-skin-block-bg text-base transition-colors md:rounded-xl md:border md:hover:border-skin-text">
        <div className="leading-5 sm:leading-6">
          <div>
            <Link to={url}>
              <a className="block text-skin-text">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {hasMounted && (
                        <ProfilePopover
                          creator={creator}
                          profiles={profiles} profile={undefined} hideAvatar={undefined}                        />
                      )}
                    </div>
                    {voted ? (
                      <span className="State bg-green text-white" data-v-59df45fa="">
                        Active
                      </span>
                    ) : (
                      <span className="State bg-violet-600 text-white" data-v-59df45fa="">
                        Closed
                      </span>
                    )}
                  </div>
                  <div className="relative mb-1 break-words pr-[80px] leading-7">
                    <h3 className="inline pr-2">{title}</h3>
                    <p className="mb-2 break-words text-md line-clamp-2">{proposal.content}</p>
                  </div>
                </div>
                <div className="mt-3">{moment.unix(createdAt).fromNow()}</div>
              </a>
            </Link>
          </div>
        </div>
      </Block>
    </>
  );
}

export default ProposalCard;
