<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const apiTypes: any = [];

async function onSubmit(values: Record<string, any>) {
  return await requestClient.post<any>('/channel-api/add', values);
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
      },
      fieldName: 'type',
      label: '接口类型',
      rules: 'required',
    },
    {
      component: 'Switch',
      componentProps: {
        class: 'w-auto',
      },
      fieldName: 'enable',
      label: '状态',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: 'BEAN',
            value: 'BEAN',
          },
          {
            label: 'HTTP',
            value: 'HTTP',
          },
          {
            label: '注册发现',
            value: 'DISCOVERY',
          },
        ],
      },
      fieldName: 'protocol',
      label: '协议',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'address',
      label: '地址',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'extra',
      label: '扩展参数',
      formItemClass: 'items-baseline',
    },
    {
      component: 'Textarea',
      fieldName: 'memo',
      label: '备注',
      formItemClass: 'items-baseline',
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
      const { channelCode, channelEnums } =
        drawerApi.getData<Record<string, any>>();
      if (channelCode) {
        channelEnums.channelApiType.forEach((element: { [x: string]: any }) => {
          apiTypes.push({
            label: `${element.name}(${element.code})`,
            value: element.code,
          });
        });
        formApi.setValues({ channelCode });
      }
    }
  },
  title: '新增渠道接口',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
