import React, { FunctionComponent } from "react";
import "./DavitOnOffButton.css.css";

interface DavitOnOffButtonProps {
    toggle: () => void;
    on: boolean;
}

export const DavitOnOffButton: FunctionComponent<DavitOnOffButtonProps> = (props) => {
    const {toggle, on} = props;

    return (
        <label className="switch">
            <input type="checkbox"
                   onChange={toggle}
                   checked={on}
            />
            <span className="slider round"/>
        </label>
    );
};
