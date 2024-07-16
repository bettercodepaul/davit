import React, { CSSProperties, FunctionComponent } from "react";

interface FormBodyProps {
    style?: CSSProperties
    children?: React.JSX.Element[] | React.JSX.Element;
}

export const FormBody: FunctionComponent<FormBodyProps> = (props) => {
    const {children, style} = props;

    return (
        <div className="flex-column flex-center"
             style={style}
        >
            {children}
        </div>
    );
};
