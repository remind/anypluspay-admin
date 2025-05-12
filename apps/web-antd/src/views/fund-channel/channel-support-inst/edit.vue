<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const dataId = ref<any | null>(null);

const cardTypes: any = [
  {
    label: '所有',
    value: '',
  },
];

async function getDetail(id: Number) {
  return requestClient.get('/channel-support-inst/detail', {
    params: { id },
  });
}

async function onSubmit(values: Record<string, any>) {
  values.id = dataId.value;
  return await requestClient.post<any>('/channel-support-inst/update', values);
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
      componentProps: {
        disabled: true,
      },
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
      const { id, channelEnums } = drawerApi.getData<Record<string, any>>();
      if (id) {
        channelEnums.cardType.forEach((element: { [x: string]: any }) => {
          cardTypes.push({
            label: element.name,
            value: element.code,
          });
        });
        dataId.value = id;
        getDetail(id).then((response) => {
          formApi.setValues(response);
        });
      }
    }
  },
  title: '编辑支付机构及限额',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
