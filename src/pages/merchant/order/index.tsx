import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useApp } from '@/store/context';
import OrderCard from '@/components/OrderCard';
import styles from './index.module.scss';

type TabType = 'pending' | 'processing' | 'done';

const tabs: { key: TabType; label: string }[] = [
  { key: 'pending', label: '待接单' },
  { key: 'processing', label: '处理中' },
  { key: 'done', label: '已完成' }
];

export default function MerchantOrderPage() {
  const { getMerchantOrders } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  const orders = useMemo(() => {
    const allOrders = getMerchantOrders();
    switch (activeTab) {
      case 'pending':
        return allOrders.filter(o => o.status === 'pending');
      case 'processing':
        return allOrders.filter(o => o.status === 'confirmed');
      case 'done':
        return allOrders.filter(o => o.status === 'completed' || o.status === 'cancelled');
      default:
        return allOrders;
    }
  }, [getMerchantOrders, activeTab]);

  const pendingCount = getMerchantOrders().filter(o => o.status === 'pending').length;

  return (
    <View className={styles.container}>
      {/* 顶部标题 */}
      <View className={styles.header}>
        <Text className={styles.title}>订单管理</Text>
        <Text className={styles.subtitle}>及时处理，保证服务</Text>
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
            {tab.key === 'pending' && pendingCount > 0 && (
              <Text className={styles.tabBadge}>{pendingCount}</Text>
            )}
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
              isMerchant
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
