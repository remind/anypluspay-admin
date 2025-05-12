<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const apiId = ref<any | null>(null);

const apiTypes: any = [];

async function getChannelApiDetail(id: Number) {
  return requestClient.get('/channel-api/detail', { params: { id } });
}

async function onSubmit(values: Record<string, any>) {
  values.id = apiId.value;
  return await requestClient.post<any>('/channel-api/update', values);
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
      const { id, channelEnums } = drawerApi.getData<Record<string, any>>();
      if (id) {
        channelEnums.channelApiType.forEach((element: { [x: string]: any }) => {
          apiTypes.push({
            label: `${element.name}(${element.code})`,
            value: element.code,
          });
        });
        apiId.value = id;
        getChannelApiDetail(id).then((response) => {
          formApi.setValues(response);
        });
      }
    }
  },
  title: '编辑渠道接口',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
