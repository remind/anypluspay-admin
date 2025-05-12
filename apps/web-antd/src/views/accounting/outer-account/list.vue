<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCodeNameValues } from '#/api';
import { requestClient } from '#/api/request';

import UpdateStatusFormDrawer from './update-status.vue';

const router = useRouter();

const urlPrefix = '/account/outer-account';
const allEnums = ref<any | null>(null);

onMounted(async () => {
  getCodeNameValues('denyStatus').then((response) => {
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
      fieldName: 'memberId',
      label: '会员ID',
    },
    {
      component: 'Input',
      fieldName: 'accountNo',
      label: '账户号',
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
    {
      field: 'accountNo',
      slots: { default: 'code' },
      title: '账户号',
      width: 260,
    },
    { field: 'memberId', title: '会员ID', align: 'left' },
    { field: 'accountType', title: '账户类型', align: 'left' },
    { field: 'accountName', title: '账户名称', align: 'left' },
    { field: 'denyStatusName', title: '禁止状态', align: 'left' },
    { field: 'currencyCode', title: '币种', align: 'left' },
    { field: 'balanceDirectionName', title: '余额方向', align: 'left' },
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
const [UpdateStatusDrawer, updateStatusDrawerApi] = useVbenDrawer({
  connectedComponent: UpdateStatusFormDrawer,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      gridApi.reload();
    }
  },
});

function changeDenyStatus(id: string) {
  updateStatusDrawerApi.setData({ allEnums: allEnums.value, id });
  updateStatusDrawerApi.open();
}

function showDetail(id: string) {
  router.push({ name: 'OuterAccountDetail', params: { id } });
}
</script>
<template>
  <Page auto-content-height>
    <UpdateStatusDrawer />
    <Grid>
      <template #code="{ row }">
        <Button type="link" @click="showDetail(row.accountNo)">
          {{ row.accountNo }}
        </Button>
      </template>
      <template #action="{ row }">
        <Button type="link" @click="changeDenyStatus(row.accountNo)">
          变更状态
        </Button>
      </template>
    </Grid>
  </Page>
</template>
