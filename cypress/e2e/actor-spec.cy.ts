import { ActorFormTestController } from "../controller/ActorFormTestController";
import { ActorViewTestController } from "../controller/ActorViewTestController";
import { EditMenuTestController } from "../controller/EditMenuTestController";
import { SidePanelTestController } from "./../controller/SidePanelTestController"
describe('Actor',async () => {
  it('create Actor', () => {
    cy.visit('http://localhost:9000/')
    const editMenu = new EditMenuTestController();
    const sidePanel= new SidePanelTestController();
    const actorForm= new ActorFormTestController();
    const actorView= new ActorViewTestController();
    const name = "Actor1"

    sidePanel.editButton().click();
    editMenu.actorAddOrEditAddButton().click();
    actorForm.addActor(name);
    const actorLabel= actorView.getActorLabel(name);

    expect(actorLabel.should('have.text',name));
  })
})