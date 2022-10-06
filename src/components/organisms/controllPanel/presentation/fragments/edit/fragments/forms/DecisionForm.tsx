import React, { FunctionComponent } from "react";
import { ConditionTO } from "../../../../../../../../dataAccess/access/to/ConditionTO";
import { GoToTypes } from "../../../../../../../../dataAccess/access/types/GoToType";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import { DavitAddButton } from "../../../../../../../atomic/buttons/DavitAddButton";
import { DavitBackButton } from "../../../../../../../atomic/buttons/DavitBackButton";
import { DavitCommentButton } from "../../../../../../../atomic/buttons/DavitCommentButton";
import { DavitDeleteButton } from "../../../../../../../atomic/buttons/DavitDeleteButton";
import { DavitRootButton } from "../../../../../../../atomic/buttons/DavitRootButton";
import { ActorDropDown } from "../../../../../../../atomic/dropdowns/ActorDropDown";
import { DecisionDropDown } from "../../../../../../../atomic/dropdowns/DecisionDropDown";
import { GoToOptionDropDown } from "../../../../../../../atomic/dropdowns/GoToOptionDropDown";
import { InstanceDropDown } from "../../../../../../../atomic/dropdowns/InstanceDropDown";
import { StepDropDown } from "../../../../../../../atomic/dropdowns/StepDropDown";
import { Form } from "../../../../../../../atomic/forms/Form";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitTextInput } from "../../../../../../../atomic/textinput/DavitTextInput";
import { useDecisionViewModel } from "../viewmodels/DecisionViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLabel, FormlabelAlign } from "./fragments/FormLabel";
import { FormLine } from "./fragments/FormLine";

interface DecisionFormProps {

}

export const DecisionForm: FunctionComponent<DecisionFormProps> = () => {

    const {
        name,
        changeName,
        handleType,
        ifGoTo,
        elseGoTo,
        setGoToTypeStep,
        createGoToStep,
        setRoot,
        isRoot,
        deleteDecision,
        createGoToDecision,
        setGoToTypeDecision,
        createCondition,
        decId,
        conditions,
        note,
        saveNote,
        deleteCondition,
        saveCondition,
        saveAndGoBack,
    } = useDecisionViewModel();


    const labelDecision: string = "Select next decision";
    const labelCreateDecision: string = "Create new / next decision";
    const labelStep: string = "Select next step";
    const labelCreateStep: string = "Create new /next step";
    const labelTypeIf: string = "Type condition true";
    const labelTypeElse: string = "Type condition false";
    const labelIfLabel: string = "If condition's are true";
    const labelElseLabel: string = "If condition's are false";


    const buildConditionTableRow = (condition: ConditionTO): JSX.Element => {
        const copyCondition: ConditionTO = DavitUtil.deepCopy(condition);

        return (
            <tr key={copyCondition.id}>
                <td>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <ActorDropDown
                            onSelect={(actor) => {
                                copyCondition.actorFk = actor ? actor.actor.id : -1;
                                saveCondition(copyCondition);
                            }}
                            placeholder={"Select actor..."}
                            value={copyCondition.actorFk}
                        />
                        <InstanceDropDown
                            onSelect={(dataAndInstance) => {
                                if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                    copyCondition.dataFk = dataAndInstance!.dataFk;
                                    copyCondition.instanceFk = dataAndInstance!.instanceId;
                                    saveCondition(copyCondition);
                                }
                            }}
                            placeholder={"Select data instance ..."}
                            value={JSON.stringify({
                                dataFk: copyCondition!.dataFk,
                                instanceId: copyCondition!.instanceFk,
                            })
                            }
                        />
                        {copyCondition.id !== -1 && <DavitDeleteButton onClick={() => {
                            deleteCondition(copyCondition.id);
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
            <FormHeader><h2>Decision</h2></FormHeader>

            <FormDivider />

            <FormBody>

                <FormLine>
                    <DavitTextInput
                        label="Name:"
                        placeholder="Decision name ..."
                        onChangeCallback={(name: string) => changeName(name)}
                        value={name}
                        focus={true}
                    />
                </FormLine>

                {/*------------------------- Condition -------------------------*/}

                <FormLine>
                    <table className={"border"}
                           style={{width: "40em", minHeight: "30vh"}}
                    >
                        <thead>
                        <tr>
                            <td style={{textAlign: "center"}}>Actor</td>
                            <td style={{textAlign: "center"}}>Data Instance</td>
                            <td style={{textAlign: "end"}}><DavitAddButton onClick={createCondition} /></td>
                        </tr>
                        </thead>
                        <tbody style={{maxHeight: "40vh"}}>
                        {conditions.map(buildConditionTableRow)}
                        </tbody>
                    </table>
                </FormLine>

                {/*------------------------- If option -------------------------*/}

                <FormDivider />

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>
                        <h3>{labelIfLabel}</h3>
                    </FormLabel>
                </FormLine>

                <FormLine>
                    <FormLabel>{labelTypeIf}</FormLabel>
                    <GoToOptionDropDown
                        onSelect={(gt) => handleType(true, gt)}
                        value={ifGoTo ? ifGoTo.type : GoToTypes.FIN}
                    />
                </FormLine>

                {ifGoTo!.type === GoToTypes.STEP && (
                    <>
                        <FormLine>
                            <FormLabel>{labelStep}</FormLabel>
                            <StepDropDown
                                onSelect={(step) => setGoToTypeStep(true, step)}
                                value={ifGoTo?.type === GoToTypes.STEP ? ifGoTo.id : 1}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateStep}</FormLabel>
                            <DavitAddButton onClick={() => createGoToStep(true)} />
                        </FormLine>
                    </>
                )}

                {ifGoTo!.type === GoToTypes.DEC && (
                    <>
                        <FormLine>
                            <FormLabel>{labelDecision}</FormLabel>
                            <DecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(true, cond)}
                                value={ifGoTo?.type === GoToTypes.DEC ? ifGoTo.id : 1}
                                exclude={decId}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateDecision}</FormLabel>
                            <DavitAddButton onClick={() => createGoToDecision(true)} />
                        </FormLine>
                    </>
                )}

                {/*------------------------- Else option -------------------------*/}
                <FormDivider />

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>
                        <h3>{labelElseLabel}</h3>
                    </FormLabel>
                </FormLine>

                <FormLine>
                    <FormLabel>{labelTypeElse}</FormLabel>
                    <GoToOptionDropDown
                        onSelect={(gt) => handleType(false, gt)}
                        value={elseGoTo ? elseGoTo.type : GoToTypes.ERROR}
                    />
                </FormLine>

                {elseGoTo!.type === GoToTypes.STEP && (
                    <>
                        <FormLine>
                            <FormLabel>{labelStep}</FormLabel>
                            <StepDropDown
                                onSelect={(step) => setGoToTypeStep(false, step)}
                                value={elseGoTo?.type === GoToTypes.STEP ? elseGoTo.id : 1}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateStep}</FormLabel>
                            <DavitAddButton onClick={() => createGoToStep(false)} />
                        </FormLine>
                    </>
                )}

                {elseGoTo!.type === GoToTypes.DEC && (
                    <>
                        <FormLine>
                            <FormLabel>{labelDecision}</FormLabel>
                            <DecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(false, cond)}
                                value={elseGoTo?.type === GoToTypes.DEC ? elseGoTo.id : 1}
                                exclude={decId}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateDecision}</FormLabel>
                            <DavitAddButton onClick={() => createGoToDecision(false)} />
                        </FormLine>
                    </>
                )}
            </FormBody>
            <FormDivider />
            <FormFooter>
                <DavitDeleteButton onClick={deleteDecision} />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitRootButton onClick={setRoot}
                                 isRoot={isRoot}
                />
                <DavitBackButton onClick={saveAndGoBack} />
            </FormFooter>

        </Form>
    );
};
