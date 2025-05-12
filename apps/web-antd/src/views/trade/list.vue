<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

import DetailModalPage from './detail.vue';
import RefundFormDrawer from './refund-model.vue';

const urlPrefix = '/trade/order';

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
      fieldName: 'id',
      label: '订单号',
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
    {
      field: 'id',
      slots: { default: 'code' },
      title: '订单号',
      align: 'left',
      width: 300,
    },
    { field: 'merchantId', title: '商户号', align: 'left' },
    { field: 'payeeId', title: '收款方', align: 'left' },
    { field: 'payerId', title: '付款方', align: 'left' },
    { field: 'amount', title: '金额', align: 'left' },
    { field: 'status', title: '状态', align: 'left' },
    { field: 'gmtCreate', title: '创建时间', align: 'left' },
    { field: 'gmtModified', title: '修改时间', align: 'left' },
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

const [DetailModal, detailModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DetailModalPage,
  class: 'detail-modal',
  showConfirmButton: false,
  showCancelButton: false,
});
/**
 * 打开订单详情页面
 * @param id
 */
function openTradeDetail(id: string) {
  detailModalApi.setData(id);
  detailModalApi.open();
}

const [RefundDrawer, refundDrawerApi] = useVbenDrawer({
  connectedComponent: RefundFormDrawer,
});

function openRefundDetail(id: string) {
  refundDrawerApi.setData({ tradeId: id });
  refundDrawerApi.open();
}
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #code="{ row }">
        <Button type="link" @click="openTradeDetail(row.id)">
          {{ row.id }}
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="openRefundDetail(row.id)">退款</Button>
      </template>
    </Grid>
    <DetailModal />
    <RefundDrawer />
  </Page>
</template>
<style lang="css">
.detail-modal {
  min-width: 800px;
}
</style>
