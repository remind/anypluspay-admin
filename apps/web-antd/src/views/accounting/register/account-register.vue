<script lang="ts" setup>
import { Card, message, TabPane, Tabs } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const urlPrefix = '/account/accounting/register';

const [Inner2InnerForm] = useVbenForm({
  handleSubmit: inner2innerSubmit,
  layout: 'vertical',
  resetButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: 'required',
      fieldName: 'drAccountNo',
      label: '借方账户',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: 'required',
      fieldName: 'crAccountNo',
      label: '贷方账户',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: 'required',
      fieldName: 'amount',
      label: '金额',
    },
    {
      component: 'Textarea',
      fieldName: 'memo',
      label: '备注',
    },
  ],
});

function inner2innerSubmit(values: Record<string, any>) {
  requestClient.post<any>(`${urlPrefix}/inner2inner`, values).then(() => {
    message.success({
      content: '操作成功',
    });
  });
}

const [Inner2OuterForm] = useVbenForm({
  handleSubmit: inner2outerSubmit,
  layout: 'vertical',
  resetButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: 'required',
      fieldName: 'drAccountNo',
      label: '借方账户',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: 'required',
      fieldName: 'crAccountNo',
      label: '贷方账户',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '常规',
            value: 'NORMAL',
          },
        ],
      },
      fieldName: 'crFundType',
      label: '贷方资金类型',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: 'required',
      fieldName: 'amount',
      label: '金额',
    },
    {
      component: 'Textarea',
      fieldName: 'memo',
      label: '备注',
    },
  ],
});

function inner2outerSubmit(values: Record<string, any>) {
  requestClient.post<any>(`${urlPrefix}/inner2outer`, values).then(() => {
    message.success({
      content: '操作成功',
    });
  });
}
</script>
<template>
  <Page auto-content-height>
    <Card>
      <Tabs type="card">
        <TabPane key="1" tab="内转内">
          <Card :bordered="false" style="width: 400px">
            <Inner2InnerForm />
          </Card>
        </TabPane>
        <TabPane key="2" tab="内转外">
          <Card :bordered="false" style="width: 400px">
            <Inner2OuterForm />
          </Card>
        </TabPane>
        <TabPane key="3" tab="外转内"> 3</TabPane>
        <TabPane key="4" tab="外转外"> 4</TabPane>
      </Tabs>
    </Card>
  </Page>
</template>
