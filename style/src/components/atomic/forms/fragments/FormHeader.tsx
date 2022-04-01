import React, { FunctionComponent } from "react";

interface FormHeaderProps {
}

export const FormHeader: FunctionComponent<FormHeaderProps> = (props) => {
    const {children} = props;

    return (
        <div className={"flex content-space-around padding-vertical-medium width-fluid"}>
            {children}
        </div>
    );
};
