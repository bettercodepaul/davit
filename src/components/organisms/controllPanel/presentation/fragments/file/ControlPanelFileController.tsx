import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons/faCloudUploadAlt";
import React, { createRef, FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { EditActions } from "../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../slices/GlobalSlice";
import { useAppDispatch } from "../../../../../../store";
import { DavitDeleteButton, DavitDownloadModal, DavitIconButton } from "../../../../../atomic";
import { ControlPanel } from "../edit/common/ControlPanel";
import { OptionField } from "../edit/common/OptionField";

export interface ControlPanelFileControllerProps {
}

export const ControlPanelFileController: FunctionComponent<ControlPanelFileControllerProps> = () => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const inputFileRef = createRef<HTMLInputElement>();

    const openFileBrowser = () => {
        if (inputFileRef !== null && inputFileRef.current !== null) {
            inputFileRef.current.click();
        }
    };

    const readFileToString = (file: File | null) => {
        const fileReader = new FileReader();
        if (file !== null) {
            fileReader.readAsText(file);
            fileReader.onload = (event) => {
                dispatch(GlobalActions.storefileData(event.target!.result as string));
            };
        }
    };

    const dispatch = useAppDispatch();

    const deleteLocalStorage = () => {
        dispatch(EditActions.setMode.view());
        dispatch(GlobalActions.createNewProject());
    };

    return (
        <ControlPanel>
            <OptionField label="Upload">
                <div>
                    <DavitIconButton iconName={faCloudUploadAlt}
                                     onClick={openFileBrowser}
                    />
                    <input
                        hidden={true}
                        ref={inputFileRef}
                        type="file"
                        onChange={(event) => {
                            if (event.target.files !== null) {
                                readFileToString(event.target.files[0]);
                            }
                        }}
                    />
                </div>
            </OptionField>
            <OptionField label="Download">
                <DavitIconButton onClick={() => setShowForm(true)}
                                 iconName={faDownload}
                />
                {showForm && <DavitDownloadModal closeCallback={() => setShowForm(false)} />}
            </OptionField>
            <OptionField label="Clear">
                <DavitDeleteButton onClick={deleteLocalStorage} />
            </OptionField>
        </ControlPanel>
    );
};
