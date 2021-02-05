# cypressInsightsReporter
Simple reporter that sends Cypress test results to Azure Application Insights as AvailabilityResults

SYNOPSIS

Place the file in the "reporters" folder of your Cypress project and add something like the following to cypress.json:

{
  "reporter": "reporters/insights.js",
  "reporterOptions": {
    "appInsightsConnectionString": "xxx"
  }
}

