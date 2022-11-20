export class ActorFormTestController {
    nameInput() {return cy.get('[data-test-id="hb6LI"]')}
    deleteButton(){return cy.get('[data-test-id="zOj3e"]')}
    commentButton(){return cy.get('[data-test-id="1vYjs"]')}
    createAnotherButton(){return cy.get('[data-test-id="Gdobj"]')}
    backButton(){return cy.get('[data-test-id="FSfCd"]')}

    addActor(name:string){
        this.nameInput().type(name);
        this.backButton().click({force:true});
    }

}