import { useNavigate } from 'react-router-dom'

export default function FeedButton({ name }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`?feed=${name}`)}>
      {name}
    </button>
  );
}
