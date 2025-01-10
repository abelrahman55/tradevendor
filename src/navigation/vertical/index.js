const navigation = () => {
  return [
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

    // {
    //   title: 'Orders',
    //   icon: 'tabler:file-dollar',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/invoice/list'
    //     }
    //   ]
    // },
    // {
    //   title: 'Categories',
    //   title_ar: 'الفئات الفرعيه',
    //   icon: 'tabler:file-dollar',
    //   path: '/Categories'
    // },
    {
      title: 'Branches',
      title_ar: 'فروع المتجر',
      icon: 'tabler:file-dollar',
      path: '/Branches'
    },
    {
      title: 'Magazines',
      title_ar: 'المجلات',
      icon: 'tabler:file-dollar',
      path: '/Magazines'
    },
    {
      title: 'Admins',
      title_ar: 'مستخدمين الداشبورد',
      icon: 'tabler:file-dollar',
      path: '/Admins'
    },
    {
      title: 'Orders',
      title_ar: 'الطلبات',
      icon: 'tabler:file-dollar',
      path: '/Orders'
    }
  ]
}

export default navigation
