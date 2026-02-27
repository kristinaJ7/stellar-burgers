import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  selectUserName,
  selectAuthChecked,
  selectAuthError,
  checkAuth
} from '../../services/slices/auth-slice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const userName = useAppSelector(selectUserName);
  const authChecked = useAppSelector(selectAuthChecked);
  const error = useAppSelector(selectAuthError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Запускаем проверку авторизации при монтировании компонента
    dispatch(checkAuth());

    // Отладочные логи — помогут отследить состояние на разных этапах
    console.log('AppHeader состояние:', {
      userName,
      authChecked,
      error,
      rawState: {
        userName,
        authChecked,
        error
      }
    });
  }, [dispatch]);

  return <AppHeaderUI userName={userName} />;
};
