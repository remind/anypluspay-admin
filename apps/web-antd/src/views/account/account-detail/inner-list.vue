<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

/**
 * 获取数据列表
 */
async function getDataList(params: any) {
  return requestClient.get('/account/account-detail/inner-list', { params });
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'accountNo',
      label: '账户号',
    },
    {
      component: 'DatePicker',
      fieldName: 'startDate',
      label: '开始时间',
      componentProps: {
        showTime: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'endDate',
      label: '结束时间',
      componentProps: {
        showTime: true,
      },
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { field: 'requestNo', title: '请求号', align: 'left' },
    { field: 'accountNo', title: '账户号', align: 'left' },
    { field: 'beforeBalance', title: '前余额', align: 'left' },
    { field: 'afterBalance', title: '后余额', align: 'left' },
    { field: 'amount', title: '发生额', align: 'left' },
    { field: 'crDr', title: '借贷', align: 'left' },
    { field: 'accountingDate', title: '会计日', align: 'left' },
    { field: 'memo', title: '备注', align: 'left' },
    { field: 'gmtCreate', title: '发生时间', align: 'left' },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const data = await getDataList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        return data;
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
