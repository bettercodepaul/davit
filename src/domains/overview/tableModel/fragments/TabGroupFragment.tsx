import React, { FunctionComponent } from "react";
import "./TabGroupFragment.css";

interface TabGroupFragmentProps {
    label: string;
    style?: Object;
}

export const TabGroupFragment: FunctionComponent<TabGroupFragmentProps> = (props) => {
    const {label, children, style} = props;
    return (
        <div className="tab-group"
             style={style}
        >
            <div className="tab-aggregator">{label}</div>
            <div className="flex">{children}</div>
        </div>
    );
};
