<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const urlPrefix = '/payment/pay-method';

const payModelEnum = ref([]);
const assetTypeEnum = ref([]);
const payMethodStatusEnum = ref([]);

const objectKeyId = ref<any | null>(null);

async function getDetail(code: string) {
  return requestClient.get(`${urlPrefix}/detail`, { params: { code } });
}

async function onSubmit(values: Record<string, any>) {
  values.code = objectKeyId.value;
  return await requestClient.post<any>(`${urlPrefix}/update`, values);
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
      component: 'Select',
      fieldName: 'payModel',
      componentProps: {
        options: payModelEnum,
        fieldNames: { label: 'name', value: 'code' },
      },
      label: '支付模式',
      rules: 'selectRequired',
    },
    {
      component: 'Select',
      fieldName: 'assetType',
      componentProps: {
        options: assetTypeEnum,
        fieldNames: { label: 'name', value: 'code' },
      },
      label: '资产类型',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'payInst',
      label: '支付机构',
      help: '限制的机构编码，如果无限制填写UNLIMITED，余额支付填写余额类型编码',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'status',
      componentProps: {
        options: payMethodStatusEnum,
        fieldNames: { label: 'name', value: 'code' },
      },
      label: '状态',
      rules: 'selectRequired',
    },
    {
      component: 'Textarea',
      fieldName: 'extension',
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
      const { allEnums, code } = drawerApi.getData<Record<string, any>>();
      payModelEnum.value = allEnums.payModel;
      assetTypeEnum.value = allEnums.assetType;
      payMethodStatusEnum.value = allEnums.payMethodStatus;
      objectKeyId.value = code;
      if (code) {
        getDetail(code).then((response) => {
          formApi.setValues(response);
        });
      }
    }
  },
  title: '编辑支付方式',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
