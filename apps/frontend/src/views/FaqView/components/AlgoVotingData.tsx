import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AlgoVotingData() {
  const [votingData, setVotingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://governance.algorand.foundation/api/voting-sessions/period-7-voting-session-1/')
      .then((response) => setVotingData(response.data))
      .catch((error) => {
        console.error(error);
        setError(error);
      });
  }, []);

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      {votingData && (
        <>
          <h2>Voting Session Information</h2>
          <h3>Title: {votingData.title}</h3>
          <p>Description: {votingData.short_description}</p>
          <p>Voting Start Date: {votingData.voting_start_datetime}</p>
          <p>Voting End Date: {votingData.voting_end_datetime}</p>
          <p>Topics Count: {votingData.topic_count}</p>
          {votingData.topics.map((topic, index) => (
            <div key={index}>
              <h4>Topic: {topic.title}</h4>
              <p>Total Vote Count: {topic.total_vote_count}</p>
              {topic.topic_options.map((option, index) => (
                <div key={index}>
                  <p>Option: {option.title}</p>
                  <p>Vote Percentage: {option.vote_percentage}</p>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default AlgoVotingData
