import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../dataAccess/access/to/ActionTO";
import { DataTO, DATA_INSTANCE_ID_FACTOR, getDataAndInstanceIds } from "../../../dataAccess/access/to/DataTO";
import { DecisionTO } from "../../../dataAccess/access/to/DecisionTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { ActionType } from "../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors } from "../../../slices/EditSlice";
import { MasterDataActions, masterDataSelectors } from "../../../slices/MasterDataSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { ComponentData } from "../../../viewDataTypes/ComponentData";
import { ViewFragmentProps } from "../../../viewDataTypes/ViewFragment";
import { ViewFragmentState } from "../../../viewDataTypes/ViewFragmentState";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {
  fullScreen?: boolean;
}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  const { fullScreen } = props;

  const {
    components,
    getArrows,
    saveComp,
    groups,
    getCompDatas,
    componentCTOToEdit,
    handleComponentClickEvent,
  } = useViewModel();

  return (
    <MetaComponentDnDBox
      componentCTOs={components}
      onSaveCallBack={saveComp}
      arrows={getArrows()}
      componentCTOToEdit={componentCTOToEdit}
      groups={groups}
      componentDatas={getCompDatas()}
      onClick={handleComponentClickEvent}
      fullScreen={fullScreen}
    />
  );
};

export interface Arrows {
  sourceComponentId: number;
  targetComponentId: number;
}

const useViewModel = () => {
  // ====== SELECTORS =====
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const groups: GroupTO[] = useSelector(masterDataSelectors.groups);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const dispatch = useDispatch();
  // ----- EDIT -----
  const componentCTOToEdit: ComponentCTO | null = useSelector(editSelectors.componentToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
  const initDataToEdit: InitDataTO | null = useSelector(editSelectors.initDataToEdit);
  // ----- VIEW -----
  const arrows: Arrows[] = useSelector(sequenceModelSelectors.selectCurrentArrows);
  const currentComponentDatas: ComponentData[] = useSelector(sequenceModelSelectors.selectComponentData);
  const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);
  const actions: ActionTO[] = useSelector(sequenceModelSelectors.selectActions);

  React.useEffect(() => {
    dispatch(MasterDataActions.loadComponentsFromBackend());
    dispatch(MasterDataActions.loadGroupsFromBackend());
  }, [dispatch]);

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(EditActions.component.save(componentCTO));
  };

  const getArrows = (): Arrows[] => {
    const allArrows: Arrows[] = [];
    arrows.forEach((arrow) => allArrows.push(arrow));
    if (stepToEdit) {
      allArrows.push({
        sourceComponentId: stepToEdit.squenceStepTO.sourceComponentFk,
        targetComponentId: stepToEdit.squenceStepTO.targetComponentFk,
      });
    }
    return allArrows;
  };

  const getCompDatas = () => {
    let compDatas: ViewFragmentProps[] = [];
    compDatas.push(...getComponentDatasFromView());
    compDatas.push(...getComponentDatasFromEdit());
    return compDatas;
  };

  const getComponentDatasFromView = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    const compDatasFromErros: ViewFragmentProps[] = errors.map(mapActionToComponentDatas);
    const compDatasFromActions: ViewFragmentProps[] = actions.map(mapActionToComponentDatas);
    const compDatasFromCompDatas: ViewFragmentProps[] = currentComponentDatas.map(mapComponentDataToCompoenntData);
    compDatas.push(...compDatasFromErros);
    compDatas.push(
      ...compDatasFromActions.filter(
        (compDataFromAction) => !compDatas.some((cp) => compDataExists(cp, compDataFromAction))
      )
    );
    compDatas.push(
      ...compDatasFromCompDatas.filter(
        (compDataFromCompData) => !compDatas.some((cp) => compDataExists(cp, compDataFromCompData))
      )
    );
    return compDatas;
  };

  const getComponentDatasFromEdit = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    const compDatasFromStepToEdit: ViewFragmentProps[] = stepToEdit?.actions.map(mapActionToComponentDatas) || [];
    const compDataFromActionToEdit: ViewFragmentProps | undefined = actionToEdit
      ? mapActionToComponentDatas(actionToEdit)
      : undefined;
    const compDataFromDecisionToEdit: ViewFragmentProps[] = mapDecisionToCompData(decisionToEdit);
    const compDatasFromDataSetup: ViewFragmentProps[] = dataSetupToEdit
      ? dataSetupToEdit.initDatas.map(mapInitDataToCompData)
      : [];
    const compDatasFromInitData: ViewFragmentProps | undefined = initDataToEdit
      ? mapInitDataToCompData(initDataToEdit)
      : undefined;
    compDatas.push(...compDatasFromStepToEdit);
    compDatas.push(...compDataFromDecisionToEdit);
    compDatas.push(...compDatasFromDataSetup);
    if (compDataFromActionToEdit) {
      compDatas.push(compDataFromActionToEdit);
    }
    if (compDatasFromInitData) {
      compDatas.push(compDatasFromInitData);
    }
    return compDatas;
  };

  const compDataExists = (propOne: ViewFragmentProps, propTwo: ViewFragmentProps) => {
    return propOne.parentId === propTwo.parentId && propOne.name === propTwo.name;
  };

  const mapActionToComponentDatas = (errorItem: ActionTO): ViewFragmentProps => {
    const state: ViewFragmentState = mapActionTypeToViewFragmentState(errorItem.actionType);
    return { name: getDataNameById(errorItem.dataFk), state: state, parentId: errorItem.componentFk };
  };

  const mapComponentDataToCompoenntData = (compData: ComponentData): ViewFragmentProps => {
    return {
      name: getDataNameById(compData.dataFk),
      parentId: compData.componentFk,
      state: ViewFragmentState.PERSISTENT,
    };
  };

  const mapDecisionToCompData = (decision: DecisionTO | null): ViewFragmentProps[] => {
    let props: ViewFragmentProps[] = [];
    if (decision) {
      props = decision.dataFks.map((data) => {
        return {
          parentId: decision.componentFk,
          name: getDataNameById(data),
          state: decision.has ? ViewFragmentState.CHECKED : ViewFragmentState.DELETED,
        };
      });
    }
    return props;
  };

  const mapInitDataToCompData = (initData: InitDataTO): ViewFragmentProps => {
    return {
      parentId: initData.componentFk,
      name: getDataNameById(initData.dataFk),
      state: ViewFragmentState.NEW,
    };
  };

  const getDataNameById = (id: number): string => {
    if (id < DATA_INSTANCE_ID_FACTOR) {
      return datas.find((data) => data.data.id === id)?.data.name || "Could not find Data";
    } else {
      const ids = getDataAndInstanceIds(id);
      const data: DataTO | undefined = datas.find((data) => data.data.id === ids.dataId)?.data;
      const instance = data?.inst.find((instance) => instance.id === ids.instanceId);
      return instance && data ? data.name + ": " + instance.name : "Could not find Data";
    }
  };

  const mapActionTypeToViewFragmentState = (actionType: ActionType): ViewFragmentState => {
    let cdState: ViewFragmentState;
    switch (actionType) {
      case ActionType.ADD:
        cdState = ViewFragmentState.NEW;
        break;
      case ActionType.DELETE:
        cdState = ViewFragmentState.DELETED;
        break;
    }
    return cdState;
  };

  return {
    components,
    componentCTOToEdit,
    getArrows,
    saveComp,
    groups,
    getCompDatas,
    handleComponentClickEvent: (componentId: number) =>
      dispatch(SequenceModelActions.handleComponentClickEvent(componentId)),
  };
};
