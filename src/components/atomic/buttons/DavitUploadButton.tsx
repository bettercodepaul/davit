import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons/faCloudUploadAlt";
import React, { createRef, FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { GlobalActions } from "../../../slices/GlobalSlice";
import { useAppDispatch } from "../../../store";
import { DavitButton } from "./DavitButton";

export interface DavitFileInputProps {
}

export const DavitUploadButton: FunctionComponent<DavitFileInputProps> = () => {
    const dispatch = useAppDispatch();
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

    return (
        <div>
            <DavitButton iconName={faCloudUploadAlt}
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
    );
};
