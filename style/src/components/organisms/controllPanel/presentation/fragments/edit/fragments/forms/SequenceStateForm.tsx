import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { SequenceStateTO } from "../../../../../../../../dataAccess/access/to/SequenceStateTO";
import { StateTO } from "../../../../../../../../dataAccess/access/to/StateTO";
import { masterDataSelectors } from "../../../../../../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import { DavitBackButton, Form } from "../../../../../../../atomic";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { useSequenceViewModel } from "../viewmodels/SequenceViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { StateList } from "./fragments/StateList";

interface StateFormProps {
}

export const SequenceStateForm: FunctionComponent<StateFormProps> = () => {

    const {
        saveSequenceState,
        editSequence,
        createSequenceState,
        deleteSequenceState,
        id,
    } = useSequenceViewModel();

    const sequenceStates: SequenceStateTO[] = useSelector(masterDataSelectors.selectSequenceStateBySequenceId(id));

    const closeStateForm = () => {
        if (!sequenceStates.some(state => state.label === "")) {
            sequenceStates.forEach(saveSequenceState);
            editSequence();
        }
    };

    const setIsState = (stateToToggle: StateTO, is: boolean) => {
        const copyStateToToggle: StateTO = DavitUtil.deepCopy(stateToToggle);
        copyStateToToggle.isState = is;
        saveSequenceState(copyStateToToggle as SequenceStateTO);
    };

    const changeName = (name: string, stateId: number) => {
        const stateToChangeName: SequenceStateTO | undefined = sequenceStates.find(state => state.id === stateId);
        if (stateToChangeName) {
            const copyStatToChangeName: SequenceStateTO = DavitUtil.deepCopy(stateToChangeName);
            copyStatToChangeName.label = name;
            saveSequenceState(copyStatToChangeName);
        }
    };

    return (
        <Form>
            <FormHeader>
                <h2>State</h2>
            </FormHeader>

            <FormDivider />

            <FormBody>

                <div className="width-fluid">
                    <StateList statesToEdit={sequenceStates}
                               stateColumnName="Default"
                               addStateCallback={createSequenceState}
                               removeStateCallback={deleteSequenceState}
                               setActiveCallback={setIsState}
                               changeName={changeName}
                    />
                </div>

            </FormBody>

            <FormFooter>
                <DavitBackButton onClick={closeStateForm} />
            </FormFooter>

        </Form>
    );
};
