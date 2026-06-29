// 示例数据和默认菜品
import { Category, Dish } from '@/types';

// 菜品分类
export const categories: Category[] = [
  { id: 1, name: '热销套餐', icon: '🔥' },
  { id: 2, name: '主食', icon: '🍚' },
  { id: 3, name: '小菜', icon: '🥗' },
  { id: 4, name: '饮品', icon: '🥤' },
  { id: 5, name: '甜点', icon: '🍰' }
];

// 默认菜品（首次运行自动灌入存储）
export const defaultDishes: Dish[] = [
  { id: 1, name: '黄焖鸡米饭', description: '鲜嫩鸡腿肉，搭配青椒香菇，汤汁浓郁', price: 22.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional+chinese+braised+chicken+with+rice%2C+clay+pot+style%2C+food+photography&image_size=square', categoryId: 1, status: 'available' },
  { id: 2, name: '红烧牛肉面', description: '大块牛腩慢炖，汤头香浓', price: 25.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=braised+beef+noodle+soup%2C+chinese+style%2C+appetizing+food+photography&image_size=square', categoryId: 1, status: 'available' },
  { id: 3, name: '宫保鸡丁饭', description: '鸡肉丁配花生米，麻辣鲜香', price: 20.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kung+pao+chicken+with+rice%2C+chinese+food+photography&image_size=square', categoryId: 2, status: 'available' },
  { id: 4, name: '番茄炒蛋盖饭', description: '家常美味，酸甜可口', price: 16.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stir+fried+tomato+and+egg+over+rice%2C+chinese+home+cooking&image_size=square', categoryId: 2, status: 'available' },
  { id: 5, name: '凉拌黄瓜', description: '清脆爽口，蒜香开胃', price: 8.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese+cucumber+salad+with+garlic%2C+side+dish&image_size=square', categoryId: 3, status: 'available' },
  { id: 6, name: '皮蛋豆腐', description: '嫩滑豆腐配皮蛋，清爽解暑', price: 10.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese+century+egg+tofu+cold+dish%2C+appetizer&image_size=square', categoryId: 3, status: 'available' },
  { id: 7, name: '冰可乐', description: '冰镇可乐，解渴必备', price: 5.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iced+coca+cola+in+a+glass%2C+refreshing+drink&image_size=square', categoryId: 4, status: 'available' },
  { id: 8, name: '珍珠奶茶', description: 'Q弹珍珠配浓郁奶茶', price: 12.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bubble+milk+tea+with+tapioca+pearls%2C+drink&image_size=square', categoryId: 4, status: 'available' },
  { id: 9, name: '抹茶蛋糕', description: '日式抹茶，绵密香甜', price: 15.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=matcha+green+tea+cake+slice%2C+dessert&image_size=square', categoryId: 5, status: 'available' },
  { id: 10, name: '芒果布丁', description: '鲜芒果配嫩滑布丁', price: 12.0, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mango+pudding+dessert%2C+sweet+treat&image_size=square', categoryId: 5, status: 'available' },
];
