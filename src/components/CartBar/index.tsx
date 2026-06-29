import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/context';
import styles from './index.module.scss';

interface CartBarProps {
  onViewCart?: () => void;
}

export default function CartBar({ onViewCart }: CartBarProps) {
  const { cart, getCartTotal } = useApp();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getCartTotal();

  if (totalCount === 0) {
    return null;
  }

  const handleClick = () => {
    Taro.navigateTo({ url: '/pages/cart/index' });
  };

  return (
    <View className={styles.bar}>
      <View className={styles.info}>
        <View className={styles.badge}>
          <Text className={styles.badgeText}>{totalCount}</Text>
        </View>
        <Text className={styles.totalLabel}>合计：</Text>
        <Text className={styles.totalPrice}>¥{totalPrice.toFixed(1)}</Text>
      </View>
      <Button className={styles.btn} onClick={handleClick}>
        去结算
      </Button>
    </View>
  );
}
