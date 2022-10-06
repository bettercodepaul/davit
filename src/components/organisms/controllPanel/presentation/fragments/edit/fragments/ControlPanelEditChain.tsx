import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChainDecisionTO } from "../../../../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../../../../../../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../../../../../../../dataAccess/access/to/ChainTO";
import { SequenceTO } from "../../../../../../../dataAccess/access/to/SequenceTO";
import { EditActions } from "../../../../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../../../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../../../../../../slices/SequenceModelSlice";
import { EditChain } from "../../../../../../../slices/thunks/ChainThunks";
import { EditSequence } from "../../../../../../../slices/thunks/SequenceThunks";
import { useAppDispatch } from "../../../../../../../store";
import { DavitUtil } from "../../../../../../../utils/DavitUtil";
import { DavitBackButton } from "../../../../../../atomic/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../atomic/buttons/DavitButton";
import { DavitDeleteButton } from "../../../../../../atomic/buttons/DavitDeleteButton";
import { ChainDecisionDropDownButton } from "../../../../../../atomic/dropdowns/ChainDecisionDropDown";
import { ChainLinkDropDownButton } from "../../../../../../atomic/dropdowns/ChainLinkDropDown";
import { DavitTextInput } from "../../../../../../atomic/textinput/DavitTextInput";
import { AddOrEdit } from "../../../../../../molecules/AddOrEdit";
import { ControlPanel } from "../common/ControlPanel";
import { OptionField } from "../common/OptionField";

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
    } = useControlPanelEditChainViewModel();

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
                <DavitButton onClick={createAnother}
                             label="Create another"
                />
                <DavitBackButton onClick={saveChain} />
                <DavitDeleteButton onClick={deleteChain} />
            </OptionField>

        </ControlPanel>
    );
};

const useControlPanelEditChainViewModel = () => {
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const dispatch = useAppDispatch();
    const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
    const isFirst: boolean = useSelector(masterDataSelectors.isFirstChainElement(selectedChain?.id || -1));

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(selectedChain)) {
            console.warn("Tried to go to edit sequence without chain specified" + selectedChain);
            dispatch(EditActions.setMode.edit());
        }
        if (selectedChain?.id !== -1) {
            setIsCreateAnother(false);
        }
    }, [selectedChain, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            const copyChainToEdit: ChainTO = DavitUtil.deepCopy(selectedChain);
            copyChainToEdit.name = name;
            dispatch(EditChain.save(copyChainToEdit));
        }
    };

    const saveChain = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            if (selectedChain!.name !== "") {
                dispatch(EditChain.save(selectedChain!));
            } else {
                dispatch(EditChain.delete(selectedChain!));
            }
            if (isCreateAnother && !newMode) {
                dispatch(EditActions.setMode.editChain());
            } else {
                dispatch(EditActions.setMode.edit());
            }
        }
    };

    const deleteChain = () => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            dispatch(EditChain.delete(selectedChain!));
        }
        dispatch(EditActions.setMode.edit());
    };

    const validateInput = (): boolean => {
        if (!DavitUtil.isNullOrUndefined(selectedChain)) {
            return DavitUtil.isValidName(selectedChain!.name);
        } else {
            return false;
        }
    };

    const editOrAddChainLink = (link?: ChainlinkTO) => {
        let chainLinkToEdit: ChainlinkTO | undefined = link;
        if (chainLinkToEdit === undefined) {
            chainLinkToEdit = new ChainlinkTO();
            chainLinkToEdit.chainFk = selectedChain?.id || -1;
            chainLinkToEdit.root = isFirst;
        }
        dispatch(EditActions.setMode.editChainLink(chainLinkToEdit));
    };

    const editOrAddChainDecision = (decision?: ChainDecisionTO) => {
        let decisionToEdit: ChainDecisionTO | undefined = decision;
        if (decisionToEdit === undefined) {
            decisionToEdit = new ChainDecisionTO();
            decisionToEdit.chainFk = selectedChain?.id || -1;
        }
        dispatch(EditActions.setMode.editChainDecision(decisionToEdit));
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editSequence());
    };

    const updateSequence = () => {
        const copySequence: SequenceTO = DavitUtil.deepCopy(selectedChain);
        dispatch(EditSequence.save(copySequence));
    };

    return {
        label: "EDIT * " + (selectedChain?.name || ""),
        name: selectedChain?.name,
        id: selectedChain?.id ? selectedChain.id : -1,
        changeName,
        saveChain,
        deleteChain,
        validateInput,
        createAnother,
        updateSequence,
        editOrAddChainDecision,
        editOrAddChainLink,
    };
};
