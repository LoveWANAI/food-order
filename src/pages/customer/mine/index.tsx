import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/context';
import styles from './index.module.scss';

export default function CustomerMinePage() {
  const { cart, setRole } = useApp();

  const handleLogout = () => {
    Taro.reLaunch({ url: '/pages/index/index' });
  };

  return (
    <View className={styles.container}>
      {/* 头部信息 */}
      <View className={styles.header}>
        <View className={styles.avatar}>
          <Text className={styles.avatarText}>👤</Text>
        </View>
        <View className={styles.userInfo}>
          <Text className={styles.username}>顾客用户</Text>
          <Text className={styles.roleTag}>顾客端</Text>
        </View>
      </View>

      {/* 菜单项 */}
      <View className={styles.menuSection}>
        <View className={styles.menuItem}>
          <View className={classnames(styles.menuIcon)}>
            <Text>🛒</Text>
          </View>
          <View className={styles.menuInfo}>
            <Text className={styles.menuTitle}>购物车</Text>
            <Text className={styles.menuDesc}>当前{cart.length}件商品</Text>
          </View>
        </View>
      </View>

      {/* 退出登录 */}
      <View className={styles.logoutSection}>
        <Button className={styles.logoutBtn} onClick={handleLogout}>
          退出登录
        </Button>
      </View>
    </View>
  );
}

function classnames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
