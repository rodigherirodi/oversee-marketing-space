
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { TrilhasProvider } from '@/contexts/TrilhasContext';
import Tasks from '@/pages/Tasks';
import Chat from '@/pages/Chat';
import Profile from '@/pages/Profile';
import Trilhas from '@/pages/Trilhas';
import { TaskProvider } from '@/contexts/TaskContext';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <AuthProvider>
          <WorkspaceProvider>
            <TrilhasProvider>
              <ChatProvider>
                <TaskProvider>
                  <div className="min-h-screen bg-background">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PrivateRoute>
                            <Tasks />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/tasks"
                        element={
                          <PrivateRoute>
                            <Tasks />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/chat"
                        element={
                          <PrivateRoute>
                            <Chat />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <PrivateRoute>
                            <Profile />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/trilhas"
                        element={
                          <PrivateRoute>
                            <Trilhas />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </div>
                </TaskProvider>
              </ChatProvider>
            </TrilhasProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
