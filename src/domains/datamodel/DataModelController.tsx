import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { DavitPathProps, DavitPathTypes } from "../../components/atomic/svg/DavitPath";
import { DavitCard, DavitCardProps } from "../../components/molecules";
import { DnDBox, DnDBoxElement, DnDBoxType } from "../../components/organisms/dndBox/DnDBox";
import { ActorCTO } from "../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../dataAccess/access/cto/DataCTO";
import { GeometricalDataCTO } from "../../dataAccess/access/cto/GeometraicalDataCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../dataAccess/access/to/ActionTO";
import { ConditionTO } from "../../dataAccess/access/to/ConditionTO";
import { DataRelationTO } from "../../dataAccess/access/to/DataRelationTO";
import { DecisionTO } from "../../dataAccess/access/to/DecisionTO";
import { ActionType } from "../../dataAccess/access/types/ActionType";
import { editSelectors } from "../../slices/EditSlice";
import { GlobalActions, globalSelectors } from "../../slices/GlobalSlice";
import { MasterDataActions, masterDataSelectors } from "../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../slices/SequenceModelSlice";
import { EditData } from "../../slices/thunks/DataThunks";
import { useAppDispatch } from "../../store";
import { DavitUtil } from "../../utils/DavitUtil";
import { ActorData } from "../../viewDataTypes/ActorData";
import { ActorDataState } from "../../viewDataTypes/ActorDataState";
import { ViewFragmentProps } from "../../viewDataTypes/ViewFragment";

interface DataModelControllerProps {
}

export const DataModelController: FunctionComponent<DataModelControllerProps> = () => {

    const {
        onPositionUpdate,
        toDnDElements,
        zoomIn,
        zoomOut,
        getRelations,
        onGeometricalDataUpdate,
        dataZoomFactor,
    } = useMetaDataModelViewModel();

    const createMetaDataDnDBox = () => {
            return (
                <>
                    {toDnDElements.length === 0 &&
                    <div className="dataModel">
                        <h2 className={"fluid flex flex-center"}>{"Create a new data object"}</h2>
                    </div>}
                    {toDnDElements.length > 0 && <DnDBox
                        onPositionUpdate={onPositionUpdate}
                        toDnDElements={toDnDElements}
                        svgElements={getRelations()}
                        zoomIn={zoomIn}
                        zoomOut={zoomOut}
                        zoom={dataZoomFactor}
                        type={DnDBoxType.data}
                        onGeoUpdate={onGeometricalDataUpdate}
                    />}
                </>
            );
        }
    ;

    return createMetaDataDnDBox();
};

const useMetaDataModelViewModel = () => {
        const dispatch = useAppDispatch();
        // ====== SELECTORS =====
        const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);
        const dataCTOToEdit: DataCTO | null = useSelector(editSelectors.selectDataToEdit);
        const dataRelations: DataRelationTO[] = useSelector(masterDataSelectors.selectRelations);
        const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
        // ----- EDIT -----
        const dataRelationToEdit: DataRelationTO | null = useSelector(editSelectors.selectRelationToEdit);
        const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.selectStepToEdit);
        const actionToEdit: ActionTO | null = useSelector(editSelectors.selectActionToEdit);
        const decisionToEdit: DecisionTO | null = useSelector(editSelectors.selectDecisionToEdit);
        const conditionToEdit: ConditionTO | null = useSelector(editSelectors.selectConditionToEdit);
        // ----- VIEW -----
        const actions: ActionTO[] = useSelector(sequenceModelSelectors.selectActions);

        const currentActorDatas: ActorData[] = useSelector(sequenceModelSelectors.selectActorData);
        const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);

        const dataZoomFactor: number = useSelector(globalSelectors.selectDataZoomFactor);

        React.useEffect(() => {
            dispatch(MasterDataActions.loadDatasFromBackend());
            dispatch(MasterDataActions.loadRelationsFromBackend());
        }, [dispatch]);

        const getActorNameById = (actorId: number): string => {
            return actors.find((actor) => actor.actor.id === actorId)?.actor.name || "Could not find Actor";
        };

        const getActorDatas = () => {
            const actorDatas: ViewFragmentProps[] = [];
            actorDatas.push(...getActorDatasFromView());
            actorDatas.push(...getActorDatasFromEdit());
            return actorDatas;
        };

        const getActorDatasFromView = (): ViewFragmentProps[] => {
            const actorDatas: ViewFragmentProps[] = [];
            //Map and add errors to actor data's
            const actorDatasFromErros: ViewFragmentProps[] = errors.map(mapErrorToActorDatas);
            actorDatas.push(...actorDatasFromErros);
            //Map and add actions to actor data's if there not already exist in actorDatas
            const actorDatasFromActions: ViewFragmentProps[] = actions.map(mapActionToActorDatas);
            actorDatas.push(
                ...actorDatasFromActions.filter(
                    (actorDataFromAction) => !actorDatas.some((cp) => actorDataExists(cp, actorDataFromAction)),
                ),
            );
            //Map and add current Actor-Data's to actor data's if there not already exist in actorDatas
            const actorDatasFromCurrentActorDatas: ViewFragmentProps[] = currentActorDatas
                // We don't want to display "old" state of data.
                .filter((actDat) => actDat.state !== ActorDataState.UPDATED_FROM)
                .map(mapActorDataToViewFragment)
                .sort((a, b) => a.name.localeCompare(b.name));
            actorDatas.push(
                ...actorDatasFromCurrentActorDatas.filter(
                    (actorDataFromCurrentActorDatas) => !actorDatas.some((cp) => actorDataExists(cp, actorDataFromCurrentActorDatas)),
                ),
            );

            return actorDatas;
        };

        const getActorDatasFromEdit = (): ViewFragmentProps[] => {
            const actorDatas: ViewFragmentProps[] = [];
            const actorDatasFromStepToEdit: ViewFragmentProps[] = stepToEdit?.actions.map(mapActionToActorDatas) || [];
            const actorDataFromActionToEdit: ViewFragmentProps | undefined = actionToEdit
                ? mapActionToActorDatas(actionToEdit)
                : undefined;

            const actorDataFromDecisionToEdit: ViewFragmentProps[] = mapDecisionToActorData(decisionToEdit);

            actorDatas.push(...actorDatasFromStepToEdit);
            actorDatas.push(...actorDataFromDecisionToEdit);

            if (actorDataFromActionToEdit) {
                actorDatas.push(actorDataFromActionToEdit);
            }

            if (conditionToEdit) {
                actorDatas.push(mapConditionToActorData(conditionToEdit));
            }
            return actorDatas;
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

        function mapActionToActorDatas(actionItem: ActionTO): ViewFragmentProps {
            const state: ActorDataState = mapActionTypeToViewFragmentState(actionItem.actionType);
            return {
                name: getActorNameById(actionItem.receivingActorFk),
                state: state,
                parentId: actionItem.dataFk,
            };
        }

        const mapActorDataToViewFragment = (actorData: ActorData): ViewFragmentProps => {
            return {
                name: getActorNameById(actorData.actorFk),
                parentId: {dataId: actorData.dataFk, instanceId: actorData.instanceFk},
                state: ActorDataState.PERSISTENT,
            };
        };

        const mapDecisionToActorData = (decision: DecisionTO | null): ViewFragmentProps[] => {
            let props: ViewFragmentProps[] = [];
            if (decision) {
                if (decision.conditions !== undefined && decision.conditions.length > 0) {
                    props = decision.conditions.map((condition) => {
                        return mapConditionToActorData(condition);
                    });
                }
            }
            return props;
        };

        const mapConditionToActorData = (condition: ConditionTO): ViewFragmentProps => {
            return {
                parentId: {dataId: condition.dataFk, instanceId: condition.instanceFk},
                name: getActorNameById(condition.actorFk),
                state: ActorDataState.CHECKED,
            };
        };

        // const mapInitDataToActorData = (initData: InitDataTO): ViewFragmentProps => {
        //     return {
        //         parentId:
        //             initData.instanceFk > -1
        //                 ? {dataId: initData.dataFk, instanceId: initData.instanceFk}
        //                 : initData.dataFk,
        //         name: getActorNameById(initData.actorFk),
        //         state: ActorDataState.NEW,
        //     };
        // };

        const actorDataExists = (propOne: ViewFragmentProps, propTwo: ViewFragmentProps) => {
            const dataId1 = (propOne.parentId as { dataId: number; instanceId: number }).dataId || propOne.parentId;
            const instanceId1 = (propOne.parentId as {
                dataId: number;
                instanceId: number;
            }).instanceId;
            const dataId2 = (propTwo.parentId as { dataId: number; instanceId: number }).dataId || propTwo.parentId;
            const instanceId2 = (propTwo.parentId as {
                dataId: number;
                instanceId: number;
            }).instanceId;
            return (
                (dataId1 === dataId2 || propOne.parentId === propTwo.parentId) &&
                propOne.name === propTwo.name &&
                (!(instanceId1 || instanceId2) || instanceId1 === instanceId2)
            );
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
                    cdState = ActorDataState.NEW;
                    break;
                case ActionType.SEND_AND_DELETE:
                    cdState = ActorDataState.NEW;
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

        const getDataNameById = (dataId: number, instanceId?: number): string => {
            let dataName: string = "Could not find Data";
            const data: DataCTO | undefined = datas.find((data) => data.data.id === dataId);
            if (data) {
                dataName = data.data.name;
                if (instanceId !== undefined && instanceId !== -1) {
                    dataName =
                        dataName +
                        " - " +
                        (data.data.instances.find((inst) => inst.id === instanceId)?.name ||
                            "Could not find instance Name");
                }
            }
            return dataName;
        };

        const onPositionUpdate = (x: number, y: number, positionId: number) => {
            const dataCTO = datas.find((data) => data.geometricalData.position.id === positionId);
            if (dataCTO) {
                const copyDataCTO: DataCTO = DavitUtil.deepCopy(dataCTO);
                copyDataCTO.geometricalData.position.x = x;
                copyDataCTO.geometricalData.position.y = y;
                dispatch(EditData.save(copyDataCTO));
            }
        };

        const dataToDnDElements = (datas: DataCTO[]): DnDBoxElement[] => {
            const dndBoxElements: DnDBoxElement[] = datas
                .filter((data) => !(dataCTOToEdit && dataCTOToEdit.data.id === data.data.id))
                .map((dataa) => {
                    return {
                        element: <DavitCard {...dataToCard(dataa)} />,
                        position: dataa.geometricalData.position,
                        geometricalData: dataa.geometricalData.geometricalData,
                    };
                })
                .filter((item) => item !== undefined);
            // add data to edit
            if (dataCTOToEdit) {
                dndBoxElements.push({
                    element: <DavitCard {...dataToCard(dataCTOToEdit)} />,
                    position: dataCTOToEdit.geometricalData.position,
                    geometricalData: dataCTOToEdit.geometricalData.geometricalData,
                });
            }
            return dndBoxElements;
        };

        const dataToCard = (data: DataCTO): DavitCardProps => {
            return {
                id: data.data.id,
                initName: data.data.name,
                initWidth: 100,
                initHeight: 30,
                dataFragments: getActorDatas().filter(
                    (act) =>
                        act.parentId === data.data.id ||
                        (act.parentId as { dataId: number; instanceId: number }).dataId === data.data.id,
                ),
                instances: data.data.instances,
                zoomFactor: dataZoomFactor,
                type: "DATA",
            };
        };

        const zoomOut = (): void => {
            dispatch(GlobalActions.dataZoomOut());
        };

        const zoomIn = (): void => {
            dispatch(GlobalActions.dataZoomIn());
        };

        const getGeometricalData = (dataId: number): GeometricalDataCTO | undefined => {
            return datas.find((data) => data.data.id === dataId)?.geometricalData || undefined;
        };

        const relationToDavitPath = (relation: DataRelationTO, id: number, isEdit?: boolean): DavitPathProps => {
            const sourceGeometricalData: GeometricalDataCTO | undefined = getGeometricalData(relation.data1Fk);
            const targetGeometricalData: GeometricalDataCTO | undefined = getGeometricalData(relation.data2Fk);

            return {
                id: id,
                labels: [],
                lineType: DavitPathTypes.GRID,
                xSource: sourceGeometricalData?.position.x || 0,
                ySource: sourceGeometricalData?.position.y || 0,
                xTarget: targetGeometricalData?.position.x || 0,
                yTarget: targetGeometricalData?.position.y || 0,
                sourceHeight: sourceGeometricalData?.geometricalData.height || 0,
                sourceWidth: sourceGeometricalData?.geometricalData.width || 0,
                targetHeight: targetGeometricalData?.geometricalData.height || 0,
                targetWidth: targetGeometricalData?.geometricalData.width || 0,
                stroked: isEdit,
                sourceDirection: relation.direction1,
                targetDirection: relation.direction2,
            };
        };

        const getRelations = (): DavitPathProps[] => {
            const dataRelationsProps: DavitPathProps[] = [];

            let copyDataRelations: DataRelationTO[] = DavitUtil.deepCopy(dataRelations);

            if (dataRelationToEdit) {
                copyDataRelations = copyDataRelations.filter((relation) => relation.id !== dataRelationToEdit.id);
                if (isRelationReadyToDraw(dataRelationToEdit)) {
                    dataRelationsProps.push(relationToDavitPath(dataRelationToEdit, dataRelationToEdit.id, true));
                }
            }

            copyDataRelations.forEach((rel) => dataRelationsProps.push(relationToDavitPath(rel, rel.id)));
            return dataRelationsProps;
        };

        const isRelationReadyToDraw = (dataRelation: DataRelationTO): boolean => {
            return (dataRelation.data1Fk !== -1 && dataRelation.data2Fk !== -1);
        };

        const onGeometricalDataUpdate = (width: number, height: number, geoId: number) => {
            const copyData: DataCTO | undefined = DavitUtil.deepCopy(
                datas.find((data) => data.geometricalData.geometricalData.id === geoId),
            );
            if (copyData) {
                copyData.geometricalData.geometricalData.width = width;
                copyData.geometricalData.geometricalData.height = height;
                dispatch(EditData.save(copyData));
            }
        };

        return {
            onPositionUpdate,
            toDnDElements: dataToDnDElements(datas),
            zoomIn,
            zoomOut,
            getRelations,
            onGeometricalDataUpdate,
            dataZoomFactor,
        };
    }
;
