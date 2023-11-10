import { useEffect, useState } from 'react';
import { getIpfsUrl } from 'helpers/utils';
import BaseLink from 'components/BaseComponents/BaseLink';
import { DiscordIcon } from 'icons/Discord'

type Props = {
  link: string;
  title?: string;
  description?: any;
  previewTitle?: any;
};

type Preview = {
  meta: {
    title: string;
    description: string;
    
  };
  links: {
    icon: {
      href: string;
    }[];
  };
}; 

export const DiscussionBlock: React.FC<Props> = ({ link, title, description }) => {
  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => { 
    update(link);
  }, [link]);

  async function update(val: string) {
    try {
      setPreview(null);
      new URL(val);
      const IFRAMELY_API_KEY = 'ebb1b6b6d8d13a3119477e';
      const url = `https://cdn.iframe.ly/api/iframely?url=${encodeURI(
        val
      )}&api_key=${IFRAMELY_API_KEY}`;
      const result = await fetch(url);
      const data = await result.json();
      setPreview(data);
    } catch (e) {
      console.log(e);
    }
  }

  const previewTitle = preview?.meta?.title;
  const previewIconHref = preview?.links?.icon[0]?.href;

  return previewTitle ? (
    <div>
      {title && <div className="mb-2">{title}</div>}
      <BaseLink link={getIpfsUrl(link)} hideExternalIcon>
        <div className="flex items-center rounded-xl border hover:cursor-pointer hover:border-skin-text">
          {previewIconHref && (
            <div className="px-4 pr-0">
              <div className="w-[32px]">
                {previewIconHref.includes('discord.com') ? (
                  <DiscordIcon />
                ) : (
                  <img
                    src={previewIconHref}
                    alt="logo"
                    width="32"
                    height="32"
                    className="rounded bg-white"
                  />
                )}
              </div>
            </div>
          )}
          <div className="overflow-hidden px-4 py-3">
            <div className="truncate text-skin-link">{previewTitle}</div>
            {preview?.meta?.description && (
              <div className="truncate text-sm text-skin-text">
                {preview?.meta?.description}
              </div>
            )}
          </div>
        </div>
      </BaseLink>
    </div>
  ) : null;
};