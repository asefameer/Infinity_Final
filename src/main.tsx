import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'InstrumentationKey=72b9d2ff-c31c-4828-b32b-424d88cd9c80;IngestionEndpoint=https://southeastasia-1.in.applicationinsights.azure.com/;LiveEndpoint=https://southeastasia.livediagnostics.monitor.azure.com/;ApplicationId=e3c50dd7-a367-4c9f-bfe6-1e64a807b480' 
  /* Tip: Use an environment variable here like import.meta.env.VITE_APPINSIGHTS_STRINGS */
}});
appInsights.loadAppInsights();
appInsights.trackPageView();

createRoot(document.getElementById("root")!).render(<App />);
