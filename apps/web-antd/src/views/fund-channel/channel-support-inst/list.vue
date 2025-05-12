<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { watch } from 'vue';

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

const gridOptions: VxeGridProps<any> = {
  columns: [
    { field: 'targetInstCode', title: '目标机构', sortable: true },
    {
      field: 'cardTypeName',
      title: '卡类型',
      sortable: true,
      formatter({ cellValue }) {
        return cellValue || '所有';
      },
    },
    { field: 'extra', title: '扩展条件' },
    {
      field: 'perAmountRange',
      title: '单笔限额',
      sortable: true,
      formatter({ cellValue }) {
        return cellValue || '无限制';
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
  pagerConfig: {
    enabled: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  connectedComponent: EditFormDrawer,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      loadData();
    }
  },
});

const [AddDrawer, addDrawerApi] = useVbenDrawer({
  connectedComponent: AddFormDrawer,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      loadData();
    }
  },
});

async function loadData() {
  requestClient
    .get('/channel-support-inst/list', {
      params: { channelCode: props.channelCode },
    })
    .then((response) => {
      console.log(response);
      gridApi.setGridOptions({ data: response });
    });
}

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
  await requestClient.get('/channel-support-inst/delete', {
    params: { id },
  });
  loadData();
}

watch(
  () => props.channelEnums,
  async (channelEnum) => {
    if (channelEnum) {
      // 确保枚举数据已加载
      loadData();
    }
  },
  { immediate: true },
);
</script>
<template>
  <div>
    <EditDrawer />
    <AddDrawer />
    <Grid table-title="机构及限额列表">
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="add"> 新增 </Button>
        <Button class="mr-2" type="primary" @click="loadData"> 刷新 </Button>
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
