import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { TrilhasProvider } from '@/contexts/TrilhasContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Tasks from '@/pages/Tasks';
import Chat from '@/pages/Chat';
import Admin from '@/pages/Admin';
import Profile from '@/pages/Profile';
import Workspace from '@/pages/Workspace';
import Trilhas from '@/pages/Trilhas';
import { TaskProvider } from '@/contexts/TaskContext';

const queryClient = new useQueryClient();

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
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
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/"
                        element={
                          <PrivateRoute>
                            <Home />
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
                        path="/admin"
                        element={
                          <PrivateRoute>
                            <Admin />
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
                        path="/workspace"
                        element={
                          <PrivateRoute>
                            <Workspace />
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
