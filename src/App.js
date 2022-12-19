import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/authentication/Auth';
import Interface from './components/interface/Interface';
import NoPage from './components/NoPage';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

/*
  If the user IS NOT logged in, they will be redirected to the
  AUTHENTICATION page on either route.
  
  If the user IS logged in, they will be
  redirected to the INTERFACE page on either route.
*/

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              cookies.get('TOKEN') ? <Navigate to={'interface'} /> : <Auth />
            } 
          />
          <Route
            path={'interface'}
            element={
              cookies.get('TOKEN') ? <Interface /> : <Navigate to={'/'} />
            }
          />
          <Route path={'*'} element={<NoPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
