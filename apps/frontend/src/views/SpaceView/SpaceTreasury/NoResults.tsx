import React from 'react';
import { ExtendedSpace } from 'helpers/interfaces';
import { Block } from 'components/BaseComponents/Block';
import { Button } from 'components/BaseComponents/Button';
import { Link, useParams } from 'react-router-dom';

interface Props {
  space: any;
}

const NoResults: React.FC<Props> = () => {
  const { spaceKey } = useParams();

  return (
    <div className="mb-3 text-center">
      <Block className="pt-1">
        <div className="mb-3">{'No results found'}</div>
        <Link to={`/${spaceKey}/settings`}>
          <Button>{'Link treasury'}</Button>
        </Link>
      </Block>
    </div>
  );
};

export default NoResults;
