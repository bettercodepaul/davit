import React, { FunctionComponent } from "react";
import "./Form.css";

export interface FormProps {
}

export const Form: FunctionComponent<FormProps> = (props) => {
    const {children} = props;

    return (
        <div className={"form padding-vertical-small padding-horizontal-medium border border-small"}>
            {children}
        </div>
    );
};
