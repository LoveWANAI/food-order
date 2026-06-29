import React, { useState } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/context';
import styles from './index.module.scss';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, addOrder, clearCart } = useApp();
  const [remark, setRemark] = useState('');

  const totalPrice = getCartTotal();

  const handleIncrease = (dishId: number) => {
    const item = cart.find(i => i.dish.id === dishId);
    if (item) {
      updateQuantity(dishId, item.quantity + 1);
    }
  };

  const handleDecrease = (dishId: number) => {
    const item = cart.find(i => i.dish.id === dishId);
    if (item) {
      if (item.quantity > 1) {
        updateQuantity(dishId, item.quantity - 1);
      } else {
        handleRemove(dishId);
      }
    }
  };

  const handleRemove = (dishId: number) => {
    Taro.showModal({
      title: '确认移除',
      content: '确定要从购物车移除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          removeFromCart(dishId);
        }
      }
    });
  };

  const handleSubmit = () => {
    if (cart.length === 0) {
      Taro.showToast({ title: '购物车是空的', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认下单',
      content: `共 ${cart.reduce((sum, i) => sum + i.quantity, 0)} 件商品，合计 ¥${totalPrice.toFixed(1)}`,
      success: async (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          await addOrder(cart, remark.trim() || undefined);
          clearCart();
          setRemark('');
          Taro.hideLoading();
          Taro.showToast({ title: '下单成功', icon: 'success' });
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/customer/order/index' });
          }, 1500);
        }
      }
    });
  };

  const handleGoShopping = () => {
    Taro.switchTab({ url: '/pages/customer/home/index' });
  };

  if (cart.length === 0) {
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>购物车</Text>
        </View>
        <View className={styles.content}>
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🛒</Text>
            <Text className={styles.emptyText}>购物车是空的</Text>
            <Button className={styles.shopBtn} onClick={handleGoShopping}>
              去点餐
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      {/* 顶部标题 */}
      <View className={styles.header}>
        <Text className={styles.title}>购物车</Text>
      </View>

      {/* 购物车列表 */}
      <ScrollView scrollY className={styles.content}>
        <View className={styles.cartList}>
          {cart.map(item => (
            <View key={item.dish.id} className={styles.cartItem}>
              <Image
                className={styles.itemImage}
                src={item.dish.image}
                mode='aspectFill'
              />
              <View className={styles.itemInfo}>
                <Text className={styles.itemName}>{item.dish.name}</Text>
                <Text className={styles.itemPrice}>¥{item.dish.price.toFixed(1)}</Text>
              </View>
              <View className={styles.quantityControl}>
                <Button
                  className={styles.quantityBtn}
                  onClick={() => handleDecrease(item.dish.id)}
                >
                  -
                </Button>
                <Text className={styles.quantity}>{item.quantity}</Text>
                <Button
                  className={styles.quantityBtn}
                  onClick={() => handleIncrease(item.dish.id)}
                >
                  +
                </Button>
              </View>
              <Button
                className={styles.removeBtn}
                onClick={() => handleRemove(item.dish.id)}
              >
                删除
              </Button>
            </View>
          ))}
        </View>

        {/* 备注 */}
        <View className={styles.remarkSection}>
          <Text className={styles.remarkTitle}>备注</Text>
          <Input
            className={styles.remarkInput}
            placeholder='请输入备注信息（如：少辣、不要葱等）'
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
          />
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <View className={styles.totalSection}>
          <Text className={styles.totalLabel}>合计：</Text>
          <Text className={styles.totalPrice}>¥{totalPrice.toFixed(1)}</Text>
        </View>
        <Button
          className={classnames(
            styles.submitBtn,
            cart.length === 0 && styles.disabled
          )}
          onClick={handleSubmit}
          disabled={cart.length === 0}
        >
          提交订单
        </Button>
      </View>
    </View>
  );
}

function classnames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
