import { SequenceStateTO } from "../../dataAccess/access/to/SequenceStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const saveSequenceStateThunk = (sequenceState: SequenceStateTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStateTO> = DataAccess.saveSequenceState(sequenceState);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequenceStatesFromBackend());
};

const deleteSequenceStateThunk = (stateId: number): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStateTO> = DataAccess.deleteSequenceState(stateId);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequenceStatesFromBackend());
};

export const EditSequenceState = {
    save: saveSequenceStateThunk,
    delete: deleteSequenceStateThunk,
};
