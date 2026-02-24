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

import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams
} from 'react-router-dom';

// Обёртка для OrderInfo
const OrderInfoWrapper = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number, 10) : undefined;

  console.log('OrderInfoWrapper: parsed orderNumber=', orderNumber);

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

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal title={title} onClose={handleClose}>
      {children}
    </Modal>
  );
};

const App = () => (
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
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/orders' element={<ProfileOrders />} />

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
        <Route
          path='/profile/orders/:number'
          element={
            <ModalWrapper title='Детали заказа'>
              <OrderInfoWrapper />
            </ModalWrapper>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  </Router>
);

export default App;
