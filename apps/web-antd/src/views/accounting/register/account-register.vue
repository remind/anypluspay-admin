<script lang="ts" setup>
import { markRaw } from 'vue';

import { Card, message, TabPane, Tabs } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

import OuterAccountField from './outer-account-field.vue';

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
  fieldMappingTime: [['crAccount', ['crAccountNo', 'crFundType'], null]],
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
      component: markRaw(OuterAccountField),
      disabledOnChangeListener: false,
      fieldName: 'crAccount',
      formItemClass: 'col-span-1',
      label: '贷方账户',
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

const [Outer2InnerForm] = useVbenForm({
  handleSubmit: outer2innerSubmit,
  layout: 'vertical',
  resetButtonOptions: {
    show: false,
  },
  fieldMappingTime: [['drAccount', ['drAccountNo', 'drFundType'], null]],
  wrapperClass: 'grid-cols-1',
  schema: [
    {
      component: markRaw(OuterAccountField),
      disabledOnChangeListener: false,
      fieldName: 'drAccount',
      formItemClass: 'col-span-1',
      label: '借方账户',
      rules: 'required',
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

function outer2innerSubmit(values: Record<string, any>) {
  requestClient.post<any>(`${urlPrefix}/outer2inner`, values).then(() => {
    message.success({
      content: '操作成功',
    });
  });
}

const [Outer2OuterForm] = useVbenForm({
  handleSubmit: outer2outerSubmit,
  layout: 'vertical',
  resetButtonOptions: {
    show: false,
  },
  fieldMappingTime: [
    ['drAccount', ['drAccountNo', 'drFundType'], null],
    ['crAccount', ['crAccountNo', 'crFundType'], null],
  ],
  wrapperClass: 'grid-cols-1',
  schema: [
    {
      component: markRaw(OuterAccountField),
      disabledOnChangeListener: false,
      fieldName: 'drAccount',
      formItemClass: 'col-span-1',
      label: '借方账户',
      rules: 'required',
    },
    {
      component: markRaw(OuterAccountField),
      disabledOnChangeListener: false,
      fieldName: 'crAccount',
      formItemClass: 'col-span-1',
      label: '贷方账户',
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

function outer2outerSubmit(values: Record<string, any>) {
  requestClient.post<any>(`${urlPrefix}/outer2outer`, values).then(() => {
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
          <Card :bordered="false" style="width: 450px">
            <Inner2InnerForm />
          </Card>
        </TabPane>
        <TabPane key="2" tab="内转外">
          <Card :bordered="false" style="width: 450px">
            <Inner2OuterForm />
          </Card>
        </TabPane>
        <TabPane key="3" tab="外转内">
          <Card :bordered="false" style="width: 450px">
            <Outer2InnerForm />
          </Card>
        </TabPane>
        <TabPane key="4" tab="外转外">
          <Card :bordered="false" style="width: 450px">
            <Outer2OuterForm />
          </Card>
        </TabPane>
      </Tabs>
    </Card>
  </Page>
</template>
