import React, { FunctionComponent } from "react";

interface ControlPanelProps {
}

export const ControlPanel: FunctionComponent<ControlPanelProps> = (props) => {
    const {children} = props;

    return (
        <div className={"flex content-space-around align-center height-fluid"}>{children}</div>
    );
};
