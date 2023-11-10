import { Block } from 'components/BaseComponents/Block';
import TextAutolinker from 'components/TextAutoLinker';

export default function ProfileAboutBiography({ about }: { about: string }) {
  return (
    <Block title="Bio">
      <TextAutolinker text={about} />
    </Block>
  );
}
