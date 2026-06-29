import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

export default function CustomerOrderPage() {
  return (
    <View className={styles.container}>
      <View className={styles.empty}>
        <Text className={styles.emptyIcon}>📋</Text>
        <Text className={styles.emptyText}>暂无订单</Text>
        <Text className={styles.emptyHint}>在首页浏览菜品并下单后，订单将显示在这里</Text>
      </View>
    </View>
  );
}
