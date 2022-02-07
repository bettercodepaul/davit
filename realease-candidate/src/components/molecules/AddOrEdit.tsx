import React, { FunctionComponent } from "react";
import { DavitAddButton } from "../atomic/buttons/DavitAddButton";

interface AddOrEditProps {
    addCallBack: () => void;
    dropDown: JSX.Element;
}

export const AddOrEdit: FunctionComponent<AddOrEditProps> = (props) => {
    const {addCallBack, dropDown} = props;

    return (
        <div className="flex">
            <DavitAddButton onClick={() => addCallBack()} />
            {dropDown}
        </div>
    );
};
