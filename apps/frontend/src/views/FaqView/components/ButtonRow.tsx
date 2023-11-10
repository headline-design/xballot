import { Link } from 'react-router-dom';

export function ButtonRow({ label, link }) {
  return (
    <>
      <div className="mb-4 flex items-center">
        <hr className="w-[50px] border-skin-border" />
        <Link to={link} className="">
          <button
            type="button"
            className="button group min-w-[120px] origin-left scale-110 px-[22px] hover:!bg-opacity-5 "
            data-v-4a6956ba=""
          >
            {label}
          </button>
        </Link>
      </div>
    </>
  );
}
