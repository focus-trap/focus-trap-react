describe('<FocusTrap> component', () => {
  beforeEach(() => cy.visit('index.html'));

  function verifyCrucialFocusTrapOnClicking(focusedElAlias) {
    // trap is active(keep focus in trap by blocking clicks on outside focusable element)
    cy.findAllByRole('link', { name: 'Return to the repository' })
      .first()
      .click();
    cy.get(focusedElAlias).should('be.focused');

    // trap is active(keep focus in trap by blocking clicks on outside un-focusable element)
    cy.findByRole('heading', { name: 'focus-trap-react demo' }).click();
    cy.get(focusedElAlias).should('be.focused');
  }

  ['defaults', 'animated-dialog', 'animated-trigger', 'setReturnFocus'].forEach(
    (demoId) => {
      describe(`demo: ${demoId}`, () => {
        it('By default focus first element in its tab order and trap focus within its children', () => {
          cy.get(`#demo-${demoId}`).as('testRoot');

          // activate trap
          cy.get('@testRoot')
            .findByRole('button', { name: /^activate trap/ })
            .as('lastlyFocusedElementBeforeTrapIsActivated')
            .click();

          // 1st element should be focused
          cy.get('@testRoot')
            .findByRole('link', { name: 'with' })
            .as('firstElementInTrap')
            .should('be.focused');

          // crucial focus-trap feature: mouse click is trapped
          verifyCrucialFocusTrapOnClicking('@firstElementInTrap');

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
          cy.get('@firstElementInTrap')
            .should('be.focused')
            .tab({ shift: true });
          cy.get('@lastElementInTrap').should('be.focused');

          // trap can be deactivated and return focus to lastly focused element before trap is activated
          cy.get('@testRoot')
            .findByRole('button', { name: /^deactivate trap/ })
            .click();

          const returnFocusTarget =
            demoId === 'setReturnFocus'
              ? '#AlternateReturnFocusElement'
              : '@lastlyFocusedElementBeforeTrapIsActivated';

          cy.get(returnFocusTarget).should('have.focus');

          // focus can be transitioned freely when trap is unmounted
          let previousFocusedEl;
          cy.get('@lastlyFocusedElementBeforeTrapIsActivated')
            .then(([lastlyFocusedEl]) => (previousFocusedEl = lastlyFocusedEl))
            .tab();
          cy.focused().should(([nextFocusedEl]) =>
            expect(nextFocusedEl).not.equal(previousFocusedEl)
          );
        });
      });
    }
  );

  describe('demo: ffne', () => {
    it('On trap mounts and activates, focus on manually specified input element', () => {
      cy.get('#demo-ffne').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .click();

      // instead of next tab-order element being focused, element specified should be focused
      cy.get('@testRoot')
        .findByRole('textbox', { name: 'Initially focused input:' })
        .as('focusedEl')
        .should('be.focused');

      // crucial focus-trap feature: mouse click is trapped
      verifyCrucialFocusTrapOnClicking('@focusedEl');
    });

    it('Escape key does not deactivate trap. Instead, click on "deactivate trap" to deactivate trap', () => {
      cy.get('#demo-ffne').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      // trying deactivate trap by ESC
      cy.get('@testRoot')
        .findByRole('textbox', { name: 'Initially focused input:' })
        .as('trapChild')
        .focus()
        .type('{esc}');

      // ESC does not deactivate the trap
      cy.get('@trapChild').should('exist').should('be.focused');

      // crucial focus-trap feature: mouse click is trapped
      verifyCrucialFocusTrapOnClicking('@trapChild');

      // click on deactivate trap button to deactivate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .click();
      cy.get('@trapChild').should('not.exist');
      cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should('be.focused');
    });
  });

  describe('demo: special element', () => {
    // because this test allows click-through to deactivate, we can't use
    //  verifyCrucialFocusTrapOnClicking() because it clicks outside, and will
    //  cause the trap to be deactivated
    const verifyFocusTrapped = function () {
      // 1st element should be focused
      cy.get('@testRoot')
        .findByRole('link', { name: 'with' })
        .as('firstElementInTrap')
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
    };

    it('Can be deactivated while staying mounted by clicking on deactivate', () => {
      cy.get('#demo-special-element').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      verifyFocusTrapped();

      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('trapChild')
        .click();

      cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should('be.focused');

      // stay mounted after deactivation
      cy.get('@trapChild').should('exist');
    });

    it('Can be deactivated while staying mounted by pressing ESC key', () => {
      cy.get('#demo-special-element').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      verifyFocusTrapped();

      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('trapChild')
        .type('{esc}');

      cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should('be.focused');

      // stay mounted after deactivation
      cy.get('@trapChild').should('exist');
    });

    it('Can click outside of trap to deactivate and click carries through', () => {
      cy.get('#demo-special-element').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .as('lastlyFocusedElementBeforeTrapIsActivated')
        .click();

      verifyFocusTrapped();

      cy.get('@testRoot')
        .findByRole('button', { name: /^deactivate trap/ })
        .as('trapChild');

      // click outside to deactivate trap and also click carries through
      cy.findByRole('button', { name: 'pass thru click' })
        .as('passThru')
        .click();

      // activate button should NOT be focused because click should've gone through to passThru button
      cy.get('@lastlyFocusedElementBeforeTrapIsActivated').should(
        'not.be.focused'
      );

      // stay mounted after deactivation
      cy.get('@trapChild').should('exist');

      // passThru button has focus and click event was processed
      cy.get('@passThru').should('be.focused');
      cy.get('@testRoot').findByText('Clicked!');
    });
  });

  describe('demo: autofocus', () => {
    it('Focus on element with "autofocus" attribute than the 1st tab order element within mounted trap children', () => {
      cy.get('#demo-autofocus').as('testRoot');

      // activate trap
      cy.get('@testRoot')
        .findByRole('button', { name: /^activate trap/ })
        .click();

      // element with "autofocus" attribute is focused
      cy.findByTestId('autofocus-el').as('trapChild').should('be.focused');

      // crucial focus-trap feature: mouse click is trapped
      verifyCrucialFocusTrapOnClicking('@trapChild');
    });
  });

  describe('demo: containerElements prop', () => {
    describe('with child', () => {
      it('containerElements can be passed in and used as multiple boundaries to keep the focus within', () => {
        cy.get('#demo-containerelements').as('testRoot');

        // activate trap
        cy.get('@testRoot')
          .findByRole('button', { name: /^activate trap/ })
          .as('lastlyFocusedElementBeforeTrapIsActivated')
          .click();

        // 1st element should be focused
        cy.get('@testRoot')
          .findByRole('link', { name: 'with' })
          .as('firstElementInTrap')
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
          .should('have.text', 'See')
          .should('be.focused')
          .tab()
          .should('have.text', 'how')
          .should('be.focused')
          .tab()
          .should('have.text', 'works')
          .should('be.focused')
          .tab()
          .should('have.text', 'with')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'works')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'how')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'See')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'focusable')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'some')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'with')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'works')
          .should('be.focused');
      });
    });

    describe('without child', () => {
      it('containerElements can be passed in and used as multiple boundaries to keep the focus within', () => {
        cy.get('#demo-containerelements-childless').as('testRoot');

        // activate trap
        cy.get('@testRoot')
          .findByRole('button', { name: /^activate trap/ })
          .as('lastlyFocusedElementBeforeTrapIsActivated')
          .click();

        // 1st element should be focused
        cy.get('@testRoot')
          .findByRole('link', { name: 'with' })
          .as('firstElementInTrap')
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
          .should('have.text', 'See')
          .should('be.focused')
          .tab()
          .should('have.text', 'how')
          .should('be.focused')
          .tab()
          .should('have.text', 'works')
          .should('be.focused')
          .tab()
          .should('have.text', 'with')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'works')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'how')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'See')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'focusable')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'some')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'with')
          .should('be.focused')
          .tab({ shift: true })
          .should('have.text', 'works')
          .should('be.focused');
      });
    });
  });

  // describe('demo: with-shadow-dom', () => {
  //   TL/DR: Unfortunately, the https://github.com/Bkucera/cypress-plugin-tab plugin doesn't
  //    support Shadow DOM, and Cypress itself doesn't have great support for it either
  //    (see more info below) so there's no point in writing a test for this demo at this time.
  //   NOTE: Because of how Cypress interacts with Shadown DOMs, it sees the shadow as a black
  //    box that has focus, so that limits what we can check for in expectations (e.g. we can't
  //    effectively check that an element inside a shadow has focus; Cypress will always say yes
  //    because something inside has focus, but it doesn't know what, exactly...). Also, the
  //    cypress-plugin-tab will complain if we try to .tab() from inside the shadow host saying
  //    it's not a tabbable element because it doesn't appear to support shadow DOM.
  // });
});
