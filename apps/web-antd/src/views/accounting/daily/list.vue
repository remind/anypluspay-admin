<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

const urlPrefix = '/account/title-daily';

/**
 * 获取数据列表
 */
async function getDataList(params: any) {
  return requestClient.get(`${urlPrefix}/list`, { params });
}

function getYesterdayFormatted(): string {
  const today = new Date();
  // 减去一天
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // 获取年、月、日
  const year = yesterday.getFullYear();
  // JavaScript中的月份是从0开始的，所以需要加1，同时确保月份是两位数
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  // 确保日期是两位数
  const day = String(yesterday.getDate()).padStart(2, '0');

  // 格式化为"YYYYMMDD"
  return `${year}${month}${day}`;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'accountDate',
      label: '会计日',
      defaultValue: getYesterdayFormatted(),
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<any> = {
  columns: [
    { field: 'accountDate', title: '会计日', align: 'left' },
    { field: 'titleCode', title: '科目编码', align: 'left' },
    { field: 'titleName', title: '科目名称', align: 'left' },
    { field: 'balanceDirection', title: '余额方向', align: 'left' },
    { field: 'debitAmount', title: '借记金额', align: 'left' },
    { field: 'debitCount', title: '借记笔数', align: 'left' },
    { field: 'debitBalance', title: '借记余额', align: 'left' },
    { field: 'creditAmount', title: '贷记金额', align: 'left' },
    { field: 'creditCount', title: '贷记笔数', align: 'left' },
    { field: 'creditBalance', title: '贷记余额', align: 'left' },
    { field: 'currencyCode', title: '币种', align: 'left' },
  ],
  pagerConfig: {
    enabled: false,
  },
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      // eslint-disable-next-line no-empty-pattern
      query: async ({ }, formValues) => {
        const data = await getDataList(formValues);
        return {
          items: data,
        };
      },
    },
  },
};
const [Grid] = useVbenVxeGrid({ formOptions, gridOptions });
</script>
<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
