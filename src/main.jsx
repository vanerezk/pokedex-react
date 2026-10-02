import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {SWRConfig} from 'swr';
import App from './App.jsx';
import DexProgressProvider from './hooks/DexProgressProvider';
import {fetcher} from './api/pokeapi';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SWRConfig value={{fetcher, revalidateOnFocus: false, revalidateIfStale: false}}>
        <DexProgressProvider>
          <App />
        </DexProgressProvider>
      </SWRConfig>
    </BrowserRouter>
  </React.StrictMode>,
);
