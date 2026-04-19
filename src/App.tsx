import React, { useState } from 'react';
import Layout, { PageId } from './components/Layout';
import Home from './pages/Home';
import ReferenceModel from './pages/ReferenceModel';
import WorkshopLibrary from './pages/WorkshopLibrary';
import BuildStudio from './pages/BuildStudio';
import CompareLab from './pages/CompareLab';
import AssetStudio from './pages/AssetStudio';
import PortfolioMap from './pages/PortfolioMap';
import Admin from './pages/Admin';
import { MOCK_WORKSHOPS } from './constants';
import { Workshop } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [workshops, setWorkshops] = useState<Workshop[]>(MOCK_WORKSHOPS);
  const [activeWorkshopId, setActiveWorkshopId] = useState<string | null>(null);

  const activeWorkshop = workshops.find(w => w.id === activeWorkshopId) || null;

  const handleUpdateWorkshop = (updated: Workshop) => {
    setWorkshops(prev => prev.map(w => w.id === updated.id ? updated : w));
  };

  const handleCreateWorkshop = (newWorkshop: Workshop) => {
    setWorkshops(prev => [...prev, newWorkshop]);
    setActiveWorkshopId(newWorkshop.id);
    setCurrentPage('build');
  };

  const navigateToBuild = (id: string) => {
    setActiveWorkshopId(id);
    setCurrentPage('build');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            onNewWorkshop={handleCreateWorkshop} 
            onOpenWorkshop={navigateToBuild} 
            onNavigateToReference={() => setCurrentPage('reference')}
          />
        );
      case 'reference':
        return <ReferenceModel />;
      case 'library':
        return <WorkshopLibrary workshops={workshops} onOpenWorkshop={navigateToBuild} />;
      case 'build':
        return <BuildStudio workshop={activeWorkshop} onUpdate={handleUpdateWorkshop} />;
      case 'compare':
        return <CompareLab workshops={workshops} />;
      case 'assets':
        return <AssetStudio workshop={activeWorkshop} />;
      case 'portfolio':
        return <PortfolioMap workshops={workshops} />;
      case 'admin':
        return <Admin />;
      default:
        return (
          <Home 
            onNewWorkshop={handleCreateWorkshop} 
            onOpenWorkshop={navigateToBuild} 
            onNavigateToReference={() => setCurrentPage('reference')}
          />
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
