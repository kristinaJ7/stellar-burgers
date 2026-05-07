import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal,
  showOrderModal,
  onRemoveIngredient
}) => {
  console.log('DEBUG: BurgerConstructorUI получил пропсы:', {
    orderRequest,
    orderModalData,
    showOrderModal,
    price,
    constructorItems
  });

  return (
    <section
      className={styles.burger_constructor}
      data-testid='burger-constructor'
    >
      {constructorItems.bun ? (
        <div
          className={`${styles.element} mb-4 mr-4`}
          data-testid='constructor-bun-top'
        >
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-testid='constructor-no-buns-top'
        >
          Выберите булки
        </div>
      )}

      <ul className={styles.elements}>
        {constructorItems.ingredients.length > 0 ? (
          constructorItems.ingredients
            .filter((item): item is TConstructorIngredient => !!item.id) // Фильтруем по id
            .map(
              (
                item: TConstructorIngredient,
                index: number // Используем TConstructorIngredient
              ) => (
                <BurgerConstructorElement
                  ingredient={item}
                  index={index}
                  totalItems={constructorItems.ingredients.length}
                  key={item.id} // ← Используем уникальный id вместо _id
                  onRemoveIngredient={onRemoveIngredient}
                  data-testid={`constructor-ingredient-${item.id}`}
                />
              )
            )
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
            data-testid='constructor-no-ingredients'
          >
            Выберите начинку
          </div>
        )}
      </ul>

      {constructorItems.bun ? (
        <div
          className={`${styles.element} mt-4 mr-4`}
          data-testid='constructor-bun-bottom'
        >
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-testid='constructor-no-buns-bottom'
        >
          Выберите булки
        </div>
      )}

      <div
        className={`${styles.total} mt-10 mr-4`}
        data-testid='constructor-total'
      >
        <div className={`${styles.cost} mr-10`} data-testid='constructor-price'>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          children='Оформить заказ'
          onClick={onOrderClick}
          disabled={orderRequest}
          data-testid='order-button'
        />
      </div>

      {orderRequest && (
        <Modal
          onClose={closeOrderModal}
          title='Оформление заказа ...'
          isOpen={orderRequest}
          data-testid='order-processing-modal'
        >
          <div className={styles.preloaderContainer}>
            <Preloader />
          </div>
        </Modal>
      )}

      {showOrderModal && orderModalData?.number !== undefined && (
        <Modal
          onClose={closeOrderModal}
          title='Заказ оформлен!'
          isOpen={showOrderModal}
          data-testid='order-success-modal'
        >
          <OrderDetailsUI
            orderNumber={orderModalData.number}
            data-testid='order-details'
          />
        </Modal>
      )}
    </section>
  );
};
