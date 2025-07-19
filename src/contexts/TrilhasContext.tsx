
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrilhaDetalhada, TrilhaProgress, UserTrilhaData } from '../types/trilhas';
import { mockTrilhasDetalhadas, mockUserTrilhaData } from '../data/trilhasMockData';

interface TrilhasContextType {
  trilhas: TrilhaDetalhada[];
  userProgress: UserTrilhaData;
  getTrilhaById: (id: string) => TrilhaDetalhada | undefined;
  toggleCourseCompletion: (trilhaId: string, courseId: string) => void;
  updateTrilhaNotes: (trilhaId: string, notes: string) => void;
  getTrilhaProgress: (trilhaId: string) => TrilhaProgress | undefined;
  getFilteredTrilhas: (category?: string, targetRole?: string) => TrilhaDetalhada[];
}

const TrilhasContext = createContext<TrilhasContextType | undefined>(undefined);

export const useTrilhas = () => {
  const context = useContext(TrilhasContext);
  if (!context) {
    throw new Error('useTrilhas must be used within a TrilhasProvider');
  }
  return context;
};

interface TrilhasProviderProps {
  children: ReactNode;
}

export const TrilhasProvider: React.FC<TrilhasProviderProps> = ({ children }) => {
  const [trilhas, setTrilhas] = useState<TrilhaDetalhada[]>(mockTrilhasDetalhadas);
  const [userProgress, setUserProgress] = useState<UserTrilhaData>(mockUserTrilhaData);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedProgress = localStorage.getItem('trilhas-progress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setUserProgress(parsedProgress);
      } catch (error) {
        console.error('Erro ao carregar progresso das trilhas:', error);
      }
    }
  }, []);

  // Salvar no localStorage sempre que o progresso mudar
  useEffect(() => {
    localStorage.setItem('trilhas-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const getTrilhaById = (id: string): TrilhaDetalhada | undefined => {
    return trilhas.find(trilha => trilha.id === id);
  };

  const toggleCourseCompletion = (trilhaId: string, courseId: string) => {
    setUserProgress(prev => {
      const trilhaProgress = prev.trilhaProgresses[trilhaId] || {
        trilhaId,
        completedCourses: [],
        startedAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        notes: '',
        certificateEarned: false
      };

      const isCompleted = trilhaProgress.completedCourses.includes(courseId);
      const updatedCompletedCourses = isCompleted
        ? trilhaProgress.completedCourses.filter(id => id !== courseId)
        : [...trilhaProgress.completedCourses, courseId];

      const trilha = getTrilhaById(trilhaId);
      const totalCourses = trilha?.courses.length || 0;
      const completedCount = updatedCompletedCourses.length;
      const certificateEarned = completedCount === totalCourses && trilha?.certificate;

      return {
        ...prev,
        trilhaProgresses: {
          ...prev.trilhaProgresses,
          [trilhaId]: {
            ...trilhaProgress,
            completedCourses: updatedCompletedCourses,
            lastAccessed: new Date().toISOString(),
            certificateEarned: certificateEarned || false
          }
        }
      };
    });

    // Atualizar o progresso na trilha correspondente
    setTrilhas(prev => prev.map(trilha => {
      if (trilha.id === trilhaId) {
        const progress = userProgress.trilhaProgresses[trilhaId];
        const completedCount = progress ? progress.completedCourses.length : 0;
        const newProgress = Math.round((completedCount / trilha.totalCourses) * 100);
        
        return {
          ...trilha,
          progress: newProgress,
          completedCourses: completedCount
        };
      }
      return trilha;
    }));
  };

  const updateTrilhaNotes = (trilhaId: string, notes: string) => {
    setUserProgress(prev => ({
      ...prev,
      trilhaProgresses: {
        ...prev.trilhaProgresses,
        [trilhaId]: {
          ...(prev.trilhaProgresses[trilhaId] || {
            trilhaId,
            completedCourses: [],
            startedAt: new Date().toISOString(),
            lastAccessed: new Date().toISOString(),
            certificateEarned: false
          }),
          notes,
          lastAccessed: new Date().toISOString()
        }
      }
    }));
  };

  const getTrilhaProgress = (trilhaId: string): TrilhaProgress | undefined => {
    return userProgress.trilhaProgresses[trilhaId];
  };

  const getFilteredTrilhas = (category?: string, targetRole?: string): TrilhaDetalhada[] => {
    return trilhas.filter(trilha => {
      if (category && trilha.category !== category) return false;
      if (targetRole && trilha.targetRole !== targetRole) return false;
      return true;
    });
  };

  return (
    <TrilhasContext.Provider
      value={{
        trilhas,
        userProgress,
        getTrilhaById,
        toggleCourseCompletion,
        updateTrilhaNotes,
        getTrilhaProgress,
        getFilteredTrilhas
      }}
    >
      {children}
    </TrilhasContext.Provider>
  );
};
