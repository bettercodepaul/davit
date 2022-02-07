import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons/faAngleUp";
import React, { FunctionComponent, useState } from "react";
import { ActionTO } from "../../../../../../../../dataAccess/access/to/ActionTO";
import { GoToTypes } from "../../../../../../../../dataAccess/access/types/GoToType";
import { DavitAddButton } from "../../../../../../../atomic/buttons/DavitAddButton";
import { DavitBackButton } from "../../../../../../../atomic/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../../atomic/buttons/DavitButton";
import { DavitCommentButton } from "../../../../../../../atomic/buttons/DavitCommentButton";
import { DavitDeleteButton } from "../../../../../../../atomic/buttons/DavitDeleteButton";
import { DavitEditButton } from "../../../../../../../atomic/buttons/DavitEditButton";
import { DavitRootButton } from "../../../../../../../atomic/buttons/DavitRootButton";
import { DavitShowMoreButton } from "../../../../../../../atomic/buttons/DavitShowMoreButton";
import { DecisionDropDown } from "../../../../../../../atomic/dropdowns/DecisionDropDown";
import { GoToOptionDropDown } from "../../../../../../../atomic/dropdowns/GoToOptionDropDown";
import { StepDropDown } from "../../../../../../../atomic/dropdowns/StepDropDown";
import { Form } from "../../../../../../../atomic/forms/Form";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { DavitTextInput } from "../../../../../../../atomic/textinput/DavitTextInput";
import { useActionViewModel } from "../viewmodels/ActionViewModel";
import { useStepViewModel } from "../viewmodels/StepViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLabel } from "./fragments/FormLabel";
import { FormLine } from "./fragments/FormLine";

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
                <td style={{textAlign: "end"}}>
                    <DavitDeleteButton onClick={() => {
                        deleteAction(action);
                        updateStep();
                    }}
                    />
                    <DavitEditButton onClick={() => editOrAddAction(action)} />
                    <DavitButton iconName={faAngleDown}
                                 onClick={() => switchIndexesAndSave(index, true)}
                    />
                    <DavitButton iconName={faAngleUp}
                                 onClick={() => switchIndexesAndSave(index, false)}
                    />
                </td>
            </tr>
        );
    };

    const buildActionTable = (actions: ActionTO[]): JSX.Element => {
        return (
            <table className={"border"}
                   style={{width: "40em", overflow: "hidden"}}
            >
                <thead>
                <tr>
                    <td style={{textAlign: "center"}}>Action</td>
                    <td style={{textAlign: "end"}}>
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

            <FormDivider />

            <FormBody>

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
                    <FormLabel><h3>Actions</h3></FormLabel>
                    <DavitShowMoreButton show={showActions}
                                         onClick={() => setShowActions(!showActions)}
                    />
                </FormLine>

                {showActions && <FormDivider /> && <FormLine>{buildActionTable(actions)}</FormLine>}

                <FormDivider />

                <FormLine>
                    <FormLabel>Select type of the next element</FormLabel>
                </FormLine>

                <FormLine>
                    <GoToOptionDropDown onSelect={handleType}
                                        value={goTo ? goTo.type : GoToTypes.ERROR}
                    />
                </FormLine>

                {goTo!.type === GoToTypes.STEP && (
                    <>
                        <FormDivider />

                        <FormLine>
                            <FormLabel>{labelSelectStep}</FormLabel>
                            <StepDropDown
                                onSelect={setGoToTypeStep}
                                value={goTo?.type === GoToTypes.STEP ? goTo.id : 1}
                                exclude={stepId}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateStep}</FormLabel>
                            <DavitAddButton onClick={createGoToStep} />
                        </FormLine>
                    </>
                )}

                {goTo!.type === GoToTypes.DEC && (
                    <>
                        <FormDivider />

                        <FormLine>
                            <FormLabel>{labelSelectDecision}</FormLabel>
                            <DecisionDropDown
                                onSelect={setGoToTypeDecision}
                                value={goTo?.type === GoToTypes.DEC ? goTo.id : 1}
                            />
                        </FormLine>
                        <FormLine>
                            <FormLabel>{labelCreateDecision}</FormLabel>
                            <DavitAddButton onClick={createGoToDecision} />
                        </FormLine>
                    </>
                )}
            </FormBody>

            <FormDivider />

            <FormFooter>
                <DavitDeleteButton onClick={deleteSequenceStep} />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitRootButton onClick={setRoot}
                                 isRoot={isRoot}
                />
                <DavitBackButton onClick={saveSequenceStep} />
            </FormFooter>
        </Form>
    );
};
