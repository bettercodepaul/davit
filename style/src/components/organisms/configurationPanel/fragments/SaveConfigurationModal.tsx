import React, { FunctionComponent, useEffect, useState } from "react";
import { DavitButton, DavitModal, DavitTextInput, Form } from "../../../atomic";
import { FormBody } from "../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../atomic/forms/fragments/FormHeader";

interface SaveConfigurationModalProps {
    onSaveCallback: (name: string) => void;
    onCloseCallback: () => void;
    name: string;
}

export const SaveConfigurationModal: FunctionComponent<SaveConfigurationModalProps> = (props) => {
    const {name, onSaveCallback, onCloseCallback} = props;

    const [editName, setEditName] = useState<string>("");

    useEffect(() => {
        setEditName(name);
    }, [name]);

    return (
        <DavitModal>
            <Form>
                <FormHeader>
                    <h2>Save Configuration</h2>
                </FormHeader>

                <FormBody>
                    <DavitTextInput onChangeCallback={setEditName}
                                    focus
                                    value={editName}
                    />
                </FormBody>

                <FormFooter>
                    <DavitButton onClick={onCloseCallback}>Cancel</DavitButton>
                    <DavitButton onClick={() => {
                        onSaveCallback(editName);
                        onCloseCallback();
                    }}
                    >Save</DavitButton>
                </FormFooter>
            </Form>
        </DavitModal>
    );
};

