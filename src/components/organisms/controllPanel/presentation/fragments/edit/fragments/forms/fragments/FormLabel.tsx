import React, { FunctionComponent } from "react";

export enum FormlabelAlign {
    start = "flex-start",
    center = "center",
    end = "flex-end"
}

interface FormLabelProps {
    className?: string
    align?: FormlabelAlign
    children?: string | React.JSX.Element;
}

export const FormLabel: FunctionComponent<FormLabelProps> = (props) => {
    const {className, align, children} = props;

    return (
        <label className={className ? className : "flex flex-start"}
               style={{justifyContent: align ? align : undefined}}
        >{children}</label>
    );
};
