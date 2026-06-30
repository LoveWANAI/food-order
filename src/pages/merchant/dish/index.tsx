import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Input, Textarea, Image, Button, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/context';
import { Dish, Order } from '@/types';
import { categories } from '@/data/mock';
import styles from './index.module.scss';

interface DishFormData {
  name: string;
  description: string;
  price: string;
  categoryId: number;
  image: string;
  status: 'available' | 'soldout';
}

export default function MerchantDishPage() {
  const { dishes, updateDishStatus, addDish, editDish, deleteDish, orders, updateOrderStatus, getMerchantOrders } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showOrders, setShowOrders] = useState(false);
  const [formData, setFormData] = useState<DishFormData>({
    name: '',
    description: '',
    price: '',
    categoryId: 1,
    image: 'https://picsum.photos/id/292/300/200',
    status: 'available'
  });

  const merchantOrders = getMerchantOrders();
  const pendingOrders = merchantOrders.filter(o => o.status === 'pending' || o.status === 'confirmed');

  const handleLogout = () => {
    Taro.reLaunch({ url: '/pages/index/index' });
  };

  const handleAdd = () => {
    setEditingDish(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: 1,
      image: 'https://picsum.photos/id/292/300/200',
      status: 'available'
    });
    setShowForm(true);
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      categoryId: dish.categoryId,
      image: dish.image,
      status: dish.status
    });
    setShowForm(true);
  };

  const handleDelete = (dishId: number) => {
    Taro.showModal({
      title: '删除菜品',
      content: '确定要删除这个菜品吗？',
      success: (res) => {
        if (res.confirm) {
          deleteDish(dishId);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  const handleToggleStatus = (dish: Dish) => {
    const newStatus = dish.status === 'available' ? 'soldout' : 'available';
    updateDishStatus(dish.id, newStatus);
    Taro.showToast({
      title: newStatus === 'available' ? '已上架' : '已下架',
      icon: 'success'
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入菜品名称', icon: 'none' });
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Taro.showToast({ title: '请输入有效价格', icon: 'none' });
      return;
    }

    const dishData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
      image: formData.image,
      status: formData.status
    };

    if (editingDish) {
      editDish({ ...editingDish, ...dishData });
      Taro.showToast({ title: '修改成功', icon: 'success' });
    } else {
      addDish(dishData);
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }
    setShowForm(false);
  };

  const handleCategoryChange = (e: any) => {
    setFormData({ ...formData, categoryId: parseInt(e.detail.value) + 1 });
  };

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        setFormData({ ...formData, image: tempFilePath });
        Taro.showToast({ title: '图片已选择', icon: 'success' });
      },
      fail: () => {
        Taro.showToast({ title: '请选择图片', icon: 'none' });
      }
    });
  };

  // 处理订单
  const handleCompleteOrder = (orderId: number) => {
    updateOrderStatus(orderId, 'completed');
    Taro.showToast({ title: '订单已完成', icon: 'success' });
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <View className={styles.container}>
      {/* 顶部标题 */}
      <View className={styles.header}>
        <View className={styles.headerLeft}>
          <Text className={styles.title}>商家管理</Text>
          <Text className={styles.subtitle}>共{dishes.length}个菜品</Text>
        </View>
        <View className={styles.headerRight}>
          <Button className={styles.orderBtn} onClick={() => setShowOrders(!showOrders)}>
            订单 {pendingOrders.length > 0 && <Text className={styles.badge}>{pendingOrders.length}</Text>}
          </Button>
          <Button className={styles.logoutBtn} onClick={handleLogout}>
            退出
          </Button>
        </View>
      </View>

      {/* 订单列表 */}
      {showOrders && (
        <View className={styles.orderSection}>
          <View className={styles.orderHeader}>
            <Text className={styles.orderTitle}>新订单</Text>
            <Text className={styles.orderCount}>{pendingOrders.length}个待处理</Text>
          </View>
          <ScrollView scrollY className={styles.orderList}>
            {pendingOrders.length > 0 ? (
              pendingOrders.map(order => (
                <View key={order.id} className={styles.orderCard}>
                  <View className={styles.orderTop}>
                    <Text className={styles.orderNo}>订单 #{order.id}</Text>
                    <Text className={styles.orderTime}>{formatTime(order.createTime)}</Text>
                  </View>
                  <View className={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <Text key={idx} className={styles.orderItem}>
                        {item.dishName} x{item.quantity}
                      </Text>
                    ))}
                  </View>
                  <View className={styles.orderBottom}>
                    <Text className={styles.orderTotal}>总计：¥{order.totalPrice.toFixed(1)}</Text>
                    <Button
                      className={styles.completeBtn}
                      onClick={() => handleCompleteOrder(order.id)}
                    >
                      完成
                    </Button>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.noOrders}>
                <Text className={styles.noOrdersText}>暂无新订单</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* 操作栏 */}
      <View className={styles.toolbar}>
        <Button className={styles.addBtn} onClick={handleAdd}>
          + 添加新菜品
        </Button>
      </View>

      {/* 菜品列表 */}
      <ScrollView scrollY className={styles.content}>
        {dishes.length > 0 ? (
          dishes.map(dish => (
            <View key={dish.id} className={styles.dishCard}>
              <Image
                className={styles.dishImage}
                src={dish.image}
                mode='aspectFill'
              />
              <View className={styles.dishContent}>
                <View className={styles.dishHeader}>
                  <Text className={styles.dishName}>{dish.name}</Text>
                  <Text className={classnames(
                    styles.statusTag,
                    dish.status === 'available' ? styles.available : styles.soldout
                  )}>
                    {dish.status === 'available' ? '在售' : '已下架'}
                  </Text>
                </View>
                <Text className={styles.dishDesc}>{dish.description}</Text>
                <View className={styles.dishFooter}>
                  <Text className={styles.dishPrice}>¥{dish.price.toFixed(1)}</Text>
                  <View className={styles.dishActions}>
                    <Button
                      className={styles.actionBtn}
                      onClick={() => handleToggleStatus(dish)}
                    >
                      {dish.status === 'available' ? '下架' : '上架'}
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.editBtn)}
                      onClick={() => handleEdit(dish)}
                    >
                      编辑
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.deleteBtn)}
                      onClick={() => handleDelete(dish.id)}
                    >
                      删除
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>🍽️</Text>
            <Text className={styles.emptyText}>还没有菜品，点击上方添加</Text>
          </View>
        )}
      </ScrollView>

      {/* 添加/编辑表单 */}
      {showForm && (
        <View className={styles.formOverlay} onClick={() => setShowForm(false)}>
          <View className={styles.formSheet} onClick={(e) => e.stopPropagation()}>
            <View className={styles.formHeader}>
              <Text className={styles.formTitle}>
                {editingDish ? '编辑菜品' : '添加新菜品'}
              </Text>
              <Button className={styles.closeBtn} onClick={() => setShowForm(false)}>
                ×
              </Button>
            </View>
            <ScrollView scrollY className={styles.formBody}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>菜品图片</Text>
                <View className={styles.imageUpload} onClick={handleChooseImage}>
                  {formData.image ? (
                    <Image
                      className={styles.uploadedImage}
                      src={formData.image}
                      mode='aspectFill'
                    />
                  ) : (
                    <View className={styles.uploadPlaceholder}>
                      <Text className={styles.uploadIcon}>📷</Text>
                      <Text className={styles.uploadText}>点击上传</Text>
                    </View>
                  )}
                </View>
                <Text className={styles.formHint}>或</Text>
                <Input
                  className={styles.formInput}
                  placeholder='直接粘贴图片链接替换'
                  value={formData.image}
                  onInput={(e) => setFormData({ ...formData, image: e.detail.value })}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>菜品名称</Text>
                <Input
                  className={styles.formInput}
                  placeholder='例如：红烧牛肉面'
                  value={formData.name}
                  onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.formLabel}>菜品描述</Text>
                <Textarea
                  className={styles.formTextarea}
                  placeholder='描述菜品的特色'
                  value={formData.description}
                  onInput={(e) => setFormData({ ...formData, description: e.detail.value })}
                />
              </View>

              <View className={styles.formRow}>
                <View className={classnames(styles.formRowItem, styles.formItem)}>
                  <Text className={styles.formLabel}>价格（元）</Text>
                  <Input
                    className={styles.formInput}
                    type='digit'
                    placeholder='0.00'
                    value={formData.price}
                    onInput={(e) => setFormData({ ...formData, price: e.detail.value })}
                  />
                </View>
                <View className={classnames(styles.formRowItem, styles.formItem)}>
                  <Text className={styles.formLabel}>分类</Text>
                  <Picker
                    mode='selector'
                    range={categories.map(cat => cat.name)}
                    value={categories.findIndex(cat => cat.id === formData.categoryId)}
                    onChange={handleCategoryChange}
                  >
                    <View className={styles.categoryPicker}>
                      {categories.find(cat => cat.id === formData.categoryId)?.name || '请选择'}
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>
              </View>

              <Button className={styles.submitBtn} onClick={handleSubmit}>
                {editingDish ? '保存修改' : '添加菜品'}
              </Button>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

function classnames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
