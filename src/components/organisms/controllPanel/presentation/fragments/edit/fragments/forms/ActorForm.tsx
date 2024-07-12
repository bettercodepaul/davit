import React, { FunctionComponent, useState } from "react";
import { DavitBackButton } from "../../../../../../../atomic/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../../atomic/buttons/DavitButton";
import { DavitDeleteButton } from "../../../../../../../atomic/buttons/DavitDeleteButton";
import { Form } from "../../../../../../../atomic/forms/Form";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitTextInput } from "../../../../../../../atomic/textinput/DavitTextInput";
import { DavitCommentButton } from "../../../../../../../molecules";
import { useActorViewModel } from "../viewmodels/ActorViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLine } from "./fragments/FormLine";

interface ActorFormProps {
}

export const ActorForm: FunctionComponent<ActorFormProps> = () => {

    const [key, setKey] = useState<number>(0);

    const {
        changeName,
        updateActor,
        deleteActor,
        saveNote,
        createAnother,
        saveActor,
        name,
        note,
    } = useActorViewModel();

    return (
        <Form key={key}>
            <FormHeader>
                <h2>Actor</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <FormLine>
                    <DavitTextInput
                        label="Name:"
                        placeholder="Actor Name"
                        onChangeCallback={(name: string) => changeName(name)}
                        onBlur={updateActor}
                        value={name}
                        focus
                    />
                </FormLine>

            </FormBody>

            <FormDivider />

            <FormFooter>
                <DavitDeleteButton onClick={deleteActor} />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitButton onClick={() => {
                    createAnother();
                    setKey(key + 1);
                }}
                >
                    {"Create another"}
                </DavitButton>
                <DavitBackButton onClick={saveActor} />
            </FormFooter>


        </Form>
    );
};
