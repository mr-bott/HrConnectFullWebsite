// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import Cookie from 'js-cookie';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const token = Cookie.get('jwt_token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <Element {...rest} />;
};

export default ProtectedRoute;
