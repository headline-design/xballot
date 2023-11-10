import { useEffect } from 'react';

export const useOgMeta = ({ space, spaceKey }) => {
  useEffect(() => {
    document.title = `${space?.content || spaceKey} | XBallot`;

    const ogTitleTag = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    const descriptionTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const ogUrlTag = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    const ogImgTag = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;

    if (ogTitleTag) {
      ogTitleTag.content = `${space?.content || spaceKey} | XBallot`;
    }
    if (ogDescriptionTag) {
      ogDescriptionTag.content = `${space?.content || spaceKey}` || null;
    }
    if (ogImgTag) {
      ogImgTag.content = `${space?.content || 'https://xballot.net/logo192.png'}`;
    }
    if (ogUrlTag) {
      ogUrlTag.content = `https://xballot.net/${spaceKey}` || null;
    }
    if (descriptionTag) {
      descriptionTag.content = `${space?.content?.slice(0, 160)}` || null;
    }
  }, [space?.content, spaceKey]);
};
