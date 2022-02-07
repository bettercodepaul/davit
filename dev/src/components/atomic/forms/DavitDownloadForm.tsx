import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { GlobalActions } from "../../../slices/GlobalSlice";
import { useEnterHook, useEscHook } from "../../../utils/WindowUtil";
import { DavitTextInput } from "../textinput/DavitTextInput";
import { FormFooter } from "./fragments/FormFooter";
import { FormHeader } from "./fragments/FormHeader";

interface DavitDownloadFormProps {
    onCloseCallback: () => void;
}

export const DavitDownloadForm: FunctionComponent<DavitDownloadFormProps> = (props) => {
    const {onCloseCallback} = props;
    const dispatch = useDispatch();
    const [projectName, setProjectName] = useState<string>("");

    const onSubmit = () => {
        dispatch(GlobalActions.downloadData(projectName !== "" ? projectName : "project"));
        onCloseCallback();
    };

    // Close the form on ESC push.
    useEscHook(onCloseCallback);
    // Close and Submit on Enter
    useEnterHook(onSubmit);

    return (
        <div className="downloadForm">
            <FormHeader>
                <DavitTextInput
                    label="File name:"
                    placeholder="project name..."
                    onChangeCallback={(name: string) => setProjectName(name)}
                    value={projectName}
                />
            </FormHeader>
            <FormFooter>
                <button onClick={() => onCloseCallback()}>cancel</button>
                <button onClick={() => onSubmit()}>download</button>
            </FormFooter>
        </div>
    );
};
