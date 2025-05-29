<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const urlPrefix = '/system/user';

const apiId = ref<any | null>(null);

const userStatusEnum = ref([]);

async function getDetail(id: Number) {
  return requestClient.get(`${urlPrefix}/detail`, { params: { id } });
}

async function onSubmit(values: Record<string, any>) {
  values.id = apiId.value;
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
      fieldName: 'id',
      label: 'ID',
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'username',
      label: '账户',
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
      rules: 'required',
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
      const { allEnums, id } = drawerApi.getData<Record<string, any>>();
      userStatusEnum.value = allEnums.sysUserStatus;
      apiId.value = id;
      if (id) {
        getDetail(id).then((response) => {
          formApi.setValues(response);
        });
      }
    }
  },
  title: '编辑系统用户',
});
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
