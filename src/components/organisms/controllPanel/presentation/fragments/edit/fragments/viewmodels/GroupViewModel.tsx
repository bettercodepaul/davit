import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { GroupTO } from "../../../../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { EditGroup } from "../../../../../../../../slices/thunks/GroupThunks";
import { useAppDispatch } from "../../../../../../../../store";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";

const useGroupViewModel = () => {
    const groupToEdit: GroupTO | null = useSelector(editSelectors.selectGroupToEdit);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // check if sequence to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(groupToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit group without groupToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }

    }, [groupToEdit, dispatch]);

    const changeName = (name: string) => {
        if (!DavitUtil.isNullOrUndefined(groupToEdit)) {
            const copyGroupToEdit: GroupTO = DavitUtil.deepCopy(groupToEdit);
            copyGroupToEdit.name = name;
            dispatch(EditActions.setMode.editGroup(copyGroupToEdit));
        }
    };

    const updateGroup = () => {
        const copyGroup: GroupTO = DavitUtil.deepCopy(groupToEdit);
        dispatch(EditGroup.save(copyGroup));
    };

    const saveGroup = () => {
        dispatch(EditGroup.save(groupToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const deleteGroup = () => {
        dispatch(EditGroup.delete(groupToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editGroup());
    };

    const getGroupColor = (): string => {
        if (!DavitUtil.isNullOrUndefined(groupToEdit)) {
            return groupToEdit!.color;
        } else {
            return "";
        }
    };

    const setGroupColor = (color: string | undefined) => {
        if (!DavitUtil.isNullOrUndefined(groupToEdit)) {
            const copyGroupToEdit: GroupTO = DavitUtil.deepCopy(groupToEdit);
            if (color !== undefined) {
                copyGroupToEdit.color = color;
            }
            dispatch(EditActions.setMode.editGroup(copyGroupToEdit));
        }
    };

    return {
        label: "EDIT GROUP",
        name: groupToEdit?.name,
        changeName,
        saveGroup,
        deleteGroup,
        getGroupColor,
        setGroupColor,
        createAnother,
        updateGroup,
        id: groupToEdit?.id || -1,
    };
};
