import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:navigation',
      order: 1,
      title: '订单查询',
    },
    name: 'OrderQuery',
    path: '/order-query',
    children: [
      {
        name: 'UnionQuery',
        path: '/query/union-qery',
        component: () => import('#/views/query/union-query.vue'),
        meta: {
          title: '联合查询',
          order: 1,
          keepAlive: true,
        },
      },
      {
        name: 'PaymentAcquirerOrder',
        path: '/payment/acquiring',
        component: () => import('#/views/payment/acquiring/list.vue'),
        meta: {
          title: '收单订单',
        },
      },
      {
        name: 'PaymentDepositOrder',
        path: '/payment/deposit',
        component: () => import('#/views/payment/deposit/list.vue'),
        meta: {
          title: '充值订单',
        },
      },
      {
        name: 'PaymentWithdrawOrder',
        path: '/payment/withdraw',
        component: () => import('#/views/payment/withdraw/list.vue'),
        meta: {
          title: '提现订单',
        },
      },
    ],
  },
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:form-select',
      order: 2,
      title: '渠道管理',
    },
    name: 'Channel',
    path: '/channel',
    children: [
      {
        name: 'FundChannelList',
        path: '/fund-channel/list',
        component: () => import('#/views/fund-channel/list.vue'),
        meta: {
          title: '资金渠道',
          keepAlive: true,
        },
      },
      {
        name: 'FundChannelDetail',
        path: '/fund-channel/detail/:code',
        component: () => import('#/views/fund-channel/detail.vue'),
        meta: {
          hideInMenu: true,
          title: '资金渠道详情',
          keepAlive: true,
        },
      },
    ],
  },
  {
    component: BasicLayout,
    meta: {
      icon: 'carbon:settings',
      order: 3,
      title: '支付配置',
    },
    name: 'PayConfig',
    path: '/pay-config',
    children: [
      {
        name: 'InstManager',
        path: '/inst/list',
        component: () => import('#/views/pay-config/inst/list.vue'),
        meta: {
          title: '机构管理',
        },
      },
      {
        name: 'PaymthodManager',
        path: '/pay-method/list',
        component: () => import('#/views/pay-config/pay-method/list.vue'),
        meta: {
          title: '支付方式',
        },
      },
    ],
  },
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:shield-key-outline',
      order: 50,
      title: '会计中心',
    },
    name: 'Accounting',
    path: '/accounting',
    children: [
      {
        name: 'AccountTitleManager',
        path: '/account-title/list',
        component: () => import('#/views/accounting/account-title/list.vue'),
        meta: {
          title: '科目管理',
          keepAlive: true,
        },
      },
      {
        name: 'InnerAccountManager',
        path: '/inner-account/list',
        component: () => import('#/views/accounting/inner-account/list.vue'),
        meta: {
          title: '内部账户',
          keepAlive: true,
        },
      },
      {
        name: 'OuterAccountManager',
        path: '/outer-account/list',
        component: () => import('#/views/accounting/outer-account/list.vue'),
        meta: {
          title: '外部账户',
          keepAlive: true,
        },
      },
      {
        name: 'OuterAccountDetail',
        path: '/outer-account/detail/:id',
        component: () => import('#/views/accounting/outer-account/detail.vue'),
        meta: {
          hideInMenu: true,
          title: '外部账户详情',
          keepAlive: true,
        },
      },
      {
        name: 'AccountRegister',
        path: '/register/account-register',
        component: () =>
          import('#/views/accounting/register/account-register.vue'),
        meta: {
          title: '登账操作',
          keepAlive: true,
        },
      },
      {
        name: 'AccountingDailyList',
        path: '/daily/list',
        component: () => import('#/views/accounting/daily/list.vue'),
        meta: {
          title: '试算平衡',
          keepAlive: true,
        },
      },
    ],
  },
  {
    component: BasicLayout,
    meta: {
      icon: 'ion:layers-outline',
      order: 55,
      title: '账务管理',
    },
    name: 'Account',
    path: '/account',
    children: [
      {
        name: 'AccountDetailOuterList',
        path: '/account-detail/outer-list',
        component: () =>
          import('#/views/account/account-detail/outer-list.vue'),
        meta: {
          title: '外部户明细',
          keepAlive: true,
        },
      },
      {
        name: 'AccountDetailInnerList',
        path: '/account-detail/inner-list',
        component: () =>
          import('#/views/account/account-detail/inner-list.vue'),
        meta: {
          title: '内部户明细',
          keepAlive: true,
        },
      },
    ],
  },
  {
    component: BasicLayout,
    meta: {
      icon: 'carbon:settings',
      order: 65,
      title: '系统配置',
    },
    name: 'SystemManager',
    path: '/system',
    children: [
      {
        name: 'SysUserManager',
        path: '/user/list',
        component: () => import('#/views/system/user/list.vue'),
        meta: {
          title: '系统用户',
        },
      },
    ],
  },
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      order: 100,
      title: '支付示例',
    },
    name: 'Demo',
    path: '/demo',
    children: [
      {
        name: 'PayDemo',
        path: '/demo/pay',
        component: () => import('#/views/demo/pay.vue'),
        meta: {
          title: '支付测试',
        },
      },
      {
        name: 'DepositDemo',
        path: '/demo/deposit',
        component: () => import('#/views/demo/deposit.vue'),
        meta: {
          title: '充值测试',
        },
      },
      {
        name: 'WithdrawDemo',
        path: '/demo/withdraw',
        component: () => import('#/views/demo/withdraw.vue'),
        meta: {
          title: '提现测试',
        },
      },
    ],
  },
];

export default routes;
