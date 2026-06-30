// 示例数据和默认菜品 - 小爱专属菜单
import { Category, Dish } from '@/types';

// 菜品分类
export const categories: Category[] = [
  { id: 1, name: '热销套餐', icon: '🔥' },
  { id: 2, name: '主食', icon: '🍚' },
  { id: 3, name: '饮品', icon: '🥤' },
  { id: 4, name: '甜点', icon: '🍰' },
  { id: 5, name: '情绪', icon: '💝' },
  { id: 6, name: '互动', icon: '💌' },
];

// 生成图片地址的辅助函数
const img = (prompt: string) => `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;

// 默认菜品
export const defaultDishes: Dish[] = [
  // ===== 热销套餐 =====
  { id: 1,  name: '搓一顿美蛙鱼【两斤蛙➕米饭】', description: '鲜嫩美蛙搭配秘制锅底，两斤蛙肉超满足', price: 48, image: img('spicy frog hotpot with rice, chinese cuisine, food photography'), categoryId: 1, status: 'available' },
  { id: 2,  name: '沙县小吃【鸡腿饭➕紫菜蛋花汤】', description: '经典沙县搭配，鸡腿饭配紫菜蛋花汤', price: 25, image: img('chicken leg rice with seaweed egg soup, chinese food'), categoryId: 1, status: 'available' },
  { id: 3,  name: '沙县小吃【卤肉饭】', description: '卤香四溢，酱汁拌饭超下饭', price: 18, image: img('braised pork rice, chinese sha county cuisine'), categoryId: 1, status: 'available' },
  { id: 4,  name: '鲜味记【一荤两素➕米饭】', description: '营养均衡，一荤两素搭配白米饭', price: 22, image: img('chinese combo meal, one meat two vegetables with rice'), categoryId: 1, status: 'available' },
  { id: 5,  name: '冒三巡【烤鸭冒菜】', description: '烤鸭遇上冒菜，麻辣鲜香新体验', price: 32, image: img('roast duck maocai spicy hot pot, chinese cuisine'), categoryId: 1, status: 'available' },

  // ===== 主食 =====
  { id: 6,  name: '番茄鸡蛋盖饭', description: '酸甜番茄配上嫩滑鸡蛋，家常温暖味道', price: 16, image: img('tomato and egg over rice, chinese home cooking, comfort food'), categoryId: 2, status: 'available' },
  { id: 7,  name: '青椒肉丝炒饭', description: '经典青椒肉丝，粒粒分明香喷喷', price: 18, image: img('green pepper shredded pork fried rice, chinese food'), categoryId: 2, status: 'available' },
  { id: 8,  name: '火腿肠鸡蛋炒饭', description: '简单好吃，火腿鸡蛋炒饭永远的爱', price: 15, image: img('ham and egg fried rice, simple delicious chinese food'), categoryId: 2, status: 'available' },
  { id: 9,  name: '猪脚饭', description: '软糯Q弹猪脚，满满胶原蛋白', price: 25, image: img('braised pig trotter rice, chinese delicacy, food photography'), categoryId: 2, status: 'available' },
  { id: 10, name: '鱼香肉丝盖饭', description: '酸甜微辣鱼香汁，拌饭一绝', price: 20, image: img('yu xiang shredded pork over rice, chinese szechuan cuisine'), categoryId: 2, status: 'available' },

  // ===== 饮品 =====
  { id: 11, name: '一点点【QQ莓莓奶茶不加糖】', description: 'Q弹莓莓配浓郁奶茶，不加糖也超好喝', price: 15, image: img('strawberry bubble milk tea, pink cute drink, boba tea'), categoryId: 3, status: 'available' },
  { id: 12, name: '一点点【芭乐奶绿三分糖】', description: '清甜芭乐遇见奶绿，三分刚好', price: 15, image: img('guava green milk tea, refreshing drink, boba'), categoryId: 3, status: 'available' },
  { id: 13, name: '蜜雪冰城【芋圆葡萄三分糖】', description: '芋圆软糯，葡萄清甜，三分糖刚刚好', price: 8, image: img('taro ball grape drink, purple cute beverage'), categoryId: 3, status: 'available' },
  { id: 14, name: '蜜雪冰城【柠檬水正常糖】', description: '清爽柠檬水，解腻必备', price: 5, image: img('fresh lemonade, cold refreshing drink, summer'), categoryId: 3, status: 'available' },
  { id: 15, name: '蜜雪冰城【茉莉奶绿三分糖】', description: '茉莉花香配上奶绿，清新脱俗', price: 8, image: img('jasmine green milk tea, floral refreshing boba'), categoryId: 3, status: 'available' },
  { id: 16, name: '蜜雪冰城【布丁奶茶三分糖】', description: '丝滑布丁配上浓郁奶茶，甜蜜温柔', price: 8, image: img('pudding milk tea, caramel pudding boba drink'), categoryId: 3, status: 'available' },
  { id: 17, name: '沪上阿姨【仙仙玫瑰青提三分糖】', description: '玫瑰花香遇上青提，仙女必喝', price: 16, image: img('rose grape tea, pink aesthetic drink, floral'), categoryId: 3, status: 'available' },
  { id: 18, name: '沪上阿姨【厚芋泥啵啵奶茶三分糖】', description: '厚厚芋泥配上Q弹啵啵，幸福感爆棚', price: 18, image: img('thick taro bubble milk tea, purple sweet drink'), categoryId: 3, status: 'available' },
  { id: 19, name: '沪上阿姨【千目抹茶波波正常糖】', description: '浓郁抹茶遇上Q弹波波，日系甜感', price: 18, image: img('matcha boba tea, green tea bubble drink, japanese style'), categoryId: 3, status: 'available' },
  { id: 20, name: '沪上阿姨【白玫瑰羽衣甘蓝三分糖】', description: '清新羽衣甘蓝配白玫瑰，高颜值养生茶', price: 18, image: img('rose kale tea, pink healthy drink, aesthetic'), categoryId: 3, status: 'available' },
  { id: 21, name: '沪上阿姨【千目抹茶冰奶正常糖】', description: '浓郁抹茶冰奶，夏天的一抹清凉', price: 18, image: img('matcha iced milk, green refreshing drink, japanese'), categoryId: 3, status: 'available' },
  { id: 22, name: '古茗【超A芝士葡萄三分糖】', description: '芝士奶盖配葡萄，超A级好喝', price: 16, image: img('cheese grape tea, cheese foam drink, trendy boba'), categoryId: 3, status: 'available' },

  // ===== 甜点 =====
  { id: 23, name: '初味甜品【毛巾卷奥利奥/抹茶奥利奥】', description: '软糯毛巾卷，奥利奥与抹茶的双重诱惑', price: 22, image: img('oreo matcha towel roll cake, cute dessert, sweet'), categoryId: 4, status: 'available' },
  { id: 24, name: '小蛋糕', description: '精致小蛋糕，一口一个甜蜜', price: 15, image: img('cute mini cake, pink frosting, kawaii dessert'), categoryId: 4, status: 'available' },
  { id: 25, name: '蛋挞', description: '酥脆外皮，嫩滑蛋心，经典甜品', price: 8, image: img('egg tart, portuguese custard tart, golden baked'), categoryId: 4, status: 'available' },

  // ===== 情绪 =====
  { id: 26, name: '【有点不开心】', description: '想要你的安慰和抱抱', price: 0, image: img('cute sad cat illustration, kawaii pink pastel'), categoryId: 5, status: 'available' },
  { id: 27, name: '【我想你了】', description: '就是很想你，没有理由', price: 0, image: img('cute love heart illustration, kawaii pink romantic'), categoryId: 5, status: 'available' },
  { id: 28, name: '【对不起，但我说不出口】', description: '用这个代替那三个字', price: 0, image: img('cute shy bunny illustration, sorry kawaii pastel'), categoryId: 5, status: 'available' },
  { id: 29, name: '【爱你超级加倍】', description: '爱你不止一点点，是超级加倍！', price: 0, image: img('cute love super heart illustration, kawaii pink'), categoryId: 5, status: 'available' },

  // ===== 互动 =====
  { id: 30, name: '【申请打电话】', description: '想听你的声音了，现在就想！', price: 0, image: img('cute phone call illustration, kawaii couple pink'), categoryId: 6, status: 'available' },
  { id: 31, name: '【想玩游戏了】', description: '一起开黑，或者你看着我玩也行', price: 0, image: img('cute game controller illustration, kawaii pink pastel'), categoryId: 6, status: 'available' },
];
