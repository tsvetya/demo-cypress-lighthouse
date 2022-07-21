import {Given, Then} from "cypress-cucumber-preprocessor/steps";

Given('I open the page', () => {
	cy.visit('https://google.com');
});

Then('perf metrics are below thresholds', () => {
	cy.lighthouse({
		performance: 85,
		"first-contentful-paint": 2000,
	});
});
