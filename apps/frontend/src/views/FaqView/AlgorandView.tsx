import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from './components/Section';

const ALGORAND_DESCRIPTION =
  "Algorand's Governance program allows you to participate in the decision-making, growth, and development of the Algorand ecosystem, with the chance to earn rewards. It provides an opportunity to engage with the community and contribute to the governance of Algorand's blockchain. By participating in governance activities, you can have a direct impact on the future direction of the ecosystem.";
const ALGORAND_DESCRIPTION_PART_2 =
  'You can actively participate in proposal discussions, vote on governance decisions, and even submit your own proposals for consideration. The rewards you earn through participation are distributed to your Algorand wallet.';

const XGOV_DESCRIPTION =
  "The xGov program is a part of Algorand's journey towards responsible decentralization. It involves a group of expert governors who apply their knowledge and expertise to funding decisions, such as grant applications. xGovs have the responsibility to review and shortlist grant applications, use their votes to select projects for funding, and actively participate in the governance process.";
const XGOV_DESCRIPTION_PART_2 =
  "As an xGov, you will have the opportunity to shape the future of Algorand's ecosystem by contributing to the decision-making process. Your expertise and active involvement will play a crucial role in funding innovative projects and initiatives that drive the growth and adoption of Algorand.";

const XGOV_DETAILS_PART_1 =
  'Governors can opt into the xGov Program during the governance sign-up phase, which occurs every quarter, for a twelve-month term. Once the governance period is completed, their rewards are deposited to the xGov Term address, where they are held for twelve months.';
const XGOV_DETAILS_PART_2 =
  "During this time, xGovernors receive voting power to be used to vote on grant applications submitted by the community. xGovernors who do not fulfill their duties forfeit their ALGO deposit, which remains in the pool. Those who perform all their governance duties will receive their deposited rewards, plus their share of any forfeited ALGOs in the pool. Be aware that xGovs may lose deposited rewards if their duties aren't fulfilled.";

const NFT_COUNCIL_DESCRIPTION_PART_1 =
  'The NFT Council voting program aims to establish a long-term and mutually beneficial relationship with the NFT ecosystem, stakeholders, and the community. This program goes through multiple voting rounds with different criteria based on the impacted audiences of each initiative.';
const NFT_COUNCIL_DESCRIPTION_PART_2 =
  'The goal is to select representatives for the NFT Council and determine the criteria for the first NFT Wallet Collection batch purchase. The NFT Council election starts with a testing round conducted internally with the Web3 team members before going public.';

const sectionDescriptions = {
  algorand: ALGORAND_DESCRIPTION,
  algorandPart2: ALGORAND_DESCRIPTION_PART_2,
  xGov: XGOV_DESCRIPTION,
  xGovPart2: XGOV_DESCRIPTION_PART_2,
  xGovDetailsPart1: XGOV_DETAILS_PART_1,
  xGovDetailsPart2: XGOV_DETAILS_PART_2,
  nftCouncilPart1: NFT_COUNCIL_DESCRIPTION_PART_1,
  nftCouncilPart2: NFT_COUNCIL_DESCRIPTION_PART_2,
};



function AlgorandGovernance() {
  const [showMore, setShowMore] = useState({
    algorand: false,
    xGov: false,
    xGovDetails: false,
    nftCouncilDetails: false,
  });

  const toggleShowMore = (section) => {
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [section]: !prevShowMore[section],
    }));
  };

  return (
    <div>
      <h1 className="relative ml-[50px] mt-[100px] font-space text-[40px] font-bold leading-[3rem]  md:mt-[135px]">
        <div className="absolute top-[22px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
        Governance
        <br />
        on Algorand
      </h1>

      <Section
        title="Algorand"
        descriptionPart1={sectionDescriptions.algorand}
        descriptionPart2={sectionDescriptions.algorandPart2}
        showMore={showMore.algorand}
        toggleShowMore={() => toggleShowMore('algorand')}
      />

      <div className="mb-4 flex items-center">
        <hr className="w-[50px] border-skin-border" />
        <Link to="https://www.algorand.foundation/governance" className="">
          <button
            type="button"
            className="button group min-w-[120px] origin-left scale-110 px-[22px] hover:!bg-opacity-5 "
            data-v-4a6956ba=""
          >
            Algo Governance
          </button>
        </Link>
      </div>

      <Section
        title="xGov"
        descriptionPart1={sectionDescriptions.xGov}
        descriptionPart2={sectionDescriptions.xGovPart2}
        showMore={showMore.xGov}
        toggleShowMore={() => toggleShowMore('xGov')}
      />

      <div className="mb-4 flex items-center">
        <hr className="w-[50px] border-skin-border" />
        <Link to="https://www.algorand.foundation/xgov" className="">
          <button
            type="button"
            className="button group min-w-[120px] origin-left scale-110 px-[22px] hover:!bg-opacity-5 "
            data-v-4a6956ba=""
          >
            xGov
          </button>
        </Link>
      </div>

      <Section
        title="xGov Program Details"
        descriptionPart1={sectionDescriptions.xGovDetailsPart1}
        descriptionPart2={sectionDescriptions.xGovDetailsPart2}
        showMore={showMore.xGovDetails}
        toggleShowMore={() => toggleShowMore('xGovDetails')}
      />

      <div className="mb-4 flex items-center">
        <hr className="w-[50px] border-skin-border" />
        <Link to="https://github.com/algorandfoundation/xGov" className="">
          <button
            type="button"
            className="button group min-w-[120px] origin-left scale-110 px-[22px] hover:!bg-opacity-5 "
            data-v-4a6956ba=""
          >
            xGov proposals
          </button>
        </Link>
      </div>

      <Section
        title="NFT Council"
        descriptionPart1={sectionDescriptions.nftCouncilPart1}
        descriptionPart2={sectionDescriptions.nftCouncilPart2}
        showMore={showMore.nftCouncilDetails}
        toggleShowMore={() => toggleShowMore('nftCouncilDetails')}
      />
    </div>
  );
}

export default AlgorandGovernance;
