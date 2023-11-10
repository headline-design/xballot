import { Link } from 'react-router-dom';
import { useCurrentPosition } from './order';

/**
 * Needs to be rendered inside of a Formik component.
 */
export default function PrevNextLinks({ isValid, domain }) {
  const { isFirst, isLast, previousSlug, nextSlug } = useCurrentPosition();

  function removeFormData() {
    localStorage.removeItem('settingsTicket');
    localStorage.removeItem('controllerTicket');
    localStorage.removeItem('regStatus');
    localStorage.removeItem('currentXApp');
    localStorage.removeItem('currentXDomain');
  }

  return (
    <div>
      {/* button links to the previous step, if exists */}
      {isFirst || (
        <Link to={`/setup/${previousSlug}`}>
          <button className="button mt-4 px-[22px]" data-v-4a6956ba="">
            Previous
          </button>
        </Link>
      )}
      {/* button to next step -- submit action on the form handles the action */}
      {isLast ? (
        <Link to={`/${domain}`}>
          <button
            onClick={removeFormData}
            className="button button--primary float-right mt-4 px-[22px] hover:brightness-95"
            data-v-4a6956ba=""
            type="button"
            disabled={!isValid}
          >
            Submit
          </button>
        </Link>
      ) : (
        <Link to={`/setup/${nextSlug}`}>
          <button
            className="button button--primary float-right mt-4 px-[22px] hover:brightness-95"
            data-v-4a6956ba=""
            type="button"
            disabled={!isValid}
          >
            Next
          </button>
        </Link>
      )}
    </div>
  );
}
