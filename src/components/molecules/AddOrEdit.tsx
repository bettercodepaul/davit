import React, { FunctionComponent } from "react";
import { ElementSize } from "../../style/Theme";
import { DavitAddButton } from "../atomic";

interface AddOrEditProps {
    addCallBack: () => void;
    dropDown: JSX.Element;
    dataTestId?:string;
}

export const AddOrEdit: FunctionComponent<AddOrEditProps> = (props) => {
    const {addCallBack, dropDown, dataTestId} = props;

    return (
        <div className="flex">
            <DavitAddButton dataTestId={dataTestId + "_G1qqp"} onClick={() => addCallBack()}
                            size={ElementSize.medium}
            />
            {dropDown}
        </div>
    );
};
