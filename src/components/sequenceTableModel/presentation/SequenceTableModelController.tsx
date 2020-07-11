import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { GoToTypes, Terminal } from "../../../dataAccess/access/types/GoToType";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { CalculatedStep, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";

interface SequenceTableModelControllerProps { }

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (props) => {
  const { title, getTableBody } = useSequenceTableViewModel();

  return (
    <div className="sequenceTable">
      <div style={{ display: "flex", justifyContent: "center", width: "100%", color: "white" }}>
        <label>{title}</label>
      </div>
      <table className="carv2Table">
        <thead>
          <tr>
            <th className="carv2Th" style={{ width: "15px" }}>
              INDEX
            </th>
            <th className="carv2Th">NAME</th>
            <th className="carv2Th">SENDER</th>
            <th className="carv2Th">RECEIVER</th>
          </tr>
        </thead>
        <tbody className="carv2TBody">{getTableBody()}</tbody>
      </table>
    </div>
  );
};

const useSequenceTableViewModel = () => {
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const stepIndex: number | null = useSelector(sequenceModelSelectors.selectCurrentStepIndex);
  const calcSteps: CalculatedStep[] = useSelector(sequenceModelSelectors.selectCalcSteps);
  const terminalStep: Terminal | null = useSelector(sequenceModelSelectors.selectTerminalStep);
  const loopStepStartIndex: number | null = useSelector(sequenceModelSelectors.selectLoopStepStartIndex);

  const createStepColumn = (step: CalculatedStep, index: number): JSX.Element => {
    let trClass: string = loopStepStartIndex && loopStepStartIndex <= index ? "carv2TrTerminalError" : "carv2Tr";
    if (index === stepIndex) {
      trClass = "carv2TrMarked";
    }
    const modelStep: SequenceStepCTO | undefined = sequence?.sequenceStepCTOs.find(item => item.squenceStepTO.id === step.stepFk);
    const name = index === 0 && !modelStep ? "Initial" : modelStep?.squenceStepTO.name || "Step not found";
    const source = index === 0 && !modelStep ? "" : modelStep ? getComponentNameById(modelStep.squenceStepTO.sourceComponentFk) : "Source not found";
    const target = index === 0 && !modelStep ? "" : modelStep ? getComponentNameById(modelStep.squenceStepTO.targetComponentFk) : "Target not found";
    return (
      <tr key={index} className={trClass}>
        <td className="carv2Td">{index}</td>
        <td className="carv2Td">{name}</td>
        <td className="carv2Td">{source}</td>
        <td className="carv2Td">{target}</td>
      </tr>
    );
  };

  const createTerminalColumn = (terminal: Terminal): JSX.Element => {
    const className = terminal.type === GoToTypes.ERROR ? "carv2TrTerminalError" : "carv2TrTerminalSuccess";
    return (<tr key={"Terminal"} className={className}>
      <td>{" "}</td><td>{terminal.type}</td><td>{" "}</td><td>{" "}</td>
    </tr>)
  }

  const getTableBody = () => {
    let list: JSX.Element[] = [];
    list = calcSteps.map(createStepColumn);
    if (terminalStep) {
      list.push(createTerminalColumn(terminalStep))
    }
    let key: number = list.length;
    while (list.length < 10) {
      list.push(createEmptyRow(key.toString(), "carv2Tr"));
      key++;
    }
    return list;
  };

  const createEmptyRow = (key: string, className?: string): JSX.Element => {
    return (<tr key={key} className={className}>
      <td>{" "}</td><td>{" "}</td><td>{" "}</td><td>{" "}</td>
    </tr>)
  }

  const getComponentNameById = (id: number): string => {
    return components.find((comp) => comp.component.id === id)?.component.name || "Could not find Component!";
  };

  return {
    title: sequence ? sequence.sequenceTO.name : "Select Sequence ...",
    getTableBody,
  };
};
