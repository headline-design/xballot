function BackButton({ handleBack }) {
  return (
    <>
      <button
        onClick={handleBack}
        className="absolute left-3 top-[20px] flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link hover:text-skin-link"
      >
        <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    width="1em"
    height="1em"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
      </button>
    </>
  );
}

export default BackButton;
