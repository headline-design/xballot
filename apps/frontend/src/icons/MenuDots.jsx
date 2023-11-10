export const MenuDots = (props) => (
    <svg viewBox="0 0 24 24" width={props.width || "1.2em"} height={props.height || "1.2em"} className={props.className || "text-sm"}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"
      />
    </svg>
  )
  