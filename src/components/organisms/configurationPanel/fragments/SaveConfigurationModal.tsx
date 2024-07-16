import { FunctionComponent, useEffect, useState } from "react";
import { FormBody } from "../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../atomic/forms/fragments/FormHeader";
import {DavitModal} from '../../../atomic/modals';
import {Form} from '../../../atomic/forms';
import {DavitTextInput} from '../../../atomic/textinput';
import {DavitButton} from '../../../atomic/buttons';

interface SaveConfigurationModalProps {
    onSaveCallback: (name: string) => void;
    onCloseCallback: () => void;
    name: string;
    type: string;
}

export const SaveConfigurationModal: FunctionComponent<SaveConfigurationModalProps> = (props) => {
    const {name, onSaveCallback, onCloseCallback, type} = props;

    const [editName, setEditName] = useState<string>("");

    useEffect(() => {
        setEditName(name);
    }, [name]);

    return (
        <DavitModal>
            <Form>
                <FormHeader>
                    <h2>Save {type} Configuration</h2>
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

