import BaseRowLoading from './BaseRowLoading'

export function LoadingRow() {
  return (
    <>
    <div className="border-y border-skin-border bg-skin-block-bg text-base md:rounded-xl md:border">
      <BaseRowLoading>
      <div className="leading-5 sm:leading-6">
        <div className="block px-4 py-4">
          <div className="lazy-loading mb-2 rounded-md" style={{ width: '60%', height: '28px' }} />
          <div className="lazy-loading rounded-md" style={{ width: '50%', height: '28px' }} />
        </div>
        </div>
      </BaseRowLoading>
      </div>
    </>
  );
}

export function LoadingRow2(props){
  return (
    <div className={props.className || "loading opacity-60"}>
      <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} viewBox="0 0 50 50">
        <path
          className="text-skin-link"
          d="M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};
