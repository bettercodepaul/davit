import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux';
import {store} from './store.ts';
import {Theme} from './style/Theme.tsx';
import {Davit} from './pages/Davit.tsx';
import "./style/index.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Provider store={store}>
          <Theme>
              <Davit />
          </Theme>
      </Provider>,
  </React.StrictMode>,
)

