import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Order, OrderStatus } from '@/types';
import { useApp } from '@/store/context';
import styles from './index.module.scss';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
  isMerchant?: boolean;
}

const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: '待接单', color: 'pending' },
  confirmed: { label: '已接单', color: 'confirmed' },
  completed: { label: '已完成', color: 'completed' },
  cancelled: { label: '已取消', color: 'cancelled' }
};

export default function OrderCard({ order, showActions = false, isMerchant = false }: OrderCardProps) {
  const { updateOrderStatus } = useApp();
  const statusInfo = statusMap[order.status];

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    Taro.showModal({
      title: '确认接单',
      content: '确定要接受此订单吗？',
      success: (res) => {
        if (res.confirm) {
          updateOrderStatus(order.id, 'confirmed');
          Taro.showToast({ title: '已接单', icon: 'success' });
        }
      }
    });
  };

  const handleComplete = () => {
    Taro.showModal({
      title: '完成订单',
      content: '确定此订单已完成吗？',
      success: (res) => {
        if (res.confirm) {
          updateOrderStatus(order.id, 'completed');
          Taro.showToast({ title: '订单完成', icon: 'success' });
        }
      }
    });
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '取消订单',
      content: '确定要取消此订单吗？',
      success: (res) => {
        if (res.confirm) {
          updateOrderStatus(order.id, 'cancelled');
          Taro.showToast({ title: '已取消', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Text className={styles.orderNo}>{order.orderNo}</Text>
        <Text className={classnames(styles.status, styles[statusInfo.color])}>
          {statusInfo.label}
        </Text>
      </View>

      <View className={styles.items}>
        {order.items.map((item, index) => (
          <View key={item.id || index} className={styles.item}>
            <Text className={styles.itemName}>{item.dishName}</Text>
            <Text className={styles.itemQty}>x{item.quantity}</Text>
            <Text className={styles.itemPrice}>¥{item.price.toFixed(1)}</Text>
          </View>
        ))}
      </View>

      {order.remark && (
        <View className={styles.remark}>
          <Text className={styles.remarkLabel}>备注：</Text>
          <Text className={styles.remarkText}>{order.remark}</Text>
        </View>
      )}

      <View className={styles.footer}>
        <Text className={styles.time}>{formatTime(order.createTime)}</Text>
        <View className={styles.total}>
          <Text className={styles.totalLabel}>合计：</Text>
          <Text className={styles.totalPrice}>¥{order.totalPrice.toFixed(1)}</Text>
        </View>
      </View>

      {showActions && (
        <View className={styles.actions}>
          {isMerchant ? (
            <>
              {order.status === 'pending' && (
                <>
                  <Button className={classnames(styles.btn, styles.confirmBtn)} onClick={handleConfirm}>
                    接单
                  </Button>
                  <Button className={classnames(styles.btn, styles.cancelBtn)} onClick={handleCancel}>
                    拒单
                  </Button>
                </>
              )}
              {order.status === 'confirmed' && (
                <Button className={classnames(styles.btn, styles.completeBtn)} onClick={handleComplete}>
                  完成
                </Button>
              )}
            </>
          ) : (
            <>
              {order.status === 'pending' && (
                <Button className={classnames(styles.btn, styles.cancelBtn)} onClick={handleCancel}>
                  取消订单
                </Button>
              )}
              {order.status === 'completed' && (
                <Button className={classnames(styles.btn, styles.reorderBtn)}>
                  再来一单
                </Button>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}

function classnames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
