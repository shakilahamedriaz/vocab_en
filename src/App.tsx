import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useAppStore } from './stores';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import VocabularyLibrary from './pages/VocabularyLibrary';
import WordDetail from './pages/WordDetail';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import SRSReview from './pages/SRSReview';
import WordArena from './pages/WordArena';
import SpeedMatch from './pages/games/SpeedMatch';
import WordScramble from './pages/games/WordScramble';
import SynonymHunt from './pages/games/SynonymHunt';
import MemoryMatch from './pages/games/MemoryMatch';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  const { checkAuth } = useAuthStore();
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    checkAuth();
    setTheme(theme);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="vocabulary" element={<VocabularyLibrary />} />
          <Route path="vocabulary/:id" element={<WordDetail />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="review" element={<SRSReview />} />
          <Route path="arena" element={<WordArena />} />
          <Route path="arena/speed" element={<SpeedMatch />} />
          <Route path="arena/scramble" element={<WordScramble />} />
          <Route path="arena/hunt" element={<SynonymHunt />} />
          <Route path="arena/memory" element={<MemoryMatch />} />
        </Route>
      </Routes>
    </>
  );
}
