import React, { FunctionComponent, useState } from "react";
import { Direction } from "../../../../../../../../dataAccess/access/to/DataRelationTO";
import { DavitBackButton } from "../../../../../../../atomic/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../../atomic/buttons/DavitButton";
import { DavitDeleteButton } from "../../../../../../../atomic/buttons/DavitDeleteButton";
import { DavitDropDown } from "../../../../../../../atomic/dropdowns/DavitDropDown";
import { Form } from "../../../../../../../atomic/forms/Form";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitCommentButton } from "../../../../../../../molecules";
import { useDataRelationViewModel } from "../viewmodels/DataRelationViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLabel, FormlabelAlign } from "./fragments/FormLabel";
import { FormLine } from "./fragments/FormLine";

interface DataRelationFormProps {

}

export const DataRelationForm: FunctionComponent<DataRelationFormProps> = () => {

    const [key, setKey] = useState<number>(0);

    const {
        data1,
        data2,
        direction1,
        direction2,
        setDirection,
        setData,
        saveRelation,
        deleteRelation,
        dataOptions,
        directionOptions,
        createAnother,
        updateRelation,
        note,
        saveNote,
    } = useDataRelationViewModel();

    return (
        <Form key={key}>
            <FormHeader>
                <h2>Data Relation</h2>
            </FormHeader>


            <FormBody>
                <FormDivider />

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>FROM</FormLabel>
                </FormLine>

                <FormLine>
                    <DavitDropDown
                        placeholder="Select Data..."
                        dropdownItems={dataOptions}
                        onSelect={(data) => {
                            setData(Number(data.value));
                            updateRelation();
                        }}
                        value={data1}
                    />
                    <DavitDropDown
                        placeholder="Select Direction1"
                        dropdownItems={directionOptions}
                        onSelect={(data) => {
                            setDirection(Direction[data.value as Direction]);
                            updateRelation();
                        }}
                        value={direction1}
                    />
                </FormLine>

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>TO</FormLabel>
                </FormLine>
                <FormLine>
                    <DavitDropDown
                        placeholder="Select Data..."
                        dropdownItems={dataOptions}
                        onSelect={(data) => {
                            setData(Number(data.value), true);
                            updateRelation();
                        }}
                        value={data2}
                    />
                    <DavitDropDown
                        placeholder="Select Direction2"
                        dropdownItems={directionOptions}
                        onSelect={(data) => {
                            setDirection(Direction[data.value as Direction], true);
                            updateRelation();
                        }}
                        value={direction2}
                    />
                </FormLine>
                <FormDivider />

            </FormBody>


            <FormFooter>
                <DavitDeleteButton onClick={deleteRelation} />
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
                <DavitBackButton onClick={saveRelation} />
            </FormFooter>

        </Form>
    );
};
