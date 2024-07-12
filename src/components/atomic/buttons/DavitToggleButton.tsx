import React, { FunctionComponent } from "react";
import "./DavitToggleButton.css";

interface DavitToggleButtonProps {
    toggle: () => void;
    value: boolean;
}

export const DavitToggleButton: FunctionComponent<DavitToggleButtonProps> = (props) => {
    const {toggle, value} = props;

    return (
        <label className="switch">
            <input type="checkbox"
                   onChange={toggle}
                   checked={value}
            />
            <span className="slider round"/>
        </label>
    );
};
