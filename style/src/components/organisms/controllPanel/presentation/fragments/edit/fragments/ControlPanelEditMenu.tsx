import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActorCTO } from "../../../../../../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../../../../../../dataAccess/access/cto/DataCTO";
import { ChainTO } from "../../../../../../../dataAccess/access/to/ChainTO";
import { DataRelationTO } from "../../../../../../../dataAccess/access/to/DataRelationTO";
import { EditActions, editSelectors, Mode } from "../../../../../../../slices/EditSlice";
import {
    ActorDropDownLabel,
    ChainDropDownButton,
    DataLabelDropDown,
    RelationLabelDropDown,
    SequenceLabelDropDown
} from "../../../../../../atomic";
import { AddOrEdit } from "../../../../../../molecules";
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
    const dispatch = useDispatch();
    const mode: Mode = useSelector(editSelectors.selectMode);

    return {
        mode,
        editOrAddActor: (actor?: ActorCTO) => dispatch(EditActions.setMode.editActor(actor)),
        editOrAddData: (data?: DataCTO) => dispatch(EditActions.setMode.editData(data)),
        editOrAddRelation: (relation?: DataRelationTO) => dispatch(EditActions.setMode.editRelation(relation)),
        editOrAddSequence: (sequenceId?: number) => dispatch(EditActions.setMode.editSequence(sequenceId)),
        editOrAddChain: (chain?: ChainTO) => dispatch(EditActions.setMode.editChain(chain)),
    };
};
