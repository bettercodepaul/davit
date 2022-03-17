/* eslint-disable react/display-name */
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DavitTable } from "../../../../components/organisms/table/DavitTable";
import { ChainLinkCTO } from "../../../../dataAccess/access/cto/ChainlinkCTO";
import { SequenceCTO } from "../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../../dataAccess/access/to/ActionTO";
import { ChainDecisionTO } from "../../../../dataAccess/access/to/ChainDecisionTO";
import { ChainTO } from "../../../../dataAccess/access/to/ChainTO";
import { ConditionTO } from "../../../../dataAccess/access/to/ConditionTO";
import { DecisionTO } from "../../../../dataAccess/access/to/DecisionTO";
import { SequenceConfigurationTO } from "../../../../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceTO } from "../../../../dataAccess/access/to/SequenceTO";
import { CalcChain } from "../../../../services/SequenceChainService";
import { CalculatedStep } from "../../../../services/SequenceService";
import { editSelectors, Mode } from "../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../../../slices/SequenceModelSlice";
import { DavitUtil } from "../../../../utils/DavitUtil";
import { TabPanel } from "../fragments/TabPanel";
import { useGetCalcErrorActionsTableData } from "../tables/calculated/CalcErrorActions";
import { useGetCalcLinkTableData } from "../tables/calculated/CalcLink";
import { useGetCalcSequenceTableData } from "../tables/calculated/CalcSequence";
import { useGetChainModelsTableData } from "../tables/model/ModelChain";
import { useGetModelChainDecisionTableData } from "../tables/model/ModelChainDecision";
import { useGetModelChainLinkTableData } from "../tables/model/ModelChainLink";
import { useGetDataSetupTableData } from "../tables/model/ModelDataSetup";
import { useGetSequenceModelsTableBody } from "../tables/model/ModelSequence";
import { useGetModelSequenceConditionTableData } from "../tables/model/ModelSequenceCondition";
import { useGetModelSequenceDecisionTableData } from "../tables/model/ModelSequenceDecision";
import { useGetStepTableData } from "../tables/model/ModelSequenceStep";
import { useGetStepActionTableData } from "../tables/model/ModelSequenceStepAction";

interface TableModelControllerProps {
}

export enum ActiveTab {
    condition = "condition",
    action = "action",
    errorAction = "errorAction",
    step = "step",
    decision = "decision",
    sequence = "sequence",
    chain = "chain",
    chainLinks = "chainLinks",
    chainDecisions = "chainDecisions",
    sequenceModels = "sequenceModels",
    chainModel = "chainModels",
    dataSetup = "dataSetup",
}

export const TableModelController: FunctionComponent<TableModelControllerProps> = () => {
    const {
        showChainModelTab,
        showSequenceModelTabs,
        showCalcChainTab,
        showCalcSequenceTab,
        showErrorTab,
        activeTab,
        setActiveTab,
        activeTableData,
        tableHeight,
        parentRef,
    } = useSequenceTableViewModel();

    return (
        <div className={"sequenceTable padding-tiny"}
             ref={parentRef}
        >
            <div className="tableBorder">
                <TabPanel
                    showChainModelTab={showChainModelTab}
                    showSequenceModelTabs={showSequenceModelTabs}
                    showCalcChainTab={showCalcChainTab}
                    showCalcSequenceTab={showCalcSequenceTab}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    showErrorTab={showErrorTab}
                />
                <DavitTable {...activeTableData} tableHeight={tableHeight} />
            </div>
        </div>
    );
};

const useSequenceTableViewModel = () => {
    const mode: Mode = useSelector(editSelectors.selectMode);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
    const selectedStep: SequenceStepCTO | null = useSelector(editSelectors.selectStepToEdit);
    const calcSteps: CalculatedStep[] = useSelector(sequenceModelSelectors.selectCalcSteps);
    const calcChain: CalcChain | null = useSelector(sequenceModelSelectors.selectCalcChain);
    const sequences: SequenceTO[] = useSelector(masterDataSelectors.selectSequences);
    const dataSetups: SequenceConfigurationTO[] = useSelector(masterDataSelectors.selectSequenceConfigurations);
    const selectedChain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const chainModels: ChainTO[] = useSelector(masterDataSelectors.selectChains);
    const selectedChainlinks: ChainLinkCTO[] = useSelector(sequenceModelSelectors.selectCurrentChainLinks);
    const selectedChainDecisions: ChainDecisionTO[] = useSelector(sequenceModelSelectors.selectCurrentChainDecisions);
    const selectedActionToEdit: ActionTO | null = useSelector(editSelectors.selectActionToEdit);
    const selectedDecisionToEdit: DecisionTO | null = useSelector(editSelectors.selectDecisionToEdit);
    const selectedConditionToEdit: ConditionTO | null = useSelector(editSelectors.selectConditionToEdit);
    const selectedErrors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);

    const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.sequence);

    useEffect(() => {
        let newActiveTab: ActiveTab | undefined = undefined;
        switch (mode) {
            case Mode.VIEW:
                if (selectedChain) {
                    newActiveTab = ActiveTab.chain;
                } else {
                    newActiveTab = ActiveTab.sequence;
                }
                break;
            case Mode.EDIT_CHAIN:
                newActiveTab = ActiveTab.chainModel;
                break;
            case Mode.EDIT_CHAIN_DECISION:
            case Mode.EDIT_CHAIN_DECISION_CONDITION:
                newActiveTab = ActiveTab.chainDecisions;
                break;
            case Mode.EDIT_SEQUENCE:
                newActiveTab = ActiveTab.step;
                break;
            case Mode.EDIT_SEQUENCE_DECISION:
            case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
                newActiveTab = ActiveTab.condition;
                break;
            case Mode.EDIT_SEQUENCE_STEP:
                newActiveTab = ActiveTab.action;
                break;
            case Mode.EDIT_SEQUENCE_STEP_ACTION:
                newActiveTab = ActiveTab.action;
                break;
        }
        if (newActiveTab) {
            setActiveTab(newActiveTab);
        }
    }, [mode, selectedChain]);

    const dataSetupData = useGetDataSetupTableData(dataSetups);
    const modelSequenceData = useGetSequenceModelsTableBody(sequences);
    const modelSequenceDecisionData = useGetModelSequenceDecisionTableData(selectedSequence);
    const modelSequenceConditionData = useGetModelSequenceConditionTableData(
        selectedDecisionToEdit,
        selectedConditionToEdit,
    );
    const modelSequenceStepData = useGetStepTableData(selectedSequence);

    const getStep = (): SequenceStepCTO | null => {
        let stepToShow: SequenceStepCTO | null = null;
        /**
         * In case to edit a action we want to show all other actions containing in the current step to edit.
         */
        if (mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
            if (selectedActionToEdit) {
                const step: SequenceStepCTO | undefined = selectedSequence?.sequenceStepCTOs.find(
                    (step) => step.sequenceStepTO.id === selectedActionToEdit?.sequenceStepFk,
                );
                if (step) {
                    stepToShow = step;
                }
            }
        } else {
            stepToShow = selectedStep;
        }
        return stepToShow;
    };

    const modelStepActionData = useGetStepActionTableData(getStep());

    const modelChainData = useGetChainModelsTableData(chainModels);
    const modelChainDecisionData = useGetModelChainDecisionTableData(
        calcChain,
        selectedChainlinks,
        selectedChainDecisions,
    );
    const modelChainLinkData = useGetModelChainLinkTableData(selectedChainlinks, selectedChainDecisions);
    const calcSequenceData = useGetCalcSequenceTableData(calcSteps, selectedSequence);
    const calcLinkData = useGetCalcLinkTableData(calcChain);

    const calcErrorAction = useGetCalcErrorActionsTableData(selectedErrors);

    const getActiveTableData = () => {
        switch (activeTab) {
            case ActiveTab.chain:
                return calcLinkData;
            case ActiveTab.chainDecisions:
                return modelChainDecisionData;
            case ActiveTab.chainLinks:
                return modelChainLinkData;
            case ActiveTab.action:
                return modelStepActionData;
            case ActiveTab.step:
                return modelSequenceStepData;
            case ActiveTab.decision:
                return modelSequenceDecisionData;
            case ActiveTab.condition:
                return modelSequenceConditionData;
            case ActiveTab.sequence:
                return calcSequenceData;
            case ActiveTab.sequenceModels:
                return modelSequenceData;
            case ActiveTab.chainModel:
                return modelChainData;
            case ActiveTab.dataSetup:
                return dataSetupData;
            case ActiveTab.errorAction:
                return calcErrorAction;
            default:
                return {header: [], bodyData: []};
        }
    };

    const parentRef = useRef<HTMLDivElement>(null);

    const [tableHeight, setTabelHeihgt] = useState<number>(0);

    useEffect(() => {
        const resizeListener = () => {
            if (parentRef && parentRef.current) {
                setTabelHeihgt(parentRef.current.offsetHeight - 120);
            }
        };

        resizeListener();
        window.addEventListener("resize", resizeListener);

        return () => {
            window.removeEventListener("resize", resizeListener);
        };
    }, [parentRef]);

    return {
        showChainModelTab: !DavitUtil.isNullOrUndefined(selectedChain),
        showSequenceModelTabs: !DavitUtil.isNullOrUndefined(selectedSequence),
        showCalcChainTab: !DavitUtil.isNullOrUndefined(calcChain),
        showCalcSequenceTab: calcSteps.length > 0,
        showErrorTab: selectedErrors.length > 0,
        activeTab,
        setActiveTab,
        activeTableData: getActiveTableData(),
        tableHeight,
        parentRef,
    };
};
