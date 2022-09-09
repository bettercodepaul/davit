import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataCTO } from "../../../../../../../dataAccess/access/cto/DataCTO";
import { DataInstanceTO } from "../../../../../../../dataAccess/access/to/DataInstanceTO";
import { EditActions, editSelectors } from "../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../slices/GlobalSlice";
import { EditData } from "../../../../../../../slices/thunks/DataThunks";
import { useAppDispatch } from "../../../../../../../store";
import { DavitUtil } from "../../../../../../../utils/DavitUtil";
import { DavitBackButton } from "../../../../../../atomic/buttons/DavitBackButton";
import { DavitDeleteButton } from "../../../../../../atomic/buttons/DavitDeleteButton";
import { DavitTextInput } from "../../../../../../atomic/textinput/DavitTextInput";
import { OptionField } from "../common/OptionField";

export interface ControlPanelEditDataInstanceProps {
    hidden: boolean;
}

export const ControlPanelEditDataInstance: FunctionComponent<ControlPanelEditDataInstanceProps> = () => {
    const {
        changeName,
        getName,
        goBack,
        deleteDataInstance,
        isDeleteButtonDisable,
        saveOnBlur,
    } = useControlPanelEditDataInstanceViewModel();

    return (
        <div className="headerGrid">
            <OptionField label="Instance - Name">
                <DavitTextInput
                    label="Name:"
                    placeholder="Data Instance Name"
                    onChangeCallback={(name: string) => changeName(name)}
                    value={getName()}
                    onBlur={saveOnBlur}
                    focus
                />
            </OptionField>
            <OptionField divider={true} />
            <OptionField label="Navigation"
                         divider={true}
            >
                <DavitBackButton onClick={goBack} />
            </OptionField>
            <OptionField label="Data - Options"
                         divider={true}
            >
                <DavitDeleteButton onClick={deleteDataInstance}
                                   disable={isDeleteButtonDisable()}
                />
            </OptionField>
        </div>
    );
};

const useControlPanelEditDataInstanceViewModel = () => {
    const dataToEdit: DataCTO | null = useSelector(editSelectors.selectDataToEdit);
    const instanceId: number | null = useSelector(editSelectors.selectInstanceIdToEdit);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // check if component to edit is really set or go back to edit mode
        if (dataToEdit === null && instanceId === -1) {
            dispatch(GlobalActions.handleError("Tried to go to edit data without data to edit specified"));
            dispatch(EditActions.setMode.edit());
        }
    });

    const changeName = (name: string) => {
        if (dataToEdit !== null && instanceId !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyData.data.instances.find((inst) => inst.id === instanceId)!.name = name;
            dispatch(EditData.update(copyData));
        }
    };

    const goBack = () => {
        if (dataToEdit !== null && instanceId !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            const instance: DataInstanceTO | undefined = copyData.data.instances.find((inst) => inst.id === instanceId);
            if (instance && instance.name === "") {
                if (instance.id === -1) {
                    deleteDataInstance();
                } else {
                    dispatch(EditActions.setMode.editDataById(dataToEdit.data.id));
                }
            } else {
                dispatch(EditActions.setMode.editDataById(dataToEdit.data.id));
            }
        }
    };

    const saveOnBlur = () => {
        if (dataToEdit !== null && instanceId !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            if (copyData.data.instances.find((inst) => inst.id === instanceId)!.name !== "") {
                dispatch(EditData.save(copyData));
            }
        }
    };

    const deleteDataInstance = () => {
        if (dataToEdit !== null && instanceId !== null) {
            const copyData: DataCTO = DavitUtil.deepCopy(dataToEdit);
            copyData.data.instances = copyData.data.instances.filter((inst) => inst.id !== instanceId);
            dispatch(EditData.save(copyData));
            dispatch(EditActions.setMode.editDataById(dataToEdit.data.id));
        }
    };

    const getName = (): string => {
        let name: string;
        const instance = dataToEdit?.data.instances.find((inst) => inst.id === instanceId);
        if (instance) {
            name = instance.name;
        } else {
            name = "could not find instance!";
        }
        return name;
    };

    const isDeleteButtonDisable = (): boolean => {
        let disable: boolean = true;
        if (!DavitUtil.isNullOrUndefined(dataToEdit)) {
            disable = dataToEdit!.data.instances.length < 2;
        }
        return disable;
    };

    return {
        label: "EDIT * DATA * INSTANCE",
        getName,
        changeName,
        goBack,
        deleteDataInstance,
        isDeleteButtonDisable,
        saveOnBlur,
    };
};
