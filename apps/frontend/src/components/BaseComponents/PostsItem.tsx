import { Link } from 'react-router-dom';
import { Block } from './Block';
import { ProfilePopover} from 'components/ProfilePopover/ProfilePopover';
import { useHasMounted } from '../../composables/useHasMounted';
import moment from 'moment'


export const PostsItem = ({
  content,
  txId,
  title,
  createdAt,
  creator,
profiles,
  voted,
}: {
  content: any;
  txId: any;
  creator: any;
  profiles: any;
  title: any;
  voted: any;
  createdAt: any;
}) => {
  const hasMounted = useHasMounted();
  const timeFromNow = moment().startOf('hour').fromNow();

  return (
    <Link className="block text-skin-text" reloadDocument={true} to={`post/${txId}`}>
      <Block className="hover:border-skin-text">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {hasMounted && (
                <ProfilePopover
                  creator={creator}
                  profiles={profiles} profile={undefined} hideAvatar={undefined}                />
              )}
            </div>
            {voted ? (
              <span className="State bg-green text-white" data-v-59df45fa="">
                Active
              </span>
            ) : (
              <span className="State bg-violet-600 text-white" data-v-59df45fa="">
                Closed
              </span>
            )}
          </div>
          <div className="relative mb-1 break-words pr-[80px] leading-7">
            <h3 className="inline pr-2">{title}</h3>
            <p className="mb-2 break-words text-md line-clamp-2">{content}</p>
          </div>
        </div>
        <div className="mt-3">  {moment.unix(createdAt).fromNow()}</div>


      </Block>
    </Link>
  );
};