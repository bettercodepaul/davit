import dataStore from "../DataStore";

export const ProjectRepository = {
    saveProjectName(name: string): string {
        dataStore.getDataStore().projectName = name;
        return name;
    },

    saveActionZoom(zoom: number): number {
        dataStore.getDataStore().actorZoom = zoom;
        return zoom;
    },

    saveDataZoom(zoom: number): number {
        dataStore.getDataStore().dataZoom = zoom;
        return zoom;
    },

    getActorZoom(): number {
        return dataStore.getDataStore().actorZoom;
    },

    getDataZoom(): number {
        return dataStore.getDataStore().dataZoom;
    },
};
