import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { ApplicationInsights } from '@microsoft/applicationinsights-web'

cconsole.log("DEBUG: App Insights Init Starting...");

const appInsights = new ApplicationInsights({ 
  config: {
    connectionString: 'InstrumentationKey=72b9d2ff-c31c-4828-b32b-424d88cd9c80;IngestionEndpoint=https://southeastasia-1.in.applicationinsights.azure.com/;LiveEndpoint=https://southeastasia.livediagnostics.monitor.azure.com/;ApplicationId=e3c50dd7-a367-4c9f-bfe6-1e64a807b480',
    loggingLevelConsole: 2, // Forces SDK to log to console
    enableDebug: true       // Enables internal SDK debugging
  } 
});

appInsights.loadAppInsights();
appInsights.trackPageView();

console.log("DEBUG: App Insights Init Finished!");

createRoot(document.getElementById("root")!).render(<App />);
