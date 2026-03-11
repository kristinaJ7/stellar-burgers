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
    <section className={styles.burger_constructor}>
      {constructorItems.bun ? (
        <div className={`${styles.element} mb-4 mr-4`}>
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
                />
              )
            )
        ) : (
          <div
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          >
            Выберите начинку
          </div>
        )}
      </ul>

      {constructorItems.bun ? (
        <div className={`${styles.element} mt-4 mr-4`}>
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
        >
          Выберите булки
        </div>
      )}

      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
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
        />
      </div>

      {orderRequest && (
        <Modal
          onClose={closeOrderModal}
          title='Оформление заказа ...'
          isOpen={orderRequest}
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
        >
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}
    </section>
  );
};
