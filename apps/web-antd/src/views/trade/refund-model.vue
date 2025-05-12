<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

async function onSubmit(values: Record<string, any>) {
  requestClient.post<any>('/trade/order/refund', values).then((response) => {
    message.success({
      content: response,
    });
  });
}
const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'tradeId',
      label: '交易单号',
    },
    {
      component: 'Input',
      fieldName: 'amount',
      label: '金额',
      rules: 'required',
    },
  ],
  showDefaultActions: false,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    try {
      const r = await formApi.validateAndSubmitForm();
      if (r) {
        drawerApi.close();
      }
    } catch (error) {
      console.log(error);
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { tradeId } = drawerApi.getData<Record<string, any>>();
      formApi.setValues({ tradeId });
    }
  },
  title: '交易退款',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
