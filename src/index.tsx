import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Davit } from "./pages/Davit";
import * as serviceWorker from "./serviceWorker";
import { store } from "./store";
import "./style/index.css";
import { Theme } from "./style/Theme";


const container = document.getElementById('root');
const root = createRoot(container ?? new HTMLElement()); // createRoot(container!) if you use TypeScript
root.render(
    <Provider store={store}>
        <Theme>
            <Davit />
        </Theme>
    </Provider>,
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
