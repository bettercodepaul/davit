import { DAVIT_VERISON } from "../../DavitConstants";
import { StoreTO } from "../access/to/StoreTO";
import { DavitVersionMigrator01 } from "./davitVersio01/DavitVersionMigrator01";
import { DavitVersionMigrator02 } from "./davitVersion02/DavitVersionMigrator02";

export const DavitVersionManager = {
    updateProject(dataStoreObject: StoreTO): StoreTO {
        console.info("call davit version manager.");
        let migratedDataStoreObject: StoreTO = {} as StoreTO;
        switch (dataStoreObject.version) {
            case undefined:
                migratedDataStoreObject = DavitVersionMigrator02.migrate(
                    DavitVersionMigrator01.migrate(dataStoreObject),
                );
                break;
            case 0.1:
                migratedDataStoreObject = DavitVersionMigrator02.migrate(dataStoreObject);
        }
        return migratedDataStoreObject;
    },

    projectVersionIsEqualDavitVersion(project: StoreTO): boolean {
        let isSameVersion: boolean = false;
        if (project.version !== undefined && project.version === DAVIT_VERISON) {
            isSameVersion = true;
        } else {
            console.warn(`!!!WARNING!!! DAVIT Project has different version (${project.version})!`);
        }
        return isSameVersion;
    },
};
