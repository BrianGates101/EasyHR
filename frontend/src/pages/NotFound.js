import { useNavigate } from 'react-router-dom';
import '../styling/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleClick = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
      <div className={"not-found-page"}>
          <div className="not-found-header-content">
            <h1>Error 404 <br/> Page Not Found</h1>
          </div>
          <button className="not-found-home-button" onClick={handleClick}>Home Page</button>
      </div>
  );
}

export default NotFound;