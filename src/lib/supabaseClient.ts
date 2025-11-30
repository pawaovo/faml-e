/**
 * Supabase 客户端配置
 * 用于连接 Supabase 后端服务
 */

import { createClient } from '@supabase/supabase-js';

// 从环境变量读取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 验证环境变量
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '缺少 Supabase 环境变量。请检查 .env.local 文件中的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
  );
}

// 创建 Supabase 客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 获取或生成用户ID
 * 使用 localStorage 持久化用户ID
 * 格式：user_${timestamp}_${random}
 */
export const getUserId = (): string => {
  const STORAGE_KEY = 'famlee_user_id';

  // 尝试从 localStorage 获取现有 ID
  let userId = localStorage.getItem(STORAGE_KEY);

  // 如果不存在，生成新的 ID
  if (!userId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    userId = `user_${timestamp}_${random}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
};

/**
 * 清除用户ID（用于测试或重置）
 */
export const clearUserId = (): void => {
  localStorage.removeItem('famlee_user_id');
};
