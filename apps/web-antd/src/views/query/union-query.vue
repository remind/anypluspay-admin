<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Card,
  Descriptions,
  DescriptionsItem,
  TabPane,
  Tabs,
  Tooltip,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { requestClient } from '#/api/request';

const searchParam = ref<any[]>([]);
const queryGroup = ref<any[]>([]);
const queryResult = ref<any>(null);
const activeTabKey = ref<any>(0);

onMounted(async () => {
  requestClient.get('/union-query/search-param').then((response) => {
    Object.entries(response).forEach(([key, value]) => {
      searchParam.value.push({
        label: value,
        value: key,
      });
    });
  });

  requestClient.get('/union-query/group').then((response) => {
    Object.entries(response).forEach(([key, value]) => {
      queryGroup.value.push({
        label: value,
        key: Number(key.slice(2)),
      });
    });
  });
});

const [QueryForm] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  resetButtonOptions: { show: false },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      component: 'Select',
      componentProps: {
        options: searchParam,
      },
      fieldName: 'inParamName',
      label: '订单号类型',
      defaultValue: 'paymentId',
      formItemClass: 'col-start-1',
    },
    {
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入订单号',
      },
      // 字段名
      fieldName: 'inParamValue',
      // 界面显示的label
      label: '订单号',
      formItemClass: 'col-start-1',
    },
  ],
  submitButtonOptions: {
    content: '查询',
  },
  actionWrapperClass: 'text-center',
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2',
});

function onSubmit(values: Record<string, any>) {
  requestClient
    .get('/union-query/query', {
      params: values,
    })
    .then((response) => {
      queryResult.value = response;
      console.log(Object.keys(response));
      let setActiveTabKey = false;
      queryGroup.value.forEach((item) => {
        if (setActiveTabKey) {
          return;
        }
        if (Object.keys(response).includes(item.key.toString())) {
          activeTabKey.value = item.key;
          setActiveTabKey = true;
        }
      });
    });
}
</script>

<template>
  <Page>
    <Card title="联合查询">
      <QueryForm />
      <Tabs v-model:active-key="activeTabKey">
        <TabPane v-for="tab in queryGroup" :key="tab.key" :tab="tab.label">
          <div
            v-if="queryResult != null && Object.hasOwn(queryResult, tab.key)"
          >
            <Card
              v-for="(r, indexResult) in queryResult[tab.key]"
              :title="r?.name"
              :key="indexResult"
              class="dataCard"
            >
              <div v-for="(item, index) in r.item" :key="index">
                <Descriptions
                  :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
                  size="small"
                >
                  <DescriptionsItem v-for="(v, k) in item" :key="k" :label="k">
                    <Tooltip :title="v" placement="top">
                      <span class="ellipsis">{{ v }}</span>
                    </Tooltip>
                  </DescriptionsItem>
                </Descriptions>
                <div
                  v-if="index < r.item.length - 1 && r.item.length > 1"
                  class="divider"
                ></div>
              </div>
            </Card>
          </div>
          <div v-else>无数据</div>
        </TabPane>
      </Tabs>
    </Card>
  </Page>
</template>

<style lang="css">
.dataCard {
  margin-top: 12px;
}

.dataCard .ant-descriptions .ant-descriptions-item-label {
  color: rgb(0 0 0 / 45%);
}

.dataCard .ant-card-head {
  min-height: 48px;
  padding: 0 12px;
  background: rgb(0 0 0 / 2%);
}

.dataCard .ant-card-head-title {
  font-size: 14px;
}

.dataCard .ant-card-body {
  padding: 12px;
}

.divider {
  margin: 12px 0; /* 设置上下间距 */
  border-top: 1px solid #e8e8e8; /* 定义横线样式 */
}

.ellipsis {
  display: inline-block;
  max-width: 200px; /* 设置最大宽度 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  vertical-align: middle;
  white-space: nowrap; /* 禁止换行 */
}
</style>
