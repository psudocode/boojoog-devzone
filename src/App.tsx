import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { fetchEntriesAtom } from "./atoms/hostsAtoms";
import {
  loadAppSettingsAtom,
  initSystemThemeDetectionAtom,
} from "./atoms/consolidatedAtoms";
import ThemeProvider from "./components/ThemeProvider";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import HostsPage from "./pages/HostsPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import NginxPage from "./pages/NginxPage";
import LocalSitePage from "./pages/LocalSitePage";

function App() {
  const fetchEntries = useSetAtom(fetchEntriesAtom);
  const loadAppSettings = useSetAtom(loadAppSettingsAtom);
  const initSystemThemeDetection = useSetAtom(initSystemThemeDetectionAtom);

  // Load settings and fetch entries when the app loads
  useEffect(() => {
    initSystemThemeDetection();
    loadAppSettings();
    fetchEntries();
  }, [initSystemThemeDetection, loadAppSettings, fetchEntries]);
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/hosts"
            element={
              <Layout>
                <HostsPage />
              </Layout>
            }
          />{" "}
          <Route
            path="/about"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />{" "}
          <Route
            path="/local-site"
            element={
              <Layout>
                <LocalSitePage />
              </Layout>
            }
          />
          <Route
            path="/nginx"
            element={
              <Layout>
                <NginxPage />
              </Layout>
            }
          />{" "}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
