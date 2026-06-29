import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import { useApp } from '@/store/context';
import styles from './index.module.scss';

export default function MerchantStatsPage() {
  const { getTodayStats, getMerchantOrders } = useApp();
  const stats = getTodayStats();

  const orderSummary = useMemo(() => {
    const orders = getMerchantOrders();
    const completed = orders.filter(o => o.status === 'completed');
    const pending = orders.filter(o => o.status === 'pending');
    const confirmed = orders.filter(o => o.status === 'confirmed');
    const cancelled = orders.filter(o => o.status === 'cancelled');

    return {
      total: orders.length,
      completed: completed.length,
      pending: pending.length + confirmed.length,
      cancelled: cancelled.length,
      completedAmount: completed.reduce((sum, o) => sum + o.totalPrice, 0)
    };
  }, [getMerchantOrders]);

  return (
    <View className={styles.container}>
      {/* 顶部标题 */}
      <View className={styles.header}>
        <Text className={styles.title}>今日统计</Text>
        <Text className={styles.subtitle}>实时掌握经营数据</Text>
      </View>

      <View className={styles.content}>
        {/* 统计卡片 */}
        <View className={styles.statsCards}>
          <View className={styles.statCard}>
            <View className={classnames(styles.statIcon, styles.orderIcon)}>
              <Text>📋</Text>
            </View>
            <Text className={styles.statValue}>{stats.orderCount}</Text>
            <Text className={styles.statLabel}>今日订单</Text>
          </View>

          <View className={styles.statCard}>
            <View className={classnames(styles.statIcon, styles.amountIcon)}>
              <Text>💰</Text>
            </View>
            <Text className={styles.statValue}>¥{stats.totalAmount.toFixed(0)}</Text>
            <Text className={styles.statLabel}>今日收入</Text>
          </View>

          <View className={styles.statCard}>
            <View className={classnames(styles.statIcon, styles.pendingIcon)}>
              <Text>⏰</Text>
            </View>
            <Text className={styles.statValue}>{stats.pendingCount}</Text>
            <Text className={styles.statLabel}>待处理订单</Text>
          </View>

          <View className={styles.statCard}>
            <View className={classnames(styles.statIcon, styles.orderIcon)}>
              <Text>✅</Text>
            </View>
            <Text className={styles.statValue}>{orderSummary.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>

        {/* 订单汇总 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📊</Text>
            订单汇总
          </Text>
          <View className={styles.summaryList}>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>总订单数</Text>
              <Text className={styles.summaryValue}>{orderSummary.total} 单</Text>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>已完成</Text>
              <Text className={styles.summaryValue}>{orderSummary.completed} 单</Text>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>处理中</Text>
              <Text className={styles.summaryValue}>{orderSummary.pending} 单</Text>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>已取消</Text>
              <Text className={styles.summaryValue}>{orderSummary.cancelled} 单</Text>
            </View>
            <View className={styles.summaryItem}>
              <Text className={styles.summaryLabel}>完成金额</Text>
              <Text className={styles.summaryValue}>¥{orderSummary.completedAmount.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* 经营提示 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💡</Text>
            经营提示
          </Text>
          <View className={styles.tipList}>
            <View className={styles.tipItem}>
              <Text className={styles.tipIcon}>•</Text>
              <Text className={styles.tipText}>
                {stats.pendingCount > 0
                  ? `您有 ${stats.pendingCount} 个待处理订单，请及时处理`
                  : '当前没有待处理订单，继续保持'}
              </Text>
            </View>
            <View className={styles.tipItem}>
              <Text className={styles.tipIcon}>•</Text>
              <Text className={styles.tipText}>
                今日收入 ¥{stats.totalAmount.toFixed(1)}，同比昨日{' '}
                {stats.orderCount > 5 ? '增长' : '持平'}
              </Text>
            </View>
            <View className={styles.tipItem}>
              <Text className={styles.tipIcon}>•</Text>
              <Text className={styles.tipText}>
                建议及时关注新订单，确保服务时效
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function classnames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
