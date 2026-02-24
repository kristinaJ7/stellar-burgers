import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  selectUserName,
  selectUserLoading,
  selectUserError,
  selectUserToken,
  loadUserDataThunk
} from '../../services/slices/user-slice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const userName = useAppSelector(selectUserName);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const token = useAppSelector(selectUserToken);
  const dispatch = useAppDispatch();

  // Перезагружаем данные при изменении токена
  useEffect(() => {
    if (token) {
      dispatch(loadUserDataThunk());
      console.log('AppHeader: отправлен запрос загрузки данных (токен есть)');
    } else {
      console.log('AppHeader: токена нет, запрос не отправлен');
    }
  }, [dispatch, token]);

  // Отслеживаем изменения имени пользователя
  useEffect(() => {
    console.log('AppHeader: имя пользователя изменилось:', userName);
  }, [userName]);

  // Отслеживаем изменения состояния загрузки
  useEffect(() => {
    console.log('AppHeader: состояние загрузки изменилось:', isLoading);
  }, [isLoading]);

  // Отслеживаем изменения ошибки
  useEffect(() => {
    if (error) {
      console.error('AppHeader: произошла ошибка:', error);
    }
  }, [error]);

  console.log('AppHeader состояние:', {
    userName,
    isLoading,
    error,
    hasToken: !!token,
    rawToken: token ? 'присутствует' : 'отсутствует'
  });

  // Определяем, что показывать в интерфейсе
  let displayName = userName;

  if (isLoading) {
    displayName = 'Загрузка...';
  }

  if (error) {
    displayName = `Ошибка: ${error}`;
  }

  return <AppHeaderUI userName={displayName} />;
};
