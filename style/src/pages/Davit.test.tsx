import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { Davit } from "./Davit";

test("Davit basic UI test", () => {
    render(
        <Provider store={store}>
            <Davit />
        </Provider>
    );

    screen.debug();
});
