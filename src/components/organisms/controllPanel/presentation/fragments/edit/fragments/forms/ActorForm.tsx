import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { DavitBackButton } from "../../../../../../../atomic";
import { DavitButton } from "../../../../../../../atomic";
import { DavitDeleteButton } from "../../../../../../../atomic";
import { Form } from "../../../../../../../atomic";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitTextInput } from "../../../../../../../atomic";
import { DavitCommentButton } from "../../../../../../../molecules";
import { useActorViewModel } from "../viewmodels/ActorViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLine } from "./fragments/FormLine";

interface ActorFormProps {
}

export const ActorForm: FunctionComponent<ActorFormProps> = () => {
    const {t} = useTranslation();
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
                <h2>{t("ACTOR.EDIT_FORM.HEADER")}</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <FormLine>
                    <DavitTextInput
                        label={t("ACTOR.EDIT_FORM.NAME_INPUT.LABEL") || undefined}
                        placeholder={t("ACTOR.EDIT_FORM.NAME_INPUT.PLACEHOLDER")  || undefined}
                        onChangeCallback={(name: string) => changeName(name)}
                        onBlur={updateActor}
                        value={name}
                        focus
                        dataTestId="hb6LI"
                    />
                </FormLine>

            </FormBody>

            <FormDivider />

            <FormFooter>
                <DavitDeleteButton onClick={deleteActor} dataTestId="zOj3e" />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                                    dataTestId="1vYjs"
                />
                <DavitButton dataTestId="Gdobj" onClick={() => {
                    createAnother();
                    setKey(key + 1);
                }}
                >
                    {t("ACTOR.EDIT_FORM.CREATE_BUTTON")}
                </DavitButton>
                <DavitBackButton onClick={saveActor} dataTestId="FSfCd" />
            </FormFooter>


        </Form>
    );
};
