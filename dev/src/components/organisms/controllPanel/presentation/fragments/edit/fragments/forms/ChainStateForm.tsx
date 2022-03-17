import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ChainStateTO } from "../../../../../../../../dataAccess/access/to/ChainStateTO";
import { StateTO } from "../../../../../../../../dataAccess/access/to/StateTO";
import { masterDataSelectors } from "../../../../../../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../../../../../../utils/DavitUtil";
import { DavitBackButton, Form } from "../../../../../../../atomic";
import { FormBody } from "../../../../../../../atomic/forms/fragments/FormBody";
import { FormFooter } from "../../../../../../../atomic/forms/fragments/FormFooter";
import { FormHeader } from "../../../../../../../atomic/forms/fragments/FormHeader";
import { useChainViewModel } from "../viewmodels/ChainViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { StateList } from "./fragments/StateList";

interface ChainStateFormProps {
}

export const ChainStateForm: FunctionComponent<ChainStateFormProps> = () => {

    const {
        saveStateFkAndStateCondition,
        editChain,
        createStateFkAndStateCondition,
        deleteStateFkAndStateCondition,
        id
    } = useChainViewModel();

    const chainStates: ChainStateTO[] = useSelector(masterDataSelectors.selectChainStateByChainId(id));

    const closeStateForm = () => {
        if (!chainStates.some(state => state.label === "")) {
            chainStates.forEach(saveStateFkAndStateCondition);
            editChain();
        }
    };

    const setIsState = (stateToToggle: StateTO, is: boolean) => {
        const copyStateToToggle: StateTO = DavitUtil.deepCopy(stateToToggle);
        copyStateToToggle.isState = is;
        saveStateFkAndStateCondition(copyStateToToggle as ChainStateTO);
    };

    const changeName = (name: string, stateId: number) => {
        const stateToChangeName: ChainStateTO | undefined = chainStates.find(state => state.id === stateId);
        if (stateToChangeName) {
            const copyStateToChangeName: ChainStateTO = DavitUtil.deepCopy(stateToChangeName);
            copyStateToChangeName.label = name;
            saveStateFkAndStateCondition(copyStateToChangeName);
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
                    <StateList statesToEdit={chainStates}
                               stateColumnName="Default"
                               addStateCallback={createStateFkAndStateCondition}
                               removeStateCallback={deleteStateFkAndStateCondition}
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
