import React, { FunctionComponent } from "react";
import {DavitAddButton} from '../atomic/buttons';
import {ElementSize} from '../../ElementSize.ts';

interface AddOrEditProps {
    addCallBack: () => void;
    dropDown: React.JSX.Element[] | React.JSX.Element;
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
