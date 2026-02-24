import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserApi } from '@api';
import { TAuthResponse } from '@utils-types';
export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Валидация email
  const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Сброс ошибки перед отправкой
    setError('');

    // Проверка формата email
    if (!isValidEmail(email)) {
      setError('Введите корректный email');
      return;
    }

    console.log('[Регистрация] Отправка данных:', {
      email,
      name: userName,
      password
    });

    const userData = {
      email,
      name: userName,
      password
    };

    registerUserApi(userData)
      .then((response: TAuthResponse) => {
        console.log('[Регистрация] Успех:', response);
      })
      .catch((error: unknown) => {
        console.error('[Регистрация] Ошибка:', error);

        // Обработка ошибки с сообщением от сервера
        if (typeof error === 'object' && error !== null && 'message' in error) {
          setError((error as { message: string }).message);
        } else {
          setError(
            'Не удалось зарегистрироваться. Проверьте данные и интернет-соединение.'
          );
        }
      });
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
