<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useVbenDrawer } from '@vben/common-ui';

import { Button, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

import AddFormDrawer from './add.vue';
import EditFormDrawer from './edit.vue';

const props = defineProps<{
  channelCode: string;
  channelEnums: Record<string, Array<Record<string, any>>>;
}>();

async function getList(params: any) {
  return requestClient.get('/api-result-code/list', {
    params,
  });
}

const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'apiType',
      label: '接口类型',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: '所有',
            value: '',
          },
          {
            label: '是',
            value: 'true',
          },
          {
            label: '否',
            value: 'false',
          },
        ],
      },
      fieldName: 'useMapping',
      defaultValue: '',
      label: '映射状态',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<any> = {
  columns: [
    { field: 'apiTypeName', title: '接口类型', sortable: true },
    { field: 'instApiCode', title: '机构结果码' },
    { field: 'instApiSubCode', title: '机构子结果码' },
    { field: 'instApiMessage', title: '机构消息' },
    { field: 'unityCode', title: '统一结果码' },
    { field: 'resultStatusName', title: '机构订单状态' },
    {
      field: 'useMapping',
      title: '映射',
      formatter({ cellValue }) {
        return cellValue ? '是' : '否';
      },
    },
    {
      field: 'reRouteEnable',
      title: '重路由',
      formatter({ cellValue }) {
        return cellValue ? '是' : '否';
      },
    },
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
          channelCode: props.channelCode,
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

function edit(id: Number) {
  editDrawerApi.setData({ id, channelEnums: props.channelEnums });
  editDrawerApi.open();
}

function add() {
  addDrawerApi.setData({
    channelCode: props.channelCode,
    channelEnums: props.channelEnums,
  });
  addDrawerApi.open();
}

async function del(id: Number) {
  await requestClient.get('/api-result-code/delete', { params: { id } });
  gridApi.reload();
}
</script>
<template>
  <div>
    <EditDrawer />
    <AddDrawer />
    <Grid table-title="API结果码列表">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="add"> 新增 </Button>
        <Button class="mr-2" type="primary" @click="gridApi.reload()">
          刷新
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="edit(row.id)">编辑</Button> |
        <Popconfirm title="确定删除？" @confirm="del(row.id)">
          <Button type="link">删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </div>
</template>
