import React from 'react';
import { Block } from 'components/BaseComponents/Block';
import PostModal from 'views/SpaceView/SpaceForum/Components/PostModal';
import { useParams } from 'react-router-dom';

interface Props {
  space: any;
  actionType: any;
  appId: any;
}

const NoResults: React.FC<Props> = ({ space, actionType, appId }) => {
  const { spaceKey } = useParams();

  return (
    <div className="mb-3 text-center">
      <Block className="pt-1">
        <div className="mb-3">{'No results found'}</div>

        <PostModal space={space} appId={appId} />
      </Block>
    </div>
  );
};

export default NoResults;
