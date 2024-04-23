import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Header from './components/Header/Header';
import './App.css';
import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <main className='App fondo'>
      <Header />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/pokemon/:id'
          element={<Detail />}
        />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
