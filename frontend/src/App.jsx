import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/home/Home';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AgreementsForm from './components/forms/AgreementsForm';
import VenturesForm from './components/forms/VenturesForm';
import JobsForm from './components/forms/JobsForm';
import JobSearchForm from './components/forms/JobSearchForm';
import AdminPanel from './components/admin/AdminPanel';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="agreements"
                element={
                  <ProtectedRoute>
                    <AgreementsForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ventures"
                element={
                  <ProtectedRoute>
                    <VenturesForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jobs"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <JobsForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="job-search"
                element={
                  <ProtectedRoute>
                    <JobSearchForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
