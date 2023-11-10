export const ExclamationCircle = ({className}) => (
    <svg
      viewBox="0 0 24 24"
      width="1.2em"
      height="1.2em"
      className={className || "float-left mr-1 text-sm"}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
      />
    </svg>
  )
