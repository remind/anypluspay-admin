<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const channelCode = ref<any | null>(null);

const requestTypes: any = [];

async function getFundChannelDetail(code: string) {
  return requestClient.get('/fund-channel/detail', { params: { code } });
}

async function onSubmit(values: Record<string, any>) {
  values.id = channelCode.value;
  return await requestClient.post<any>('/fund-channel/update', values);
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
      label: '渠道编码',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '渠道名称',
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
      component: 'Input',
      fieldName: 'instCode',
      label: '机构编码',
    },
    {
      component: 'Select',
      componentProps: {
        options: requestTypes,
      },
      fieldName: 'requestType',
      label: '渠道类型',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'payMethods',
      label: '支持的支付方式',
    },
    {
      component: 'Input',
      fieldName: 'inClearingAccount',
      label: '流入待清算账户',
    },
    {
      component: 'Input',
      fieldName: 'outClearingAccount',
      label: '流出待清算账户',
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
      const { code, channelEnums } = drawerApi.getData<Record<string, any>>();
      if (code) {
        channelEnums.requestType.forEach((element: { [x: string]: any }) => {
          requestTypes.push({
            label: `${element.name}(${element.code})`,
            value: element.code,
          });
        });
        channelCode.value = code;
        getFundChannelDetail(code).then((response) => {
          formApi.setValues(response);
        });
      }
    }
  },
  title: '编辑渠道基本信息',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
