import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaList, FaUserPlus, FaUsers, FaUsersCog, FaUserShield, FaUserCheck } from 'react-icons/fa';
import AdminLayout from '/imports/layouts/AdminLayout/AdminLayout';

// Styled components

const Container = styled.div`
  background: ${({ theme }) => theme.backgroundColor};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  color: ${({ theme }) => theme.textColor};
  margin: 0;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primaryColor};
  color: ${({ theme }) => theme.backgroundColor === '#000000' ? theme.textColor : '#fff'};
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.secondaryColor};
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.accentColor};
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #552a47;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #fff;
  font-size: 24px;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  color: ${({ theme }) => theme.textColor};
`;

const CardDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.secondaryColor};
  font-size: 14px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.accentColor};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #552a47;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.secondaryColor};
`;

const StatIconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #552a47;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #fff;
  font-size: 20px;
`;



// Types
interface User {
  _id: string;
  emails: Array<{ address: string; verified: boolean }>;
  profile: {
    name?: string;
    admin?: boolean;
    role?: string;
    organization?: string;
    active?: boolean;
  };
  createdAt: Date;
}

const Users = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = () => {
    setLoading(true);
    Meteor.call('users.getAll', (error: Error, result: User[]) => {
      setLoading(false);
      if (error) {
        console.error('Error loading users:', error);
      } else {
        // Calculate stats from the user data
        const totalUsers = result.length;
        const admins = result.filter(user => user.profile?.admin).length;
        const activeUsers = result.filter(user => user.profile?.active !== false).length;
        
        setStats({
          totalUsers,
          admins,
          activeUsers
        });
      }
    });
  };

  return (
    <AdminLayout>
      <Container>
        <PageHeader>
          <PageTitle>User Management</PageTitle>
        </PageHeader>
        
        <StatsContainer>
          <StatCard>
            <StatIconContainer>
              <FaUsers />
            </StatIconContainer>
            <StatValue>{loading ? '...' : stats.totalUsers}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatIconContainer>
              <FaUserShield />
            </StatIconContainer>
            <StatValue>{loading ? '...' : stats.admins}</StatValue>
            <StatLabel>Admins</StatLabel>
          </StatCard>
          <StatCard>
            <StatIconContainer>
              <FaUserCheck />
            </StatIconContainer>
            <StatValue>{loading ? '...' : stats.activeUsers}</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatCard>
        </StatsContainer>

        <CardGrid>
          <Card onClick={() => navigate('/admin/users/all')}>
            <IconContainer>
              <FaList />
            </IconContainer>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage existing users</CardDescription>
          </Card>
          
          <Card onClick={() => navigate('/admin/users/add')}>
            <IconContainer>
              <FaUserPlus />
            </IconContainer>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user account</CardDescription>
          </Card>
        </CardGrid>
      </Container>
    </AdminLayout>
  );
};

export default Users;
