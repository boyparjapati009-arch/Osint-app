import React from 'react';
import HomeScreen from './components/HomeScreen';
import AadhaarScreen from './components/AadhaarScreen';
import NumberScreen from './components/NumberScreen';
import SimInfoScreen from './components/SimInfoScreen';
import PincodeScreen from './components/PincodeScreen';
import CombinedScreen from './components/CombinedScreen';
import Footer from './components/Footer';
import BackButton from './components/BackButton';
import { useUrlRouter } from './hooks/useUrlRouter';

const App: React.FC = () => {
  const { view, setView, urlQuery, handleBack } = useUrlRouter();

  const renderView = () => {
    switch (view) {
      case 'aadhaar':
        return <AadhaarScreen initialQuery={urlQuery?.type === 'aadhaar' ? urlQuery.value : undefined} />;
      case 'number':
        return <NumberScreen initialQuery={urlQuery?.type === 'number' ? urlQuery.value : undefined} />;
      case 'sim':
        return <SimInfoScreen />;
      case 'pincode':
        return <PincodeScreen />;
      case 'combined':
        return <CombinedScreen />;
      case 'home':
      default:
        return <HomeScreen 
          onSelectAadhaar={() => setView('aadhaar')} 
          onSelectNumber={() => setView('number')}
          onSelectSimInfo={() => setView('sim')}
          onSelectPincode={() => setView('pincode')}
          onSelectCombined={() => setView('combined')}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(50%_50%_at_50%_50%,transparent,black)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-tr from-indigo-600/40 to-purple-600/40 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {view !== 'home' && <BackButton onClick={handleBack} />}

      <main className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center flex-grow z-10">
        {renderView()}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;