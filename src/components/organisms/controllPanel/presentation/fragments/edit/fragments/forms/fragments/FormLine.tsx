import React, { FunctionComponent } from "react";

export enum FormLinePosition {
    start = "start",
    center = "center",
    end = "end"
}

export interface FormLineProps {
    position?: FormLinePosition;
}

export const FormLine: FunctionComponent<FormLineProps> = (props) => {
    const {children, position} = props;

    return (
        <div className={"flex flex-" + (position ? position : FormLinePosition.center) + " padding-horizontal-medium padding-vertical-tiny width-fluid"}>
            {children}
        </div>
    );
};
