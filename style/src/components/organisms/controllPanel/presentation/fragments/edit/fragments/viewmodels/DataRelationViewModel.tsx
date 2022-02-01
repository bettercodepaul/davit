import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataCTO } from "../../../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationTO, Direction, RelationType } from "../../../../../../../../dataAccess/access/to/DataRelationTO";
import { EditActions, editSelectors } from "../../../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../../../slices/GlobalSlice";
import { masterDataSelectors } from "../../../../../../../../slices/MasterDataSlice";
import { EditRelation } from "../../../../../../../../slices/thunks/RelationThunks";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import { DavitDropDownItemProps } from "../../../../../../../atomic/dropdowns/DavitDropDown";

export const useDataRelationViewModel = () => {
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);
    const relationToEdit: DataRelationTO | null = useSelector(editSelectors.selectRelationToEdit);
    const dispatch = useDispatch();
    const [key, setKey] = useState<number>(0);

    useEffect(() => {
        // check if component to edit is really set or go back to edit mode
        if (DavitUtil.isNullOrUndefined(relationToEdit)) {
            dispatch(EditActions.setMode.edit());
            dispatch(GlobalActions.handleError("Tried to go to edit relation without relationToedit specified"));
        }
    }, [relationToEdit, dispatch]);

    const dataToOption = (data: DataCTO): DavitDropDownItemProps => {
        return {
            key: data.data.id,
            text: data.data.name,
            value: data.data.id.toString(),
        };
    };

    const setData = (dataId: number, isSnd?: boolean) => {
        const relationCopy: DataRelationTO = DavitUtil.deepCopy(relationToEdit);
        isSnd ? (relationCopy.data2Fk = dataId) : (relationCopy.data1Fk = dataId);
        dispatch(EditActions.setMode.editRelation(relationCopy));
    };

    const setLabel = (label: string, isSnd?: boolean) => {
        const relationCopy: DataRelationTO = DavitUtil.deepCopy(relationToEdit);
        isSnd ? (relationCopy.label2 = label) : (relationCopy.label1 = label);
        dispatch(EditActions.setMode.editRelation(relationCopy));
    };

    const setDirection = (direction: Direction, isSnd?: boolean) => {
        const relationCopy: DataRelationTO = DavitUtil.deepCopy(relationToEdit);
        isSnd ? (relationCopy.direction2 = direction) : (relationCopy.direction1 = direction);
        dispatch(EditActions.setMode.editRelation(relationCopy));
    };

    const setType = (relationType: RelationType, isSnd?: boolean) => {
        const relationCopy: DataRelationTO = DavitUtil.deepCopy(relationToEdit);
        isSnd ? (relationCopy.type2 = relationType) : (relationCopy.type1 = relationType);
        dispatch(EditActions.setMode.editRelation(relationCopy));
    };

    const saveRelation = () => {
        if (relationToEdit?.data1Fk !== -1 && relationToEdit?.data2Fk !== -1) {
            dispatch(EditRelation.save(relationToEdit!));
        } else {
            deleteRelation();
        }
        dispatch(EditActions.setMode.edit());
    };

    const deleteRelation = () => {
        dispatch(EditRelation.delete(relationToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const updateRelation = () => {
        const copyRelationToEdit: DataRelationTO = DavitUtil.deepCopy(relationToEdit);
        dispatch(EditRelation.save(copyRelationToEdit));
    };

    const createAnother = () => {
        setKey(key + 1);
        dispatch(EditActions.setMode.editRelation());
    };

    const directionOptions = Object.entries(Direction).map(([key, value], index) => ({
        key: index,
        text: key,
        value: value.toString(),
    }));

    const typeOptions = Object.entries(RelationType).map(([key, value], index) => ({
        key: index,
        text: key,
        value: value.toString(),
    }));

    const validRelation = (): boolean => {
        let valid: boolean = false;
        if (!DavitUtil.isNullOrUndefined(relationToEdit)) {
            valid = relationToEdit!.data1Fk !== -1 && relationToEdit!.data2Fk !== -1;
        }
        return valid;
    };

    const saveNote = (text: string) => {
        if (!DavitUtil.isNullOrUndefined(relationToEdit) && text !== "") {
            const relationCopy: DataRelationTO = DavitUtil.deepCopy(relationToEdit);
            relationCopy.note = text;
            dispatch(EditActions.setMode.editRelation(relationCopy));
        }
    };

    return {
        label: "EDIT * RELATION",
        label1: relationToEdit?.label1,
        label2: relationToEdit?.label2,
        data1: relationToEdit?.data1Fk === -1 ? undefined : relationToEdit?.data1Fk.toString(),
        data2: relationToEdit?.data2Fk === -1 ? undefined : relationToEdit?.data2Fk.toString(),
        direction1: relationToEdit?.direction1,
        direction2: relationToEdit?.direction2,
        type1: relationToEdit?.type1,
        type2: relationToEdit?.type2,
        setLabel,
        setType,
        setDirection,
        setData,
        saveRelation,
        deleteRelation,
        cancel: () => dispatch(EditActions.setMode.edit()),
        dataOptions: datas.map(dataToOption),
        directionOptions,
        typeOptions,
        validRelation,
        key,
        createAnother,
        updateRelation,
        note: relationToEdit ? relationToEdit.note : "",
        saveNote,
    };
};
