import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import Diario from "./pages/Diario";
import Lecciones from "./pages/Lecciones";
import Upsell from "./pages/Upsell";
import Downsell from "./pages/Downsell";
import ThankYou from "./pages/ThankYou";
import PelvicExercises from "./pages/tools/PelvicExercises";
import BladderRetraining from "./pages/tools/BladderRetraining";
import ProductsChecklist from "./pages/tools/ProductsChecklist";
import ActionPlan from "./pages/tools/ActionPlan";
import QASession from "./pages/tools/QASession";
import PackPremium from "./pages/PackPremium";
import AdvancedExercisesWorkbook from "./pages/premium/AdvancedExercisesWorkbook";
import SmartShoppingChecklist from "./pages/premium/SmartShoppingChecklist";
import PersonalizedActionProtocol from "./pages/premium/PersonalizedActionProtocol";
import ExpertSessions from "./pages/premium/ExpertSessions";
import EmotionalGuide from "./pages/premium/EmotionalGuide";
import ExclusiveCommunity from "./pages/premium/ExclusiveCommunity";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/bienvenida"} component={Welcome} />
      <Route path={"/diario"} component={Diario} />
      <Route path={"/lecciones"} component={Lecciones} />
      <Route path={"/upsell"} component={Upsell} />
      <Route path={"/downsell"} component={Downsell} />
      <Route path={"/thank-you"} component={ThankYou} />
      <Route path={"/tools/pelvic-exercises"} component={PelvicExercises} />
      <Route path={"/herramienta/reentrenamiento"} component={BladderRetraining} />
      <Route path={"/tools/products-checklist"} component={ProductsChecklist} />
      <Route path={"/tools/action-plan"} component={ActionPlan} />
      <Route path={"/tools/qa-session"} component={QASession} />
      <Route path={"/pack-premium"} component={PackPremium} />
      <Route path={"/premium/advanced-exercises-workbook"} component={AdvancedExercisesWorkbook} />
      <Route path={"/premium/smart-shopping-checklist"} component={SmartShoppingChecklist} />
      <Route path={"/premium/personalized-action-protocol"} component={PersonalizedActionProtocol} />
      <Route path={"/premium/expert-sessions"} component={ExpertSessions} />
      <Route path={"/premium/emotional-guide"} component={EmotionalGuide} />
      <Route path={"/premium/exclusive-community"} component={ExclusiveCommunity} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
