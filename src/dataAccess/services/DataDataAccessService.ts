import { DavitUtil } from "../../utils/DavitUtil";
import { DataCTO } from "../access/cto/DataCTO";
import { GeometricalDataCTO } from "../access/cto/GeometraicalDataCTO";
import { DataRelationTO } from "../access/to/DataRelationTO";
import { DataTO } from "../access/to/DataTO";
import { DataConnectionRepository } from "../repositories/DataConnectionRepository";
import { DataRepository } from "../repositories/DataRepository";
import { CheckHelper } from "../util/CheckHelper";
import { TechnicalDataAccessService } from "./TechnicalDataAccessService";

export const DataDataAccessService = {
    // ====================================================== DATA ======================================================

    findData(id: number): DataTO | undefined {
        return DataRepository.find(id);
    },

    findDataCTO(id: number): DataCTO {
        return createDataCTO(DataRepository.find(id));
    },

    findAllDatas(): DataCTO[] {
        return DataRepository.findAll().map((data) => createDataCTO(data));
    },

    saveDataCTO(dataCTO: DataCTO): DataCTO {
        CheckHelper.nullCheck(dataCTO, "dataCTO");
        const copyDataCTO: DataCTO = DavitUtil.deepCopy(dataCTO);
        const savedGeometricalData = TechnicalDataAccessService.saveGeometricalData(dataCTO.geometricalData);
        copyDataCTO.data.geometricalDataFk = savedGeometricalData.geometricalData.id;
        const savedDataTO = DataRepository.save(copyDataCTO.data);
        return {
            data: savedDataTO,
            geometricalData: savedGeometricalData,
        };
    },

    deleteDataCTO(dataCTO: DataCTO): DataCTO {
        CheckHelper.nullCheck(dataCTO.geometricalData, "GeometricalDataCTO");
        CheckHelper.nullCheck(dataCTO.data, "DataTO");
        const relations: DataRelationTO[] = this.findAllDataRelationCTOs();
        const relationsToDelete: DataRelationTO[] | undefined = relations.filter(
            (relation) => relation.data1Fk === dataCTO.data.id || relation.data2Fk === dataCTO.data.id,
        );
        relationsToDelete.forEach((relation) => this.deleteDataRelationCTO(relation));
        DataRepository.delete(dataCTO.data);
        TechnicalDataAccessService.deleteGeometricalDataCTO(dataCTO.geometricalData);
        return dataCTO;
    },

    // ====================================================== RELATIONS ======================================================

    findAllDataRelationTOs(): DataRelationTO[] {
        return DataConnectionRepository.findAll();
    },

    findAllDataRelationCTOs(): DataRelationTO[] {
        return DataDataAccessService.findAllDataRelationTOs().map(createDataRelationCTO);
    },

    saveDataRelation(dataRelation: DataRelationTO): DataRelationTO {
        CheckHelper.nullCheck(dataRelation, "dataRelation");
        const saveDataConnection = DataConnectionRepository.save(dataRelation);
        return saveDataConnection;
    },

    deleteDataRelationCTO(dataRelationTO: DataRelationTO): DataRelationTO {
        CheckHelper.nullCheck(dataRelationTO, "dataRelationCTO");
        DataConnectionRepository.delete(dataRelationTO);
        return dataRelationTO;
    },
};

// ====================================================== PRIVATE ======================================================

const createDataRelationCTO = (dataRelationTO: DataRelationTO): DataRelationTO => {
    CheckHelper.nullCheck(dataRelationTO, "DataRelationTO");
    const dataCTO1: DataCTO | undefined = createDataCTO(DataDataAccessService.findData(dataRelationTO.data1Fk));
    CheckHelper.nullCheck(dataCTO1, "dataTO1");
    const dataCTO2: DataCTO | undefined = createDataCTO(DataDataAccessService.findData(dataRelationTO.data2Fk));
    CheckHelper.nullCheck(dataCTO2, "dataTO2");
    return dataRelationTO;
};

const createDataCTO = (data: DataTO | undefined): DataCTO => {
    CheckHelper.nullCheck(data, "data");
    const geometricalData: GeometricalDataCTO | undefined = TechnicalDataAccessService.findGeometricalDataCTO(
        data!.geometricalDataFk!,
    );
    CheckHelper.nullCheck(geometricalData, "geometricalData");
    return {
        data: data!,
        geometricalData: geometricalData!,
    };
};
