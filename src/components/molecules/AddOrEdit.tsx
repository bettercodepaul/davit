import React, { FunctionComponent } from "react";
import { ElementSize } from "../../style/Theme";
import { DavitAddButton } from "../atomic";

interface AddOrEditProps {
    addCallBack: () => void;
    dropDown: JSX.Element;
}

export const AddOrEdit: FunctionComponent<AddOrEditProps> = (props) => {
    const {addCallBack, dropDown} = props;

    return (
        <div className="flex">
            <DavitAddButton onClick={() => addCallBack()}
                            size={ElementSize.medium}
            />
            {dropDown}
        </div>
    );
};
