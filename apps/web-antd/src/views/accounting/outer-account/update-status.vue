<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const dataId = ref<any | null>(null);
const denyStatus = ref([]);

const urlPrefix = '/account/outer-account';

async function getDetail(id: string) {
  return requestClient.get(`${urlPrefix}/detail`, {
    params: { accountNo: id },
  });
}

async function onSubmit(values: Record<string, any>) {
  values.id = dataId.value;
  console.log(values);
  return await requestClient.get(`${urlPrefix}/change-deny-status`, {
    params: values,
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
      fieldName: 'accountNo',
      label: '账户号',
    },
    {
      component: 'Select',
      componentProps: {
        options: denyStatus,
        fieldNames: { label: 'name', value: 'code' },
      },
      fieldName: 'denyStatus',
      label: '禁止状态',
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
      const { allEnums, id } = drawerApi.getData<Record<string, any>>();
      if (id) {
        denyStatus.value = allEnums.denyStatus;
        dataId.value = id;
        getDetail(id).then((response) => {
          formApi.setValues(response);
        });
      }
    }
  },
  title: '编辑账户禁止状态',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
