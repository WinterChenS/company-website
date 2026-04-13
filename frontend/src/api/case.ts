import { request } from '@/utils/request';

/**
 * 公司案例相关API
 */

// 公共案例接口
export interface PortfolioCase {
  id: number;
  title: string;
  client: string;
  industry: string;
  overview: string;
  challenge: string;
  solution: string;
  result: string;
  imageUrl: string;
  publishedAt: string;
  createdAt: string;
}

// 管理员案例接口
export interface PortfolioCaseAdmin {
  id: number;
  titleZh: string;
  titleEn: string;
  clientZh: string;
  clientEn: string;
  industryZh: string;
  industryEn: string;
  overviewZh: string;
  overviewEn: string;
  challengeZh: string;
  challengeEn: string;
  solutionZh: string;
  solutionEn: string;
  resultZh: string;
  resultEn: string;
  imageUrl: string;
  sortOrder: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取所有已发布的案例列表
 */
export async function getPublicCases(locale = 'zh') {
  return request<PortfolioCase[]>({
    url: `/api/public/cases?locale=${locale}`,
    method: 'GET',
  });
}

/**
 * 分页获取已发布的案例
 */
export async function getPublicCasesPage(page = 0, size = 9, locale = 'zh') {
  return request<{
    content: PortfolioCase[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }>({
    url: `/api/public/cases/page?page=${page}&size=${size}&locale=${locale}`,
    method: 'GET',
  });
}

/**
 * 获取单个案例详情
 */
export async function getCaseById(id: number, locale = 'zh') {
  return request<PortfolioCase>({
    url: `/api/public/cases/${id}?locale=${locale}`,
    method: 'GET',
  });
}

/**
 * 按行业筛选案例
 */
export async function getCasesByIndustry(industry: string, locale = 'zh') {
  return request<PortfolioCase[]>({
    url: `/api/public/cases/industry/${encodeURIComponent(industry)}?locale=${locale}`,
    method: 'GET',
  });
}

// ========== 管理员接口 ==========

/**
 * 获取管理员案例列表（分页）
 */
export async function adminGetCases(page = 0, size = 10) {
  return request<{
    content: PortfolioCaseAdmin[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }>({
    url: `/api/admin/cases?page=${page}&size=${size}`,
    method: 'GET',
  });
}

/**
 * 搜索案例
 */
export async function adminSearchCases(keyword: string, page = 0, size = 10) {
  return request<{
    content: PortfolioCaseAdmin[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }>({
    url: `/api/admin/cases/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    method: 'GET',
  });
}

/**
 * 获取单个案例详情（管理员用）
 */
export async function adminGetCaseById(id: number) {
  return request<PortfolioCaseAdmin>({
    url: `/api/admin/cases/${id}`,
    method: 'GET',
  });
}

/**
 * 创建或更新案例
 */
export async function adminSaveCase(data: Partial<PortfolioCaseAdmin>) {
  return request<PortfolioCaseAdmin>({
    url: '/api/admin/cases',
    method: 'POST',
    data,
  });
}

/**
 * 删除案例
 */
export async function adminDeleteCase(id: number) {
  return request<void>({
    url: `/api/admin/cases/${id}`,
    method: 'DELETE',
  });
}

/**
 * 发布/取消发布案例
 */
export async function adminTogglePublishCase(id: number, publish: boolean) {
  return request<PortfolioCaseAdmin>({
    url: `/api/admin/cases/${id}/publish?publish=${publish}`,
    method: 'POST',
  });
}