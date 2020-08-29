// TODO: maybe we just need one spec file for all
describe('<FocusTrap> component', () => {
  it('By default focus first element in its tab order and trap focus within its children', () => {
    cy.visit('index.html');

    cy.get('#demo-defaults')
      .as('trap');

    // activate trap
    cy.get('@trap')
      .findByRole('button', { name: 'activate trap' })
      .as('lastlyFocusedElementBeforeTrapIsActivated')
      .click();

    // 1st element should be focused
    cy.get('@trap').findByRole('link', { name: 'with' }).as('firstElementInTrap').should('be.focused');

    // trap is active(keep focus in trap by blocking clicks on outside focusable element)
    cy.findAllByRole('link', { name: 'Return to the repository' }).first().click();
    cy.get('@firstElementInTrap').should('be.focused');

    // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
    cy.findByRole('heading', { name: 'defaults' }).click();
    cy.get('@firstElementInTrap')
      .should('be.focused');

    // trap is active(keep focus in trap by tabbing through the focus trap's tabbable elements)
    cy.get('@firstElementInTrap')
      .tab()
      .should('have.text', 'some')
      .should('be.focused')
      .tab()
      .should('have.text', 'focusable')
      .should('be.focused')
      .tab()
      .as('lastElementInTrap')
      .should('have.text', 'deactivate trap')
      .should('be.focused')
      .tab();

    // trap is active(keep focus in trap by shift-tabbing through the focus trap's tabbable elements)
    cy.get('@firstElementInTrap').should('be.focused').tab({ shift: true });
    cy.get('@lastElementInTrap').should('be.focused');

    // trap can be deactivated and return focus to lastly focused element before trap is activated
    cy.get('@trap').findByRole('button', { name: 'deactivate trap' }).click();
    cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      .should('have.focus')

    // focus can be transitioned freely when trap is unmounted
    let previousFocusedEl;
    cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
      .then(([lastlyFocusedEl]) => previousFocusedEl = lastlyFocusedEl)
      .tab();
    cy.focused().should(([nextFocusedEl]) =>
      expect(nextFocusedEl).not.equal(previousFocusedEl));
  });
});
