import React, { FunctionComponent } from "react";
import { ElementSize } from "../../../style/Theme";
import "./DavitButton.css";

export interface DavitButtonProps {
    onClick: () => void;
    disabled?: boolean;
    size?: ElementSize;
    className?: string;
    active?: boolean;
    label?: string;
    dataTestId?: string;
}

export const DavitButton: FunctionComponent<DavitButtonProps> = (props) => {
    const {onClick, size = ElementSize.medium, className, children, disabled, active, label, dataTestId} = props;

    return (
        <button data-test-id={dataTestId} 
                onClick={onClick}
                className={ ElementSize[size] + " " + className + " " + (active ? "activeButton" : "")}
                disabled={disabled}
        >
            {label}
            {children}
        </button>
    );
};
