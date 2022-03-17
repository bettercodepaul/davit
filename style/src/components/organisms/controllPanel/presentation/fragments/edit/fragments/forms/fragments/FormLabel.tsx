import React, { FunctionComponent } from "react";

export enum FormlabelAlign {
    start = "flex-start",
    center = "center",
    end = "flex-end"
}

interface FormLabelProps {
    className?: string
    align?: FormlabelAlign
}

export const FormLabel: FunctionComponent<FormLabelProps> = (props) => {
    const {children, className, align} = props;

    return (
        <label className={className ? className : "formLabel"}
               style={{justifyContent: align ? align : undefined}}
        >{children}</label>
    );
};
