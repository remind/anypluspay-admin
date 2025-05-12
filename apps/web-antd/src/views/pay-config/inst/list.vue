<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Button, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCodeNameValues } from '#/api';
import { requestClient } from '#/api/request';

import AddFormDrawer from './add.vue';
import EditFormDrawer from './edit.vue';

const instEnums = ref<any | null>(null);

onMounted(async () => {
  getCodeNameValues('instAbility').then((response) => {
    instEnums.value = response;
  });
});

async function getList(params: any) {
  return requestClient.get('/institution/list', {
    params,
  });
}

const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'code',
      label: '机构编码',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<any> = {
  columns: [
    { field: 'code', title: '编码', sortable: true },
    { field: 'name', title: '名称' },
    { field: 'instAbilityName', title: '能力' },
    { field: 'memo', title: '备注' },
    { field: 'gmtCreate', title: '创建时间' },
    { field: 'gmtModified', title: '修改时间' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 180,
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const data = await getList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        return data;
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });
const [EditDrawer, editDrawerApi] = useVbenDrawer({
  connectedComponent: EditFormDrawer,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      gridApi.reload();
    }
  },
});

const [AddDrawer, addDrawerApi] = useVbenDrawer({
  connectedComponent: AddFormDrawer,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      gridApi.reload();
    }
  },
});

function edit(code: string) {
  editDrawerApi.setData({ code, instEnums: instEnums.value });
  editDrawerApi.open();
}

function add() {
  addDrawerApi.setData({ instEnums: instEnums.value });
  addDrawerApi.open();
}

async function del(code: string) {
  await requestClient.get('/institution/delete', { params: { code } });
  gridApi.reload();
}
</script>
<template>
  <div>
    <EditDrawer />
    <AddDrawer />
    <Grid table-title="机构列表">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="add"> 新增 </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="edit(row.code)">编辑</Button> |
        <Popconfirm title="确定删除？" @confirm="del(row.code)">
          <Button type="link">删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </div>
</template>
