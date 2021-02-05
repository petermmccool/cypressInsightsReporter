// https://mochajs.org/api/tutorial-custom-reporter.html
// https://docs.microsoft.com/en-us/azure/azure-monitor/app/nodejs
// https://github.com/microsoft/ApplicationInsights-JS/blob/master/README.md
'use strict';

let AppInsights = require("applicationinsights");

const { v1: uuidv1 } = require('uuid');

function sendAvailabilityRecord(appInsightsConnectionString, test, success, err) {
    var client = new AppInsights.TelemetryClient(appInsightsConnectionString);
    client.trackAvailability({ 
                duration: test.duration, 
		id: uuidv1(), 
		message: success ? "Test passed" : `Test failed: ${err.message}`,
		success : success, 
		name: test.fullTitle(), 
		runLocation: "Cyress" 
            });
    client.flush();
}

const Mocha = require('mocha');
const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END
} = Mocha.Runner.constants;

// this reporter sends results of individual tests to Azure App Insights as availability records.
class AzureAppInsightsReporter {
  constructor(runner, options) {
    const stats = runner.stats;

    let appInsightsConnectionString = ""
    if (options && options.reporterOptions) {
      if (options.reporterOptions.appInsightsConnectionString) {
        appInsightsConnectionString = options.reporterOptions.appInsightsConnectionString
      }
    }

    runner
      .on(EVENT_TEST_PASS, test => {
        sendAvailabilityRecord(appInsightsConnectionString, test, true)
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        sendAvailabilityRecord(appInsightsConnectionString, test, false, err)
      });
  }
}

module.exports = AzureAppInsightsReporter;