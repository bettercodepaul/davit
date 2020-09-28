import { Carv2Util } from "../../utils/Carv2Util";
import { DataCTO } from "../access/cto/DataCTO";
import { GeometricalDataCTO } from "../access/cto/GeometraicalDataCTO";
import { DataInstanceTO } from "../access/to/DataInstanceTO";
import { DataRelationTO } from "../access/to/DataRelationTO";
import { DataTO } from "../access/to/DataTO";
import { DataConnectionRepository } from "../repositories/DataConnectionRepository";
import { DataInstanceRepository } from "../repositories/DataInstanceRepository";
import { DataRepository } from "../repositories/DataRepository";
import { CheckHelper } from "../util/CheckHelper";
import { TechnicalDataAccessService } from "./TechnicalDataAccessService";

export const DataDataAccessService = {
  findData(id: number): DataTO | undefined {
    return DataRepository.find(id);
  },

  findDataCTO(id: number): DataCTO {
    return createDataCTO(DataRepository.find(id));
  },

  findAllDatas(): DataCTO[] {
    return DataRepository.findAll().map((data) => createDataCTO(data));
  },

  findAllInstances(): DataInstanceTO[] {
    return DataInstanceRepository.findAll();
  },

  saveDataCTO(dataCTO: DataCTO): DataCTO {
    CheckHelper.nullCheck(dataCTO, "dataCTO");
    const savedGeometricalData = TechnicalDataAccessService.saveGeometricalData(dataCTO.geometricalData);
    const existingInstances: DataInstanceTO[] = DataInstanceRepository.findAllDataInstances(dataCTO.data.id);
    const copyDataCTO: DataCTO = Carv2Util.deepCopy(dataCTO);
    copyDataCTO.data.geometricalDataFk = savedGeometricalData.geometricalData.id;
    const savedData = DataRepository.save(copyDataCTO.data);
    return {
      data: savedData,
      instances: existingInstances,
      geometricalData: savedGeometricalData,
    };
  },

  saveDataInstanceTO(dataInstanceTO: DataInstanceTO): DataInstanceTO {
    CheckHelper.nullCheck(dataInstanceTO, "dataInstanceTO");
    const savedInstance: DataInstanceTO = DataInstanceRepository.save(dataInstanceTO);
    return savedInstance;
  },

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

  deleteDataCTO(dataCTO: DataCTO): DataCTO {
    CheckHelper.nullCheck(dataCTO.geometricalData, "GeometricalDataCTO");
    CheckHelper.nullCheck(dataCTO.data, "DataTO");
    let relations: DataRelationTO[] = this.findAllDataRelationCTOs();
    const relationsToDelete: DataRelationTO[] | undefined = relations.filter(
      (relation) => relation.data1Fk === dataCTO.data.id || relation.data2Fk === dataCTO.data.id
    );
    relationsToDelete.map((relation) => this.deleteDataRelationCTO(relation));
    DataRepository.delete(dataCTO.data);
    TechnicalDataAccessService.deleteGeometricalDataCTO(dataCTO.geometricalData);
    return dataCTO;
  },

  deleteDataInstance(instance: DataInstanceTO): DataInstanceTO {
    CheckHelper.nullCheck(instance, "instance");
    return DataInstanceRepository.delete(instance);
  },

  deleteDataRelationCTO(dataRelationTO: DataRelationTO): DataRelationTO {
    CheckHelper.nullCheck(dataRelationTO, "dataRelationCTO");
    DataConnectionRepository.delete(dataRelationTO);
    return dataRelationTO;
  },
};

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
    data!.geometricalDataFk!
  );
  const instances: DataInstanceTO[] = DataInstanceRepository.findAllDataInstances(data!.id);
  CheckHelper.nullCheck(geometricalData, "geometricalData");
  return {
    data: data!,
    instances: instances,
    geometricalData: geometricalData!,
  };
};
