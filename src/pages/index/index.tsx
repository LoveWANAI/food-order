import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useApp } from '@/store/context';
import styles from './index.module.scss';

// 测试账号数据
interface Account {
  username: string;
  password: string;
  role: 'customer' | 'merchant';
  displayName: string;
}

const ACCOUNTS: Account[] = [
  { username: 'customer', password: '123456', role: 'customer', displayName: '顾客账号' },
  { username: 'merchant', password: '888888', role: 'merchant', displayName: '商家账号' },
  { username: 'admin', password: 'admin123', role: 'merchant', displayName: '管理员账号' },
];

export default function IndexPage() {
  const { setRole } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }

    // 查找匹配的账号
    const account = ACCOUNTS.find(
      acc => acc.username === username.trim() && acc.password === password
    );

    if (!account) {
      setError('用户名或密码错误');
      return;
    }

    // 设置角色并跳转
    setRole(account.role);
    if (account.role === 'merchant') {
      // 商家直接进入菜品管理
      Taro.navigateTo({ url: '/pages/merchant/dish/index' });
    } else {
      Taro.switchTab({ url: '/pages/customer/home/index' });
    }
  };

  const handleDemoLogin = (role: 'customer' | 'merchant') => {
    const account = ACCOUNTS.find(acc => acc.role === role);
    if (account) {
      setUsername(account.username);
      setPassword(account.password);
      setError('');
    }
  };

  return (
    <View className={styles.container}>
      <View className={styles.logo}>
        <Text className={styles.logoText}>🍜</Text>
      </View>
      <Text className={styles.title}>小爱专属服务</Text>
      <Text className={styles.subtitle}>贴心服务，只为小爱</Text>

      <View className={styles.loginBox}>
        <Text className={styles.loginTitle}>账号登录</Text>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>用户名</Text>
          <Input
            className={styles.input}
            type='text'
            placeholder='请输入用户名'
            value={username}
            onInput={(e) => {
              setUsername(e.detail.value);
              setError('');
            }}
          />
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>密码</Text>
          <Input
            className={styles.input}
            type='password'
            placeholder='请输入密码'
            value={password}
            onInput={(e) => {
              setPassword(e.detail.value);
              setError('');
            }}
          />
        </View>

        {error && <Text className={styles.errorText}>{error}</Text>}

        <Button className={styles.loginBtn} onClick={handleLogin}>
          登录
        </Button>
      </View>

      {/* 演示账号快捷登录 */}
      <View className={styles.demoSection}>
        <Text className={styles.demoTitle}>快捷登录（演示）</Text>
        <View className={styles.demoButtons}>
          <Button
            className={styles.demoBtn}
            onClick={() => handleDemoLogin('customer')}
          >
            顾客登录
          </Button>
          <Button
            className={classnames(styles.demoBtn, styles.merchantBtn)}
            onClick={() => handleDemoLogin('merchant')}
          >
            商家登录
          </Button>
        </View>
      </View>

      {/* 账号说明 */}
      <View className={styles.hint}>
        <Text className={styles.hintText}>演示账号：</Text>
        <Text className={styles.hintText}>顾客：customer / 123456</Text>
        <Text className={styles.hintText}>商家：merchant / 888888</Text>
      </View>
    </View>
  );
}

function classnames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
