
import React, { useState } from 'react';
import { TeamMember } from '@/types/entities';
import { mockTeamMembers } from '@/data/mockData';

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);

  const addTeamMember = (newMember: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const member: TeamMember = {
      ...newMember,
      id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    setTeamMembers(prevMembers => [member, ...prevMembers]);
    return member;
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prevMembers =>
      prevMembers.map(member =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

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
    addTeamMember,
    updateTeamMember,
    searchMembers,
  };
};
