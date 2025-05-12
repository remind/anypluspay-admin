<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const urlPrefix = '/account/inner-account';

async function onSubmit(values: Record<string, any>) {
  return await requestClient.post<any>(`${urlPrefix}/add`, values);
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
      fieldName: 'accountNo',
      label: '账户号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'accountName',
      label: '账户名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'titleCode',
      label: '科目编码',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          {
            label: '人民币',
            value: 'CNY',
          },
        ],
      },
      fieldName: 'currencyCode',
      label: '币种',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'memo',
      label: '备注',
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
  title: '新增内部账户',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
