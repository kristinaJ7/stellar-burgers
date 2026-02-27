import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';

import { logout } from '../../services/slices/auth-slice';
import { useAppDispatch } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Перенаправляем на страницу логина после выхода
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
