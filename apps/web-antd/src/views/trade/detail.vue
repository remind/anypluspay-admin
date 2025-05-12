<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { TabPane, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

const payGridOptions: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'id',
      title: '支付单号',
      align: 'left',
      width: 300,
    },
    { field: 'status', title: '状态', align: 'left' },
    { field: 'gmtCreate', title: '创建时间', align: 'left' },
    { field: 'gmtModified', title: '修改时间', align: 'left' },
  ],
  pagerConfig: {
    enabled: false,
  },
};
const [PayGrid, PayGridApi] = useVbenVxeGrid({ gridOptions: payGridOptions });

const refundGridOptions: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'id',
      title: '退款单号',
      align: 'left',
      width: 300,
    },
    { field: 'amount', title: '退款金额', align: 'left' },
    { field: 'status', title: '状态', align: 'left' },
    { field: 'gmtCreate', title: '创建时间', align: 'left' },
    { field: 'gmtModified', title: '修改时间', align: 'left' },
  ],
  pagerConfig: {
    enabled: false,
  },
};
const [RefundGrid, RefundGridApi] = useVbenVxeGrid({
  gridOptions: refundGridOptions,
});

const data = ref();

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
      loadDetailData(data.value);
    }
  },
});

function loadDetailData(id: string) {
  requestClient
    .get('/trade/order/pay-detail', {
      params: { tradeId: id },
    })
    .then((response) => {
      if (!response) {
        return;
      }
      PayGridApi.setGridOptions({ data: response.pay });
      RefundGridApi.setGridOptions({ data: response.refund });
    });
}
</script>
<template>
  <Modal title="交易订单详情">
    <Tabs>
      <TabPane key="1" tab="支付详情">
        <PayGrid />
      </TabPane>
      <TabPane key="2" tab="退款详情">
        <RefundGrid />
      </TabPane>
    </Tabs>
  </Modal>
</template>
