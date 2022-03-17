import React, { FunctionComponent } from "react";
import { ChainStateTO } from "../../../../../../../../dataAccess/access/to/ChainStateTO";
import { ConditionTO } from "../../../../../../../../dataAccess/access/to/ConditionTO";
import { StateFkAndStateCondition } from "../../../../../../../../dataAccess/access/to/DecisionTO";
import { GoToTypesChain } from "../../../../../../../../dataAccess/access/types/GoToTypeChain";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import {
    ActorDropDown,
    ChainDecisionDropDown,
    ChainLinkDropDown,
    DavitAddButton,
    DavitBackButton,
    DavitDeleteButton,
    DavitTextInput,
    Form,
    GoToChainOptionDropDown,
    InstanceDropDown
} from "../../../../../../../atomic";
import { ChainStateDropDown } from "../../../../../../../atomic/dropdowns/ChainStateDropDown";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { ToggleButton } from "../../../../../../../molecules/ToggleButton";
import { useChainDecisionViewModel } from "../viewmodels/ChainDecisionViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLabel } from "./fragments/FormLabel";
import { FormLine } from "./fragments/FormLine";

interface ChainDecisionFormProps {

}

export const ChainDecisionForm: FunctionComponent<ChainDecisionFormProps> = () => {

    const {
        handleType,
        chainId,
        changeName,
        createGoToDecision,
        name,
        deleteDecision,
        elseGoTo,
        ifGoTo,
        createGoToStep,
        decId,
        setGoToTypeDecision,
        setGoToTypeStep,
        chainConditions,
        saveCondition,
        deleteCondition,
        createCondition,
        goBack,
        stateFkAndStateConditions,
        createStateFkAndStateCondition,
        updateStateFkAndStateCondition,
        deleteStateFkAndStateCondition,
    } = useChainDecisionViewModel();

    const labelName: string = "Chain decision - name";
    const labelConditions: string = "Conditions";
    const labelIfGotoType: string = "Type condition true";
    const labelElseGotoType: string = "Type condition false";
    const labelCreateLink: string = "Create next link";
    const labelSelectLink: string = "Select next link";
    const labelCreateDecision: string = "Create next decision";
    const labelSelectDecision: string = "Select next decision";

    const buildChainConditionTableRow = (condition: ConditionTO): JSX.Element => {
        let copyCondition: ConditionTO = DavitUtil.deepCopy(condition);

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

    const selectChainState = (chainState: ChainStateTO | undefined, index: number) => {
        if (chainState) {
            updateStateFkAndStateCondition({stateFk: chainState.id, stateCondition: chainState.isState}, index);
        }
    };

    const setStateCondition = (stateFkAndStateConditions: StateFkAndStateCondition, index: number, condition: boolean) => {
        const copyStateFkAndStateCondition: StateFkAndStateCondition = DavitUtil.deepCopy(stateFkAndStateConditions);
        copyStateFkAndStateCondition.stateCondition = condition;
        updateStateFkAndStateCondition(copyStateFkAndStateCondition, index);
    };

    const buildStateTableRow = (stateFkAndStateCondition: StateFkAndStateCondition, index: number): JSX.Element => {

        return (
            <tr key={stateFkAndStateCondition.stateFk}>
                <td>
                    <div className="flex content-space-between">

                        <ChainStateDropDown onSelect={(stateFkAndStateCondition) => selectChainState(stateFkAndStateCondition, index)}
                                            chainFk={chainId}
                                            value={stateFkAndStateCondition.stateFk.toString()}
                                            placeholder="Select sequence state"
                        />

                        <ToggleButton toggleCallback={(is) => setStateCondition(stateFkAndStateCondition, index, is)}
                                      isLeft={stateFkAndStateCondition.stateCondition}
                                      leftLabel="TRUE"
                                      rightLabel="FLASE"
                        />

                        <DavitDeleteButton onClick={() => {
                            deleteStateFkAndStateCondition(stateFkAndStateCondition.stateFk);
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
            <FormHeader>
                <h2>Chain decision</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <FormLine>
                    <FormLabel>{labelName}</FormLabel>
                    <DavitTextInput
                        label="Name:"
                        placeholder="Chain decision name ..."
                        onChangeCallback={(name: string) => changeName(name)}
                        value={name}
                        focus={true}
                    />
                </FormLine>

                <FormDivider />

                <FormLine>
                    <FormLabel>{labelConditions}</FormLabel>
                </FormLine>

                {/*------------------------- Condition -------------------------*/}
                <FormLine>
                    <table className={"border"}
                           style={{width: "40em"}}
                    >
                        <thead>
                        <tr>
                            <td style={{textAlign: "center"}}>Actor</td>
                            <td style={{textAlign: "center"}}>Data Instance</td>
                            <td className={"flex flex-end"}><DavitAddButton onClick={createCondition} /></td>
                        </tr>
                        </thead>
                        <tbody style={{maxHeight: "40vh"}}>
                        {chainConditions.map(buildChainConditionTableRow)}
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

                <FormDivider />

                <FormLine>
                    <FormLabel>{labelIfGotoType}</FormLabel>
                    <GoToChainOptionDropDown
                        onSelect={(gt) => {
                            handleType(true, gt);
                        }}
                        value={ifGoTo ? ifGoTo.type : GoToTypesChain.FIN}
                    />
                </FormLine>

                {ifGoTo!.type === GoToTypesChain.LINK && (
                    <>
                        <FormDivider />

                        <FormLine>
                            <FormLabel>{labelSelectLink}</FormLabel>
                            <ChainLinkDropDown
                                onSelect={(link) => setGoToTypeStep(true, link)}
                                value={ifGoTo?.type === GoToTypesChain.LINK ? ifGoTo.id : 1}
                                chainId={chainId}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateLink}</FormLabel>
                            <DavitAddButton onClick={() => createGoToStep(true)} />
                        </FormLine>
                    </>
                )}

                {ifGoTo!.type === GoToTypesChain.DEC && (
                    <>
                        <FormDivider />

                        <FormLine>
                            <FormLabel>{labelSelectDecision}</FormLabel>
                            <ChainDecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(true, cond)}
                                value={ifGoTo?.type === GoToTypesChain.DEC ? ifGoTo.id : 1}
                                exclude={decId}
                                chainId={chainId}
                            />
                        </FormLine>

                        <FormLine>
                            <FormLabel>{labelCreateDecision}</FormLabel>
                            <DavitAddButton onClick={() => createGoToDecision(true)} />
                        </FormLine>
                    </>
                )}

                <FormDivider />

                <FormLine>
                    <FormLabel>{labelElseGotoType}</FormLabel>
                    <GoToChainOptionDropDown
                        onSelect={(gt) => {
                            handleType(false, gt);
                        }}
                        value={elseGoTo ? elseGoTo.type : GoToTypesChain.FIN}
                    />
                </FormLine>


                {elseGoTo!.type === GoToTypesChain.LINK && (
                    <>
                        <FormDivider />

                        <FormLine>
                            <FormLabel>{labelSelectLink}</FormLabel>
                            <ChainLinkDropDown
                                onSelect={(link) => setGoToTypeStep(false, link)}
                                value={ifGoTo?.type === GoToTypesChain.LINK ? ifGoTo.id : 1}
                                chainId={chainId}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateLink}</FormLabel>
                            <DavitAddButton onClick={() => createGoToStep(false)} />
                        </FormLine>
                    </>
                )}

                {elseGoTo!.type === GoToTypesChain.DEC && (
                    <>
                        <FormDivider />

                        <FormLine>
                            <FormLabel>{labelSelectDecision}</FormLabel>
                            <ChainDecisionDropDown
                                onSelect={(cond) => setGoToTypeDecision(false, cond)}
                                value={ifGoTo?.type === GoToTypesChain.DEC ? ifGoTo.id : 1}
                                exclude={decId}
                                chainId={chainId}
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
                <FormLine>
                    <DavitDeleteButton onClick={deleteDecision} />
                    <DavitBackButton onClick={goBack} />
                </FormLine>
            </FormFooter>

        </Form>
    );
};
