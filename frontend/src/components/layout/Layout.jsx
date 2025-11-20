import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AIAssistant from '../ai-assistant/AIAssistant';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <div className="container content-wrapper">
          <Outlet />
        </div>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Layout;
