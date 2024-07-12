import { DavitUtil } from "../../utils/DavitUtil";
import { ActorCTO } from "../access/cto/ActorCTO";
import { GeometricalDataCTO } from "../access/cto/GeometraicalDataCTO";
import { ActorTO } from "../access/to/ActorTO";
import { DesignTO } from "../access/to/DesignTO";
import { GroupTO } from "../access/to/GroupTO";
import { ActorRepository } from "../repositories/ActorRepository";
import { GroupRepository } from "../repositories/GroupRepository";
import { CheckHelper } from "../util/CheckHelper";
import { TechnicalDataAccessService } from "./TechnicalDataAccessService";

export const ActorDataAccessService = {
    findAll(): ActorCTO[] {
        return ActorRepository.findAll().map((actor) => createActorCTO(actor));
    },

    findCTO(id: number): ActorCTO {
        return createActorCTO(ActorRepository.find(id));
    },

    find(id: number): ActorTO | undefined {
        return ActorRepository.find(id);
    },

    findAllGroups(): GroupTO[] {
        return GroupRepository.findAll();
    },

    delete(actor: ActorCTO): ActorCTO {
        CheckHelper.nullCheck(actor.geometricalData, "GeometricalDataCTO");
        CheckHelper.nullCheck(actor.design, "DesignTO");
        CheckHelper.nullCheck(actor.actor, "ActorTO");
        ActorRepository.delete(actor.actor);
        TechnicalDataAccessService.deleteGeometricalDataCTO(actor.geometricalData);
        TechnicalDataAccessService.deleteDesign(actor.design);
        return actor;
    },

    deleteGroup(group: GroupTO): GroupTO {
        CheckHelper.nullCheck(group, "group");
        const actorsToClean: ActorCTO[] = this.findAll().filter((actor) => actor.actor.groupFks === group.id);
        actorsToClean.forEach((actor) => {
            actor.actor.groupFks = -1;
            this.saveCTO(actor);
        });
        GroupRepository.delete(group);
        return group;
    },

    saveCTO(actorCTO: ActorCTO): ActorCTO {
        CheckHelper.nullCheck(actorCTO, "ActorCTO");
        const copy: ActorCTO = DavitUtil.deepCopy(actorCTO);
        const savedDesign = TechnicalDataAccessService.saveDesign(copy.design);
        copy.actor.designFk = savedDesign.id;
        const savedGeometricalData = TechnicalDataAccessService.saveGeometricalData(copy.geometricalData);
        copy.actor.geometricalDataFk = savedGeometricalData.geometricalData.id;
        const savedActor = ActorRepository.save(copy.actor);
        return {
            actor: savedActor,
            geometricalData: savedGeometricalData,
            design: savedDesign,
        };
    },

    saveGroup(group: GroupTO): GroupTO {
        CheckHelper.nullCheck(group, "group");
        return GroupRepository.save(group);
    },
};

const createActorCTO = (actor: ActorTO | undefined): ActorCTO => {
    CheckHelper.nullCheck(actor, "actor");
    const design: DesignTO | undefined = TechnicalDataAccessService.findDesign(actor!.designFk!);
    CheckHelper.nullCheck(design, "design");
    const geometricalData: GeometricalDataCTO | undefined = TechnicalDataAccessService.findGeometricalDataCTO(
        actor!.geometricalDataFk!,
    );
    CheckHelper.nullCheck(geometricalData, "geometricalData");
    return {
        actor: actor!,
        geometricalData: geometricalData!,
        design: design!,
    };
};
