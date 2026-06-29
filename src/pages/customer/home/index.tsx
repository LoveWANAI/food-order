import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/context';
import { Dish } from '@/types';
import FoodCard from '@/components/FoodCard';
import CartBar from '@/components/CartBar';
import styles from './index.module.scss';

export default function CustomerHomePage() {
  const { categories, dishes, addToCart, cart } = useApp();
  const [activeCategory, setActiveCategory] = useState<number>(1);

  // 根据分类筛选菜品
  const filteredDishes = useMemo(() => {
    return dishes.filter(d => d.categoryId === activeCategory);
  }, [dishes, activeCategory]);

  const handleAddToCart = (dish: Dish) => {
    addToCart(dish);
    Taro.showToast({ title: '已加入购物车', icon: 'success' });
  };

  return (
    <View className={styles.container}>
      {/* 顶部标题 */}
      <View className={styles.header}>
        <Text className={styles.title}>小爱专属菜单</Text>
        <Text className={styles.subtitle}>用心准备，只为小爱</Text>
      </View>

      {/* 分类导航 */}
      <ScrollView scrollX className={styles.categories} enableFlex>
        {categories.map(cat => (
          <View
            key={cat.id}
            className={classnames(
              styles.categoryItem,
              activeCategory === cat.id && styles.active
            )}
            onClick={() => setActiveCategory(cat.id)}
          >
            <Text className={styles.categoryIcon}>{cat.icon}</Text>
            <Text className={styles.categoryName}>{cat.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 菜品列表 */}
      <View className={styles.content}>
        <Text className={styles.sectionTitle}>
          {categories.find(c => c.id === activeCategory)?.name || '菜单'}
        </Text>
        <View className={styles.dishGrid}>
          {filteredDishes.map(dish => (
            <FoodCard
              key={dish.id}
              dish={dish}
              onAdd={handleAddToCart}
            />
          ))}
        </View>
        {filteredDishes.length === 0 && (
          <View className={styles.empty}>
            <Text>该分类暂无菜品</Text>
          </View>
        )}
      </View>

      {/* 购物车栏 */}
      <CartBar />
    </View>
  );
}

function classnames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
