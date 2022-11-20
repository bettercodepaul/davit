export class ActorViewTestController{
    getActor(name:string){return cy.get(`[data-test-id="rkL3I_${name}"]`)}
    getActorLabel(name:string){return cy.get(`[data-test-id="rkL3I_${name}_label"]`)}
}