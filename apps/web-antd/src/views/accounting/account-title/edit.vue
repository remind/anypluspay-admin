<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const dataId = ref<any | null>(null);

const urlPrefix = '/account/account-title';

async function getDetail(id: Number) {
  return requestClient.get(`${urlPrefix}/detail`, { params: { code: id } });
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
      fieldName: 'code',
      label: '科目编码',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '科目名称',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      defaultValue: true,
      fieldName: 'enable',
      label: '状态',
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
  title: '编辑科目',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
