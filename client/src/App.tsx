import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppLayout } from "@/components/layout/AppLayout";

import Dashboard from "@/pages/Dashboard";
import LogCycle from "@/pages/LogCycle";
import AnalyzeText from "@/pages/AnalyzeText";
import AnalyzeVoice from "@/pages/AnalyzeVoice";
import AnalyzeImage from "@/pages/AnalyzeImage";
import History from "@/pages/History";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/log" component={LogCycle} />
        <Route path="/analyze/text" component={AnalyzeText} />
        <Route path="/analyze/voice" component={AnalyzeVoice} />
        <Route path="/analyze/image" component={AnalyzeImage} />
        <Route path="/history" component={History} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
