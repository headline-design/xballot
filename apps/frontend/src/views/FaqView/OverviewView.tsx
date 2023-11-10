import { Link } from 'react-router-dom';
import { getEndpoints, staticEndpoints } from 'utils/endPoints';

function OverviewView() {
  const endPoints = getEndpoints();
  return (
    <div>
      <h1 className="relative ml-[50px] mt-[100px] font-space text-[40px] font-bold leading-[3rem]  md:mt-[135px]">
        <div className="absolute top-[22px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
        Reach consensus
        <br />
        on Algorand{' '}
      </h1>
      <p className="mt-4 mb-[50px] pl-[50px] text-gray-300 !text-skin-text sm:w-[501px]">
        XBallot is the ultimate decentralized governance platform that offers a hassle-free and
        cost-effective solution for organizations to vote on proposals. Choose from our versatile
        voting options and create a voting process that fits your specific needs.
      </p>
      <div className="flex items-center">
        <hr className="w-[50px] border-skin-border" />
        <Link to="/" className="">
          <button
            type="button"
            className="button group min-w-[120px] origin-left scale-110 px-[22px] hover:!bg-opacity-5 "
            data-v-4a6956ba=""
          >
            Discover
          </button>
        </Link>
      </div>
      <h2 className="relative mt-[96px] ml-[50px] font-space text-lg font-bold tracking-wide ">
        <div className="absolute top-[12px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />
        Experience Effortless Governance
      </h2>
      <p className="mt-4 mb-[50px] pl-[50px] text-gray-300 !text-skin-text sm:w-[500px]">
        Elevate your Web3 governance with XBallot's user-friendly platform. Say goodbye to
        complicated processes and hello to a simplified solution for your community or
        organization's governance needs.
      </p>
      <div className="mb-4 flex items-center">
        <hr className="w-[50px] border-skin-border" />
        <Link to="/setup/step=0" className="">
          <button
            type="button"
            className="button group min-w-[120px] origin-left scale-110 px-[22px] hover:!bg-opacity-5 "
            data-v-4a6956ba=""
          >
            {' '}
            Create a space{' '}
          </button>
        </Link>
      </div>
      <div className="flex items-center">
        <hr className="w-[50px] border-skin-border" />
        <a
          href={endPoints.xballotUrl}
          target="_blank"
          className="whitespace-nowrap"
          rel="noopener noreferrer"
        >
          <button
            type="button"
            className="button group min-w-[120px] origin-left scale-110 px-[22px] hover:!bg-opacity-5 "
            data-v-4a6956ba=""
          >
            Try the demo
          </button>
          {/*v-if*/}
        </a>
      </div>
      <h2 className="relative mt-[96px] ml-[50px] font-space text-lg font-bold tracking-wide ">
        <div className="absolute top-[12px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
        Read{' '}
      </h2>
      <p className="mt-4 mb-[50px] pl-[50px] text-gray-300 !text-skin-text"> Coming soon!</p>
      <h2 className="relative mt-[96px] ml-[50px] font-space text-lg font-bold tracking-wide ">
        <div className="absolute top-[12px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
        Explore{' '}
      </h2>

      <p className="mt-4 mb-[50px] pl-[50px] text-gray-300 !text-skin-text">
        {' '}
        Knowledge base{' '}
        <a
          href={staticEndpoints.xBallotDocs}
          target="_blank"
          className="text-xballot whitespace-nowrap"
          rel="noopener noreferrer"
        >
          {' '}
          Gitbook {/*v-if*/}
        </a>
        <br /> FAQ{' '}
        <a
          href="https://discord.gg/bQuh8QSx6V"
          target="_blank"
          className="text-xballot whitespace-nowrap"
          rel="noopener noreferrer"
        >
          {' '}
          GitHub Discussions {/*v-if*/}
        </a>
        <br /> Source{' '}
        <a
          href={staticEndpoints.headlineGithub}
          target="_blank"
          className="text-xballot whitespace-nowrap"
          rel="noopener noreferrer"
        >
          {' '}
          GitHub {/*v-if*/}
        </a>
      </p>
      <h2 className="relative mt-[96px] ml-[50px] font-space text-lg font-bold tracking-wide ">
        <div className="absolute top-[12px] -left-[50px] -ml-[5px] h-2 w-2 rounded-full text-skin-bg" />{' '}
        Newsletter{' '}
      </h2>
      <div className="mt-4 mb-[50px] pl-[50px]">
        <div className="mb-2">Get the latest XBallot updates</div>
        <form
          action="https://xballot.us17.list-manage.com"
          method="post"
          target="_blank"
          autoComplete="off"
          className="relative flex w-[300px]"
        >
          <input type="hidden" name="tags" defaultValue={6449077} />
          <div className="w-full">
            {/*v-if*/}
            <div className="group relative z-10">
              {/*v-if*/}
              <input
                name="EMAIL"
                required={true}
                className="s-input !h-[42px] !pr-[66px]"
                type="email"
                placeholder="Your email"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  type="submit"
                  name="subscribe"
                  className="absolute right-0 h-[42px] rounded-r-full px-3"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="1.2em"
                    height="1.2em"
                    className="rotate-90 text-skin-link"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m12 19l9 2l-9-18l-9 18l9-2Zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="s-error -mt-[40px] h-6 opacity-0">{/*v-if*/} </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OverviewView;
