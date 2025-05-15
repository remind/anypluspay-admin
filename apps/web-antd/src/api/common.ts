import { requestClient } from '#/api/request';

/**
 * 获取枚举定义
 */
export async function getCodeNameValues(type: string) {
  return requestClient.get('/enum-value/code-name', { params: { type } });
}

/**
 * 打开新窗口并提交表单
 */
export function openPostWindow(url: any, params: any) {
  // 创建 form 元素
  const form = document.createElement('form');
  form.method = 'post';
  form.action = url;
  form.target = '_blank'; // 提交到新窗口

  // 遍历参数对象，添加隐藏字段
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = params[key];
      form.append(input);
    }
  }

  // 将表单添加到页面并提交
  document.body.append(form);
  form.submit();
  form.remove(); // 提交后移除
}
