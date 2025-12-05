
import React, { useState } from 'react';
import { FluidBackground } from './components/FluidBackground';
import { HomePage } from './pages/Home';
import { ChatPage } from './pages/Chat';
import { CalendarPage } from './pages/Calendar';
import { CampusPage } from './pages/Campus';
import { WaterfallPage } from './pages/Waterfall';
import { ProfilePage } from './pages/Profile';
import { AdminPage } from './pages/Admin';
import { MoodType, JournalEntry, PersonaConfig } from './types';
import { Home, Calendar as CalendarIcon, ClipboardList, Megaphone, User, Settings } from 'lucide-react';
import { PERSONAS } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [globalMood, setGlobalMood] = useState<MoodType>(MoodType.NEUTRAL);

  // Persona State - Default to the second one (Rational) per user request
  const [currentPersona, setCurrentPersona] = useState<PersonaConfig>(PERSONAS[1]);

  // State to hold message when switching from Journal Modal to Chat
  const [pendingChatMessage, setPendingChatMessage] = useState<string | null>(null);

  const handleAddEntry = (entry: JournalEntry) => {
    // 日记已保存到 Supabase，这里可以添加额外的处理逻辑（如通知）
    console.log('日记已保存:', entry);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage
                  setPage={setCurrentPage}
                  currentMood={globalMood}
                  setGlobalMood={setGlobalMood}
                  onSaveEntry={handleAddEntry}
                  setPendingChatMessage={setPendingChatMessage}
                  currentPersona={currentPersona}
                  setPersona={setCurrentPersona}
               />;
      case 'chat':
        return <ChatPage
                  setGlobalMood={setGlobalMood}
                  initialMessage={pendingChatMessage}
                  clearInitialMessage={() => setPendingChatMessage(null)}
                  currentPersona={currentPersona}
               />;
      case 'calendar':
        return <CalendarPage
                  setGlobalMood={setGlobalMood}
               />;
      case 'campus': return <CampusPage />;
      case 'waterfall': return <WaterfallPage />;
      case 'profile': return <ProfilePage />;
      case 'admin': return <AdminPage />;
      default: return <HomePage
                  setPage={setCurrentPage}
                  currentMood={globalMood}
                  setGlobalMood={setGlobalMood}
                  onSaveEntry={handleAddEntry}
                  setPendingChatMessage={setPendingChatMessage}
                  currentPersona={currentPersona}
                  setPersona={setCurrentPersona}
               />;
    }
  };

  const NavButton = ({ id, icon: Icon }: { id: string, icon: any }) => (
    <button 
        onClick={() => setCurrentPage(id)}
        className={`p-3 rounded-full transition-all duration-300 ${
            currentPage === id 
            ? 'bg-gray-800 text-white shadow-lg' 
            : 'text-gray-500 hover:bg-white/30'
        }`}
    >
        <Icon size={20} strokeWidth={1.5} />
    </button>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden text-gray-800">
      <FluidBackground mood={globalMood} />

      {/* 管理入口按钮 */}
      <button
        onClick={() => setCurrentPage('admin')}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          currentPage === 'admin'
            ? 'bg-gray-800 text-white'
            : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white border border-white/50'
        }`}
        title="后台管理"
      >
        <Settings size={20} strokeWidth={1.5} />
      </button>

      {/* Main Content Area */}
      <main className="h-full w-full">
        {renderPage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-panel rounded-full pl-2 pr-2 py-2 flex items-center gap-1 shadow-xl z-40 border border-white/40">
        <NavButton id="calendar" icon={CalendarIcon} />
        <NavButton id="waterfall" icon={Megaphone} />

        {/* Center Prominent Button for Home */}
        <button
            onClick={() => setCurrentPage('home')}
            className={`
                mx-2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md border border-white/20
                ${currentPage === 'home'
                ? 'bg-gray-800 text-white scale-110 shadow-gray-500/30'
                : 'bg-white/50 text-gray-700 hover:bg-white/70'}
            `}
        >
            <Home size={24} strokeWidth={1.5} />
        </button>

        <NavButton id="campus" icon={ClipboardList} />
        <NavButton id="profile" icon={User} />
      </nav>
    </div>
  );
};

export default App;
