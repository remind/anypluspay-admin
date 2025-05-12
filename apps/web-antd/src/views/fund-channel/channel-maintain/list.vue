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
  return requestClient.get('/channel-maintain/list', {
    params,
  });
}

const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'DatePicker',
      fieldName: 'gmtStart',
      label: '创建时间开始',
    },
    {
      component: 'DatePicker',
      fieldName: 'gmtEnd',
      label: '创建时间结束',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<any> = {
  columns: [
    { field: 'maintainTimeTypeName', title: '维护时间类型', sortable: true },
    { field: 'timeRange', title: '时间区间' },
    { field: 'memo', title: '备注' },
    { field: 'gmtCreate', title: '创建时间' },
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
          gmtStart: formValues.gmtStart
            ? formValues.gmtStart.format('YYYY-MM-DD')
            : null,
          gmtEnd: formValues.gmtEnd
            ? formValues.gmtEnd.format('YYYY-MM-DD')
            : null,
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
  await requestClient.get('/channel-maintain/delete', { params: { id } });
  gridApi.reload();
}
</script>
<template>
  <div>
    <EditDrawer />
    <AddDrawer />
    <Grid table-title="维护时间列表">
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
