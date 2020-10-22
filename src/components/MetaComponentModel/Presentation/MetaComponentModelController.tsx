import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ComponentCTO } from '../../../dataAccess/access/cto/ComponentCTO';
import { DataCTO } from '../../../dataAccess/access/cto/DataCTO';
import { DataSetupCTO } from '../../../dataAccess/access/cto/DataSetupCTO';
import { SequenceStepCTO } from '../../../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../../../dataAccess/access/to/ActionTO';
import { DecisionTO } from '../../../dataAccess/access/to/DecisionTO';
import { InitDataTO } from '../../../dataAccess/access/to/InitDataTO';
import { PositionTO } from '../../../dataAccess/access/to/PositionTO';
import { ActionType } from '../../../dataAccess/access/types/ActionType';
import { EditActions, editSelectors } from '../../../slices/EditSlice';
import { MasterDataActions, masterDataSelectors } from '../../../slices/MasterDataSlice';
import { sequenceModelSelectors } from '../../../slices/SequenceModelSlice';
import { Carv2Util } from '../../../utils/Carv2Util';
import { ComponentData } from '../../../viewDataTypes/ComponentData';
import { ViewFragmentProps } from '../../../viewDataTypes/ViewFragment';
import { ViewFragmentState } from '../../../viewDataTypes/ViewFragmentState';
import { Arrow } from '../../common/fragments/svg/Arrow';
import { Carv2Card, Carv2CardProps } from './fragments/Carv2Card';
import { MetaComponentDnDBox } from './fragments/MetaComponentDnDBox';

interface MetaComponentModelControllerProps {
  fullScreen?: boolean;
}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  const { fullScreen } = props;

  const { onPositionUpdate, getArrows, toDnDElements } = useViewModel();

  const mapCardToJSX = (card: Carv2CardProps): JSX.Element => {
    return <Carv2Card {...card} />;
  };

  return (
    <MetaComponentDnDBox
      onPositionUpdate={onPositionUpdate}
      arrows={getArrows()}
      toDnDElements={toDnDElements.map((el) => {
        return { ...el, element: mapCardToJSX(el.card) };
      })}
      fullScreen={fullScreen}
    />
  );
};

const useViewModel = () => {
  const dispatch = useDispatch();
  // ====== SELECTORS =====
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  // ----- EDIT -----
  const componentCTOToEdit: ComponentCTO | null = useSelector(editSelectors.componentToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
  const initDataToEdit: InitDataTO | null = useSelector(editSelectors.initDataToEdit);
  const editArrow: Arrow | null = useSelector(editSelectors.editActionArrow);
  const editStepArrows: Arrow[] = useSelector(editSelectors.editStepArrows);
  // ----- VIEW -----
  const arrows: Arrow[] = useSelector(sequenceModelSelectors.selectCurrentArrows);
  const currentComponentDatas: ComponentData[] = useSelector(sequenceModelSelectors.selectComponentData);
  const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);
  const actions: ActionTO[] = useSelector(sequenceModelSelectors.selectActions);
  const dataSetup: DataSetupCTO | null = useSelector(sequenceModelSelectors.selectDataSetup);

  React.useEffect(() => {
    dispatch(MasterDataActions.loadComponentsFromBackend());
    dispatch(MasterDataActions.loadGroupsFromBackend());
  }, [dispatch]);

  const getCompDatas = () => {
    let compDatas: ViewFragmentProps[] = [];
    compDatas.push(...getComponentDatasFromView());
    compDatas.push(...getComponentDatasFromEdit());
    return compDatas;
  };

  const getComponentDatasFromView = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    const compDatasFromErros: ViewFragmentProps[] = errors.map(mapErrorToComponentDatas);

    const compDatasFromActions: ViewFragmentProps[] = mapActionsToComponentDatas(actions, currentComponentDatas);

    const compDatasFromCompDatas: ViewFragmentProps[] = currentComponentDatas.map(mapComponentDataToViewFramgent);
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
    const compDatasFromDataSetupEdit: ViewFragmentProps[] = dataSetupToEdit
      ? dataSetupToEdit.initDatas.map(mapInitDataToCompData)
      : [];
    const compDatasFromDataSetupView: ViewFragmentProps[] = dataSetup
      ? dataSetup.initDatas.map(mapInitDataToCompData)
      : [];
    const compDatasFromInitData: ViewFragmentProps | undefined = initDataToEdit
      ? mapInitDataToCompData(initDataToEdit)
      : undefined;
    compDatas.push(...compDatasFromStepToEdit);
    compDatas.push(...compDataFromDecisionToEdit);
    compDatas.push(...compDatasFromDataSetupEdit);
    if (currentComponentDatas.length <= 0) {
      compDatas.push(...compDatasFromDataSetupView);
    }
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

  const mapActionsToComponentDatas = (actions: ActionTO[], compDatas: ComponentData[]): ViewFragmentProps[] => {
    const viewProps: ViewFragmentProps[] = [];

    actions.forEach((action) => {
      const instanceId: number | undefined = compDatas.find(
        (cd) => cd.dataFk === action.dataFk && cd.componentFk === action.receivingComponentFk
      )?.instanceFk;

      viewProps.push(mapActionToComponentDatas(action, instanceId));

      if (action.actionType === ActionType.SEND_AND_DELETE) {
        viewProps.push({
          name: getDataNameById(action.dataFk, action.instanceFk),
          state: ViewFragmentState.DELETED,
          parentId: action.sendingComponentFk,
        });
      }
    });

    return viewProps;
  };

  const mapActionToComponentDatas = (actionItem: ActionTO, instanceId?: number): ViewFragmentProps => {
    const state: ViewFragmentState = mapActionTypeToViewFragmentState(actionItem.actionType);
    return {
      name: getDataNameById(actionItem.dataFk, instanceId || actionItem.instanceFk),
      state: state,
      parentId: actionItem.receivingComponentFk,
    };
  };

  const mapErrorToComponentDatas = (errorItem: ActionTO): ViewFragmentProps => {
    const state: ViewFragmentState = mapErrorTypeToViewFragmentState(errorItem.actionType);

    return {
      name: getDataNameById(errorItem.dataFk, errorItem.instanceFk),
      state: state,
      parentId: errorItem.receivingComponentFk,
    };
  };

  const mapComponentDataToViewFramgent = (compData: ComponentData): ViewFragmentProps => {
    return {
      name: getDataNameById(compData.dataFk, compData.instanceFk),
      parentId: compData.componentFk,
      state: ViewFragmentState.PERSISTENT,
    };
  };

  const mapDecisionToCompData = (decision: DecisionTO | null): ViewFragmentProps[] => {
    let props: ViewFragmentProps[] = [];
    if (decision) {
      if (decision.dataAndInstaceId !== undefined && decision.dataAndInstaceId.length > 0) {
        props = decision.dataAndInstaceId.map((data) => {
          return {
            parentId: decision.componentFk,
            name: getDataNameById(data.dataFk, data.instanceId),
            state: decision.has ? ViewFragmentState.CHECKED : ViewFragmentState.DELETED,
          };
        });
      }
    }
    return props;
  };

  const mapInitDataToCompData = (initData: InitDataTO): ViewFragmentProps => {
    return {
      parentId: initData.componentFk,
      name: getDataNameById(initData.dataFk, initData.instanceFk),
      state: ViewFragmentState.NEW,
    };
  };

  const getDataNameById = (dataId: number, instanceId?: number): string => {
    const defaultInstanceId: number = 1;
    let dataName: string = "Could not find Data";
    const data: DataCTO | undefined = datas.find((data) => data.data.id === dataId);
    if (data) {
      dataName = data.data.name;
      if (instanceId && instanceId > defaultInstanceId) {
        dataName =
          dataName + " - " + data.data.instances.find((inst) => inst.id === instanceId)?.name ||
          "Could not find instance Name";
      }
    }
    return dataName;
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
      case ActionType.SEND:
        cdState = ViewFragmentState.NEW;
        break;
      case ActionType.SEND_AND_DELETE:
        cdState = ViewFragmentState.NEW;
        break;
    }
    return cdState;
  };

  const mapErrorTypeToViewFragmentState = (actionType: ActionType): ViewFragmentState => {
    let cdState: ViewFragmentState;
    switch (actionType) {
      case ActionType.ADD:
        cdState = ViewFragmentState.ERROR_ADD;
        break;
      case ActionType.DELETE:
        cdState = ViewFragmentState.ERROR_DELETE;
        break;
      case ActionType.SEND:
        cdState = ViewFragmentState.ERROR_ADD;
        break;
      case ActionType.SEND_AND_DELETE:
        cdState = ViewFragmentState.ERROR_ADD;
        break;
    }
    return cdState;
  };

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const componentCTO = components.find((componentCTO) => componentCTO.geometricalData.position.id === positionId);
    if (componentCTO) {
      let copyComponentCTO: ComponentCTO = Carv2Util.deepCopy(componentCTO);
      copyComponentCTO.geometricalData.position.x = x;
      copyComponentCTO.geometricalData.position.y = y;
      dispatch(EditActions.component.save(copyComponentCTO));
    }
  };

  const toDnDElements = (components: ComponentCTO[]): { card: Carv2CardProps; position: PositionTO }[] => {
    let cards: { card: Carv2CardProps; position: PositionTO }[] = [];
    cards = components
      .filter((comp) => !(componentCTOToEdit && componentCTOToEdit.component.id === comp.component.id))
      .map((comp) => {
        return {
          card: componentToCard(comp),
          position: comp.geometricalData.position,
        };
      })
      .filter((item) => item !== undefined);
    // add component to edit
    if (componentCTOToEdit) {
      cards.push({
        card: componentToCard(componentCTOToEdit),
        position: componentCTOToEdit.geometricalData.position,
      });
    }
    return cards;
  };

  const componentToCard = (component: ComponentCTO): Carv2CardProps => {
    return {
      id: component.component.id,
      initName: component.component.name,
      initWidth: component.geometricalData.geometricalData.width,
      initHeigth: component.geometricalData.geometricalData.height,
      dataFragments: getCompDatas().filter(
        (comp) =>
          comp.parentId === component.component.id ||
          (comp.parentId as { dataId: number; instanceId: number }).dataId === component.component.id
      ),
      zoomFactor: 1,
      type: "COMPONENT",
    };
  };

  const getArrows = (): Arrow[] => {
    let ar: Arrow[] = [];
    ar = arrows;
    if (editArrow) {
      console.info("edit arrows: ", editArrow);
      ar.push(editArrow);
    }
    ar.push(...editStepArrows);
    return ar;
  };

  return {
    onPositionUpdate,
    getArrows,
    toDnDElements: toDnDElements(components),
  };
};
