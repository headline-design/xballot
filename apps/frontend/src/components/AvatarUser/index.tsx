import { useEffect, useState } from 'react';
//import { useProfiles } from './composables/useProfiles';
import BaseAvatar from '../BaseComponents/BaseAvatar/BaseAvatar';
import { staticEndpoints } from 'utils/endPoints';

interface DefineProps {
  address: string| undefined;
  size?: string | undefined;
  previewFile?: File | undefined;
}

const defaultProps: DefineProps = {
  size: '22',
  previewFile: undefined,
  address: undefined
};

function Avatar(props: DefineProps) {
  //const { profilesCreated } = useProfiles();
  const [timestamp, setTimestamp] = useState('');

  /*useEffect(() => {
    if (!props?.address || !profilesCreated?.[props.address]) return;
    setTimestamp(`&ts=${profilesCreated[props.address]}`);
  }, [props.address, profilesCreated]);*/

  return (
    <BaseAvatar
      src={`${staticEndpoints.stamp}avatar/algo:${props.address}?s=${
        Number(props.size) * 2
      }${timestamp}`}
      previewFile={props.previewFile}
      size={props.size}
    />
  );
}

Avatar.defaultProps = defaultProps;
