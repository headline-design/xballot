import { Button } from 'components/BaseComponents/Button';
import { Link } from 'react-router-dom';

export const NoResults = () => (
  <>
    <div className="p-4 text-center">
      <div className="mb-3">Oops, you haven't joined any spaces yet</div>
      <Link to="/" className="">
        <Button
          data-v-4571bf26=""
          type="button"
          className="button button group !mb-0  h-[46px] min-w-[120px] rounded-[23px] border border-skin-border bg-transparent px-[22px] px-[22px] text-[18px] text-skin-link hover:border-skin-text "
        >
          Join spaces
        </Button>
      </Link>
    </div>
    <div className="relative">
      <div className="absolute h-[10px] w-[10px]" />
    </div>
    {/**/}
  </>
);
 