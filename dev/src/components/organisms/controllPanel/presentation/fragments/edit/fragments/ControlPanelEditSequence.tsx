import React, { FunctionComponent } from "react";
import {
    DavitBackButton,
    DavitButton,
    DavitDeleteButton,
    DavitTextInput,
    DecisionLabelDropDown,
    StepLabelDropDown
} from "../../../../../../atomic";
import { AddOrEdit, DavitCommentButton } from "../../../../../../molecules";
import { ControlPanel } from "../common/ControlPanel";
import { OptionField } from "../common/OptionField";
import { useSequenceViewModel } from "./viewmodels/SequenceViewModel";

export interface ControlPanelEditSequenceProps {
}

export const ControlPanelEditSequence: FunctionComponent<ControlPanelEditSequenceProps> = () => {

    const {
        name,
        changeName,
        deleteSequence,
        saveSequence,
        editOrAddSequenceStep,
        createAnother,
        updateSequence,
        editOrAddDecision,
        note,
        saveNote,
        editStates,
    } = useSequenceViewModel();

    return (
        <ControlPanel>

            <OptionField label="Sequence - name">
                <DavitTextInput
                    label="Name:"
                    placeholder="Sequence Name..."
                    onChangeCallback={(name: string) => changeName(name)}
                    value={name}
                    focus={true}
                    onBlur={updateSequence}
                />

                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
            </OptionField>
            <OptionField label="Create / Edit | Sequence - Step"
                         divider={true}
            >
                <AddOrEdit addCallBack={editOrAddSequenceStep}
                           dropDown={<StepLabelDropDown onSelect={editOrAddSequenceStep}
                                                        label="Step"
                           />}
                />
            </OptionField>
            <OptionField label="Create / Edit | Sequence - Decision"
                         divider={true}
            >
                <AddOrEdit addCallBack={editOrAddDecision}
                           dropDown={<DecisionLabelDropDown onSelect={editOrAddDecision}
                                                            label="Decision"
                           />}
                />
            </OptionField>
            <OptionField label={"options"}
                         divider={true}
            >
                <DavitButton onClick={editStates}>State</DavitButton>

                <DavitButton onClick={createAnother}
                >
                    {"Create another"}
                </DavitButton>
                <DavitBackButton onClick={saveSequence} />
                <DavitDeleteButton onClick={deleteSequence} />
            </OptionField>
        </ControlPanel>
    );
};

