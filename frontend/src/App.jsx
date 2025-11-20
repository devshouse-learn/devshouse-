import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/home/Home';
import './App.css';

// Temporary placeholder components for routes not yet created
const AgreementsPage = () => (
  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>Convenios con Colegios</h1>
    <p>Formulario de registro de convenios (próximamente)</p>
  </div>
);

const VenturesPage = () => (
  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>Emprendimientos</h1>
    <p>Formulario de publicación de emprendimientos (próximamente)</p>
  </div>
);

const JobsPage = () => (
  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>Publicar Empleo</h1>
    <p>Formulario para empresas (próximamente)</p>
  </div>
);

const JobSearchPage = () => (
  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
    <h1>Buscar Empleo</h1>
    <p>Formulario para candidatos (próximamente)</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="agreements" element={<AgreementsPage />} />
          <Route path="ventures" element={<VenturesPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="job-search" element={<JobSearchPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
