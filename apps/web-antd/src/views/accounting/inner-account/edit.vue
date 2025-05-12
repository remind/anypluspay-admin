<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const dataId = ref<any | null>(null);

const urlPrefix = '/account/inner-account';

async function getDetail(id: string) {
  return requestClient.get(`${urlPrefix}/detail`, {
    params: { accountNo: id },
  });
}

async function onSubmit(values: Record<string, any>) {
  values.id = dataId.value;
  return await requestClient.post<any>(`${urlPrefix}/update`, values);
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
      fieldName: 'accountNo',
      label: '账户号',
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
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { id } = drawerApi.getData<Record<string, any>>();
      if (id) {
        dataId.value = id;
        getDetail(id).then((response) => {
          formApi.setValues(response);
        });
      }
    }
  },
  title: '编辑内部账户',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
