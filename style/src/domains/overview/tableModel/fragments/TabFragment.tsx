import React, { FunctionComponent } from "react";

interface TabFragmentProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export const TabFragment: FunctionComponent<TabFragmentProps> = (props) => {
    const {label, isActive, onClick} = props;
    return (
        <div className={isActive ? "tab active" : "tab"}
             onClick={onClick}
        >
            {label}
        </div>
    );
};
