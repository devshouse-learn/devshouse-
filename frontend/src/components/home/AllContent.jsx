import { useState } from 'react';
import JobsList from '../jobs/JobsList';
import VenturesList from '../ventures/VenturesList';
import AgreementsList from '../agreements/AgreementsList';
import StudentsList from '../agreements/StudentsList';
import SearchTalent from '../recruiting/SearchTalent';
import './AllContent.css';

const AllContent = () => {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="all-content">
      <div className="content-tabs">
        <button
          className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          💼 Ofertas de Trabajo
        </button>
        <button
          className={`tab-button ${activeTab === 'ventures' ? 'active' : ''}`}
          onClick={() => setActiveTab('ventures')}
        >
          🚀 Emprendimientos
        </button>
        <button
          className={`tab-button ${activeTab === 'agreements' ? 'active' : ''}`}
          onClick={() => setActiveTab('agreements')}
        >
          📋 Convenios
        </button>
        <button
          className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          🎓 Estudiantes
        </button>
        <button
          className={`tab-button ${activeTab === 'talent' ? 'active' : ''}`}
          onClick={() => setActiveTab('talent')}
        >
          👥 Talentos
        </button>
      </div>

      <div className="content-area">
        {activeTab === 'jobs' && <JobsList />}
        {activeTab === 'ventures' && <VenturesList />}
        {activeTab === 'agreements' && <AgreementsList />}
        {activeTab === 'students' && <StudentsList />}
        {activeTab === 'talent' && <SearchTalent />}
      </div>
    </div>
  );
};

export default AllContent;
