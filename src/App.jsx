import {useEffect} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import Footer from './components/Footer/Footer';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import Detail from './pages/Detail';
import './App.css';

function ScrollToTop() {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className='App'>
      <ScrollToTop />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/pokemon/:id'
          element={<Detail />}
        />
        <Route
          path='*'
          element={<NotFound />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
