<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const cardTypes: any = [
  {
    label: '所有',
    value: 'UNLIMITED',
  },
];

async function onSubmit(values: Record<string, any>) {
  return await requestClient.post<any>('/channel-support-inst/add', values);
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
      component: 'Input',
      fieldName: 'targetInstCode',
      label: '目标机构',
    },
    {
      component: 'Select',
      componentProps: {
        options: cardTypes,
      },
      fieldName: 'cardType',
      label: '卡类型',
    },
    {
      component: 'Textarea',
      fieldName: 'extra',
      label: '扩展条件',
      formItemClass: 'items-baseline',
      help: "kv格式，多个用'&'拼接，如a=1&b=2",
    },
    {
      component: 'Input',
      fieldName: 'perAmountRange',
      label: '单笔限额',
      help: '用区间表示，无限额可为空，如(,1000]表示下限无限制，上限小于等于1000',
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
        channelEnums.cardType.forEach((element: { [x: string]: any }) => {
          cardTypes.push({
            label: element.name,
            value: element.code,
          });
        });
        formApi.setValues({ channelCode });
      }
    }
  },
  title: '新增支付机构及限额',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
