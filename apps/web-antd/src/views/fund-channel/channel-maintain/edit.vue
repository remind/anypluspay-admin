<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const apiId = ref<any | null>(null);

const maintainTimeTypes: any = [];

async function getDetail(id: Number) {
  return requestClient.get('/channel-maintain/detail', { params: { id } });
}

async function onSubmit(values: Record<string, any>) {
  values.id = apiId.value;
  return await requestClient.post<any>('/channel-maintain/update', values);
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
      fieldName: 'channelCode',
      label: '渠道编码',
    },
    {
      component: 'Select',
      componentProps: {
        options: maintainTimeTypes,
        disabled: true,
      },
      fieldName: 'maintainTimeType',
      label: '维护时间类型',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'timeRange',
      label: '时间范围',
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
      const { id, channelEnums } = drawerApi.getData<Record<string, any>>();
      if (id) {
        if (maintainTimeTypes.length === 0) {
          channelEnums.maintainTimeType.forEach(
            (element: { [x: string]: any }) => {
              maintainTimeTypes.push({
                label: element.name,
                value: element.code,
              });
            },
          );
        }
        apiId.value = id;
        getDetail(id).then((response) => {
          formApi.setValues(response);
        });
      }
    }
  },
  title: '编辑维护时间',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
