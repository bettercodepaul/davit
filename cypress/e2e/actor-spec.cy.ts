import { ActorFormTestController } from "../controller/ActorFormTestController";
import { ActorViewTestController } from "../controller/ActorViewTestController";
import { EditMenuTestController } from "../controller/EditMenuTestController";
import { SidePanelTestController } from "./../controller/SidePanelTestController"
describe('Actor',async () => {
  it('create Actor', () => {
    cy.visit('http://localhost:9000/')
    const editMenu = new EditMenuTestController();
    const name = "Actor1"
    new SidePanelTestController().editButton().click();
    editMenu.actorAddOrEditAddButton().click();
    new ActorFormTestController().addActor(name);
    const actorLabel= new ActorViewTestController().getActorLabel(name);
    expect(actorLabel.should('have.text',name));
  })
})