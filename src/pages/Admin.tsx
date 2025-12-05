import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, Users, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { generateMockStats, mockCampusEvents, type MockCampusEvent } from '@/data/mockAdminData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MoodType } from '../types';

// Mood 颜色映射
const MOOD_COLORS: Record<MoodType, string> = {
  [MoodType.HAPPY]: '#FFD700',
  [MoodType.ANXIOUS]: '#6366F1',
  [MoodType.SAD]: '#94A3B8',
  [MoodType.ANGRY]: '#EF4444',
  [MoodType.NEUTRAL]: '#D1D5DB',
};

const MOOD_LABELS: Record<MoodType, string> = {
  [MoodType.HAPPY]: '开心',
  [MoodType.ANXIOUS]: '焦虑',
  [MoodType.SAD]: '悲伤',
  [MoodType.ANGRY]: '愤怒',
  [MoodType.NEUTRAL]: '平和',
};

interface AdminPageProps {
  onLogout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('statistics');
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState<MockCampusEvent[]>(mockCampusEvents);

  // 新活动表单状态
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: '讲座' as const,
    location: '',
    description: '',
    imageUrl: '',
  });

  const stats = generateMockStats(timePeriod);

  // 发布新活动
  const handlePublishEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      alert('请填写完整的活动信息');
      return;
    }

    const event: MockCampusEvent = {
      id: Date.now().toString(),
      ...newEvent,
      status: 'published',
      createdAt: new Date().toISOString(),
    };

    setEvents([event, ...events]);

    // 重置表单
    setNewEvent({
      title: '',
      date: '',
      type: '讲座',
      location: '',
      description: '',
      imageUrl: '',
    });

    alert('活动发布成功!');
  };

  const handleLogout = () => {
    localStorage.removeItem('famlee_admin_token');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Famlée 后台管理</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">管理员</p>
              <p className="text-xs text-muted-foreground">admin</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Description */}
        <div className="mb-8">
          <p className="text-muted-foreground">数据统计与校园活动管理中心</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              数据统计
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              活动发布
            </TabsTrigger>
          </TabsList>

          {/* 数据统计面板 */}
          <TabsContent value="statistics">
            {/* 时间维度选择 */}
            <div className="mb-6 flex items-center gap-4">
              <Label className="text-sm font-medium">时间维度:</Label>
              <Select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as 'day' | 'week' | 'month')}
              >
                <option value="day">今日</option>
                <option value="week">本周</option>
                <option value="month">本月</option>
              </Select>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总对话次数</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalConversations}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timePeriod === 'day' ? '今日' : timePeriod === 'week' ? '本周' : '本月'}
                  </p>
                </CardContent>
              </Card>

              {stats.moodDistribution.slice(0, 3).map((item) => (
                <Card key={item.mood}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{MOOD_LABELS[item.mood]}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{item.count}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      占比 {item.percentage}%
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* 对话趋势图 */}
              <Card>
                <CardHeader>
                  <CardTitle>对话量趋势</CardTitle>
                  <CardDescription>
                    {timePeriod === 'day' ? '24小时' : timePeriod === 'week' ? '7天' : '30天'}趋势分析
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="conversations"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="对话次数"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Mood 分布饼图 */}
              <Card>
                <CardHeader>
                  <CardTitle>心情分布</CardTitle>
                  <CardDescription>各类心情占比统计</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.moodDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${MOOD_LABELS[entry.mood]} ${entry.percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats.moodDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.mood]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Mood 对比柱状图 */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>心情变化趋势对比</CardTitle>
                  <CardDescription>各类心情随时间变化的详细对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="happy" fill={MOOD_COLORS[MoodType.HAPPY]} name="开心" />
                      <Bar dataKey="anxious" fill={MOOD_COLORS[MoodType.ANXIOUS]} name="焦虑" />
                      <Bar dataKey="sad" fill={MOOD_COLORS[MoodType.SAD]} name="悲伤" />
                      <Bar dataKey="angry" fill={MOOD_COLORS[MoodType.ANGRY]} name="愤怒" />
                      <Bar dataKey="neutral" fill={MOOD_COLORS[MoodType.NEUTRAL]} name="平和" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* AI 总结 */}
            <Card>
              <CardHeader>
                <CardTitle>AI 心情分析总结</CardTitle>
                <CardDescription>基于用户对话的智能心理趋势分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.aiSummary.map((item) => (
                    <div
                      key={item.mood}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                      style={{ borderColor: MOOD_COLORS[item.mood] + '40' }}
                    >
                      <div
                        className="w-3 h-3 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: MOOD_COLORS[item.mood] }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{MOOD_LABELS[item.mood]}</div>
                        <p className="text-sm text-gray-600">{item.summary}</p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-gray-100">
                        {item.trend === 'up' ? '↑ 上升' : item.trend === 'down' ? '↓ 下降' : '→ 稳定'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 活动发布面板 */}
          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 发布新活动表单 */}
              <Card>
                <CardHeader>
                  <CardTitle>发布新活动</CardTitle>
                  <CardDescription>填写活动信息并发布到校园心理布告栏</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">活动标题 *</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="例如: 湖畔冥想工作坊"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">活动时间 *</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">活动类型 *</Label>
                    <Select
                      id="type"
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, type: e.target.value as any })
                      }
                    >
                      <option value="讲座">讲座</option>
                      <option value="团辅">团辅</option>
                      <option value="工坊">工坊</option>
                      <option value="运动">运动</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">活动地点 *</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="例如: 西土城校区 · 小花园"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">活动描述</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, description: e.target.value })
                      }
                      placeholder="简要描述活动内容和注意事项"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">活动图片 URL</Label>
                    <Input
                      id="imageUrl"
                      value={newEvent.imageUrl}
                      onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <Button onClick={handlePublishEvent} className="w-full">
                    发布活动
                  </Button>
                </CardContent>
              </Card>

              {/* 已发布活动列表 */}
              <Card>
                <CardHeader>
                  <CardTitle>已发布活动</CardTitle>
                  <CardDescription>最近发布的校园心理活动</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          {event.imageUrl && (
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="w-16 h-16 rounded-lg object-cover shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1 truncate">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                                {event.type}
                              </span>
                              <span>{event.date}</span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400">{event.location}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  event.status === 'published'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {event.status === 'published' ? '已发布' : '草稿'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
