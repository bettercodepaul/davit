import React, { FunctionComponent } from "react";
import "./FlowChartlabel.css";

interface FlowChartlabelProps {
    label: string;
    text: string;
}

export const FlowChartlabel: FunctionComponent<FlowChartlabelProps> = (props) => {
    const {text, label} = props;

    return (
        <div className="flowChartLabel">
            <span className="flowChartLabelLeft">
                <label>{label}</label>
            </span>
            <span className="flowChartLabelRight">
                <label>{text}</label>
            </span>
        </div>
    );
};
