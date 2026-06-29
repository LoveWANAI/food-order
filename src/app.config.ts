export default defineAppConfig({
  pages: [
    'pages/index/index',           // 角色选择入口
    'pages/customer/home/index',  // 顾客首页-菜单浏览
    'pages/customer/order/index',  // 顾客订单
    'pages/customer/mine/index',  // 顾客我的
    'pages/merchant/order/index', // 商家订单管理
    'pages/merchant/dish/index',  // 商家菜品管理
    'pages/merchant/stats/index', // 商家统计
    'pages/cart/index'            // 购物车页面
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF6B35',
    navigationBarTitleText: '小爱专属服务',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#FF6B35',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/customer/home/index',
        text: '菜单'
      },
      {
        pagePath: 'pages/customer/order/index',
        text: '订单'
      },
      {
        pagePath: 'pages/customer/mine/index',
        text: '我的'
      }
    ]
  }
})
