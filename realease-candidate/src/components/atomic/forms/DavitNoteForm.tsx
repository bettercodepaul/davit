import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useEnterHook, useEscHook } from "../../../utils/WindowUtil";
import { FormDivider } from "../../organisms/controllPanel/presentation/fragments/edit/fragments/forms/fragments/FormDivider";
import { FormLine } from "../../organisms/controllPanel/presentation/fragments/edit/fragments/forms/fragments/FormLine";
import { FormBody } from "./fragments/FormBody";
import { FormFooter } from "./fragments/FormFooter";
import { FormHeader } from "./fragments/FormHeader";

interface DavitNoteFormProps {
    subHeader?: string;
    text?: string;
    onSubmit: (nodeText: string) => void;
    onCancel: () => void;
}

export const DavitNoteForm: FunctionComponent<DavitNoteFormProps> = (props) => {
    const {subHeader, onCancel, onSubmit, text} = props;
    const textAreRef = useRef<HTMLTextAreaElement>(null);
    const [noteText, setNoteText] = useState<string>("");

    useEffect(() => {
        setNoteText(text ? text : "");
        textAreRef.current!.focus();
    }, [text]);

    // Close the form on ESC push.
    useEscHook(onCancel);

    // Close and Submit on Enter
    useEnterHook(() => onSubmit(noteText));

    return (
        <div className="noteForm">
            <FormHeader>
                <h1>Note</h1>
            </FormHeader>

            <FormDivider />

            {subHeader && <FormLine><h2>{subHeader}</h2></FormLine>}

            <FormBody>
                <textarea
                    className={"noteTextarea border"}
                    onChange={(e) => setNoteText(e.target.value)}
                    value={noteText}
                    ref={textAreRef}
                />
            </FormBody>

            <FormDivider />

            <FormFooter>
                <button onClick={() => onCancel()}>cancel</button>
                <button onClick={() => onSubmit(noteText)}>save</button>
            </FormFooter>
        </div>
    );
};
