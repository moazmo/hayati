import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiCheckSquare, 
  FiRepeat, 
  FiSun, 
  FiCalendar,
  FiTarget,
  FiClock,
  FiBarChart,
  FiSearch,
  FiDatabase,
  FiSettings 
} from 'react-icons/fi';
import HayatiLogo from './HayatiLogo';

const SidebarContainer = styled.aside`
  width: 250px;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  padding: 24px 16px;
  box-shadow: ${props => props.theme.shadows.card};
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  padding: 8px;
`;

const NavList = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

const NavItem = styled.li`
  margin-bottom: 8px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    background-color: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    margin-left: 12px;
    margin-right: 12px;
    width: 20px;
    height: 20px;
  }
`;

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: FiHome, label: t('nav.dashboard') },
    { path: '/tasks', icon: FiCheckSquare, label: t('nav.tasks') },
    { path: '/habits', icon: FiRepeat, label: t('nav.habits') },
    { path: '/prayers', icon: FiSun, label: t('nav.prayers') },
    { path: '/calendar', icon: FiCalendar, label: t('nav.calendar') },
    { path: '/goals', icon: FiTarget, label: 'الأهداف - Goals' },
    { path: '/pomodoro', icon: FiClock, label: 'البومودورو - Pomodoro' },
    { path: '/analytics', icon: FiBarChart, label: 'التحليلات - Analytics' },
    { path: '/search', icon: FiSearch, label: 'البحث المتقدم - Search' },
    { path: '/data-manager', icon: FiDatabase, label: 'إدارة البيانات - Data' },
    { path: '/settings', icon: FiSettings, label: t('nav.settings') },
  ];

  return (
    <SidebarContainer>
      <LogoContainer>
        <HayatiLogo size={45} variant="full" />
      </LogoContainer>
      
      <NavList>
        <ul>
          {navItems.map((item) => (
            <NavItem key={item.path}>
              <StyledNavLink to={item.path}>
                <item.icon />
                {item.label}
              </StyledNavLink>
            </NavItem>
          ))}
        </ul>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;
