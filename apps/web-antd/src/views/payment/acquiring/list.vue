<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

import RefundFormDrawer from './refund.vue';

const urlPrefix = '/payment/acquiring';

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
    {
      component: 'Input',
      fieldName: 'relationPaymentId',
      label: '关联支付单号',
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
    { field: 'outTradeNo', title: '外部交易号', align: 'left' },
    { field: 'partnerId', title: '合作方', align: 'left' },
    { field: 'payeeId', title: '收款方', align: 'left' },
    { field: 'payerId', title: '付款方', align: 'left' },
    { field: 'subject', title: '标题', align: 'left' },
    { field: 'amount', title: '金额', align: 'left' },
    { field: 'status', title: '状态', align: 'left' },
    { field: 'tradeType', title: '交易类型', align: 'left' },
    { field: 'relationPaymentId', title: '关联支付单号', align: 'left' },
    { field: 'gmtCreate', title: '创建时间', align: 'left' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
    },
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
const [RefundDrawer, refundDrawerApi] = useVbenDrawer({
  connectedComponent: RefundFormDrawer,
});

function openRefundDetail(paymentId: string) {
  refundDrawerApi.setData({ paymentId });
  refundDrawerApi.open();
}
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <Button type="link" @click="openRefundDetail(row.paymentId)">
          退款
        </Button>
      </template>
    </Grid>
    <RefundDrawer />
  </Page>
</template>
