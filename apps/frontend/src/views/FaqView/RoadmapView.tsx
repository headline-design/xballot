import React, { useState } from 'react';
import { Section } from './components/Section';
import { ButtonRow } from './components/ButtonRow';
import { SubFooterLinks } from './components/SubFooterLinks';
import { staticEndpoints } from 'utils/endPoints';

const ROADMAP_DESCRIPTION_1_PART_1 = `
Many of our voting systems are live and battle-tested today. But we are still refining several of them. We are also working on a few new voting systems that will be released in the coming weeks. Here is a list of voting systems that are currently in the works:
`;

const ROADMAP_DESCRIPTION_1_PART_2 = `
Multi-token voting, quadratic voting w/ sybil resistance, treasury management contracts, and more.
`;

const ROADMAP_DESCRIPTION_2_PART_1 = `
XBallot's on-chain forums are one of the most exciting features of the platform. We are currently working on a multi-threaded forum system that will allow for deep discussions and debates.`;

const ROADMAP_DESCRIPTION_2_PART_2 = `
We currently support a three-level system: Post level, thread level, and sub-thread level. We are working on a system that will allow for unlimited sub-threads.`;

const ROADMAP_DESCRIPTION_3_PART_1 = `
Integrating a domain registrar with a DAO management system is a complex task. We currently support minting, updating, and assigning domains anywhere within our protcol. We are working on a system that will allow for secondary sales of domains. `;

const ROADMAP_DESCRIPTION_3_PART_2 = `
Down the road we are planning to build a system that will allow DAOs to register their own domains and subdomains. This will allow DAOs to create their own decentralized websites`;

const ROADMAP_DESCRIPTION_4_PART_1 = `
Our objective is to build a platform that is fully decentralized and community-owned. The first step in this process is to open-source our tooling.`;

const ROADMAP_DESCRIPTION_4_PART_2 = `
We are currently working on a system that will allow anyone to build their own XBallot interface. We are also working on an API/SDK that will allow developers to build their own applications on top of the XBallot protocol.`;

function RoadmapView() {
  const [showMore, setShowMore] = useState({
    hdlDaoPart1: false,
    hdlDaoPart2: false,
    hdlTokenPart1: false,
    hdlTokenPart2: false,
    sustainabilityPart1: false,
    sustainabilityPart2: false,
  });

  const toggleShowMore = (section) => {
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [section]: !prevShowMore[section],
    }));
  };

  return (
    <div>
      <h1 className="relative ml-[50px] mt-[100px] font-space text-[40px] font-bold leading-[3rem] md:mt-[135px]">
        <div className="absolute top-[22px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
        Construction <br /> Zone 🏗️
      </h1>
      <p className="mt-4 mb-[50px] pl-[50px] text-gray-300 !text-skin-text sm:w-[501px]">
        XBallot is currently in late-stage V1 development. There are many exciting features built to
        production today with a lot more on the way. Some features that are live now are not fully
        functional yet. This is intentional while we field test and recieve feedback. Here is a list
        of features that are currently in the works:
      </p>
      <Section
        title={
          <>
            Voting systems:
            <br /> Advanced
          </>
        }
        showMore={showMore.hdlDaoPart1}
        toggleShowMore={() => toggleShowMore('hdlDaoPart1')}
        descriptionPart1={ROADMAP_DESCRIPTION_1_PART_1}
        descriptionPart2={ROADMAP_DESCRIPTION_1_PART_2}
      />
        <ButtonRow
        label="Visit Infura"
        link="https://www.infura.io"
      />

      <Section
        title={
          <>
            Forum feeds:
            <br /> Deep threading
          </>
        }
        showMore={showMore.hdlTokenPart1}
        toggleShowMore={() => toggleShowMore('hdlTokenPart1')}
        descriptionPart1={ROADMAP_DESCRIPTION_2_PART_1}
        descriptionPart2={ROADMAP_DESCRIPTION_2_PART_2}
      />
      <ButtonRow
        label="Visit Github"
        link={staticEndpoints.headlineGithub}
      />

      <Section
        title={
          <>
            XBD market:
            <br /> Secondary sales
          </>
        }
        showMore={showMore.sustainabilityPart1}
        toggleShowMore={() => toggleShowMore('sustainabilityPart1')}
        descriptionPart1={ROADMAP_DESCRIPTION_3_PART_1}
        descriptionPart2={ROADMAP_DESCRIPTION_3_PART_2}
      />
      <Section
        title={
          <>
            Open-source tooling:
            <br /> API/SDK access
          </>
        }
        showMore={showMore.sustainabilityPart1}
        toggleShowMore={() => toggleShowMore('sustainabilityPart1')}
        descriptionPart1={ROADMAP_DESCRIPTION_4_PART_1}
        descriptionPart2={ROADMAP_DESCRIPTION_4_PART_2}
      />
      <ButtonRow label="HDL Community" link={staticEndpoints.headlineTelegram}/>
      <ButtonRow label="CoinMarketCap" link="https://coinmarketcap.com/currencies/headline-inc" />
      <SubFooterLinks
        linksTitle="Learn more"
        linkTitle1="Twitter"
        link1={staticEndpoints.headlineTwitter}
        linkDescription1="HEADLINE Crypto"
        linkDescription2="XBallot Platform"
        linkDescription3="XBallot Community"
        linkTitle2="Twitter"
        link2={staticEndpoints.xBallotTwitter}
        linkTitle3="Telegram"
        link3={staticEndpoints.xBallotTelegram}
      />
    </div>
  );
}

export default RoadmapView;
