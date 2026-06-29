import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useApp } from '@/store/context';
import OrderCard from '@/components/OrderCard';
import styles from './index.module.scss';

type TabType = 'all' | 'pending' | 'processing' | 'done';

const tabs: { key: TabType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '处理中' },
  { key: 'done', label: '已完成' }
];

export default function CustomerOrderPage() {
  const { getCustomerOrders } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const orders = useMemo(() => {
    const allOrders = getCustomerOrders();
    switch (activeTab) {
      case 'pending':
        return allOrders.filter(o => o.status === 'pending' || o.status === 'confirmed');
      case 'done':
        return allOrders.filter(o => o.status === 'completed' || o.status === 'cancelled');
      default:
        return allOrders;
    }
  }, [getCustomerOrders, activeTab]);

  return (
    <View className={styles.container}>
      {/* 顶部标题 */}
      <View className={styles.header}>
        <Text className={styles.title}>小爱订单</Text>
      </View>

      {/* 标签页 */}
      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      {/* 订单列表 */}
      <ScrollView scrollY className={styles.content}>
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              showActions
              isMerchant={false}
            />
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无订单</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function classnames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
