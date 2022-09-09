import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActorCTO } from "../../../../../../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../../../../../../dataAccess/access/cto/DataCTO";
import { ChainTO } from "../../../../../../../dataAccess/access/to/ChainTO";
import { DataRelationTO } from "../../../../../../../dataAccess/access/to/DataRelationTO";
import { DataSetupTO } from "../../../../../../../dataAccess/access/to/DataSetupTO";
import { GroupTO } from "../../../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors, Mode } from "../../../../../../../slices/EditSlice";
import { useAppDispatch } from "../../../../../../../store";
import { ActorDropDownLabel } from "../../../../../../atomic/dropdowns/ActorDropDown";
import { ChainDropDownButton } from "../../../../../../atomic/dropdowns/ChainDropDown";
import { DataLabelDropDown } from "../../../../../../atomic/dropdowns/DataDropDown";
import { DataSetupLabelDropDown } from "../../../../../../atomic/dropdowns/DataSetupDropDown";
import { RelationLabelDropDown } from "../../../../../../atomic/dropdowns/RelationDropDown";
import { SequenceLabelDropDown } from "../../../../../../atomic/dropdowns/SequenceDropDown";
import { AddOrEdit } from "../../../../../../molecules/AddOrEdit";
import { ControlPanel } from "../common/ControlPanel";
import { OptionField } from "../common/OptionField";


export interface ControlPanelEditMenuProps {
}

export const ControlPanelEditMenu: FunctionComponent<ControlPanelEditMenuProps> = () => {

    const {
        editOrAddActor,
        editOrAddData,
        editOrAddRelation,
        editOrAddSequence,
        editOrAddDataSetup,
        editOrAddChain,
    } = useControlPanelEditMenuViewModel();

    return (
        <ControlPanel>
            <OptionField label="actor">
                <AddOrEdit
                    addCallBack={() => editOrAddActor()}
                    dropDown={<ActorDropDownLabel onSelect={editOrAddActor}
                                                  label="Actor"
                    />}
                />
            </OptionField>
            <OptionField label="Data"
                         divider={true}
            >
                <AddOrEdit addCallBack={() => editOrAddData()}
                           dropDown={<DataLabelDropDown onSelect={editOrAddData}
                                                        label="Data"
                           />}
                />
                <AddOrEdit addCallBack={() => editOrAddRelation()}
                           dropDown={<RelationLabelDropDown onSelect={editOrAddRelation}
                                                            label="Relation"
                           />}
                />
            </OptionField>
            <OptionField label="Data - Setup"
                         divider={true}
            >
                <AddOrEdit addCallBack={() => editOrAddDataSetup()}
                           dropDown={<DataSetupLabelDropDown onSelect={editOrAddDataSetup}
                                                             label="Data-Setup"
                           />}
                />
            </OptionField>
            <OptionField label="sequence"
                         divider={true}
            >
                <AddOrEdit addCallBack={() => editOrAddSequence()}
                           dropDown={<SequenceLabelDropDown
                               onSelect={(sequenceTO) => editOrAddSequence(sequenceTO?.id)}
                               label="Sequence"
                           />}
                />
                <AddOrEdit addCallBack={() => editOrAddChain()}
                           dropDown={<ChainDropDownButton
                               onSelect={(chain) => editOrAddChain(chain)}
                               label="Chain"
                           />}
                />
            </OptionField>
        </ControlPanel>
    );
};

const useControlPanelEditMenuViewModel = () => {
    const dispatch = useAppDispatch();
    const mode: Mode = useSelector(editSelectors.selectMode);

    return {
        mode,
        editOrAddActor: (actor?: ActorCTO) => dispatch(EditActions.setMode.editActor(actor)),
        editOrAddData: (data?: DataCTO) => dispatch(EditActions.setMode.editData(data)),
        editOrAddRelation: (relation?: DataRelationTO) => dispatch(EditActions.setMode.editRelation(relation)),
        editOrAddSequence: (sequenceId?: number) => dispatch(EditActions.setMode.editSequence(sequenceId)),
        editOrAddGroup: (group?: GroupTO) => dispatch(EditActions.setMode.editGroup(group)),
        editOrAddDataSetup: (dataSetup?: DataSetupTO) =>
            dispatch(EditActions.setMode.editDataSetup(dataSetup ? dataSetup.id : undefined)),
        editOrAddChain: (chain?: ChainTO) => dispatch(EditActions.setMode.editChain(chain)),
    };
};
