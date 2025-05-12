<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCodeNameValues } from '#/api';
import { requestClient } from '#/api/request';

import AddFormDrawer from './add.vue';
import EditFormDrawer from './edit.vue';

const allEnums = ref<any | null>(null);

const urlPrefix = '/account/account-title';

onMounted(async () => {
  getCodeNameValues('accountTitleType,balanceDirection,accountTitleScope').then(
    (response) => {
      allEnums.value = response;
    },
  );
});

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
      fieldName: 'code',
      label: '科目编码',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '科目名称',
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
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'code',
      slots: { default: 'code' },
      align: 'left',
      title: '编码',
    },
    { field: 'name', title: '名称', align: 'left' },
    { field: 'tier', title: '层级', align: 'left' },
    {
      field: 'leaf',
      title: '叶子节点',
      formatter({ cellValue }) {
        return cellValue ? '是' : '否';
      },
    },
    { field: 'parentCode', title: '父科目编码', align: 'left' },
    { field: 'typeName', title: '类型', align: 'left' },
    { field: 'balanceDirectionName', title: '余额方向', align: 'left' },
    { field: 'scopeName', title: '适用范围', align: 'left' },
    {
      field: 'enable',
      title: '状态',
      formatter({ cellValue }) {
        return cellValue ? '可用' : '禁用';
      },
    },
    { field: 'memo', title: '备注', align: 'left' },
    { field: 'gmtCreate', title: '创建时间', align: 'left' },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
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

function add(isRoot: boolean) {
  addDrawerApi.setData({ allEnums: allEnums.value, isRoot });
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
        <Button class="mr-2" type="primary" @click="add(true)">
          新增一级科目
        </Button>
        <Button class="mr-2" type="primary" @click="add(false)"> 新增 </Button>
        <Button class="mr-2" type="primary" @click="gridApi.reload()">
          刷新
        </Button>
      </template>
      <template #code="{ row }">
        <Button type="link" @click="edit(row.code)">{{ row.code }}</Button>
      </template>
      <template #action="{ row }">
        <Popconfirm title="确定删除？" @confirm="del(row.code)">
          <Button type="link">删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </Page>
</template>
