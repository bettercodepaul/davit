import React, { FunctionComponent } from "react";
import "./TabFragment.css";

interface TabFragmentProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const TabFragment: FunctionComponent<TabFragmentProps> = (props) => {
    const {label, isActive, onClick} = props;
    return (
        <div className={"no-user-select " + (isActive ? "tab activeTabFragment" : "tab")}
             onClick={onClick}
        >
            {label}
        </div>
    );
};
