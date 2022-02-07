// ----------------------------------------------- DECISION -----------------------------------------------

import { ConditionTO } from "../../dataAccess/access/to/ConditionTO";
import { DecisionTO } from "../../dataAccess/access/to/DecisionTO";
import { AppThunk } from "../../store";
import { DavitUtil } from "../../utils/DavitUtil";
import { editActions } from "../EditSlice";
import { EditDecision } from "./DecisionThunks";

const saveConditionThunk = (conditionToSave: ConditionTO): AppThunk => (dispatch) => {
    const decisionToSave: DecisionTO = EditDecision.find(conditionToSave.decisionFk);
    const copyDecisionToSave: DecisionTO = DavitUtil.deepCopy(decisionToSave);
    const filteredConditions: ConditionTO[] = copyDecisionToSave.conditions.filter(
        (condition) => condition.id !== conditionToSave.id,
    );
    filteredConditions.push(conditionToSave);
    copyDecisionToSave.conditions = filteredConditions;
    dispatch(EditDecision.save(copyDecisionToSave));
};

const updateConditionThunk = (condition: ConditionTO): AppThunk => (dispatch) => {
    if (condition) {
        dispatch(editActions.setConditionToEdit(condition));
    }
};

const deleteConditionThunk = (conditionToDelete: ConditionTO): AppThunk => (dispatch) => {
    if (conditionToDelete) {
        const decisionToEdit: DecisionTO = EditDecision.find(conditionToDelete.decisionFk);
        const copyDecision: DecisionTO = DavitUtil.deepCopy(decisionToEdit);
        const filteredConditions: ConditionTO[] = copyDecision.conditions.filter(
            (condition) => condition.id !== conditionToDelete.id,
        );
        copyDecision.conditions = filteredConditions;
        dispatch(EditDecision.save(copyDecision));
    }
};

export const EditCondition = {
    update: updateConditionThunk,
    save: saveConditionThunk,
    delete: deleteConditionThunk,
};
