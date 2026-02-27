import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { checkAuth } from '../../services/slices/auth-slice';

import { ConstructorPage } from '@pages';
import { Feed } from '@pages';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { NotFound404 } from '@pages';

import { Modal } from '@components';
import { OrderInfo } from '@components';
import { IngredientDetails } from '@components';
import { useParams } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@components';
import { useLocation } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useAppDispatch } from '../../services/store';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Типизация состояния авторизации
interface AuthState {
  isAuthenticated: boolean;
  authChecked: boolean; // Флаг готовности проверки
}

interface RootState {
  auth: AuthState;
}

// Компоненты маршрутов с корректной типизацией
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const authChecked = useSelector((state: RootState) => state.auth.authChecked);

  // Пока проверка не завершена — показываем загрузчик
  if (!authChecked) {
    return <div>Проверка авторизации...</div>;
  }

  // Если авторизован — отдаём контент, иначе — редирект
  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const authChecked = useSelector((state: RootState) => state.auth.authChecked);

  if (!authChecked) {
    return <div>Проверка авторизации...</div>;
  }

  return !isAuthenticated ? children : <Navigate to='/profile' replace />;
};

// Обёртка для OrderInfo
const OrderInfoWrapper = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number, 10) : undefined;

  if (!orderNumber) {
    return <div>Неверный номер заказа</div>;
  }

  return <OrderInfo orderNumber={orderNumber} />;
};

const ModalWrapper = ({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const handleClose = () => {
    if (background) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          {/* Публичные роуты — без защиты */}
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          {/* Публичные формы авторизации */}
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path='/register'
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Защищённые роуты — обернуты в ProtectedRoute */}
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <ModalWrapper title='Детали заказа'>
                  <OrderInfoWrapper />
                </ModalWrapper>
              </ProtectedRoute>
            }
          />

          {/* Остальные роуты */}
          <Route
            path='/feed/:number'
            element={
              <ModalWrapper title='Детали заказа'>
                <OrderInfoWrapper />
              </ModalWrapper>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <ModalWrapper title='Ингредиенты'>
                <IngredientDetails />
              </ModalWrapper>
            }
          />

          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
