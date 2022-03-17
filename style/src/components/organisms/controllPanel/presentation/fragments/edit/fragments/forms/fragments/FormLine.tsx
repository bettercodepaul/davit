import React, { FunctionComponent } from "react";

export interface FormLineProps {
}

export const FormLine: FunctionComponent<FormLineProps> = (props) => {
    const {children} = props;

    return (
        <div className={"formLine"}>
            {children}
        </div>
    );
};
