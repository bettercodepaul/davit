import React, { FunctionComponent } from "react";
import { InitDataTO } from "../../../../../../../../dataAccess/access/to/InitDataTO";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import { DavitAddButton } from "../../../../../../../atomic/buttons/DavitAddButton";
import { DavitBackButton } from "../../../../../../../atomic/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../../atomic/buttons/DavitButton";
import { DavitCommentButton } from "../../../../../../../atomic/buttons/DavitCommentButton";
import { DavitDeleteButton } from "../../../../../../../atomic/buttons/DavitDeleteButton";
import { ActorDropDown } from "../../../../../../../atomic/dropdowns/ActorDropDown";
import { InstanceDropDown } from "../../../../../../../atomic/dropdowns/InstanceDropDown";
import { Form } from "../../../../../../../atomic/forms/Form";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitTextInput } from "../../../../../../../atomic/textinput/DavitTextInput";
import { useDataSetupViewModel } from "../viewmodels/DataSetupViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLine } from "./fragments/FormLine";

interface DataSetupFormProps {

}

export const DataSetupForm: FunctionComponent<DataSetupFormProps> = () => {

    const {
        name,
        changeName,
        saveDataSetup,
        deleteDataSetup,
        createAnother,
        updateDataSetup,
        createInitData,
        note,
        saveNote,
        initDatas,
        saveInitData,
        deleteInitData,
    } = useDataSetupViewModel();

    const buildActorDataTableRow = (initData: InitDataTO): JSX.Element => {
        let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

        return (
            <tr key={copyInitData.id}>
                <td>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <ActorDropDown
                            onSelect={(actor) => {
                                copyInitData.actorFk = actor ? actor.actor.id : -1;
                                saveInitData(copyInitData);
                            }}
                            placeholder={"Select Actor..."}
                            value={copyInitData.actorFk}
                        />
                        <InstanceDropDown
                            onSelect={(dataAndInstance) => {
                                if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                    copyInitData.dataFk = dataAndInstance!.dataFk;
                                    copyInitData.instanceFk = dataAndInstance!.instanceId;
                                    saveInitData(copyInitData);
                                }
                            }}
                            placeholder={"Select Data Instance..."}
                            value={JSON.stringify({
                                dataFk: copyInitData!.dataFk,
                                instanceId: copyInitData!.instanceFk,
                            })
                            }
                        />
                        {copyInitData.id !== -1 && <DavitDeleteButton onClick={() => {
                            deleteInitData(copyInitData);
                        }}
                                                                      noConfirm
                        />}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <Form>
            <FormHeader>
                <h2>Data Setup</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <FormLine>
                    <DavitTextInput
                        label="Name:"
                        placeholder="Data Setup Name ..."
                        onChangeCallback={(name: string) => changeName(name)}
                        value={name}
                        focus={true}
                        onBlur={updateDataSetup}
                    />
                </FormLine>

                <FormDivider />

                <FormLine>
                    <table className={"border"}
                           style={{width: "40em", minHeight: "30vh"}}
                    >
                        <thead>
                        <tr>
                            <td style={{textAlign: "center"}}>Actor</td>
                            <td style={{textAlign: "center"}}>Data Instance</td>
                            <td style={{textAlign: "end"}}><DavitAddButton onClick={createInitData} /></td>
                        </tr>
                        </thead>
                        <tbody style={{maxHeight: "40vh"}}>
                        {initDatas.map(buildActorDataTableRow)}
                        </tbody>
                    </table>
                </FormLine>
            </FormBody>

            <FormDivider />

            <FormFooter>
                <DavitDeleteButton onClick={deleteDataSetup} />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitButton onClick={createAnother}
                             label="Create another"
                />
                <DavitBackButton onClick={saveDataSetup} />
            </FormFooter>

        </Form>
    );
};
