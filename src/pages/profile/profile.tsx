import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { getUserApi, updateUserApi, refreshToken } from '@api';
import { TUserResponse } from '@utils-types';

// Константы
const MAX_TOKEN_REFRESH_RETRIES = 2;

export const Profile: FC = () => {
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await getUserApi();
      setFormValue({
        name: userData.user.name,
        email: userData.user.email,
        password: ''
      });
      setInitialName(userData.user.name);
      setInitialEmail(userData.user.email);
    } catch (err) {
      if (!navigator.onLine) {
        setError('Нет подключения к интернету');
        setIsLoading(false);
        return;
      }

      try {
        await refreshToken();
        // После обновления токена — снова загружаем данные
        await loadUserData();
      } catch (refreshErr) {
        console.error('Не удалось обновить токен:', refreshErr);
        setError('Авторизуйтесь заново: сессия истекла.');
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Проверка изменений
  const isFormChanged =
    formValue.name !== initialName ||
    formValue.email !== initialEmail ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged || isLoading) return;

    if (!navigator.onLine) {
      setError('Нет подключения к интернету.');
      return;
    }

    setIsLoading(true);
    setError(null);

    let retryCount = 0;

    while (retryCount < MAX_TOKEN_REFRESH_RETRIES) {
      try {
        await updateUserApi({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password || undefined
        });

        // Успех: обновляем начальные значения
        setInitialName(formValue.name);
        setInitialEmail(formValue.email);
        setFormValue((prev) => ({ ...prev, password: '' }));

        alert('Данные сохранены!');
        break;
      } catch (err: unknown) {
        if (
          (err instanceof Error && err.message.includes('jwt expired')) ||
          (typeof err === 'object' &&
            err !== null &&
            'status' in err &&
            (err as any).status === 401)
        ) {
          try {
            await refreshToken();
            retryCount++;
          } catch (refreshErr) {
            console.error('Ошибка обновления токена:', refreshErr);
            setError('Не удалось сохранить: авторизуйтесь заново.');
            break;
          }
        } else {
          console.error('Ошибка сохранения:', err);
          setError('Не удалось сохранить данные. Проверьте подключение.');
          break;
        }
      }
    }

    setIsLoading(false);
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Возвращаем все поля к исходным значениям
    setFormValue({
      name: initialName,
      email: initialEmail,
      password: ''
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null); // Сбрасываем ошибку при изменении формы
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
