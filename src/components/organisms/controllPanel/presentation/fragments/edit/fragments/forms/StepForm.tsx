import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons/faAngleUp";
import React, { FunctionComponent, useState } from "react";
import { ActionTO } from "../../../../../../../../dataAccess/access/to/ActionTO";
import { GoToTypes } from "../../../../../../../../dataAccess/access/types/GoToType";
import {
    DavitAddButton,
    DavitBackButton,
    DavitButton,
    DavitDeleteButton,
    DavitEditButton,
    DavitIconButton,
    DavitShowMoreButton,
    DavitTextInput,
    DecisionDropDown,
    Form,
    GoToOptionDropDown,
    StepDropDown
} from "../../../../../../../atomic";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitCommentButton } from "../../../../../../../molecules";
import { useActionViewModel } from "../viewmodels/ActionViewModel";
import { useStepViewModel } from "../viewmodels/StepViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLabel } from "./fragments/FormLabel";
import { FormLine, FormLinePosition } from "./fragments/FormLine";

interface StepFormProps {
}

export const StepForm: FunctionComponent<StepFormProps> = () => {

    const {
        name,
        changeName,
        deleteSequenceStep,
        saveSequenceStep,
        editOrAddAction,
        updateStep,
        handleType,
        setGoToTypeStep,
        goTo,
        setGoToTypeDecision,
        createGoToStep,
        createGoToDecision,
        setRoot,
        isRoot,
        stepId,
        note,
        saveNote,
        actions,
        switchIndexesAndSave,
    } = useStepViewModel();

    const {deleteAction, getOptionText} = useActionViewModel();

    const labelSelectDecision: string = "Select next decision";
    const labelCreateDecision: string = "Create next decision";
    const labelSelectStep: string = "Select next step";
    const labelCreateStep: string = "Create next step";

    const [showActions, setShowActions] = useState(true);

    const createActionRow = (action: ActionTO, index: number): JSX.Element => {
        return (<tr key={index}>
                <td>
                    <label>{getOptionText(action)}</label>
                </td>
                <td className="flex flex-end">
                    <DavitDeleteButton onClick={() => {
                        deleteAction(action);
                        updateStep();
                    }}
                    />
                    <DavitEditButton onClick={() => editOrAddAction(action)} />
                    <DavitIconButton iconName={faAngleDown}
                                     onClick={() => switchIndexesAndSave(index, true)}
                    />
                    <DavitIconButton iconName={faAngleUp}
                                     onClick={() => switchIndexesAndSave(index, false)}
                    />
                </td>
            </tr>
        );
    };

    const buildActionTable = (actions: ActionTO[]): JSX.Element => {
        return (
            <table className="border"
                   style={{width: "40em", overflow: "hidden"}}
            >
                <thead>
                <tr className="flex content-space-between align-center">
                    <td>Action</td>
                    <td>
                        <DavitAddButton onClick={() => {
                            editOrAddAction();
                            updateStep();
                        }}
                        />
                    </td>
                </tr>
                </thead>
                <tbody style={{maxHeight: "30vh"}}>
                {actions.map((action, index) => createActionRow(action, index))}
                </tbody>
            </table>
        );
    };

    return (
        <Form>
            <FormHeader>
                <h2>Step</h2>
            </FormHeader>

            <FormBody>

                <FormDivider />

                <FormLine>
                    <DavitTextInput
                        label="Name:"
                        placeholder="Step Name ..."
                        onChangeCallback={(name: string) => changeName(name)}
                        value={name}
                        focus={true}
                        onBlur={updateStep}
                    />
                </FormLine>

                <FormDivider />

                <FormLine>
                    <FormLine position={FormLinePosition.center}>
                        <FormLabel><h3>Actions</h3></FormLabel>
                    </FormLine>
                    <FormLine position={FormLinePosition.center}>

                        <DavitShowMoreButton show={showActions}
                                             onClick={() => setShowActions(!showActions)}
                        />
                    </FormLine>
                </FormLine>

                {showActions && <FormDivider /> && <FormLine>{buildActionTable(actions)}</FormLine>}

                <FormDivider />

                <FormLine>
                    <FormLine position={FormLinePosition.start}>
                        <FormLabel>Select type of the next element</FormLabel>
                    </FormLine>

                    <FormLine position={FormLinePosition.start}>
                        <GoToOptionDropDown onSelect={handleType}
                                            value={goTo ? goTo.type : GoToTypes.ERROR}
                        />
                    </FormLine>
                </FormLine>

                {goTo!.type === GoToTypes.STEP && (
                    <>

                        <FormLine>
                            <FormLine position={FormLinePosition.start}>
                                <FormLabel>{labelSelectStep}</FormLabel>
                            </FormLine>
                            <FormLine position={FormLinePosition.start}>
                                <StepDropDown
                                    onSelect={setGoToTypeStep}
                                    value={goTo?.type === GoToTypes.STEP ? goTo.id : 1}
                                    exclude={stepId}
                                />
                            </FormLine>
                        </FormLine>

                        <FormLine>
                            <FormLine position={FormLinePosition.start}>
                                <FormLabel>{labelCreateStep}</FormLabel>
                            </FormLine>
                            <FormLine position={FormLinePosition.start}>
                                <DavitAddButton onClick={createGoToStep} />
                            </FormLine>
                        </FormLine>
                    </>
                )}

                {goTo!.type === GoToTypes.DEC && (
                    <>

                        <FormLine>
                            <FormLine position={FormLinePosition.start}>
                                <FormLabel>{labelSelectDecision}</FormLabel>
                            </FormLine>
                            <FormLine position={FormLinePosition.start}>
                                <DecisionDropDown
                                    onSelect={setGoToTypeDecision}
                                    value={goTo?.type === GoToTypes.DEC ? goTo.id : 1}
                                />
                            </FormLine>
                        </FormLine>

                        <FormLine>
                            <FormLine position={FormLinePosition.start}>
                                <FormLabel>{labelCreateDecision}</FormLabel>
                            </FormLine>
                            <FormLine position={FormLinePosition.start}>
                                <DavitAddButton onClick={createGoToDecision} />
                            </FormLine>
                        </FormLine>
                    </>
                )}

                <FormDivider />

            </FormBody>

            <FormFooter>
                <DavitDeleteButton onClick={deleteSequenceStep} />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitButton onClick={setRoot}
                             disabled={isRoot}
                >
                    {isRoot ? "Start" : "Set as Start"}
                </DavitButton>
                <DavitBackButton onClick={saveSequenceStep} />
            </FormFooter>
        </Form>
    );
};
