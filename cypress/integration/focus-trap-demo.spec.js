describe('<FocusTrap> component', () => {
  beforeEach(() => cy.visit('index.html'));

  it('By default focus first element in its tab order and trap focus within its children', () => {
    cy.get('#demo-defaults')
      .as('testRoot');

    // activate trap
    cy.get('@testRoot')
      .findByRole('button', { name: 'activate trap' })
      .as('lastlyFocusedElementBeforeTrapIsActivated')
      .click();

    // 1st element should be focused
    cy.get('@testRoot').findByRole('link', { name: 'with' }).as('firstElementInTrap').should('be.focused');

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
    cy.get('@testRoot').findByRole('button', { name: 'deactivate trap' }).click();
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

  it('On trap mounts and activates, focus on manually specified input element', () => {
    cy.get('#demo-ffne')
      .as('testRoot');

    // activate trap
    cy.get('@testRoot').findByRole('button', { name: 'activate trap' })
      .click();

    // instead of next tab-order element being focused, element specified should be focused
    cy.get('@testRoot').findByRole('textbox', { name: 'Initially focused input' }).should('be.focused');
  });

  it('Escape key does not deactivate trap. Instead, click on "deactivate trap" to deactivate trap', () => {
    cy.get('#demo-ffne')
      .as('testRoot');

    // activate trap
    cy.get('@testRoot').findByRole('button', { name: 'activate trap' }).as('lastlyFocusedElementBeforeTrapIsActivated')
      .click();

    // trying deactivate trap by ESC
    cy.get('@testRoot').findByRole('textbox', { name: 'Initially focused input' }).as('trapChild').focus().type('{esc}');

    // ESC does not deactivate the trap
    cy.get('@trapChild').should('exist').should('be.focused');

    // click on deactivate trap button to deactivate trap
    cy.get('@testRoot').findByRole('button', { name: 'deactivate trap' }).click();
    cy.get('@trapChild').should('not.exist');
    cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should('be.focused');
  });

  it('Can be deactivated while staying mounted  ', () => {
    cy.get('#demo-special-element')
      .as('testRoot');

    // activate trap
    cy.get('@testRoot').findByRole('button', { name: 'activate trap' }).as('lastlyFocusedElementBeforeTrapIsActivated')
      .click();

    // stay mounted after deactivation
    cy.get('@testRoot').findByRole('button', { name: 'deactivate trap' }).as('trapChild').click();
    cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should('be.focused');
    cy.get('@trapChild').should('exist');
  });

  it('Can click outside of trap to deactivate and click carries through  ', () => {
    cy.get('#demo-special-element')
      .as('testRoot');

    // activate trap
    cy.get('@testRoot').findByRole('button', { name: 'activate trap' }).click();

    // click outside to deactivate trap and also click carries through
    cy.findByRole('button', { name: 'pass thru click' }).click().should('be.focused');
    cy.get('@testRoot').findByText('Clicked!');
  });

  it('Focus on element with "autofocus" attribute than the 1st tab order element within mounted trap children', () => {
    cy.get('#demo-autofocus')
      .as('testRoot');

    // activate trap
    cy.get('@testRoot').findByRole('button', { name: 'activate trap' }).click();

    // element with "autofocus" attribute is focused
    cy.findByTestId('autofocus-el').should('be.focused');
  });
});
