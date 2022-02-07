import React, { FunctionComponent } from "react";

interface FormFooterProps {

}

export const FormFooter: FunctionComponent<FormFooterProps> = (props) => {
    const {children} = props;

    return (
        <div className={"formFooter"}>
            {children}
        </div>
    );
};
