import { Link } from 'react-router-dom';

function OopsProposalRow({spaceKey}) {
  return (
    <div className="mb-3 mt-2 text-center">
      <div className="border-y border-skin-border bg-skin-block-bg pt-1 text-base md:rounded-xl md:border">
        <div className="p-4 leading-5 sm:leading-6">
          <div className="mb-3">Oops, we can't find this proposal</div>
          <Link
              to={{
                pathname: `/${spaceKey}`,
              }}>
              <button type="button" className="button px-[22px]" data-v-4a6956ba="">
              Return home
            </button>
              </Link>
        </div>
      </div>
    </div>
  );
}

export default OopsProposalRow;
