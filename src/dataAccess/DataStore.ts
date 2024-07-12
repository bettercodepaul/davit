import { DAVIT_VERISON, DEFAULT_PROJECT_NAME, DEFAULT_ZOOM, STORE_ID } from "../DavitConstants";
import { DataStoreCTO } from "./access/cto/DataStoreCTO";
import { StoreTO } from "./access/to/StoreTO";
import { DavitVersionManager } from "./migration/DavitVersionManager";

class DataStore {
    static instance: DataStore;
    private data: DataStoreCTO | undefined;

    public constructor() {
        if (!DataStore.instance || !DataStore.instance.data) {
            this.readDataFromStorage();
        }
        if (DataStore.instance) {
            return DataStore.instance;
        }
        DataStore.instance = this;
    }

    private readDataFromStorage() {
        const dataObjectString: string | null = localStorage.getItem(STORE_ID);
        let objectStore: StoreTO = {
            version: DAVIT_VERISON,
            projectName: DEFAULT_PROJECT_NAME,
            actorZoom: DEFAULT_ZOOM,
            dataZoom: DEFAULT_ZOOM,
            actors: [],
            groups: [],
            geometricalDatas: [],
            positions: [],
            designs: [],
            sequences: [],
            steps: [],
            actions: [],
            decisions: [],
            datas: [],
            dataConnections: [],
            sequenceConfigurations: [],
            chainConfigurations: [],
            chains: [],
            chainLinks: [],
            chainDecisions: [],
            sequenceStates: [],
            chainStates: [],
        } as StoreTO;
        if (!dataObjectString) {
            localStorage.setItem(STORE_ID, JSON.stringify(objectStore));
        } else {
            objectStore = JSON.parse(dataObjectString);
            if (!DavitVersionManager.projectVersionIsEqualDavitVersion(objectStore)) {
                objectStore = DavitVersionManager.updateProject(objectStore);
                this.storeFileData(JSON.stringify(objectStore));
            }
        }
        this.readData(objectStore);
    }

    private readData(objectStore: StoreTO) {
        this.data = new DataStoreCTO();
        // if (!DavitVersionManager.projectVersionIsEqualDavitVersion(objectStore)) {
        //     objectStore = DavitVersionManager.updateProject(objectStore);
        // }
        Object.entries(objectStore).forEach(([key, value]) => {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    const dataEntry = Object.entries(this.data!).find(([dataKey]) => dataKey === key);
                    if (dataEntry) {
                        value.forEach((abstractTO: any) => {
                            dataEntry[1].set(abstractTO.id, abstractTO);
                        });
                    } else {
                        console.warn(`Data has wrong format: key ${key}, value ${value}`);
                        throw new Error(`Data has wrong format: key ${key}, value ${value}`);
                    }
                }
                this.data!.projectName = objectStore.projectName;

                // If zoom is not set, fall back to default 100%
                this.data!.actorZoom = objectStore.actorZoom ? objectStore.actorZoom : 1;
                this.data!.dataZoom = objectStore.dataZoom ? objectStore.dataZoom : 1;
            } else {
                throw new Error(`No value found for key ${key}`);
            }
        });
    }

    private saveData(): void {
        localStorage.setItem(STORE_ID, JSON.stringify(this.getDataStoreObject()));
    }

    private getDataStoreObject(): StoreTO {
        return {
            projectName: this.data!.projectName.toString(),
            version: DAVIT_VERISON,
            actorZoom: Number(this.data!.actorZoom),
            dataZoom: Number(this.data!.dataZoom),
            actors: Array.from(this.data!.actors.values()),
            groups: Array.from(this.data!.groups.values()),
            designs: Array.from(this.data!.designs.values()),
            geometricalDatas: Array.from(this.data!.geometricalDatas.values()),
            positions: Array.from(this.data!.positions.values()),
            sequences: Array.from(this.data!.sequences.values()),
            steps: Array.from(this.data!.steps.values()),
            actions: Array.from(this.data!.actions.values()),
            datas: Array.from(this.data!.datas.values()),
            dataConnections: Array.from(this.data!.dataConnections.values()),
            sequenceConfigurations: Array.from(this.data!.sequenceConfigurations.values()),
            chainConfigurations: Array.from(this.data!.chainConfigurations.values()),
            decisions: Array.from(this.data!.decisions.values()),
            chains: Array.from(this.data!.chains.values()),
            chainLinks: Array.from(this.data!.chainLinks.values()),
            chainDecisions: Array.from(this.data!.chainDecisions.values()),
            sequenceStates: Array.from(this.data!.sequenceStates.values()),
            chainStates: Array.from(this.data!.chainStates.values()),
        };
    }

    public storeFileData(fileData: string) {
        const objectStore: StoreTO = JSON.parse(fileData);
        this.readData(objectStore);
        localStorage.setItem(STORE_ID, fileData);
    }

    public downloadData(projectName: string) {
        const dataStr = JSON.stringify(this.getDataStoreObject());
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", projectName + ".json");
        linkElement.click();
    }

    public createNewProject() {
        localStorage.removeItem(STORE_ID);
        this.readDataFromStorage();
    }

    public commitChanges(): void {
        this.saveData();
        this.readDataFromStorage();
    }

    public roleBack(): void {
        console.warn("Data Store: role back.");
        this.readDataFromStorage();
    }

    public getDataStore(): DataStoreCTO {
        if (!this.data) {
            this.readDataFromStorage();
        }
        return this.data!;
    }
}

const dataStore = new DataStore();

export default dataStore;
