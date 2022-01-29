import React, { FunctionComponent } from "react";
import { ElementSize } from "../../../style/Theme";
import "./DavitButton.css";

export interface DavitButtonProps {
    onClick: () => void;
    disabled?: boolean;
    size?: ElementSize;
    className?: string;
    active?: boolean;
}

export const DavitButton: FunctionComponent<DavitButtonProps> = (props) => {
    const {onClick, size = ElementSize.medium, className, children, disabled, active} = props;

    return (
        <button onClick={onClick}
                className={ElementSize[size] + " " + className + " " + (active ? "activeButton" : "")}
                disabled={disabled}
        >
            {children}
        </button>
    );
};
