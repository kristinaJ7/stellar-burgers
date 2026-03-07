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
import { IngredientDetails } from '@components';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectAuthChecked
} from '../../services/slices/auth-slice';

import { useEffect } from 'react';

// Компонент защищённого маршрута (без изменений)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authChecked = useAppSelector(selectAuthChecked);
  const location = useLocation();

  if (!authChecked) {
    return <div>Проверка авторизации...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

// Компонент публичного маршрута (без изменений)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authChecked = useAppSelector(selectAuthChecked);

  if (!authChecked) {
    return <div>Проверка авторизации...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const UniversalModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const modalData = location.state as
    | { title?: string; background?: Location }
    | undefined;

  const handleClose = () => {
    if (modalData?.background) {
      navigate(-1);
    } else {
      navigate('..', { replace: true });
    }
  };

  return (
    <Modal
      title={modalData?.title || 'Детали ингредиента'}
      isOpen={!!modalData?.background}
      onClose={handleClose}
    >
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
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

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

          {/* Маршрут для модального окна (открывается поверх текущего маршрута) */}
          <Route
            path='/ingredients/:id'
            element={
              <UniversalModalWrapper>
                <IngredientDetails isModal />
              </UniversalModalWrapper>
            }
          />

          {/* Отдельный маршрут для прямой ссылки (полная страница) */}
          <Route
            path='/ingredient/:id'
            element={<IngredientDetails isModal={false} />}
          />

          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
