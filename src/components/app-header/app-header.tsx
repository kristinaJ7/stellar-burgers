import { FC } from 'react';
import { useAppSelector } from '../../services/store';
import { selectUserName } from '../../services/slices/auth-slice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const userName = useAppSelector(selectUserName);

  return <AppHeaderUI userName={userName} />;
};
