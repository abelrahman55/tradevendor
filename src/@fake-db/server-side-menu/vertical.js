// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const navigation = [
  {
    title: 'Dashboards',
    icon: 'tabler:smart-home',
    badgeContent: 'new',
    badgeColor: 'error',
    children: [
      {
        title: 'Analytics',
        path: '/dashboards/analytics'
      }
    ]
  },
  {
    sectionTitle: 'Apps & Pages'
  },

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
mock.onGet('/api/vertical-nav/data').reply(() => {
  return [200, navigation]
})
