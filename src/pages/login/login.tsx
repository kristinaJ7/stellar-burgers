import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { getCookie, setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

    if (token) {
      if (!isTokenExpired(token)) {
        navigate('/');
      } else {
        // Очистка истёкшего токена
        setCookie('accessToken', '');
        localStorage.removeItem('refreshToken');
      }
    }
  }, [navigate]);

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
    // Исправленное регулярное выражение с экранированной точкой
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Некорректный email';
    if (!password) return 'Введите пароль';
    if (password.length < 6) return 'Пароль должен быть не менее 6 символов';
    return null;
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Сброс ошибок и установка состояния загрузки
    setErrorText('');
    setIsLoading(true);

    // Клиентская валидация
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
        // Сохраняем токены
        setCookie('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Перенаправление на главную страницу
        navigate('/');
      } else {
        setErrorText('Ошибка авторизации. Сервер не вернул токены');
      }
    } catch (error: any) {
      console.error('[Login] Ошибка входа:', error);

      // Улучшенная обработка ошибок с проверкой структуры
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
      // isLoading={isLoading} // Передаём состояние загрузки в UI
    />
  );
};
