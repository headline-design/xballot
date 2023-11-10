import React, { useState } from 'react';
import { Section } from './components/Section';
import { ButtonRow } from './components/ButtonRow';
import { SubFooterLinks } from './components/SubFooterLinks';
import { staticEndpoints, getEndpoints } from 'utils/endPoints';

const HDL_DAO_DESCRIPTION_PART_1 = `
The HDL DAO is a venture DAO that manages the XBallot platform. HDL serves as the native governance token for the HEADLINE ecosystem, allowing HDL token holders to actively participate in decision-making processes and shape the future direction of the XBallot platform. Built on the Algorand blockchain, XBallot leverages the speed, security, and scalability of Algo, the native token, to provide efficient and transparent voting solutions.
`;

const HDL_DAO_DESCRIPTION_PART_2 = `
XBallot demonstrates its commitment to community empowerment by allocating 20% of its platform-generated revenue to the HDL DAO. This revenue sharing mechanism ensures that the HDL DAO and its token holders directly benefit from the growth and success of the XBallot platform. Furthermore, upon HDL DAO incorporation, the DAO will receive equity in XBallot and associated properties along with other HEADLINE applications, strengthening the alignment of interests between the DAO and the platform's development.
`;

const HDL_TOKEN_DESCRIPTION_PART_1 = `
As a key component of the XBallot ecosystem, the HDL token plays a crucial role in shaping the platform's management, operations, and investment decisions. With a total supply of 25,000,000 tokens, HDL token holders have a strong voice in the governance framework. The Algorand ecosystem has facilitated over 700,000 HDL transactions, showcasing the active engagement of the HDL community in the ecosystem-building process. Transparently tracked on platforms like CoinMarketCap and CoinGecko, the HDL token provides visibility to holders and potential investors.
`;

const HDL_TOKEN_DESCRIPTION_PART_2 = `
To ensure the security and custodial oversight of the HDL token treasury, HDL DAO funds are held on Copper, a trusted digital asset custody provider. This approach enhances the safety and integrity of the HDL token ecosystem, protecting the interests of the community and stakeholders. HDL token holders actively participate in community voting on HDL DAO matters, including strategic direction, operational decisions, and potential investment opportunities. The governance structure of the HDL DAO fosters collective decision-making, reflecting the consensus and interests of the token holders.
`;

const SUSTAINABILITY_DESCRIPTION_PART_1 = `
To demonstrate a commitment to long-term sustainability and stability, 80% of the HDL token supply has been vested. This measured vesting approach aligns the interests of token holders with the overall success and growth of the XBallot platform.
`;

const SUSTAINABILITY_DESCRIPTION_PART_2 = `
The HDL DAO is dedicated to fostering community collaboration and ensuring the decentralization of decision-making processes within the XBallot ecosystem. Through open discussions, voting, and active participation, HDL token holders actively shape policies, protocols, and initiatives. The HDL DAO is committed to transparency, accountability, and inclusivity, striving to represent the collective interests of token holders. Active engagement in governance processes empowers HDL token holders to contribute to the growth and development of the XBallot platform, driving innovation and benefiting the community.
`;

function TokenomicsView() {
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

  const endPoints = getEndpoints();

  return (
    <div>
      <h1 className="relative ml-[50px] mt-[100px] font-space text-[40px] font-bold leading-[3rem] md:mt-[135px]">
        <div className="absolute top-[22px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
        Tokenomics
      </h1>
      <p className="mt-4 mb-[50px] pl-[50px] text-gray-300 !text-skin-text sm:w-[501px]">
        XBallot takes community governance on Algorand to the next level with HDL. The HDL DAO, the
        HDL token, and the Algo token are the core components of the XBallot ecosystem, empowering
        community members to actively participate in the decision-making process.
      </p>
      <Section
        title={
          <>
            The HDL DAO:
            <br /> Empowering Community Governance
          </>
        }
        showMore={showMore.hdlDaoPart1}
        toggleShowMore={() => toggleShowMore('hdlDaoPart1')}
        descriptionPart1={HDL_DAO_DESCRIPTION_PART_1}
        descriptionPart2={HDL_DAO_DESCRIPTION_PART_2}
      />
      <ButtonRow label="HDL DAO" link={endPoints.xballotUrl + "about"} />

      <Section
        title={
          <>
            The HDL Token:
            <br /> Shaping Governance Framework
          </>
        }
        showMore={showMore.hdlTokenPart1}
        toggleShowMore={() => toggleShowMore('hdlTokenPart1')}
        descriptionPart1={HDL_TOKEN_DESCRIPTION_PART_1}
        descriptionPart2={HDL_TOKEN_DESCRIPTION_PART_2}
      />
      <ButtonRow
        label="HDL Token"
        link="https://app.tinyman.org/#/swap?asset_in=0&asset_out=137594422"
      />

      <Section
        title={
          <>
            Sustainability &<br /> Community Collaboration
          </>
        }
        showMore={showMore.sustainabilityPart1}
        toggleShowMore={() => toggleShowMore('sustainabilityPart1')}
        descriptionPart1={SUSTAINABILITY_DESCRIPTION_PART_1}
        descriptionPart2={SUSTAINABILITY_DESCRIPTION_PART_2}
      />
      <ButtonRow label="HDL Community" link={staticEndpoints.headlineTelegram} />
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

export default TokenomicsView;
