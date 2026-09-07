import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NotificationsPage from "./pages/NotificationPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import ChatPage from "./pages/ChatPage";
import RequestsPage from "./pages/RequestsPage";
import CallPage from "./pages/CallPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./components/NotFound";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
function App() {
  return (
    <main>
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path={"/chat/:userId" || "/chat"} element={<ChatPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/call/:callId" element={<CallPage />} />
          </Route>
          {/* 404 */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
