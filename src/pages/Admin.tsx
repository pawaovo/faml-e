import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Settings,
  HelpCircle,
  Search,
  LogOut,
  TrendingUp,
  TrendingDown,
  Minus,
  PlusCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { generateMockStats, mockCampusEvents, type MockCampusEvent } from '@/data/mockAdminData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { MoodType } from '../types';

// Mood 颜色映射
const MOOD_COLORS: Record<MoodType, string> = {
  [MoodType.HAPPY]: '#72e3ad',
  [MoodType.ANXIOUS]: '#6366F1',
  [MoodType.SAD]: '#94A3B8',
  [MoodType.ANGRY]: '#EF4444',
  [MoodType.NEUTRAL]: '#D1D5DB',
};

interface AdminPageProps {
  onLogout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('month');
  const [events, setEvents] = useState<MockCampusEvent[]>(mockCampusEvents);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: '讲座' as const,
    location: '',
    description: '',
    imageUrl: '',
  });

  const stats = generateMockStats(timePeriod);

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

  // 侧边栏菜单项
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '数据统计' },
    { id: 'analytics', icon: BarChart3, label: '数据分析' },
    { id: 'events', icon: Calendar, label: '活动发布' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* 左侧导航栏 - 薄荷绿主题 */}
      <aside className="w-64 bg-gradient-to-b from-primary to-[oklch(0.80_0.12_165)] border-r border-primary/20 flex flex-col shadow-lg">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Famlée</h1>
              <p className="text-xs text-white/70">后台管理</p>
            </div>
          </div>
        </div>

        {/* Quick Create Button */}
        <div className="px-4 mb-4">
          <Button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 gap-2">
            <PlusCircle className="w-4 h-4" />
            快速创建
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-white/25 backdrop-blur-sm text-white font-medium border border-white/30'
                    : 'text-white/80 hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <Separator className="bg-white/20" />

        {/* Bottom Section */}
        <div className="p-4 space-y-3">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:bg-white/15 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm">设置</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/80 hover:bg-white/15 hover:text-white rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">帮助</span>
          </button>

          <Separator className="bg-white/20" />

          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="w-9 h-9 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">管理员</p>
              <p className="text-xs text-white/70 truncate">admin</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8 hover:bg-white/15 text-white/80 hover:text-white"
              onClick={onLogout}
              title="退出登录"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-1">数据统计</h2>
                <p className="text-muted-foreground">欢迎回来，这是您的数据概览</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索..."
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Revenue Card */}
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardDescription className="text-sm font-medium">总对话次数</CardDescription>
                    <Badge variant="success" className="gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12.5%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stats.totalConversations.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    本月持续上升
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    最近 6 个月访客数
                  </p>
                </CardContent>
              </Card>

              {/* New Customers Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardDescription className="text-sm font-medium">开心情绪</CardDescription>
                    <Badge variant="warning" className="gap-1">
                      <TrendingDown className="w-3 h-3" />
                      -5%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stats.moodDistribution.find(m => m.mood === MoodType.HAPPY)?.count || 0}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    本周期略有下降
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    需要关注改善措施
                  </p>
                </CardContent>
              </Card>

              {/* Active Accounts Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardDescription className="text-sm font-medium">焦虑情绪</CardDescription>
                    <Badge variant="success" className="gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +8%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stats.moodDistribution.find(m => m.mood === MoodType.ANXIOUS)?.count || 0}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    用户留存率良好
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    互动超出预期目标
                  </p>
                </CardContent>
              </Card>

              {/* Growth Rate Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardDescription className="text-sm font-medium">平和情绪</CardDescription>
                    <Badge variant="secondary" className="gap-1">
                      <Minus className="w-3 h-3" />
                      稳定
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stats.moodDistribution.find(m => m.mood === MoodType.NEUTRAL)?.percentage}%
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Minus className="w-3 h-3" />
                    保持稳定表现
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    符合增长预期
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chart Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">对话量趋势</CardTitle>
                    <CardDescription className="mt-1">最近 3 个月总计</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={timePeriod === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimePeriod('month')}
                    >
                      最近 3 个月
                    </Button>
                    <Button
                      variant={timePeriod === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimePeriod('week')}
                    >
                      最近 30 天
                    </Button>
                    <Button
                      variant={timePeriod === 'day' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimePeriod('day')}
                    >
                      最近 7 天
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={stats.trendData}>
                    <defs>
                      <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#72e3ad" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#72e3ad" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="happy"
                      stroke="#72e3ad"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrimary)"
                      name="开心"
                    />
                    <Area
                      type="monotone"
                      dataKey="anxious"
                      stroke="#6366F1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSecondary)"
                      name="焦虑"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events View */}
        {activeView === 'events' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-1">活动发布</h2>
              <p className="text-muted-foreground">管理校园心理活动</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 发布新活动 */}
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
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
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
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="简要描述活动内容"
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

              {/* 已发布活动 */}
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
                        className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow"
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
                            <h4 className="font-medium text-sm mb-1 truncate">{event.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Badge variant="secondary">{event.type}</Badge>
                              <span>{event.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-1">数据分析</h2>
              <p className="text-muted-foreground">深度心理数据洞察与 AI 智能分析</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-sm font-medium">总用户数</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">2,845</div>
                  <p className="text-xs text-muted-foreground mt-1">活跃用户占比 78%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-sm font-medium">平均会话时长</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">12.5 分钟</div>
                  <p className="text-xs text-muted-foreground mt-1">较上月增长 15%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-sm font-medium">情绪健康指数</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">85.2</div>
                  <p className="text-xs text-muted-foreground mt-1">整体良好，持续改善中</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Mood Distribution Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">心情分布</CardTitle>
                  <CardDescription>用户心情状态统计占比</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.moodDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {stats.moodDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.mood]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    {stats.moodDistribution.map((item) => (
                      <div key={item.mood} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: MOOD_COLORS[item.mood] }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.mood === MoodType.HAPPY ? '开心' :
                           item.mood === MoodType.ANXIOUS ? '焦虑' :
                           item.mood === MoodType.SAD ? '悲伤' :
                           item.mood === MoodType.ANGRY ? '愤怒' : '平和'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mood Comparison Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">心情对比</CardTitle>
                  <CardDescription>各类心情数量对比分析</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.moodDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey={(item) =>
                          item.mood === MoodType.HAPPY ? '开心' :
                          item.mood === MoodType.ANXIOUS ? '焦虑' :
                          item.mood === MoodType.SAD ? '悲伤' :
                          item.mood === MoodType.ANGRY ? '愤怒' : '平和'
                        }
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="count" fill="#72e3ad" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis Results */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">AI 智能分析报告</CardTitle>
                <CardDescription>基于大数据的心理健康趋势分析</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Analysis Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    整体评估
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    根据本月数据分析，用户整体心理健康状况呈现积极趋势。
                    <span className="text-primary font-medium">开心情绪</span>占比 35%，为主导情绪，表明校园心理活动效果显著。
                    <span className="text-foreground">焦虑情绪</span>虽占 25%，但较上月下降 8%，
                    说明心理咨询服务的介入发挥了有效作用。
                  </p>
                </div>

                <Separator />

                {/* Key Findings */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    关键发现
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-accent/50 rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">积极趋势</h4>
                          <p className="text-xs text-muted-foreground">
                            周末举办的"湖畔冥想"活动后，平和情绪提升 12%，用户反馈良好。
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-accent/50 rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                          <TrendingDown className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">需要关注</h4>
                          <p className="text-xs text-muted-foreground">
                            期末考试临近，焦虑情绪在工科学生群体中有上升趋势，建议加强心理辅导。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Recommendations */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    行动建议
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">增加团体辅导频率</h4>
                        <p className="text-xs text-muted-foreground">
                          建议每周至少举办 2 次团体辅导活动，重点关注考试压力管理和情绪调节技巧。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">优化 AI 对话算法</h4>
                        <p className="text-xs text-muted-foreground">
                          根据用户反馈，建议加强 AI 对焦虑情绪的识别能力，提供更精准的心理疏导建议。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-white font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">推广心语瀑布功能</h4>
                        <p className="text-xs text-muted-foreground">
                          匿名吐槽墙使用率较低，建议通过校园海报和社交媒体加强宣传，提升学生参与度。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Mood Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">各心情详细分析</CardTitle>
                <CardDescription>基于用户对话内容的深度分析</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.aiSummary.map((item) => (
                    <div
                      key={item.mood}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-lg"
                        style={{ backgroundColor: MOOD_COLORS[item.mood] }}
                      >
                        {item.mood === MoodType.HAPPY ? '😊' :
                         item.mood === MoodType.ANXIOUS ? '😰' :
                         item.mood === MoodType.SAD ? '😔' :
                         item.mood === MoodType.ANGRY ? '😠' : '😐'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">
                            {item.mood === MoodType.HAPPY ? '开心情绪' :
                             item.mood === MoodType.ANXIOUS ? '焦虑情绪' :
                             item.mood === MoodType.SAD ? '悲伤情绪' :
                             item.mood === MoodType.ANGRY ? '愤怒情绪' : '平和情绪'}
                          </h4>
                          <Badge
                            variant={
                              item.trend === 'up' ? 'success' :
                              item.trend === 'down' ? 'destructive' : 'secondary'
                            }
                            className="gap-1"
                          >
                            {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                             item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                             <Minus className="w-3 h-3" />}
                            {item.trend === 'up' ? '上升' : item.trend === 'down' ? '下降' : '稳定'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Placeholder for other views */}
        {!['dashboard', 'analytics', 'events'].includes(activeView) && (
          <div className="p-8">
            <Card className="p-12 text-center">
              <CardTitle className="text-2xl mb-2">功能开发中</CardTitle>
              <CardDescription>该功能正在开发中，敬请期待...</CardDescription>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};
