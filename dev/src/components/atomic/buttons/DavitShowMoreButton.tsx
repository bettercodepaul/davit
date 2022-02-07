import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import React, { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { DavitButton } from "./DavitButton";

interface DavitMoreButtonProps {
    onClick: () => void;
    style?: CSSProperties;
    show?: boolean
    className?: string
}

export const DavitShowMoreButton: FunctionComponent<DavitMoreButtonProps> = (props) => {
    const {onClick, style, show, className} = props;

    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        if (show !== undefined) {
            setShowMore(show);
        }
    }, [show]);

    return <DavitButton onClick={() => {
        onClick();
        setShowMore(!showMore);
    }}
                        className={className ? className : undefined}
                        iconName={showMore ? faAngleDown : faAngleRight}
                        style={style}
    />;
};
