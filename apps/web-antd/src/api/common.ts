import { requestClient } from '#/api/request';

/**
 * 获取枚举定义
 */
export async function getCodeNameValues(type: string) {
  return requestClient.get('/enum-value/code-name', { params: { type } });
}
