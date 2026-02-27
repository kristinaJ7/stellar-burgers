/*import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { getCookie, setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем путь, откуда пришли (для возврата после авторизации)
  const from = location.state?.from || '/';

  // Функция проверки срока действия JWT
  const isTokenExpired = (token: string): boolean => {
    try {
      if (!token) return true;

      const parts = token.split('.');
      if (parts.length !== 3) return true; // Некорректный JWT

      const decoded = JSON.parse(atob(parts[1]));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('[Login] Ошибка декодирования токена:', error);
      return true;
    }
  };

  // Проверка токена при монтировании компонента
  useEffect(() => {
    const token = getCookie('accessToken');

    if (token && !isTokenExpired(token)) {
      // Если токен валиден — перенаправляем на целевую страницу
      console.log('[Login] Валидный токен найден, перенаправление на:', from);
      navigate(from, { replace: true });
      return;
    }

    // Если токена нет или он истёк — очищаем и остаёмся на форме входа
    setCookie('accessToken', '');
    localStorage.removeItem('refreshToken');
  }, [navigate, from]);

  // Очистка состояния при размонтировании компонента
  useEffect(
    () => () => {
      setEmail('');
      setPassword('');
      setErrorText('');
    },
    []
  );

  // Функция валидации формы
  const validateForm = (): string | null => {
    if (!email) return 'Введите email';
    // Исправленное регулярное выражение
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Некорректный email';
    if (!password) return 'Введите пароль';
    if (password.length < 6) return 'Пароль должен быть не менее 6 символов';
    return null;
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setErrorText('');
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setErrorText(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const data = await loginUserApi({ email, password });
      console.log('[Login] Ответ сервера:', data);

      if (data?.accessToken && data?.refreshToken) {
        setCookie('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        // Перенаправление на страницу, откуда пришли, или на главную
        navigate(from, { replace: true });
      } else {
        setErrorText('Ошибка авторизации. Сервер не вернул токены');
      }
    } catch (error: any) {
      console.error('[Login] Ошибка входа:', error);

      if (error?.response?.status === 401) {
        setErrorText('Неверный email или пароль');
      } else if (error?.code === 'ERR_NETWORK') {
        setErrorText('Проверьте подключение к интернету');
      } else if (error?.response?.status === 429) {
        setErrorText('Слишком много попыток. Попробуйте позже');
      } else if (error?.response?.status === 403) {
        setErrorText('Доступ запрещён. Обратитесь в поддержку');
      } else if (error?.message?.includes('Network')) {
        setErrorText('Проблемы с подключением к серверу');
      } else {
        setErrorText('Произошла ошибка. Попробуйте ещё раз');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

*/

import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store'; // Используем типизированный dispatch
import { LoginUI } from '@ui-pages';
import { getCookie, setCookie } from '../../utils/cookie';
import { login, checkAuth } from '../../services/slices/auth-slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch(); // Используем наш типизированный dispatch
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем путь, откуда пришли (для возврата после авторизации)
  const from = location.state?.from || '/';

  // Функция проверки срока действия JWT
  const isTokenExpired = (token: string): boolean => {
    try {
      if (!token) return true;

      const parts = token.split('.');
      if (parts.length !== 3) return true; // Некорректный JWT

      const decoded = JSON.parse(atob(parts[1]));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('[Login] Ошибка декодирования токена:', error);
      return true;
    }
  };

  // Проверка токена при монтировании компонента
  useEffect(() => {
    const token = getCookie('accessToken');

    if (token && !isTokenExpired(token)) {
      // Если токен валиден — перенаправляем на целевую страницу
      console.log('[Login] Валидный токен найден, перенаправление на:', from);
      navigate(from, { replace: true });
      return;
    }

    // Если токена нет или он истёк — очищаем и остаёмся на форме входа
    setCookie('accessToken', '');
    localStorage.removeItem('refreshToken');
  }, [navigate, from]);

  // Очистка состояния при размонтировании компонента
  useEffect(
    () => () => {
      setEmail('');
      setPassword('');
      setErrorText('');
    },
    []
  );

  // Функция валидации формы
  const validateForm = (): string | null => {
    if (!email) return 'Введите email';
    // Исправленное регулярное выражение
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Некорректный email';
    if (!password) return 'Введите пароль';
    if (password.length < 6) return 'Пароль должен быть не менее 6 символов';
    return null;
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setErrorText('');
    setIsLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setErrorText(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Теперь TypeScript знает типы этих экшенов
      const result = await dispatch(login({ email, password })).unwrap();
      await dispatch(checkAuth()).unwrap();

      console.log('[Login] Авторизация успешна, перенаправление на:', from);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('[Login] Ошибка входа:', error);

      if (error === 'Неверный email или пароль') {
        setErrorText('Неверный email или пароль');
      } else if (error?.code === 'ERR_NETWORK') {
        setErrorText('Проверьте подключение к интернету');
      } else if (error?.response?.status === 429) {
        setErrorText('Слишком много попыток. Попробуйте позже');
      } else if (error?.response?.status === 403) {
        setErrorText('Доступ запрещён. Обратитесь в поддержку');
      } else if (error?.message?.includes('Network')) {
        setErrorText('Проблемы с подключением к серверу');
      } else {
        setErrorText('Произошла ошибка. Попробуйте ещё раз');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
