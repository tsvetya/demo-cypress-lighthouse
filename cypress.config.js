const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const { pa11y } = require("@cypress-audit/pa11y");

module.exports = defineConfig({
	e2e: {
		baseUrl: "https://www.google.com",
		specPattern: "**/*.feature",
		excludeSpecPattern: ["**/*.html", "**/*.js"],
		fixturesFolder: "./fixtures",
		supportFile: "./support/index.js",
		screenshotsFolder: "./reporter/screenshots",
		videosFolder: "./reporter/videos",
		downloadsFolder: "./reporter/downloads",
		defaultCommandTimeout: 120000,
		execTimeout: 15000,
		taskTimeout: 15000,
		pageLoadTimeout: 200000,
		slowTestThreshold: 300000,
		viewportHeight: 768,
		viewportWidth: 1024,
		scrollBehavior: "center",
		chromeWebSecurity: false,
		video: false,
		reporter: "cypress-multi-reporters",
		reporterOptions: {
			configFile: "reporter-config.json"
		},
		setupNodeEvents(on, config) {
			on("before:browser:launch", (browser = {}, launchOptions) => {
				prepareAudit(launchOptions);
			});
	
			on("task", {
				lighthouse: lighthouse((lighthouseReport) => {
					console.log(lighthouseReport);
				}),
				pa11y: pa11y(console.log.bind(console)),
			});

			on("file:preprocessor", cucumber());

			config.env.FAIL_FAST_ENABLED = config.env.mode === "DEBUG";
			// if enabled, will fail on the first error
			require("cypress-fail-fast/plugin")(on, config);

			if (config.env.mode === "DEBUG") {
				
				// auto open devtools in debug env. see https://github.com/cypress-io/cypress/issues/2024
				on("before:browser:launch", (browser = {}, launchOptions) => {
					if (browser.family === "chromium" && browser.name !== "electron") {
						launchOptions.args.push("--auto-open-devtools-for-tabs");
						launchOptions.args.push("--disable-extensions");
					} else if (browser.family === "firefox") {
						launchOptions.args.push("-devtools");
					} else if (browser.name === "electron") {
						launchOptions.preferences.devTools = true;
					}
					return launchOptions;
				});
			}
		},
	},
});
