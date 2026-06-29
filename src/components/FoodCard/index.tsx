import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Dish } from '@/types';
import styles from './index.module.scss';

interface FoodCardProps {
  dish: Dish;
  onAdd?: (dish: Dish) => void;
  showStatus?: boolean;
}

export default function FoodCard({ dish, onAdd, showStatus = false }: FoodCardProps) {
  const handleAdd = () => {
    if (dish.status === 'soldout') {
      Taro.showToast({ title: '该菜品已售罄', icon: 'none' });
      return;
    }
    onAdd?.(dish);
  };

  const handleImageError = () => {
    console.error('[FoodCard] Image load error:', dish.image);
  };

  return (
    <View className={styles.card}>
      <Image
        className={styles.image}
        src={dish.image}
        mode='aspectFill'
        onError={handleImageError}
      />
      {dish.status === 'soldout' && (
        <View className={styles.soldoutOverlay}>
          <Text className={styles.soldoutText}>已售罄</Text>
        </View>
      )}
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{dish.name}</Text>
          {showStatus && (
            <Text
              className={classnames(
                styles.status,
                dish.status === 'available' ? styles.available : styles.soldout
              )}
            >
              {dish.status === 'available' ? '在售' : '售罄'}
            </Text>
          )}
        </View>
        <Text className={styles.description}>{dish.description}</Text>
        <View className={styles.footer}>
          <Text className={styles.price}>¥{dish.price.toFixed(1)}</Text>
          <Button
            className={classnames(
              styles.addBtn,
              dish.status === 'soldout' && styles.disabled
            )}
            onClick={handleAdd}
            disabled={dish.status === 'soldout'}
          >
            {dish.status === 'soldout' ? '售罄' : '加入'}
          </Button>
        </View>
      </View>
    </View>
  );
}

function classnames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
