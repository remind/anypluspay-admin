<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const maintainTimeTypes: any = [];

async function onSubmit(values: Record<string, any>) {
  return await requestClient.post<any>('/channel-maintain/add', values);
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
      const { channelCode, channelEnums } =
        drawerApi.getData<Record<string, any>>();
      if (channelCode) {
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
        formApi.setValues({ channelCode });
      }
    }
  },
  title: '新增维护时间',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
