import React, { FunctionComponent, useState } from "react";
import { DataInstanceTO } from "../../../../../../../../dataAccess/access/to/DataInstanceTO";
import { DavitAddButton } from "../../../../../../../atomic/buttons/DavitAddButton";
import { DavitBackButton } from "../../../../../../../atomic/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../../atomic/buttons/DavitButton";
import { DavitDeleteButton } from "../../../../../../../atomic/buttons/DavitDeleteButton";
import { Form } from "../../../../../../../atomic/forms/Form";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitTextInput } from "../../../../../../../atomic/textinput/DavitTextInput";
import { DavitCommentButton } from "../../../../../../../molecules";
import { useDataViewModel } from "../viewmodels/DataViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLine } from "./fragments/FormLine";

interface DataFormProps {
}

export const DataForm: FunctionComponent<DataFormProps> = () => {

        const [key, setKey] = useState<number>(0);

        const {
            name,
            changeName,
            saveData,
            deleteData,
            updateData,
            createAnother,
            instances,
            note,
            saveNote,
            changeInstanceName,
            createInstance,
            deleteInstance
        } = useDataViewModel();

        const createInstanceRow = (instance: DataInstanceTO, index: number): JSX.Element => {
            return (<tr key={index}>
                    <td>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <DavitTextInput
                                onChangeCallback={(newName) => changeInstanceName(newName, index)}
                                value={instance.name}
                                onBlur={updateData}
                            />
                            {index !== 0 &&
                            <div>
                                <DavitDeleteButton onClick={() => deleteInstance(index)}
                                                   noConfirm
                                />
                            </div>
                            }
                        </div>
                    </td>
                </tr>
            );
        };

        return (
            <Form key={key}>

                <FormHeader>
                    <h2>Data</h2>
                </FormHeader>

                <FormDivider />

                <FormBody>


                    <FormLine>
                        <DavitTextInput
                            label="Name:"
                            placeholder="Data Name"
                            onChangeCallback={changeName}
                            value={name}
                            focus
                            onBlur={updateData}
                        />
                    </FormLine>


                    <FormDivider />

                    <FormLine>
                        <table className={"border"}
                               style={{width: "40em"}}
                        >
                            <thead>
                            <tr>
                                <td style={{textAlign: "center"}}>Instances</td>
                                <td className={"flex flex-end"}><DavitAddButton onClick={createInstance} /></td>
                            </tr>
                            </thead>
                            <tbody>
                            {instances.map(createInstanceRow)}
                            </tbody>
                        </table>
                    </FormLine>

                </FormBody>

                <FormDivider />

                <FormFooter>
                    <DavitDeleteButton onClick={deleteData} />
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
                    <DavitBackButton onClick={saveData} />
                </FormFooter>


            </Form>
        );
    }
;
