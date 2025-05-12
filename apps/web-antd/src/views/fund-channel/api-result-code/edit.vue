<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const apiId = ref<any | null>(null);

const apiTypes: any = [];

const instOrderStatus: any = [];

async function getDetail(id: Number) {
  return requestClient.get('/api-result-code/detail', { params: { id } });
}

async function onSubmit(values: Record<string, any>) {
  values.id = apiId.value;
  return await requestClient.post<any>('/api-result-code/update', values);
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
        options: apiTypes,
        disabled: true,
      },
      fieldName: 'apiType',
      label: '接口类型',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'instApiCode',
      label: '机构结果码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'instApiSubCode',
      label: '机构子结果码',
    },
    {
      component: 'Input',
      fieldName: 'instApiMessage',
      label: '机构消息',
    },
    {
      component: 'Input',
      fieldName: 'unityCode',
      label: '统一结果码',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: instOrderStatus,
      },
      fieldName: 'resultStatus',
      label: '机构订单状态',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      defaultValue: true,
      fieldName: 'useMapping',
      label: '映射',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      defaultValue: false,
      fieldName: 'reRouteEnable',
      label: '重路由',
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
        if (apiTypes.length === 0) {
          channelEnums.channelApiType.forEach(
            (element: { [x: string]: any }) => {
              apiTypes.push({
                label: element.name,
                value: element.code,
              });
            },
          );
          channelEnums.instOrderStatus.forEach(
            (element: { [x: string]: any }) => {
              instOrderStatus.push({
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
  title: '编辑API结果码',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
