import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux';
import {store} from './store.ts';
import {Davit} from './pages/Davit.tsx';
import "./style/index.css";
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <Davit/>
        </Provider>,
    </React.StrictMode>,
)

