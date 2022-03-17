import React, { CSSProperties, FunctionComponent } from "react";

interface FormBodyProps {
    style?: CSSProperties
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
