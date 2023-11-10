import { useNavigate } from 'react-router-dom';

export const BackButton = ({link = '..'}) => {
  const navigate = useNavigate();


  const goBack = () => {
    navigate(link);
  };

  return (
    <button type="button" onClick={() => goBack()}>
     <div className="inline-flex items-center gap-1 text-skin-text hover:text-skin-link">
    <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m11 17l-5-5m0 0l5-5m-5 5h12"
      />
    </svg>{" "}
    Back
  </div>
    </button>
  );
};
