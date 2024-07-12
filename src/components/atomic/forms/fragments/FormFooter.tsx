import React, { FunctionComponent } from "react";

interface FormFooterProps {

}

export const FormFooter: FunctionComponent<FormFooterProps> = (props) => {
    const {children} = props;

    return (
        <div className={"width-fluid flex content-space-around padding-vertical-medium"}>
            {children}
        </div>
    );
};
