import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { ArcherContainer, ArcherElement } from "react-archer";
import { useSelector } from "react-redux";
import { StateView } from "../../../components/molecules/StateView";
import { ChainCTO } from "../../../dataAccess/access/cto/ChainCTO";
import { ChainLinkCTO } from "../../../dataAccess/access/cto/ChainlinkCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ChainDecisionTO } from "../../../dataAccess/access/to/ChainDecisionTO";
import { RelationType } from "../../../dataAccess/access/to/DataRelationTO";
import { DecisionTO } from "../../../dataAccess/access/to/DecisionTO";
import { GoTo, GoToTypes, Terminal } from "../../../dataAccess/access/types/GoToType";
import { GoToChain, GoToTypesChain, TerminalChain } from "../../../dataAccess/access/types/GoToTypeChain";
import { CalcChain } from "../../../services/SequenceChainService";
import { SequenceModelActions, sequenceModelSelectors, ViewLevel } from "../../../slices/SequenceModelSlice";
import { useAppDispatch } from "../../../store";
import { DavitUtil } from "../../../utils/DavitUtil";
import { TabFragment } from "../tableModel/fragments/TabFragment";
import { TabGroupFragment } from "../tableModel/fragments/TabGroupFragment";
import "./FlowChart.css";

interface FlowChartControllerProps {
}

export const FlowChartController: FunctionComponent<FlowChartControllerProps> = () => {
        const {
            nodeModelTree,
            calcSteps,
            calcLinkIds,
            lineColor,
            currentStepId,
            nodeModelChainTree,
            currentLinkId,
            chain,
            sequence,
            chainLineColor,
            viewLevel,
            setViewLevelToChain,
            setViewLevelToSequence,
        } = useFlowChartViewModel();

        const [tableHeight, setTableHeight] = useState<number>(0);

        const parentRef = useRef<HTMLDivElement>(null);

        // TODO: move this in to custom hook in WindowUtils
        useEffect(() => {
            const resizeListener = () => {
                if (parentRef && parentRef.current) {
                    setTableHeight(parentRef.current.offsetHeight);
                }
            };

            resizeListener();
            window.addEventListener("resize", resizeListener);

            return () => {
                window.removeEventListener("resize", resizeListener);
            };
        }, [parentRef]);

        const buildSequenceChart = (node: NodeModel): JSX.Element => {
            const rel: RelationType[] = [];

            // if (node.parentId) {
            //     rel.push({
            //         targetId: node.parentId,
            //         targetAnchor: "bottom",
            //         sourceAnchor: "top",
            //         style: {
            //             strokeColor:
            //                 calcSteps.find((step) => step === node.parentId) && calcSteps.find((step) => step === node.id)
            //                     ? lineColor()
            //                     : "var(--background-color-header)",
            //             strokeWidth:
            //                 calcSteps.find((step) => step === node.parentId) && calcSteps.find((step) => step === node.id)
            //                     ? 5
            //                     : 3,
            //         },
            //     });
            // }

            return (
                <div className="flowChartFlex"
                     style={{margin: node.id === "root" ? "" : "50px 0"}}
                     key={node.id}
                >
                    <ArcherElement id={node.id}
                                   // relations={rel}
                    >
                        <div
                            className={node.id === "root" ? "ROOT" : node.leafType}
                            id={currentStepId === node.id ? "flowChartCurrentStep" : ""}
                        >
                            {node.id === "root" || node.leafType === GoToTypes.DEC ? "" : node.label}
                        </div>
                    </ArcherElement>
                    {node.leafType === GoToTypes.DEC && <div className="condLabel">{node.label}</div>}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "start",
                            width: "100%",
                        }}
                    >
                        {node.childs.map(buildSequenceChart)}
                    </div>
                </div>
            );
        };

        const buildChainChart = (node: NodeModelChain): JSX.Element => {
            // const rel: Relation[] = [];

            // if (node.parentId) {
                // rel.push({
                //     targetId: node.parentId,
                //     targetAnchor: "bottom",
                //     sourceAnchor: "top",
                //     style: {
                //         strokeColor:
                //             calcLinkIds?.find((link) => link === node.parentId) &&
                //             calcLinkIds.find((link) => link === node.id)
                //                 ? chainLineColor()
                //                 : "var(--background-color-header)",
                //         strokeWidth:
                //             calcLinkIds?.find((link) => link === node.parentId) &&
                //             calcLinkIds.find((link) => link === node.id)
                //                 ? 5
                //                 : 3,
                //     },
                // });
            // }

            return (
                <div className="flowChartFlex"
                     style={{margin: node.id === "root" ? "" : "50px 0"}}
                     key={node.id}
                >
                    <ArcherElement id={node.id}
                                   // relations={rel}
                    >
                        <div className={node.leafType}
                             id={currentLinkId === node.id ? "flowChartCurrentStep" : ""}
                        >
                            {node.leafType === GoToTypesChain.DEC ? "" : node.label}
                        </div>
                    </ArcherElement>
                    {node.leafType === GoToTypesChain.DEC && <div className="condLabel">{node.label}</div>}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "start",
                            width: "100%",
                        }}
                    >
                        {node.childs.map(buildChainChart)}
                    </div>
                </div>
            );
        };

        const buildFlowChart = (): JSX.Element => {
            return (
                <ArcherContainer noCurves={true}>
                    {buildSequenceChart(nodeModelTree)}
                </ArcherContainer>
            );
        };

        const buildChainFlowChart = (): JSX.Element => {
            return (
                <ArcherContainer noCurves={true}>
                    {buildChainChart(nodeModelChainTree)}
                </ArcherContainer>
            );
        };

        const renderFlowChart = (): boolean => {
            return !(!sequence && !chain);
        };

        return (
            <div className="flowChartModel"
                 ref={parentRef}
            >
                {!renderFlowChart() &&
                <h2 className={"fluid flex flex-center"}>{"Select a sequence or chain to see the flow chart"}</h2>
                }

                {renderFlowChart() &&
                <div className="flowChart padding-small"
                     style={{height: tableHeight}}
                >
                    <div className="flowChartHeader">
                        {chain && <TabGroupFragment label="Mode">
                            <TabFragment label="Chain"
                                         isActive={viewLevel === ViewLevel.chain}
                                         onClick={setViewLevelToChain}
                            />
                            <TabFragment label="Sequence"
                                         isActive={viewLevel === ViewLevel.sequence}
                                         onClick={setViewLevelToSequence}
                            />
                        </TabGroupFragment>}
                        <StateView showChain={viewLevel === ViewLevel.chain} />
                    </div>
                    {viewLevel === ViewLevel.sequence && sequence && buildFlowChart()}
                    {viewLevel === ViewLevel.chain && chain && buildChainFlowChart()}
                </div>}
            </div>
        );
    }
;

// ------------------------------------------- Interfaces ------------------------------------------------------------

interface NodeModel {
    parentId?: string;
    id: string;
    label: string;
    leafType: GoToTypes;
    childs: NodeModel[];
}

interface NodeModelChain {
    parentId?: string;
    id: string;
    label: string;
    leafType: GoToTypesChain;
    childs: NodeModelChain[];
}

interface Node {
    value: SequenceStepCTO | DecisionTO | Terminal;
    isLoop: boolean;
    type: GoToTypes;
}

interface NodeChain {
    value: ChainLinkCTO | ChainDecisionTO | TerminalChain;
    isLoop: boolean;
    type: GoToTypesChain;
}

// ------------------------------------------- View model ------------------------------------------------------------

const useFlowChartViewModel = () => {
        const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
        const terminalStep: Terminal | null = useSelector(sequenceModelSelectors.selectTerminalStep);
        const stepIds: string[] = useSelector(sequenceModelSelectors.selectCalcStepIds);
        const chain: ChainCTO | null = useSelector(sequenceModelSelectors.selectChainCTO);
        const calcChain: CalcChain | null = useSelector(sequenceModelSelectors.selectCalcChain);
        const currentStepId: string = useSelector(sequenceModelSelectors.selectCurrentStepId);
        const currentLinkId: string = useSelector(sequenceModelSelectors.selectCurrentLinkId);
        const viewLevel: ViewLevel = useSelector(sequenceModelSelectors.selectViewLevel);
        const dispatch = useAppDispatch();

        const getRoot = (sequence: SequenceCTO | null): Node => {
            const root: Node = {
                type: GoToTypes.ERROR,
                value: {type: GoToTypes.ERROR},
                isLoop: false,
            };
            if (!DavitUtil.isNullOrUndefined(sequence)) {
                const rootStep: SequenceStepCTO | undefined = sequence!.sequenceStepCTOs.find(
                    (step) => step.sequenceStepTO.root,
                );
                const rootCond: DecisionTO | undefined = sequence!.decisions.find((cond) => cond.root);

                if (rootStep && !rootCond) {
                    root.type = GoToTypes.STEP;
                    root.value = rootStep;
                }
                if (rootCond && !rootStep) {
                    root.type = GoToTypes.DEC;
                    root.value = rootCond;
                }
            }
            return root;
        };

        const getChainRoot = (chain: ChainCTO | null): NodeChain => {
            const root: NodeChain = {
                type: GoToTypesChain.ERROR,
                value: {type: GoToTypesChain.ERROR},
                isLoop: false,
            };
            if (!DavitUtil.isNullOrUndefined(chain)) {
                const rootStep: ChainLinkCTO | undefined = chain!.links.find((link) => link.chainLink.root);
                if (rootStep) {
                    root.type = GoToTypesChain.LINK;
                    root.value = rootStep;
                }
            }
            return root;
        };

        const setGoToAsNode = (goto: GoTo, parentId: string, parentIds: string[]): NodeModel => {
            const nodeModel: NodeModel = {
                id: "",
                label: "",
                leafType: goto.type,
                parentId: parentId,
                childs: [],
            };
            if (!DavitUtil.isNullOrUndefined(sequence)) {
                switch (goto.type) {
                    case GoToTypes.STEP:
                        // eslint-disable-next-line no-case-declarations
                        const step: SequenceStepCTO | null =
                            sequence!.sequenceStepCTOs.find((step) => step.sequenceStepTO.id === goto.id) || null;
                        if (step) {
                            const prefix: string = "_STEP_" + step.sequenceStepTO.id;
                            nodeModel.id = parentId + prefix;
                            nodeModel.label = step.sequenceStepTO.name;
                            if (!parentId.includes(prefix)) {
                                parentIds.push(nodeModel.id);
                                nodeModel.childs.push(setGoToAsNode(step.sequenceStepTO.goto, nodeModel.id, parentIds));
                            }
                        }
                        break;
                    case GoToTypes.DEC:
                        // eslint-disable-next-line no-case-declarations
                        const cond: DecisionTO | null = sequence!.decisions.find((cond) => cond.id === goto.id) || null;
                        if (cond) {
                            const prefix: string = "_DEC_" + cond.id;
                            nodeModel.id = parentId + prefix;
                            nodeModel.label = cond.name;

                            if (!parentId.includes(prefix)) {
                                parentIds.push(nodeModel.id);
                                nodeModel.childs.push(setGoToAsNode(cond.ifGoTo, nodeModel.id, parentIds));
                                nodeModel.childs.push(setGoToAsNode(cond.elseGoTo, nodeModel.id, parentIds));
                            }
                            break;
                        }
                        break;
                    case GoToTypes.ERROR:
                        nodeModel.id = parentId + "_ERROR";
                        break;
                    case GoToTypes.FIN:
                        nodeModel.id = parentId + "_FIN";
                        break;
                    case GoToTypes.IDLE:
                        nodeModel.id = parentId + "_IDLE";
                        break;
                }
            }
            return nodeModel;
        };

        const setGoToAsNodeChain = (goto: GoToChain, parentId: string, parentIds: string[]): NodeModelChain => {
            const nodeModel: NodeModelChain = {
                id: "",
                label: "",
                leafType: goto.type,
                parentId: parentId,
                childs: [],
            };
            if (!DavitUtil.isNullOrUndefined(chain)) {
                switch (goto.type) {
                    case GoToTypesChain.LINK:
                        // eslint-disable-next-line no-case-declarations
                        const link: ChainLinkCTO | null =
                            chain!.links.find((link) => link.chainLink.id === goto.id) || null;
                        if (link) {
                            const prefix: string = "_LINK_" + link.chainLink.id;
                            nodeModel.id = parentId + prefix;
                            nodeModel.label = link.chainLink.name;
                            if (!parentId.includes(prefix)) {
                                parentIds.push(nodeModel.id);
                                nodeModel.childs.push(setGoToAsNodeChain(link.chainLink.goto, nodeModel.id, parentIds));
                            }
                        }
                        break;
                    case GoToTypesChain.DEC:
                        // eslint-disable-next-line no-case-declarations
                        const decision: ChainDecisionTO | null = chain!.decisions.find((dec) => dec.id === goto.id) || null;
                        if (decision) {
                            const prefix: string = "_DEC_" + decision.id;
                            nodeModel.id = parentId + prefix;
                            nodeModel.label = decision.name;

                            if (!parentId.includes(prefix)) {
                                parentIds.push(nodeModel.id);
                                nodeModel.childs.push(setGoToAsNodeChain(decision.ifGoTo, nodeModel.id, parentIds));
                                nodeModel.childs.push(setGoToAsNodeChain(decision.elseGoTo, nodeModel.id, parentIds));
                            }
                            break;
                        }
                        break;
                    case GoToTypesChain.ERROR:
                        nodeModel.id = parentId + "_ERROR";
                        break;
                    case GoToTypesChain.FIN:
                        nodeModel.id = parentId + "_FIN";
                        break;
                }
            }
            return nodeModel;
        };

        const getDataSetup = (): Node => {
            const initData: Node = {isLoop: false, type: GoToTypes.STEP, value: new SequenceStepCTO()};
            if (sequence) {
                const root: Node = getRoot(sequence);
                if ((root.value as SequenceStepCTO).actions) {
                    (initData.value as SequenceStepCTO).sequenceStepTO.goto = {
                        type: GoToTypes.STEP,
                        id: (root.value as SequenceStepCTO).sequenceStepTO.id,
                    };
                }
                if ((root.value as DecisionTO).elseGoTo) {
                    (initData.value as SequenceStepCTO).sequenceStepTO.goto = {
                        type: GoToTypes.DEC,
                        id: (root.value as DecisionTO).id,
                    };
                }
                initData.isLoop = false;
            }
            return initData;
        };

        const buildNodeModelTree = (node: Node): NodeModel => {
            const parentIds: string[] = [];
            const nodeModel: NodeModel = {id: "root", label: "", leafType: node.type, childs: []};
            switch (node.type) {
                case GoToTypes.STEP:
                    parentIds.push(nodeModel.id);
                    nodeModel.label = (node.value as SequenceStepCTO).sequenceStepTO.name;
                    nodeModel.childs.push(
                        setGoToAsNode((node.value as SequenceStepCTO).sequenceStepTO.goto, nodeModel.id, parentIds),
                    );
                    break;
                case GoToTypes.DEC:
                    parentIds.push(nodeModel.id);
                    nodeModel.label = (node.value as DecisionTO).name;
                    nodeModel.childs.push(setGoToAsNode((node.value as DecisionTO).ifGoTo, nodeModel.id, parentIds));
                    nodeModel.childs.push(setGoToAsNode((node.value as DecisionTO).elseGoTo, nodeModel.id, parentIds));
                    break;
            }
            return nodeModel;
        };

        const buildNodeModelChainTree = (node: NodeChain): NodeModelChain => {
            const parentIds: string[] = [];
            const nodeModel: NodeModelChain = {id: "", label: "", leafType: node.type, childs: []};
            parentIds.push(nodeModel.id);
            if ((node.value as ChainLinkCTO).chainLink) {
                nodeModel.id = (node.value as ChainLinkCTO).chainLink.id.toString();
                nodeModel.label = (node.value as ChainLinkCTO).chainLink.name;
                nodeModel.childs.push(
                    setGoToAsNodeChain((node.value as ChainLinkCTO).chainLink.goto, nodeModel.id, parentIds),
                );
            }
            return nodeModel;
        };

        const getSteps = (): string[] => {
            return DavitUtil.deepCopy(stepIds);
        };

        //TODO: do not use css variables here
        const getLineColor = (): string => {
            if (terminalStep) {
                switch (terminalStep.type) {
                    case GoToTypes.ERROR:
                        return "var(--color-error)";
                    case GoToTypes.FIN:
                        return "var(--color-green)";
                    case GoToTypes.IDLE:
                        return "var(--color-blue)";
                }
            } else {
                return "#FF00FF";
            }
        };

        //TODO: do not use css variables here
        const getChainLineColor = (): string => {
            if (calcChain) {
                switch (calcChain.terminal.type) {
                    case GoToTypesChain.ERROR:
                        return "var(--color-error)";
                    case GoToTypesChain.FIN:
                        return "var(--color-green)";
                }
            } else {
                return "#FF00FF";
            }
        };

        const setViewLevelToChain = () => {
            dispatch(SequenceModelActions.setViewLevel(ViewLevel.chain));
        };

        const setViewLevelToSequence = () => {
            dispatch(SequenceModelActions.setViewLevel(ViewLevel.sequence));
        };

        return {
            nodeModelTree: buildNodeModelTree(getDataSetup()),
            nodeModelChainTree: buildNodeModelChainTree(getChainRoot(chain)),
            currentStepId,
            calcSteps: getSteps(),
            calcLinkIds: calcChain?.linkIds,
            lineColor: getLineColor,
            chainLineColor: getChainLineColor,
            currentLinkId,
            sequence,
            chain,
            chainName: chain?.chain.name || "",
            sequenceName: sequence?.sequenceTO.name || "",
            viewLevel,
            setViewLevelToSequence,
            setViewLevelToChain
        };
    }
;
