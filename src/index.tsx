import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Davit } from "./pages/Davit";
import * as serviceWorker from "./serviceWorker";
import { store } from "./store";
import "./style/index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
 root.render(<Provider store={store}>
        <Davit />
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
