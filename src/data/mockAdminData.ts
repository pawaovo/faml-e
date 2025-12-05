import { MoodType } from '../types';

// 模拟统计数据接口
export interface AdminStats {
  period: 'day' | 'week' | 'month';
  totalConversations: number;
  moodDistribution: {
    mood: MoodType;
    count: number;
    percentage: number;
  }[];
  trendData: {
    date: string;
    conversations: number;
    happy: number;
    anxious: number;
    sad: number;
    angry: number;
    neutral: number;
  }[];
  aiSummary: {
    mood: MoodType;
    summary: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

// 生成模拟统计数据
export const generateMockStats = (period: 'day' | 'week' | 'month'): AdminStats => {
  const conversations = period === 'day' ? 120 : period === 'week' ? 580 : 2450;

  const moodDistribution = [
    { mood: MoodType.HAPPY, count: Math.floor(conversations * 0.35), percentage: 35 },
    { mood: MoodType.ANXIOUS, count: Math.floor(conversations * 0.25), percentage: 25 },
    { mood: MoodType.NEUTRAL, count: Math.floor(conversations * 0.20), percentage: 20 },
    { mood: MoodType.SAD, count: Math.floor(conversations * 0.15), percentage: 15 },
    { mood: MoodType.ANGRY, count: Math.floor(conversations * 0.05), percentage: 5 },
  ];

  // 生成趋势数据
  const pointsCount = period === 'day' ? 24 : period === 'week' ? 7 : 30;
  const trendData = Array.from({ length: pointsCount }, (_, i) => {
    const baseValue = Math.floor(conversations / pointsCount);
    const variance = Math.floor(Math.random() * 20 - 10);

    return {
      date: period === 'day'
        ? `${i}:00`
        : period === 'week'
        ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i]
        : `${i + 1}日`,
      conversations: baseValue + variance,
      happy: Math.floor((baseValue + variance) * 0.35),
      anxious: Math.floor((baseValue + variance) * 0.25),
      sad: Math.floor((baseValue + variance) * 0.15),
      angry: Math.floor((baseValue + variance) * 0.05),
      neutral: Math.floor((baseValue + variance) * 0.20),
    };
  });

  const aiSummary = [
    {
      mood: MoodType.HAPPY,
      summary: '用户积极情绪整体上升，主要与期末考试结束、假期临近相关',
      trend: 'up' as const,
    },
    {
      mood: MoodType.ANXIOUS,
      summary: '焦虑情绪有所缓解，心理咨询活动效果显著',
      trend: 'down' as const,
    },
    {
      mood: MoodType.SAD,
      summary: '悲伤情绪保持稳定，需持续关注人际关系相关话题',
      trend: 'stable' as const,
    },
    {
      mood: MoodType.ANGRY,
      summary: '愤怒情绪略有下降，校园活动帮助释放压力',
      trend: 'down' as const,
    },
    {
      mood: MoodType.NEUTRAL,
      summary: '平和情绪稳定，用户心理状态整体健康',
      trend: 'stable' as const,
    },
  ];

  return {
    period,
    totalConversations: conversations,
    moodDistribution,
    trendData,
    aiSummary,
  };
};

// 模拟校园活动数据
export interface MockCampusEvent {
  id: string;
  title: string;
  date: string;
  type: '讲座' | '团辅' | '工坊' | '运动';
  location: string;
  description: string;
  imageUrl: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export const mockCampusEvents: MockCampusEvent[] = [
  {
    id: '1',
    title: '湖畔冥想: 寻找内心的宁静',
    date: '2025-12-15 14:00',
    type: '团辅',
    location: '西土城校区 · 小花园',
    description: '在繁忙的学业中暂停一下，跟随专业心理老师进行集体放松技巧练习。',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
    status: 'published',
    createdAt: '2025-12-01',
  },
  {
    id: '2',
    title: '考前压力管理讲座',
    date: '2025-12-18 10:00',
    type: '讲座',
    location: '教三楼 201',
    description: '邀请北师大心理学教授，讲解如何科学应对考试焦虑。',
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=400&q=80',
    status: 'published',
    createdAt: '2025-12-02',
  },
  {
    id: '3',
    title: '新年心愿工作坊',
    date: '2025-12-28 16:00',
    type: '工坊',
    location: '沙河校区 · 活动中心',
    description: '通过艺术创作表达新年愿望，释放创造力',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80',
    status: 'draft',
    createdAt: '2025-12-05',
  },
];
