<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const InstAbilitys: any = [];

async function onSubmit(values: Record<string, any>) {
  return await requestClient.post<any>('/institution/add', values);
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
      fieldName: 'code',
      label: '编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
      rules: 'required',
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'cname',
        options: InstAbilitys,
      },
      fieldName: 'instAbility',
      label: '能力',
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
      const { instEnums } = drawerApi.getData<Record<string, any>>();
      if (InstAbilitys.length === 0) {
        instEnums.instAbility.forEach((element: { [x: string]: any }) => {
          InstAbilitys.push({
            label: element.name,
            value: element.code,
          });
        });
      }
    }
  },
  title: '新增机构',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
