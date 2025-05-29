<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

const urlPrefix = '/payment/deposit';

/**
 * 获取数据列表
 */
async function getDataList(params: any) {
  return requestClient.get(`${urlPrefix}/list`, { params });
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'paymentId',
      label: '支付单号',
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
    labelField: 'id',
  },
  columns: [
    { field: 'paymentId', title: '支付单号', align: 'left' },
    { field: 'payProcessId', title: '支付指令', align: 'left' },
    { field: 'memberId', title: '会员ID', align: 'left' },
    { field: 'accountNo', title: '账户', align: 'left' },
    { field: 'amount', title: '金额', align: 'left' },
    { field: 'status', title: '状态', align: 'left' },
    { field: 'gmtCreate', title: '创建时间', align: 'left' },
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
