<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Typography, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { openPostWindow } from '#/api';

const createTradeResult = ref<any | null>(null);

function onSubmit(values: Record<string, any>) {
  openPostWindow('/api/demo/deposit-cashier', values);
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
      defaultValue: '50',
      label: '金额',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'memo',
      defaultValue: '测试充值',
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
    description="1、填写充值信息；2、跳转收银台；3、选择支付方式支付。 充值不需要预创建订单，在支付时会自动创建充值订单。"
    title="充值测试"
  >
    <Card title="支付">
      <Form />
      <Typography>
        <TypographyParagraph>{{ createTradeResult }}</TypographyParagraph>
      </Typography>
    </Card>
  </Page>
</template>
