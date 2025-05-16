<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Typography, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const applyResult = ref<any | null>(null);

function onSubmit(values: Record<string, any>) {
  requestClient.post<any>('/demo/withdraw/apply', values).then((response) => {
    applyResult.value = response;
  });
}

const [Form] = useVbenForm({
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
      fieldName: 'memberId',
      defaultValue: '100000003',
      label: '会员ID',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'accountNo',
      defaultValue: '200100200110000000315600001',
      label: '账户号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'amount',
      defaultValue: '1',
      label: '金额',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'cardIdNo',
      defaultValue: '513023199001010000',
      label: '身份证号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'cardName',
      defaultValue: '张三',
      label: '姓名',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'bankCode',
      defaultValue: 'ABC',
      label: '银行编码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'cardNo',
      defaultValue: '6228481234567890',
      label: '银行卡号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'memo',
      defaultValue: '测试提现',
      label: '备注',
      rules: 'required',
    },
  ],
  layout: 'horizontal',
  wrapperClass: 'grid-cols-3',
  showDefaultActions: true,
});
</script>
<template>
  <Page
    content-class="flex flex-col gap-4"
    description="1、填写提现卡信息；2、提交提现。"
    title="提现测试"
  >
    <Card title="提现">
      <Form />
      <Typography>
        <TypographyParagraph>{{ applyResult }}</TypographyParagraph>
      </Typography>
    </Card>
  </Page>
</template>
