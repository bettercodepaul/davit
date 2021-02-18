import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { EditActions } from "../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../slices/GlobalSlice";
import { DavitDeleteButton } from "../../../../../common/fragments/buttons/DavitDeleteButton";
import { DavitDownloadButton } from "../../../../../common/fragments/buttons/DavitDownloadButton";
import { DavitUploadButton } from "../../../../../common/fragments/buttons/DavitUploadButton";
import { OptionField } from "../../edit/common/OptionField";

export interface ControllPanelFileOptionsProps {
    showDownloadFile: () => void;
}

export const ControllPanelFileOptions: FunctionComponent<ControllPanelFileOptionsProps> = (props) => {
    const { showDownloadFile } = props;
    const { deleteLocalStorage } = useFileOptionModelView();

    return (
        <div className="optionFieldSpacer">
            <OptionField label="file">
                <DavitUploadButton />
                <DavitDownloadButton onClick={showDownloadFile} />
                <DavitDeleteButton onClick={deleteLocalStorage} />
            </OptionField>
        </div>
    );
};

const useFileOptionModelView = () => {
    const dispatch = useDispatch();

    const deleteLocalStorage = () => {
        dispatch(EditActions.setMode.view());
        dispatch(GlobalActions.createNewProject());
    };

    return {
        deleteLocalStorage,
    };
};
