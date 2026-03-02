import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { LoginUI } from '@ui-pages';
import { getCookie, setCookie } from '../../utils/cookie';
import { login, checkAuth } from '../../services/slices/auth-slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const isTokenExpired = (token: string): boolean => {
    try {
      if (!token) return true;

      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const decoded = JSON.parse(atob(parts[1]));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error('[Login] Ошибка декодирования токена:', error);
      return true;
    }
  };

  useEffect(() => {
    const token = getCookie('accessToken');

    if (token && !isTokenExpired(token)) {
      // Обновляем состояние авторизации и перенаправляем
      dispatch(checkAuth())
        .unwrap()
        .then(() => navigate(from, { replace: true }))
        .catch(() => {
          setCookie('accessToken', '');
          localStorage.removeItem('refreshToken');
        });
      return;
    }

    setCookie('accessToken', '');
    localStorage.removeItem('refreshToken');
  }, [navigate, from, dispatch]);

  useEffect(
    () => () => {
      setEmail('');
      setPassword('');
      setErrorText('');
      setIsLoading(false);
    },
    []
  );

  const validateForm = (): string | null => {
    if (!email) return 'Введите email';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return 'Некорректный email';

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
      await dispatch(login({ email, password })).unwrap();
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
