// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const navigation = [
  {
    icon: 'tabler:smart-home',
    title: 'Dashboards',
    children: [
      {
        icon: 'tabler:chart-pie-2',
        title: 'Analytics',
        path: '/dashboards/analytics'
      },
      {
        icon: 'tabler:device-analytics',
        title: 'CRM',
        path: '/dashboards/crm'
      },
      {
        icon: 'tabler:shopping-cart',
        title: 'eCommerce',
        path: '/dashboards/ecommerce'
      }
    ]
  },
  {
    icon: 'tabler:layout-grid-add',
    title: 'Orders',
    children: [
      {
        title: 'Orders',
        icon: 'tabler:file-dollar',
        children: [
          {
            title: 'List',
            path: '/apps/invoice/list'
          }
        ]
      },
      {
        title: 'Traders',
        icon: 'tabler:user',
        children: [
          {
            title: 'List',
            path: '/apps/user/list'
          }
        ]
      },
      {
        title: 'Roles & Permissions',
        icon: 'tabler:settings',
        children: [
          {
            title: 'Roles',
            path: '/apps/roles'
          },
          {
            title: 'Permissions',
            path: '/apps/permissions'
          }
        ]
      }
    ]
  }
]
mock.onGet('/api/horizontal-nav/data').reply(() => {
  return [200, navigation]
})
