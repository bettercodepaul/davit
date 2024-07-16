import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { FunctionComponent } from "react";
import {ElementSize} from '../../../ElementSize.ts';
import { DavitIconButton } from "./DavitIconButton";

interface DavitMoreButtonProps {
    onClick: (show: boolean) => void;
    show?: boolean;
    className?: string;
    size?: ElementSize;
}

export const DavitShowMoreButton: FunctionComponent<DavitMoreButtonProps> = (props) => {
    const {onClick, show, className, size} = props;

    return <DavitIconButton onClick={() => onClick(!show)}
                            size={size ? size : ElementSize.tiny}
                            iconName={show ? faAngleDown : faAngleRight}
                            className={className}
    />;
};
