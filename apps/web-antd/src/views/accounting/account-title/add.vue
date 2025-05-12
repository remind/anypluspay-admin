<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const accountTitleType = ref([]);
const balanceDirection = ref([]);
const accountTitleScope = ref([]);

const urlPrefix = '/account/account-title';

async function onSubmit(values: Record<string, any>) {
  return await requestClient.post<any>(`${urlPrefix}/add`, values);
}

const rootSchema = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '科目名称',
    rules: 'required',
  },
  {
    component: 'Select',
    fieldName: 'type',
    componentProps: {
      options: accountTitleType,
      fieldNames: { label: 'name', value: 'code' },
    },
    label: '科目类型',
    rules: 'required',
  },
  {
    component: 'Select',
    fieldName: 'scope',
    componentProps: {
      options: accountTitleScope,
      fieldNames: { label: 'name', value: 'code' },
    },
    label: '适用范围',
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
];
const normalSchema = [
  {
    component: 'Input',
    fieldName: 'parentCode',
    label: '父科目编码',
    rules: 'required',
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
];

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [],
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
      const { allEnums, isRoot } = drawerApi.getData<Record<string, any>>();
      accountTitleType.value = allEnums.accountTitleType;
      balanceDirection.value = allEnums.balanceDirection;
      accountTitleScope.value = allEnums.accountTitleScope;
      if (isRoot) {
        formApi.setState(() => {
          return {
            schema: rootSchema,
          };
        });
      } else {
        formApi.setState(() => {
          return {
            schema: normalSchema,
          };
        });
      }
    }
  },
  title: '新增科目',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
