<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Button, Popconfirm } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

const router = useRouter();

/**
 * 打开渠道详情页面
 * @param code
 */
function openFundChannelDetail(code: string) {
  router.push({ name: 'FundChannelDetail', params: { code } });
}

/**
 * 获取资金渠道列表
 */
async function getFundChannelList(params: any) {
  return requestClient.get('/fund-channel/list', { params });
}
/**
 * 删除渠道
 * @param code
 */
async function del(code: string) {
  await requestClient.get('/fund-channel/delete', { params: { code } });
  gridApi.reload();
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'code',
      label: '渠道编码',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '渠道名称',
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
      title: '编码',
    },
    { field: 'name', title: '名称', align: 'left' },
    { field: 'requestTypeName', title: '渠道类型', align: 'left' },
    { field: 'instCode', title: '机构', align: 'left' },
    { field: 'memo', title: '备注', align: 'left' },
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
        const data = await getFundChannelList({
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
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #code="{ row }">
        <Button type="link" @click="openFundChannelDetail(row.code)">
          {{ row.code }}
        </Button>
      </template>
      <template #action="{ row }">
        <Popconfirm title="确定删除？" @confirm="del(row.code)">
          <Button type="link">删除</Button>
        </Popconfirm>
      </template>
    </Grid>
  </Page>
</template>
