import React, { FunctionComponent } from "react";

interface FormHeaderProps {
}

export const FormHeader: FunctionComponent<FormHeaderProps> = (props) => {
    const {children} = props;

    return (
        <div className={"formHeader"}>
            {children}
        </div>
    );
};
