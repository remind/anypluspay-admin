<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenDrawer } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import {
  Button,
  Card,
  Descriptions,
  DescriptionsItem,
  Divider,
  TabPane,
  Tabs,
} from 'ant-design-vue';

import { getCodeNameValues } from '#/api';
import { requestClient } from '#/api/request';

import ApiResultCode from './api-result-code/list.vue';
import ChannelApi from './channel-api/list.vue';
import ChannelMaintain from './channel-maintain/list.vue';
import ChannelSupportInst from './channel-support-inst/list.vue';
import EditFormDrawer from './edit.vue';

const route = useRoute();
const { setTabTitle } = useTabs();
const currentChannelCode = computed(() => {
  return (route.params?.code as string) ?? '';
});

setTabTitle(`${currentChannelCode.value} - 渠道详情`);

const channelData = ref<any | null>(null);
const channelAllEnums = ref<any | null>(null);

async function getFundChannelDetail(code: string) {
  return requestClient.get('/fund-channel/detail', { params: { code } });
}

async function loadData() {
  getFundChannelDetail(`${currentChannelCode.value}`).then((response) => {
    channelData.value = response;
  });
}

onMounted(async () => {
  getCodeNameValues(
    'channelApiType,requestType,cardType,instOrderStatus,maintainTimeType',
  ).then((response) => {
    channelAllEnums.value = response;
  });
  loadData();
});

const [EditDrawer, editDrawerApi] = useVbenDrawer({
  connectedComponent: EditFormDrawer,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      loadData();
    }
  },
});

async function edit() {
  editDrawerApi.setData({
    code: currentChannelCode.value,
    channelEnums: channelAllEnums.value,
  });
  editDrawerApi.open();
}
</script>
<template>
  <Page auto-content-height>
    <EditDrawer />
    <Card>
      <Descriptions
        v-if="channelData"
        title="基本信息"
        :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
        size="small"
      >
        <template #extra>
          <Button type="primary" @click="edit()">编辑</Button>
        </template>
        <DescriptionsItem label="渠道编码">
          {{ channelData?.code }}
        </DescriptionsItem>
        <DescriptionsItem label="渠道名称">
          {{ channelData?.name }}
        </DescriptionsItem>
        <DescriptionsItem label="是否可用">
          {{ channelData?.enable ? '可用' : '禁用' }}
        </DescriptionsItem>
        <DescriptionsItem label="机构编码">
          {{ channelData?.instCode }}
        </DescriptionsItem>
        <DescriptionsItem label="渠道类型">
          {{ channelData?.requestTypeName }}
        </DescriptionsItem>
        <DescriptionsItem label="支付方式">
          {{ channelData?.payMethods }}
        </DescriptionsItem>
        <DescriptionsItem label="流入待清算账户">
          {{ channelData?.inClearingAccount }}
        </DescriptionsItem>
        <DescriptionsItem label="流出待清算账户">
          {{ channelData?.outClearingAccount }}
        </DescriptionsItem>
        <DescriptionsItem label="扩展参数">
          {{ channelData?.extra }}
        </DescriptionsItem>
        <DescriptionsItem label="备注">
          {{ channelData?.memo }}
        </DescriptionsItem>
        <DescriptionsItem label="创建时间">
          {{ channelData?.gmtCreate }}
        </DescriptionsItem>
        <DescriptionsItem label="最后修改时间">
          {{ channelData?.gmtModified }}
        </DescriptionsItem>
      </Descriptions>
      <Divider />
      <Tabs type="card">
        <TabPane key="1" tab="支持机构">
          <ChannelSupportInst
            :channel-code="currentChannelCode"
            :channel-enums="channelAllEnums"
          />
        </TabPane>
        <TabPane key="2" tab="渠道接口">
          <ChannelApi
            :channel-code="currentChannelCode"
            :channel-enums="channelAllEnums"
          />
        </TabPane>
        <TabPane key="3" tab="结果码">
          <ApiResultCode
            :channel-code="currentChannelCode"
            :channel-enums="channelAllEnums"
          />
        </TabPane>
        <TabPane key="4" tab="维护时间">
          <ChannelMaintain
            :channel-code="currentChannelCode"
            :channel-enums="channelAllEnums"
          />
        </TabPane>
      </Tabs>
    </Card>
  </Page>
</template>
