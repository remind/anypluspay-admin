<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

import AddFormDrawer from './add.vue';
import EditFormDrawer from './edit.vue';

const urlPrefix = '/account/inner-account';

/**
 * 获取数据列表
 */
async function getDataList(params: any) {
  return requestClient.get(`${urlPrefix}/list`, { params });
}
/**
 * 删除
 * @param code
 */
async function del(code: string) {
  await requestClient.get(`${urlPrefix}/delete`, { params: { code } });
  gridApi.reload();
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'accountNo',
      label: '账户号',
    },
    {
      component: 'Input',
      fieldName: 'titleCode',
      label: '科目号',
    },
    {
      component: 'Input',
      fieldName: 'accountName',
      label: '账户名称',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { field: 'accountNo', title: '账户号', align: 'left', width: 200 },
    { field: 'titleCode', title: '科目号', align: 'left' },
    { field: 'accountName', title: '账户名称', align: 'left' },
    { field: 'currencyCode', title: '币种', align: 'left' },
    { field: 'balance', title: '余额', align: 'left' },
    { field: 'gmtCreate', title: '创建时间', align: 'left' },
    { field: 'gmtModified', title: '修改时间', align: 'left' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 200,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const data = await getDataList({
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

function add() {
  addDrawerApi.open();
}

function edit(id: string) {
  editDrawerApi.setData({ id });
  editDrawerApi.open();
}
</script>
<template>
  <Page auto-content-height>
    <EditDrawer />
    <AddDrawer />
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="add()"> 新增 </Button>
        <Button class="mr-2" type="primary" @click="gridApi.reload()">
          刷新
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="edit(row.accountNo)">编辑</Button> |
        <Popconfirm title="确定删除？" @confirm="del(row.code)">
          <Button type="link">删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </Page>
</template>
