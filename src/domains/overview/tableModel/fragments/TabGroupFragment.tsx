import React, { FunctionComponent } from "react";
import "./TabGroupFragment.css";

interface TabGroupFragmentProps {
    label: string;
    style?: NonNullable<unknown>;
    children: React.JSX.Element[];
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
