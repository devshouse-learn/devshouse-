import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/home/Home';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import BackendMonitor from './components/common/BackendMonitor';
import AgreementsHub from './components/agreements/AgreementsHub';
import AgreementsList from './components/agreements/AgreementsList';
import StudentsList from './components/agreements/StudentsList';
import AgreementsForm from './components/forms/AgreementsForm';
import StudentForm from './components/forms/StudentForm';
import VenturesList from './components/ventures/VenturesList';
import VenturesForm from './components/forms/VenturesForm';
import JobsList from './components/jobs/JobsList';
import JobsForm from './components/forms/JobsForm';
import JobSearchList from './components/job-search/JobSearchList';
import JobSearchForm from './components/forms/JobSearchForm';
import AdminPanel from './components/admin/AdminPanel';
import AdminDashboard from './components/admin/AdminDashboard';
import DataViewer from './components/dashboard/DataViewer';
import ModerationPanel from './components/moderation/ModerationPanel';
import RecruitingHub from './components/recruiting/RecruitingHub';
import SearchCompanies from './components/recruiting/SearchCompanies';
import SearchTalent from './components/recruiting/SearchTalent';
import PublishJob from './components/recruiting/PublishJob';
import PublishProfile from './components/recruiting/PublishProfile';

function App() {
  return (
    <ErrorBoundary>
      <BackendMonitor />
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="agreements"
                element={<AgreementsHub />}
              />
              <Route
                path="agreements/list"
                element={<AgreementsList />}
              />
              <Route
                path="agreements/students"
                element={<StudentsList />}
              />
              <Route
                path="agreements/form"
                element={
                  <ProtectedRoute>
                    <AgreementsForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="agreements/student"
                element={
                  <ProtectedRoute>
                    <StudentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ventures"
                element={<VenturesList />}
              />
              <Route
                path="ventures/form"
                element={
                  <ProtectedRoute>
                    <VenturesForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jobs"
                element={<JobsList />}
              />
              <Route
                path="jobs/form"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <JobsForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="job-search"
                element={<JobSearchList />}
              />
              <Route
                path="job-search/form"
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
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="data-viewer"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DataViewer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="recruiting"
                element={<RecruitingHub />}
              />
              <Route
                path="recruiting/search-companies"
                element={<SearchCompanies />}
              />
              <Route
                path="recruiting/search-talent"
                element={<SearchTalent />}
              />
              <Route
                path="recruiting/publish-job"
                element={<PublishJob />}
              />
              <Route
                path="recruiting/publish-profile"
                element={<PublishProfile />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
