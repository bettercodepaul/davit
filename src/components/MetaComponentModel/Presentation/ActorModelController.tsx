import React, { FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActorCTO } from '../../../dataAccess/access/cto/ActorCTO';
import { DataCTO } from '../../../dataAccess/access/cto/DataCTO';
import { DataSetupCTO } from '../../../dataAccess/access/cto/DataSetupCTO';
import { SequenceStepCTO } from '../../../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../../../dataAccess/access/to/ActionTO';
import { DecisionTO } from '../../../dataAccess/access/to/DecisionTO';
import { InitDataTO } from '../../../dataAccess/access/to/InitDataTO';
import { ActionType } from '../../../dataAccess/access/types/ActionType';
import { EditActions, editSelectors } from '../../../slices/EditSlice';
import { MasterDataActions, masterDataSelectors } from '../../../slices/MasterDataSlice';
import { sequenceModelSelectors } from '../../../slices/SequenceModelSlice';
import { DavitUtil } from '../../../utils/DavitUtil';
import { ActorData } from '../../../viewDataTypes/ActorData';
import { ActorDataState } from '../../../viewDataTypes/ActorDataState';
import { ViewFragmentProps } from '../../../viewDataTypes/ViewFragment';
import { Arrow, ArrowType } from '../../common/fragments/svg/Arrow';
import { DavitPathHead, DavitPathProps, DavitPathTypes } from '../../common/fragments/svg/DavitPath';
import { DavitCard, DavitCardProps } from './fragments/DavitCard';
import { DnDBox, DnDBoxElement, DnDBoxType } from './fragments/DnDBox';

interface ActorModelControllerProps {
    fullScreen?: boolean;
}

export const ActorModelController: FunctionComponent<ActorModelControllerProps> = (props) => {
    const { fullScreen } = props;

    const { onPositionUpdate, getArrows, toDnDElements, zoomIn, zoomOut } = useViewModel();

    return (
        <DnDBox
            onPositionUpdate={onPositionUpdate}
            toDnDElements={toDnDElements}
            svgElements={getArrows()}
            fullScreen={fullScreen}
            zoomIn={zoomIn}
            zoomOut={zoomOut}
            type={DnDBoxType.actor}
        />
    );
};

const useViewModel = () => {
    const dispatch = useDispatch();
    // ====== SELECTORS =====
    const actors: ActorCTO[] = useSelector(masterDataSelectors.actors);
    const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
    // ----- EDIT -----
    const actorCTOToEdit: ActorCTO | null = useSelector(editSelectors.actorToEdit);
    const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
    const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
    const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
    const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
    const initDataToEdit: InitDataTO | null = useSelector(editSelectors.initDataToEdit);
    const editArrow: Arrow | null = useSelector(editSelectors.editActionArrow);
    const editStepArrows: Arrow[] = useSelector(editSelectors.editStepArrows);
    // ----- VIEW -----
    const arrows: Arrow[] = useSelector(sequenceModelSelectors.selectCurrentArrows);
    const currentActorDatas: ActorData[] = useSelector(sequenceModelSelectors.selectActorData);
    const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);
    const dataSetup: DataSetupCTO | null = useSelector(sequenceModelSelectors.selectDataSetup);

    const [zoom, setZoom] = useState<number>(1);

    const ZOOM_FACTOR: number = 0.1;

    React.useEffect(() => {
        dispatch(MasterDataActions.loadActorsFromBackend());
        dispatch(MasterDataActions.loadGroupsFromBackend());
    }, [dispatch]);

    const getActorDatas = () => {
        const actorDatas: ViewFragmentProps[] = [];
        actorDatas.push(...getActorDatasFromView());
        actorDatas.push(...getActorDatasFromEdit());
        return actorDatas;
    };

    const getActorDatasFromView = (): ViewFragmentProps[] => {
        const actorDatas: ViewFragmentProps[] = [];
        const actorDatasFromErros: ViewFragmentProps[] = errors.map(mapErrorToActorDatas);

        const actorDatasFromCompDatas: ViewFragmentProps[] = currentActorDatas
            .map(mapActorDataToViewFramgent)
            .sort((a, b) => a.name.localeCompare(b.name));
        actorDatas.push(...actorDatasFromErros);

        actorDatas.push(
            ...actorDatasFromCompDatas.filter(
                (actorDataFromActorData) => !actorDatas.some((cp) => actorDataExists(cp, actorDataFromActorData)),
            ),
        );
        return actorDatas;
    };

    const getActorDatasFromEdit = (): ViewFragmentProps[] => {
        const actorDatas: ViewFragmentProps[] = [];
        const actorDatasFromStepToEdit: (ViewFragmentProps | undefined)[] =
            stepToEdit?.actions.map((action) => (action ? mapActionToActorDatas(action) : [])).flat(1) || [];
        const actorDataFromActionToEdit: ViewFragmentProps[] = actionToEdit ? mapActionToActorDatas(actionToEdit) : [];
        const actorDataFromDecisionToEdit: ViewFragmentProps[] = mapDecisionToActorData(decisionToEdit);
        const actorDatasFromDataSetupEdit: ViewFragmentProps[] = dataSetupToEdit
            ? dataSetupToEdit.initDatas.map(mapInitDataToActorData)
            : [];
        const actorDatasFromDataSetupView: ViewFragmentProps[] = dataSetup
            ? dataSetup.initDatas.map(mapInitDataToActorData)
            : [];
        const actorDatasFromInitData: ViewFragmentProps | undefined = initDataToEdit
            ? mapInitDataToActorData(initDataToEdit)
            : undefined;
        actorDatasFromStepToEdit.forEach((actorData) => {
            actorData && actorDatas.push(actorData);
        });
        actorDatas.push(...actorDataFromDecisionToEdit);
        actorDatas.push(...actorDatasFromDataSetupEdit);
        if (currentActorDatas.length <= 0) {
            actorDatas.push(...actorDatasFromDataSetupView);
        }
        actorDatas.push(...actorDataFromActionToEdit);
        if (actorDatasFromInitData) {
            actorDatas.push(actorDatasFromInitData);
        }
        return actorDatas;
    };

    const actorDataExists = (propOne: ViewFragmentProps, propTwo: ViewFragmentProps) => {
        return propOne.parentId === propTwo.parentId && propOne.name === propTwo.name;
    };

    const mapActionToActorDatas = (actionItem: ActionTO): ViewFragmentProps[] => {
        const viewFragmentProps: ViewFragmentProps[] = [];

        if (actionItem.actionType !== ActionType.TRIGGER) {
            const state: ActorDataState = mapActionTypeToViewFragmentState(actionItem.actionType);
            const parentId = state === ActorDataState.SENT ? actionItem.sendingActorFk : actionItem.receivingActorFk;

            viewFragmentProps.push({
                name: getDataNameById(actionItem.dataFk, actionItem.instanceFk),
                state: state,
                parentId: parentId,
            });

            if (actionItem.actionType === ActionType.SEND_AND_DELETE) {
                viewFragmentProps.push({
                    name: getDataNameById(actionItem.dataFk, actionItem.instanceFk),
                    state: ActorDataState.DELETED,
                    parentId: actionItem.sendingActorFk,
                });
            }
        }
        return viewFragmentProps;
    };

    const mapErrorToActorDatas = (errorItem: ActionTO): ViewFragmentProps => {
        const state: ActorDataState = mapErrorTypeToViewFragmentState(errorItem.actionType);

        const parentId = state === ActorDataState.ERROR_SEND ? errorItem.sendingActorFk : errorItem.receivingActorFk;

        return {
            name: getDataNameById(errorItem.dataFk, errorItem.instanceFk),
            state: state,
            parentId: parentId,
        };
    };

    const mapActorDataToViewFramgent = (actorData: ActorData): ViewFragmentProps => {
        return {
            name: getDataNameById(actorData.dataFk, actorData.instanceFk),
            parentId: actorData.actorFk,
            state: actorData.state,
        };
    };

    const mapDecisionToActorData = (decision: DecisionTO | null): ViewFragmentProps[] => {
        let props: ViewFragmentProps[] = [];
        if (decision) {
            if (decision.dataAndInstaceIds !== undefined && decision.dataAndInstaceIds.length > 0) {
                props = decision.dataAndInstaceIds.map((data) => {
                    return {
                        parentId: decision.actorFk,
                        name: getDataNameById(data.dataFk, data.instanceId),
                        state: ActorDataState.CHECKED,
                    };
                });
            }
        }
        return props;
    };

    const mapInitDataToActorData = (initData: InitDataTO): ViewFragmentProps => {
        return {
            parentId: initData.actorFk,
            name: getDataNameById(initData.dataFk, initData.instanceFk),
            state: ActorDataState.NEW,
        };
    };

    const getDataNameById = (dataId: number, instanceId?: number): string => {
        let dataName: string = 'Could not find Data';
        const data: DataCTO | undefined = datas.find((data) => data.data.id === dataId);
        if (data) {
            dataName = data.data.name;
            if (instanceId !== undefined && instanceId !== -1) {
                dataName =
                    dataName +
                    ' - ' +
                    (data.data.instances.find((inst) => inst.id === instanceId)?.name ||
                        'Could not find instance Name');
            }
        }
        return dataName;
    };

    const mapActionTypeToViewFragmentState = (actionType: ActionType): ActorDataState => {
        let cdState: ActorDataState;
        switch (actionType) {
            case ActionType.ADD:
                cdState = ActorDataState.NEW;
                break;
            case ActionType.DELETE:
                cdState = ActorDataState.DELETED;
                break;
            case ActionType.SEND:
            case ActionType.SEND_AND_DELETE:
                cdState = ActorDataState.SENT;
                break;
            case ActionType.TRIGGER:
                cdState = ActorDataState.PERSISTENT;
                break;
        }
        return cdState;
    };

    const mapErrorTypeToViewFragmentState = (actionType: ActionType): ActorDataState => {
        let cdState: ActorDataState;
        switch (actionType) {
            case ActionType.ADD:
                cdState = ActorDataState.ERROR_ADD;
                break;
            case ActionType.DELETE:
                cdState = ActorDataState.ERROR_DELETE;
                break;
            case ActionType.SEND:
            case ActionType.SEND_AND_DELETE:
                cdState = ActorDataState.ERROR_SEND;
                break;
            case ActionType.TRIGGER:
                cdState = ActorDataState.PERSISTENT;
                break;
        }
        return cdState;
    };

    const onPositionUpdate = (x: number, y: number, positionId: number) => {
        const actorCTO = actors.find((actorCTO) => actorCTO.geometricalData.position.id === positionId);
        if (actorCTO) {
            const copyActorCTO: ActorCTO = DavitUtil.deepCopy(actorCTO);
            copyActorCTO.geometricalData.position.x = x;
            copyActorCTO.geometricalData.position.y = y;
            dispatch(EditActions.actor.save(copyActorCTO));
        }
    };

    const actorsToDnDElements = (actors: ActorCTO[]): DnDBoxElement[] => {
        let dndBoxElements: DnDBoxElement[] = [];
        dndBoxElements = actors
            .filter((actor) => !(actorCTOToEdit && actorCTOToEdit.actor.id === actor.actor.id))
            .map((actorr) => {
                return {
                    element: <DavitCard {...actorToCard(actorr)} />,
                    position: actorr.geometricalData.position,
                };
            })
            .filter((item) => item !== undefined);
        // add actor to edit
        if (actorCTOToEdit) {
            dndBoxElements.push({
                element: <DavitCard {...actorToCard(actorCTOToEdit)} />,
                position: actorCTOToEdit.geometricalData.position,
            });
        }
        return dndBoxElements;
    };

    const actorToCard = (actor: ActorCTO): DavitCardProps => {
        return {
            id: actor.actor.id,
            initName: actor.actor.name,
            initWidth: actor.geometricalData.geometricalData.width,
            initHeigth: actor.geometricalData.geometricalData.height,
            dataFragments: getActorDatas().filter(
                (act) =>
                    act.parentId === actor.actor.id ||
                    (act.parentId as { dataId: number; instanceId: number }).dataId === actor.actor.id,
            ),
            zoomFactor: zoom,
            type: 'ACTOR',
        };
    };

    const getArrows = (): DavitPathProps[] => {
        const arrowProps: DavitPathProps[] = [];
        let arrowsToDraw: Arrow[] = [];
        arrowsToDraw = arrows;
        // TODO prüfe ob dass das gleiche ist!
        // ===================================
        if (editArrow) {
            arrowsToDraw.push(editArrow);
        }
        arrowsToDraw.push(...editStepArrows);
        // ===================================

        arrowsToDraw.forEach((arrowToDrow, index) => {
            arrowProps.push({
                head: DavitPathHead.ARROW,
                id: index,
                labels: arrowToDrow.dataLabels,
                lineType: DavitPathTypes.SMOOTH,
                xSource: arrowToDrow.sourceGeometricalData.position.x,
                ySource: arrowToDrow.sourceGeometricalData.position.y,
                xTarget: arrowToDrow.targetGeometricalData.position.x,
                yTarget: arrowToDrow.targetGeometricalData.position.y,
                sourceHeight: arrowToDrow.sourceGeometricalData.geometricalData.height,
                sourceWidth: arrowToDrow.sourceGeometricalData.geometricalData.width,
                targetHeight: arrowToDrow.targetGeometricalData.geometricalData.height,
                targetWidth: arrowToDrow.targetGeometricalData.geometricalData.width,
                stroked: arrowToDrow.type === ArrowType.TRIGGER,
                lineColor: arrowToDrow.type === ArrowType.SEND ? 'var(--carv2-color-exxcellent-blue)' : 'black',
            });
        });
        return arrowProps;
    };

    const zoomOut = (): void => {
        setZoom(zoom - ZOOM_FACTOR);
    };

    const zoomIn = (): void => {
        setZoom(zoom + ZOOM_FACTOR);
    };

    return {
        onPositionUpdate,
        getArrows,
        toDnDElements: actorsToDnDElements(actors),
        zoomIn,
        zoomOut,
    };
};
