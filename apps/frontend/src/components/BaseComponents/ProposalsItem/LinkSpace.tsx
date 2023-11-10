import { useState, useEffect } from 'react';
import BaseLink from '../BaseLink';
import { getEndpoints } from 'utils/endPoints';

const LinkSpace = ({ spaceId, children, domains, domain }) => {
  const [spaceLink, setSpaceLink] = useState(null);
  const endPoints = getEndpoints();
  useEffect(() => {
    if (domain && Object.values(domains).includes(spaceId)) {
      const key = Object.keys(domains).find((key) => domains[key] === spaceId);
      setSpaceLink(`https://${key}`);
    } else if (domain) {
      setSpaceLink(`${endPoints.xballotUrl + spaceId}`);
    } else {
      setSpaceLink({
        name: 'spaceProposals',
        params: { key: spaceId },
      });
    }
  }, [spaceId, domain]);

  return (
    <BaseLink link={spaceLink} hideExternalIcon>
      {children}
    </BaseLink>
  );
};

export default LinkSpace;
