import React, { FunctionComponent } from "react";
import "./DavitButton.css";
import {ElementSize} from '../../../ElementSize.ts';

export interface DavitButtonProps {
    onClick: () => void;
    disabled?: boolean;
    size?: ElementSize;
    className?: string;
    active?: boolean;
    label?: string;
    children?: React.ReactNode;
}

export const DavitButton: FunctionComponent<DavitButtonProps> = (props) => {
    const {onClick, size = ElementSize.medium, className, children, disabled, active, label} = props;

    return (
        <button onClick={onClick}
                className={ElementSize[size] + " " + className + " " + (active ? "activeButton" : "")}
                disabled={disabled}
        >
            {label}
            {children}
        </button>
    );
};
