import React, { FunctionComponent } from "react";
import "./ViewPlaceholder.css";

interface ViewPlaceholderProps {
    text: string
}

export const ViewPlaceholder: FunctionComponent<ViewPlaceholderProps> = (props) => {
    const {text} = props;

    return (
        <div className="viewPlaceholder">
            <h2>{text}</h2>
        </div>
    );
};
