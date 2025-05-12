<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useTabs } from '@vben/hooks';

import { Card, Descriptions, DescriptionsItem, Divider } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

const route = useRoute();
const { setTabTitle } = useTabs();
const accountNo = computed(() => {
  return (route.params?.id as string) ?? '';
});

setTabTitle(`${accountNo.value} - 账户详情`);

const data = ref<any | null>(null);

onMounted(async () => {
  requestClient
    .get('/account/outer-account/detail', {
      params: { accountNo: `${accountNo.value}` },
    })
    .then((response) => {
      data.value = response;
      gridApi.setGridOptions({ data: response.outerSubAccounts });
    });
});
const gridOptions: VxeGridProps<any> = {
  columns: [
    { field: 'fundType', title: '类型' },
    { field: 'balance', title: '余额' },
    { field: 'availableBalance', title: '可用余额' },
    { field: 'gmtCreate', title: '创建时间' },
    { field: 'gmtModified', title: '修改时间' },
  ],
  pagerConfig: {
    enabled: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>
<template>
  <Page auto-content-height>
    <EditDrawer />
    <Card>
      <Descriptions
        v-if="data"
        title="基本信息"
        :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
        size="small"
      >
        <DescriptionsItem label="账户号">
          {{ data?.accountNo }}
        </DescriptionsItem>
        <DescriptionsItem label="科目">{{ data?.titleCode }}</DescriptionsItem>
        <DescriptionsItem label="账户名称">
          {{ data?.accountName }}
        </DescriptionsItem>
        <DescriptionsItem label="会员ID">{{ data?.memberId }}</DescriptionsItem>
        <DescriptionsItem label="禁止状态">
          {{ data?.denyStatusName }}
        </DescriptionsItem>
        <DescriptionsItem label="类型">
          {{ data?.accountAttributeName }}
        </DescriptionsItem>
        <DescriptionsItem label="余额方向">
          {{ data?.balanceDirectionName }}
        </DescriptionsItem>
        <DescriptionsItem label="币种">
          {{ data?.currencyCode }}
        </DescriptionsItem>
        <DescriptionsItem label="创建时间">
          {{ data?.gmtCreate }}
        </DescriptionsItem>
        <DescriptionsItem label="最后修改时间">
          {{ data?.gmtModified }}
        </DescriptionsItem>
      </Descriptions>
      <Divider />
      <Grid table-title="子户列表" />
    </Card>
  </Page>
</template>
