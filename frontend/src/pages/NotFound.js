import { useNavigate } from 'react-router-dom';
import '../styling/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Oops! The page you are looking for does not exist.</p>
        <button className="not-found-home-button" onClick={handleClick}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;