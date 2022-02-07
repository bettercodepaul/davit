import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { editSelectors, Mode } from "../../../../slices/EditSlice";
import { ActiveTab } from "../presentation/TableModelController";
import { TabFragment } from "./TabFragment";
import { TabGroupFragment } from "./TabGroupFragment";

interface TabPanelProps {
    activeTab: ActiveTab;
    setActiveTab: (newActiveTab: ActiveTab) => void;
    showChainModelTab: boolean;
    showSequenceModelTabs: boolean;
    showCalcChainTab: boolean;
    showCalcSequenceTab: boolean;
    showErrorTab: boolean;
}

interface TabGroupDefinition {
    label: string;
    tabs: TabDefinition[];
    condition?: boolean;
}

interface TabDefinition {
    label: string;
    identifier: ActiveTab;
    condition?: boolean;
}

export const TabPanel: FunctionComponent<TabPanelProps> = (props) => {
    const {
        activeTab,
        setActiveTab,
        showCalcChainTab,
        showCalcSequenceTab,
        showChainModelTab,
        showSequenceModelTabs,
        showErrorTab,
    } = props;

    const mode: Mode = useSelector(editSelectors.selectMode);

    const getSequenceModelTabGroupDefinition = (): TabGroupDefinition => {
        const tabs: TabDefinition[] = [
            {
                label: "Decision",
                identifier: ActiveTab.decision,
            },
            {
                label: "Steps",
                identifier: ActiveTab.step,
            },
        ];

        if (mode === Mode.EDIT_SEQUENCE_STEP || mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
            tabs.push({label: "Actions", identifier: ActiveTab.action});
        }

        if (mode === Mode.EDIT_SEQUENCE_DECISION || mode === Mode.EDIT_SEQUENCE_DECISION_CONDITION) {
            tabs.push({label: "Condition", identifier: ActiveTab.condition});
        }

        return {
            label: "Sequence Model",
            condition: showSequenceModelTabs,
            tabs: tabs,
        };
    };

    const tabDefinitions: TabGroupDefinition[] = [
        {
            label: "Calculated",
            condition: showCalcChainTab || showCalcSequenceTab,
            tabs: [
                {
                    label: "Chain",
                    identifier: ActiveTab.chain,
                    condition: showCalcChainTab,
                },
                {
                    label: "Sequence",
                    identifier: ActiveTab.sequence,
                    condition: showCalcSequenceTab,
                },
                {
                    label: "Errors",
                    identifier: ActiveTab.errorAction,
                    condition: showErrorTab,
                },
            ],
        },
        {
            label: "Chain Model",
            condition: showChainModelTab,
            tabs: [
                {
                    label: "Decision",
                    identifier: ActiveTab.chainDecisions,
                },
                {
                    label: "Links",
                    identifier: ActiveTab.chainLinks,
                },
            ],
        },
        getSequenceModelTabGroupDefinition(),
        {
            label: "Models",
            tabs: [
                {
                    label: "Chain",
                    identifier: ActiveTab.chainModel,
                },
                {
                    label: "Sequence",
                    identifier: ActiveTab.sequenceModels,
                },
                {
                    label: "Data Setup",
                    identifier: ActiveTab.dataSetup,
                },
            ],
        },
    ];

    const mapTabGroups = (tabGroup: TabGroupDefinition, index: number) => {
        return (
            (tabGroup.condition === undefined || tabGroup.condition) && (
                <TabGroupFragment label={tabGroup.label}
                                  key={index}
                >
                    {tabGroup.tabs.map(
                        (tab: any, index) =>
                            (tab.condition === undefined || tab.condition) && (
                                <TabFragment
                                    label={tab.label}
                                    isActive={activeTab === tab.identifier}
                                    onClick={() => setActiveTab(tab.identifier)}
                                    key={index}
                                />
                            ),
                    )}
                </TabGroupFragment>
            )
        );
    };

    const getTabsKey = () => {
        let key = showCalcChainTab ? "chain" : "";
        key += showSequenceModelTabs ? "seqModel" : "";
        key += showChainModelTab ? "chainModel" : "";
        key += showCalcSequenceTab ? "seq" : "";
        return key;
    };

    return (
        <div className="tabs"
             key={getTabsKey()}
        >
            {tabDefinitions.map(mapTabGroups)}
        </div>
    );
};
