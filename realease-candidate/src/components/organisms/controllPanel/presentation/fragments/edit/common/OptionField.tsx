import React, { FunctionComponent } from "react";

export interface OptionFieldProps {
    label?: string;
    divider?: boolean;
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
