import React from 'react';
import { Block } from 'components/BaseComponents/Block'
import { Button } from 'components/BaseComponents/Button';
import { Link } from 'react-router-dom';

interface Props {
  space: any;
  actionType: any;
}

const NoResults: React.FC<Props> = ({ actionType }) => {

  return (
    <div className="mb-3 text-center">
      <Block className="pt-1">
        <div className="mb-3">
          {'No results found'}
        </div>
        <Link
          to={{
            pathname: `create`,
          }}
        >
          <Button>
            {actionType}
          </Button>
        </Link>
      </Block>
    </div>
  );
};

export default NoResults;