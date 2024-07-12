import React, { FunctionComponent } from "react";
import { ConditionTO } from "../../../../../../../../dataAccess/access/to/ConditionTO";
import { StateFkAndStateCondition } from "../../../../../../../../dataAccess/access/to/DecisionTO";
import { SequenceStateTO } from "../../../../../../../../dataAccess/access/to/SequenceStateTO";
import { GoToTypes } from "../../../../../../../../dataAccess/access/types/GoToType";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import {
    ActorDropDown,
    DavitAddButton,
    DavitBackButton,
    DavitButton,
    DavitDeleteButton,
    DavitTextInput,
    DecisionDropDown,
    Form,
    GoToOptionDropDown,
    InstanceDropDown,
    StepDropDown
} from "../../../../../../../atomic";
import { SequenceStateDropDown } from "../../../../../../../atomic/dropdowns/SequenceStateDropDown";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitCommentButton } from "../../../../../../../molecules";
import { ToggleButton } from "../../../../../../../molecules/ToggleButton";
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
        stateFkAndStateConditions,
        createStateFkAndStateCondition,
        updateStateFkAndStateCondition,
        deleteStateFkAndStateCondition,
        sequenceFk,
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
                    <div className="flex content-space-between">
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

    const selectSequenceState = (sequenceState: SequenceStateTO | undefined, index: number) => {
        if (sequenceState) {
            updateStateFkAndStateCondition({stateFk: sequenceState.id, stateCondition: sequenceState.isState}, index);
        }
    };

    const setStateCondition = (stateFkAndStateConditions: StateFkAndStateCondition, index: number, condition: boolean) => {
        const copyStateFkAndStateCondition: StateFkAndStateCondition = DavitUtil.deepCopy(stateFkAndStateConditions);
        copyStateFkAndStateCondition.stateCondition = condition;
        updateStateFkAndStateCondition(copyStateFkAndStateCondition, index);
    };

    const buildStateTableRow = (stateFkAndCondition: StateFkAndStateCondition, index: number): JSX.Element => {

        return (
            <tr key={stateFkAndCondition.stateFk}>
                <td>
                    <div className="flex content-space-between">

                        <SequenceStateDropDown onSelect={(selectedState) => selectSequenceState(selectedState, index)}
                                               sequenceFk={sequenceFk}
                                               value={stateFkAndCondition.stateFk.toString()}
                                               placeholder="Select sequence state"
                        />

                        <ToggleButton toggleCallback={(is) => setStateCondition(stateFkAndCondition, index, is)}
                                      isLeft={stateFkAndCondition.stateCondition}
                                      leftLabel="TRUE"
                                      rightLabel="FALSE"
                        />

                        <DavitDeleteButton onClick={() => {
                            deleteStateFkAndStateCondition(stateFkAndCondition.stateFk);
                        }}
                                           noConfirm
                        />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <Form>
            <FormHeader><h2>Decision</h2></FormHeader>


            <FormBody>

                <FormDivider />

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
                           style={{width: "40em"}}
                    >
                        <thead>
                        <tr>
                            <td>Actor</td>
                            <td>Data Instance</td>
                            <td className={"flex flex-end"}><DavitAddButton onClick={createCondition} /></td>
                        </tr>
                        </thead>
                        <tbody style={{maxHeight: "20vh"}}>
                        {conditions.map(buildConditionTableRow)}
                        </tbody>
                    </table>
                </FormLine>

                {/*------------------------- State -------------------------*/}
                <FormLine>
                    <table className="border"
                           style={{width: "40em"}}
                    >
                        <thead>
                        <tr>
                            <td>State</td>
                            <td>Is</td>
                            <td className={"flex flex-end"}><DavitAddButton onClick={createStateFkAndStateCondition} />
                            </td>
                        </tr>
                        </thead>
                        <tbody style={{maxHeight: "20vh"}}>
                        {stateFkAndStateConditions.map((state, index) => buildStateTableRow(state, index))}
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

                <FormDivider />

            </FormBody>
            <FormFooter>
                <DavitDeleteButton onClick={deleteDecision} />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitButton onClick={setRoot}
                             disabled={isRoot}
                >
                    {isRoot ? "Start" : "Set as Start"}
                </DavitButton>
                <DavitBackButton onClick={saveAndGoBack} />
            </FormFooter>

        </Form>
    );
};
