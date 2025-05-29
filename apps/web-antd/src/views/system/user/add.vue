<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm, z } from '#/adapter/form';
import { requestClient } from '#/api/request';

const urlPrefix = '/system/user';

const userStatusEnum = ref([]);

async function onSubmit(values: Record<string, any>) {
  return await requestClient.post<any>(`${urlPrefix}/add`, values);
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
      fieldName: 'username',
      label: '账户',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '昵称',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'status',
      componentProps: {
        options: userStatusEnum,
        fieldNames: { label: 'name', value: 'code' },
      },
      label: '状态',
      rules: 'selectRequired',
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '登录密码',
      rules: 'required',
    },
    {
      component: 'InputPassword',
      fieldName: 'rePassword',
      label: '重复密码',
      rules: z
        .string()
        .min(1, { message: '重复密码不能为空' })
        .refine(
          async () => {
            const values = await formApi.getValues();
            return values.password === values.rePassword;
          },
          {
            message: '两次输入的密码不一致',
          },
        ),
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
      const { allEnums } = drawerApi.getData<Record<string, any>>();
      userStatusEnum.value = allEnums.sysUserStatus;
    }
  },
  title: '新增系统用户',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
