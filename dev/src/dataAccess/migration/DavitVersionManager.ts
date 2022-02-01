import { DAVIT_VERISON } from "../../DavitConstants";
import { StoreTO } from "../access/to/StoreTO";

export const DavitVersionManager = {
    updateProject(dataStoreObject: StoreTO): StoreTO {
        console.info("Call davit version manager.");
        let migratedDataStoreObject: StoreTO = {} as StoreTO;

        switch (dataStoreObject.version) {
            case undefined:
            //     migratedDataStoreObject = DavitVersionMigrator03.migrate(
            //         DavitVersionMigrator02.migrate(
            //             DavitVersionMigrator01.migrate(dataStoreObject),
            //         )
            //     );
            //     break;
            // case 0.1:
            //     migratedDataStoreObject = DavitVersionMigrator03.migrate(
            //         DavitVersionMigrator02.migrate(dataStoreObject));
            //     break;
            // case 0.2:
            //     migratedDataStoreObject = DavitVersionMigrator03.migrate(dataStoreObject);
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
