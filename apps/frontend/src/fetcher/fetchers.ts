import { useCallback } from 'react';
import { Proposals } from 'utils/constants/templates/proposal';
import { getAllOpted, getLatestProposal, getSettingsObject, getUserProposals, getIndexerProposal } from 'fetcher/utils';

export const useProposalFetcher = () => {
  const fetchProposal = useCallback(async (appId, proposalId) => {
    console.log('fetchingProposal...', appId, proposalId);
    try {
      let response = await getLatestProposal(appId, 0);
      console.log('got a proposal...', appId);
      response = response.filter((proposal) => proposal.txid === proposalId);
      if (response) {
        const pArray = response.map((proposal) => ({
          ...Proposals[0],
          ...proposal.pDescription,
          ...proposal,
          fetcher: 'chain',
          space: proposal.settings,
          appId,
        }));
        return pArray[0];
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    fetchProposal,
  };
};

export const useSpaceFetcher = () => {
  const fetchSpace = useCallback(async (appId) => {
    console.log('fetchingSpace...', appId);
    try {
      const chainData = await getSettingsObject(appId);
      const members = await getAllOpted(appId, 0, 0);
      console.log('members', members)
      return {
        ...chainData,
        members,
      };
    } catch (error) {
      console.error(`Error in fetching space: ${error}`);
    }
  }, []);

  return {
    fetchSpace,
  };
};

export const usePostFetcher = () => {
  const fetchPosts = useCallback(async (appId, minRound) => {
    console.log('fetchingPosts...', appId);
    try {
      const chainData = await getSettingsObject(appId);
      const posts = await getUserProposals(
        appId,
        chainData?.forum?.token,
        chainData?.forum?.tokenAmount,
        minRound,
      );

      console.log('posts', posts);

      // create an object with the fetched data and an 'updatedAt' timestamp
      const fetchedData = {
        ...chainData,
        posts,
        updatedAt: new Date().toISOString(),
      };

      // save the fetched data to local storage
      localStorage.setItem(`posts_${appId}`, JSON.stringify(fetchedData));

      return fetchedData;
    } catch (error) {
      console.error(`Error in fetching posts: ${error}`);
    }
  }, []);

  return {
    fetchPosts,
  };
};

export const useIndexerProposalFetcher = () => {
  const fetchIndexerProposal = useCallback(async (appId, proposalId) => {
    console.log('fetchingProposal...', appId, proposalId);
    try {
      const response = await getIndexerProposal(appId, proposalId);
      console.log('got a proposal...', appId);
      if (response && response.txid === proposalId) {
        return response;
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    fetchIndexerProposal,
  };
};

