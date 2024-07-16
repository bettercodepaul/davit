import React, { FunctionComponent } from "react";
import "./OptionField.css";

export interface OptionFieldProps {
    label?: string;
    divider?: boolean;
    children?: React.JSX.Element[] | React.JSX.Element;
}

export const OptionField: FunctionComponent<OptionFieldProps> = (props) => {
    const {label, children, divider} = props;

    return (
        <div className={"optionField" + (divider ? " columnDivider" : "")}>
            <div className={"optionFieldChildArea"}>{children}</div>
            {label?.toUpperCase()}
        </div>
    );
};
