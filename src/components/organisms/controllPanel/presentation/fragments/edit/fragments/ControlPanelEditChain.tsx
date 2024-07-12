import React, { FunctionComponent } from "react";
import {
    ChainDecisionDropDownButton,
    ChainLinkDropDownButton,
    DavitBackButton,
    DavitButton,
    DavitDeleteButton,
    DavitTextInput
} from "../../../../../../atomic";
import { AddOrEdit, DavitCommentButton } from "../../../../../../molecules";
import { ControlPanel } from "../common/ControlPanel";
import { OptionField } from "../common/OptionField";
import { useChainViewModel } from "./viewmodels/ChainViewModel";

export interface ControlPanelEditChainProps {
}

export const ControlPanelEditChain: FunctionComponent<ControlPanelEditChainProps> = () => {
    const {
        name,
        changeName,
        createAnother,
        editOrAddChainDecision,
        saveChain,
        deleteChain,
        id,
        editOrAddChainLink,
        editStates,
        note,
        saveNote,
    } = useChainViewModel();

    return (
        <ControlPanel>
            <OptionField label="Chain - name">
                <DavitTextInput
                    label="Name:"
                    placeholder="Chain Name..."
                    onChangeCallback={(name: string) => changeName(name)}
                    value={name}
                    focus={true}
                />

                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
            </OptionField>

            <OptionField label="Create / Edit | Chain - Link"
                         divider={true}
            >
                <AddOrEdit addCallBack={editOrAddChainLink}
                           dropDown={<ChainLinkDropDownButton
                               onSelect={(link) => editOrAddChainLink(link)}
                               label="Link"
                               chainId={id}
                           />}
                />
            </OptionField>

            <OptionField label="Create / Edit | Chain - Decision"
                         divider={true}
            >
                <AddOrEdit addCallBack={editOrAddChainDecision}
                           dropDown={<ChainDecisionDropDownButton
                               onSelect={editOrAddChainDecision}
                               label="Decision"
                               chainId={id}
                           />}
                />
            </OptionField>

            <OptionField label="Options"
                         divider={true}
            >
                <DavitButton onClick={editStates}>State</DavitButton>
                <DavitButton onClick={createAnother}>
                    {"Create another"}
                </DavitButton>
                <DavitBackButton onClick={saveChain} />
                <DavitDeleteButton onClick={deleteChain} />
            </OptionField>

        </ControlPanel>
    );
};

