<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Dropdown, Menu, MenuItem, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCodeNameValues } from '#/api';
import { requestClient } from '#/api/request';

import AddFormDrawer from './add.vue';
import UpdateFormDrawer from './edit.vue';

const urlPrefix = '/payment/pay-method';

const allEnums = ref<any | null>(null);

onMounted(async () => {
  getCodeNameValues('payModel,assetType,payMethodStatus').then((response) => {
    allEnums.value = response;
  });
});

/**
 * 获取数据列表
 */
async function getDataList(params: any) {
  return requestClient.get(`${urlPrefix}/list`, { params });
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'code',
      label: '编码',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
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
    labelField: 'id',
  },
  columns: [
    { field: 'code', title: '编码', align: 'left' },
    { field: 'name', title: '名称', align: 'left' },
    { field: 'payModelName', title: '支付模式', align: 'left' },
    { field: 'assetTypeName', title: '资产类型', align: 'left' },
    { field: 'payInst', title: '支付机构', align: 'left' },
    { field: 'statusName', title: '状态', align: 'left' },
    { field: 'gmtCreate', title: '创建时间', align: 'left' },
    { field: 'gmtModified', title: '修改时间', align: 'left' },
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

const [AddDrawer, addDrawerApi] = useVbenDrawer({
  connectedComponent: AddFormDrawer,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      gridApi.reload();
    }
  },
});
function add() {
  addDrawerApi.setData({
    allEnums: allEnums.value,
  });
  addDrawerApi.open();
}

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  connectedComponent: UpdateFormDrawer,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      gridApi.reload();
    }
  },
});

function openEditForm(code: string) {
  editDrawerApi.setData({ allEnums: allEnums.value, code });
  editDrawerApi.open();
}

async function del(code: string) {
  await requestClient.get(`${urlPrefix}/delete`, { params: { code } });
  gridApi.reload();
}
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="add"> 新增 </Button>
        <Button class="mr-2" type="primary" @click="gridApi.reload()">
          刷新
        </Button>
      </template>
      <template #action="{ row }">
        <Dropdown>
          <Button type="link">操作 </Button>
          <template #overlay>
            <Menu>
              <MenuItem @click="openEditForm(row.code)">编辑</MenuItem>
              <Popconfirm
                :title="`确定删除${row.code}吗？`"
                @confirm="del(row.code)"
              >
                <MenuItem>删除</MenuItem>
              </Popconfirm>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </Grid>
    <AddDrawer />
    <EditDrawer />
  </Page>
</template>
