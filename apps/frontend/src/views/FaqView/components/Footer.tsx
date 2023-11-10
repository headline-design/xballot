import { staticEndpoints } from "utils/endPoints";

const Footer = () => {
  return (
    <footer className="space-x-3 bg-skin-bg pb-[50px] pl-[50px] md:fixed md:right-0 md:bottom-0 md:bg-transparent md:p-4 2xl:pr-6">
      <a
        href={staticEndpoints.xBallotTwitter}
        target="_blank"
        className="whitespace-nowrap"
        rel="noopener noreferrer"
      >
        <i
          className="iconfont icontwitter text-skin-text opacity-40 transition-opacity hover:opacity-80"
          style={{ fontSize: 28, lineHeight: '28px' }}
        />
      </a>
      <a
        href={staticEndpoints.xBallotDiscord}
        target="_blank"
        className="whitespace-nowrap"
        rel="noopener noreferrer"
      >
        <i
          className="iconfont icondiscord text-skin-text opacity-40 transition-opacity hover:opacity-80"
          style={{ fontSize: 28, lineHeight: '28px' }}
        />
      </a>
      <a
        href="https://t.me/headline_crypto"
        target="_blank"
        className="whitespace-nowrap"
        rel="noopener noreferrer"
      >
        <i
          className="iconfont icontelegram text-skin-text opacity-40 transition-opacity hover:opacity-80"
          style={{ fontSize: 28, lineHeight: '28px' }}
        />
      </a>
      <a
        href={staticEndpoints.headlineGithub}
        target="_blank"
        className="whitespace-nowrap"
        rel="noopener noreferrer"
      >
        <i
          className="iconfont icongithub text-skin-text opacity-40 transition-opacity hover:opacity-80"
          style={{ fontSize: 28, lineHeight: '28px' }}
        />
      </a>
      <a
        href={staticEndpoints.xBallotDocs}
        target="_blank"
        className="whitespace-nowrap"
        rel="noopener noreferrer"
      >
        <i
          className="iconfont icongitbook text-skin-text opacity-40 transition-opacity hover:opacity-80"
          style={{ fontSize: 28, lineHeight: '28px' }}
        />
      </a>
    </footer>
  );
};

export default Footer;
