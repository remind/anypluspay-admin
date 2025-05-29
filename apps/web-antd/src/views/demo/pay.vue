<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Typography, TypographyParagraph } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const createTradeResult = ref<any | null>(null);

function onSubmit(values: Record<string, any>) {
  requestClient
    .post<any>('/demo/create-trade-order', values)
    .then((response) => {
      createTradeResult.value = response;
      window.open(
        `/api/demo/cashier?paymentId=${response.paymentId}`,
        '_blank',
      );
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
      fieldName: 'partnerId',
      defaultValue: '100000003',
      label: '合作方',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'subject',
      defaultValue: '测试subject',
      label: '标题',
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
      fieldName: 'payerId',
      defaultValue: '100000002',
      label: '付款人ID',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'payeeId',
      defaultValue: '100000003',
      label: '收款人ID',
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
    description="1、创建交易；2、跳转收银台；3、选择支付方式支付。 交易状态：0-待支付，1-成功，2-失败"
    title="支付测试"
  >
    <Card title="支付">
      <Form />
      <Typography>
        <TypographyParagraph>{{ createTradeResult }}</TypographyParagraph>
      </Typography>
    </Card>
  </Page>
</template>
