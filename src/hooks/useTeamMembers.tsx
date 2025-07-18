
import { useState } from 'react';
import { TeamMember } from '../types/entities';
import { mockTeamMembers } from '../data/mockData';

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [isLoading, setIsLoading] = useState(false);

  const addTeamMember = (newMember: Omit<TeamMember, 'id'>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const member: TeamMember = {
        ...newMember,
        id: Date.now().toString(),
      };
      
      setTeamMembers(prev => [...prev, member]);
      setIsLoading(false);
    }, 500);
  };

  const updateTeamMember = (id: string, updatedMember: Partial<TeamMember>) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === id ? { ...member, ...updatedMember } : member
        )
      );
      setIsLoading(false);
    }, 500);
  };

  const deleteTeamMember = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      setIsLoading(false);
    }, 500);
  };

  const getActiveMembers = () => teamMembers.filter(member => member.status === 'active');
  
  const getMembersByDepartment = (department: string) => 
    teamMembers.filter(member => member.department === department);

  const searchMembers = (query: string) => {
    if (!query.trim()) return teamMembers;
    
    const lowercaseQuery = query.toLowerCase();
    return teamMembers.filter(member =>
      member.name.toLowerCase().includes(lowercaseQuery) ||
      member.email.toLowerCase().includes(lowercaseQuery) ||
      member.position.toLowerCase().includes(lowercaseQuery) ||
      member.department.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    teamMembers,
    isLoading,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getActiveMembers,
    getMembersByDepartment,
    searchMembers,
  };
};
