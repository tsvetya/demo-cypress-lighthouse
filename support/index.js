import "cypress-fail-fast";
import "@cypress-audit/lighthouse/commands";
import addContext from "mochawesome/addContext";


before(() => {
	Cypress.Cookies.defaults({
		preserve: () => true
	});
});

Cypress.on("test:after:run", (test, runnable) => {
	if (test.state === "failed") {
		const screenshot = `../screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
		addContext({ test }, screenshot);
	}
});
