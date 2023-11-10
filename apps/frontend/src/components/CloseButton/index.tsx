export function CloseButton() {
  return (
    <button className="absolute top-2 flex items-center rounded-full p-[6px] text-md text-skin-text transition-colors duration-200 hover:text-skin-link absolute right-2 top-[20px]">
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
