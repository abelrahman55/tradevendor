// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import { Dialog, DialogTitle, Button, DialogContent, DialogActions } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Axios Import
import axios from 'axios'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Date Picker Wrapper
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import styled from '@emotion/styled'
import toast from 'react-hot-toast'
import { BASE_URL } from 'src/constants'

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

// ** Vars for order status
const orderStatusObj = {
  canceled: { color: 'error', icon: 'tabler:alert-circle' },
  completed: { color: 'success', icon: 'tabler:circle-check' },
  pending: { color: 'warning', icon: 'tabler:clock' }
}

// ** Translation objects
const translations = {
  en: {
    filters: 'Filters',
    orderStatus: 'Order Status',
    none: 'None',
    completed: 'Completed',
    pending: 'Pending',
    canceled: 'Canceled',
    orderDate: 'Order Date',
    view: 'View',
    orderId: 'Order ID',
    vendorName: 'Vendor Name',
    phone: 'Phone',
    client: 'Client',
    orderValue: 'Order Value',
    orderDateLabel: 'Order Date',
    status: 'Status',
    actions: 'Actions',
    categoriesManagement: 'Categories Management',
    searchPlaceholder: 'Search...',
    addNewCategory: 'Add New Category',
    editCategory: 'Edit Category',
    add: 'Add',
    update: 'Update',
    cancel: 'Cancel',
    confirm: 'Confirm',
    arabicName: 'Arabic Name',
    englishName: 'English Name',
    arabicImage: 'Arabic Image',
    englishImage: 'English Image',
    errorUploadingImage: 'Error uploading image',
    errorUploading: 'An error occurred during the upload',
    errorFetchingOrders: 'An error occurred while fetching orders',
    ordersFetchedSuccess: 'Orders fetched successfully'

    // Add more translations as needed
  },
  ar: {
    filters: 'الفلاتر',
    orderStatus: 'حالة الطلب',
    none: 'لا شيء',
    completed: 'مكتمل',
    pending: 'قيد الانتظار',
    canceled: 'ملغي',
    orderDate: 'تاريخ الطلب',
    view: 'عرض',
    orderId: 'معرف الطلب',
    vendorName: 'اسم البائع',
    phone: 'الهاتف',
    client: 'العميل',
    orderValue: 'قيمة الطلب',
    orderDateLabel: 'تاريخ الطلب',
    status: 'الحالة',
    actions: 'الإجراءات',
    categoriesManagement: 'إدارة الفئات',
    searchPlaceholder: 'بحث...',
    addNewCategory: 'إضافة فئة جديدة',
    editCategory: 'تعديل الفئة',
    add: 'إضافة',
    update: 'تحديث',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    arabicName: 'الاسم بالعربية',
    englishName: 'الاسم بالإنجليزية',
    arabicImage: 'الصورة بالعربية',
    englishImage: 'الصورة بالإنجليزية',
    errorUploadingImage: 'خطأ في تحميل الصورة',
    errorUploading: 'حدث خطأ أثناء التحميل',
    errorFetchingOrders: 'حدث خطأ أثناء جلب الطلبات',
    ordersFetchedSuccess: 'تم جلب الطلبات بنجاح'

    // Add more translations as needed
  }
}

// ** Function to get initials (assuming it's defined elsewhere)
const getInitials = name => {
  if (!name) return 'U'
  const names = name.split(' ')
  let initials = names[0].charAt(0).toUpperCase()
  if (names.length > 1) {
    initials += names[1].charAt(0).toUpperCase()
  }

  return initials
}

// ** renders client column
const renderClient = (row, t, theme) => {
  if (row.user?.name) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {row.user.name}
        </Typography>
      </Box>
    )
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme.typography.body1.fontSize }}
      >
        {getInitials('Unknown')}
      </CustomAvatar>
    )
  }
}

// ** Define default columns with translation support
const defaultColumns = (t, theme) => [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 100,
    headerName: t.orderId,
    renderCell: ({ row }) => (
      <Typography component={LinkStyled} href={`/apps/orders/preview/${row.id}`}>{`#${row.id}`}</Typography>
    )
  },
  {
    flex: 0.1,
    field: 'Vendor Name',
    minWidth: 150,
    headerName: t.vendorName,
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.secondary' }}>{row?.products[0]?.product?.store?.name_en || t.none}</Typography>
    )
  },
  {
    flex: 0.1,
    field: 'phone',
    minWidth: 150,
    headerName: t.phone,
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.phone || t.none}</Typography>
  },
  {
    flex: 0.25,
    field: 'user',
    minWidth: 200,
    headerName: t.client,
    renderCell: ({ row }) => renderClient(row, t, theme)
  },
  {
    flex: 0.1,
    field: 'order_value',
    minWidth: 100,
    headerName: t.orderValue,
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{`$${row.order_value}`}</Typography>
  },
  {
    flex: 0.15,
    field: 'created_at',
    minWidth: 200,
    headerName: t.orderDate,
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.created_at}</Typography>
  },
  {
    flex: 0.1,
    field: 'order_status',
    minWidth: 150,
    headerName: t.status,
    renderCell: ({ row }) => {
      const color = orderStatusObj[row.order_status] ? orderStatusObj[row.order_status].color : 'primary'

      return (
        <Tooltip title={row.order_status}>
          <CustomChip rounded size='small' skin='light' color={color} label={row.order_status} />
        </Tooltip>
      )
    }
  }
]

// ** Styled Input for Date Picker
const CustomInput = forwardRef((props, ref) => {
  const { start, end, dates, setDates, label, ...rest } = props
  const startDate = start !== null ? format(start, 'MM/dd/yyyy') : ''
  const endDate = end !== null ? ` - ${format(end, 'MM/dd/yyyy')}` : ''
  const value = `${startDate}${endDate !== '' ? endDate : ''}`

  if (start === null && dates.length) {
    setDates([])
  }

  return <CustomTextField fullWidth inputRef={ref} {...rest} label={label || ''} value={value} />
})

// ** InvoiceList Component with Multi-Language Support
const Orders = () => {
  // ** Retrieve the current language from localStorage or default to 'en'
  const lang = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'en' : 'en'

  // ** Destructure the appropriate translations based on the current language
  const t = translations[lang] || translations.en

  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [orders, setOrders] = useState([])
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)

  // ** Fetch orders
  const fetchOrders = async () => {
    const token = localStorage.getItem('accessToken') // Get access token from localStorage

    // Build query string with filters
    const params = new URLSearchParams()
    if (statusValue) params.append('status', statusValue)
    if (value) params.append('search', value)
    if (startDateRange && endDateRange) {
      params.append('startDate', format(startDateRange, 'yyyy-MM-dd'))
      params.append('endDate', format(endDateRange, 'yyyy-MM-dd'))
    }

    try {
      const response = await axios.get(`${BASE_URL}orders/store_orders/${storeData?.store_id ?? storeData?.id}`)
      console.log(response)
      if (response.data.status === 'success') {
        let fetchedOrders = response.data.data

        if (value && value.length) {
          fetchedOrders = fetchedOrders.filter(item => String(item.id) === String(value))
        }

        if (statusValue && statusValue.length) {
          fetchedOrders = fetchedOrders.filter(item => item.order_status === statusValue)
        }

        if (startDateRange && endDateRange) {
          fetchedOrders = fetchedOrders.filter(item => {
            const orderDate = new Date(item.created_at)

            if (isNaN(orderDate)) return false

            return orderDate >= startDateRange && orderDate <= endDateRange
          })
        }

        setOrders(fetchedOrders)

        toast.success(t.ordersFetchedSuccess)
      } else {
        toast.error(response.data.message || t.errorFetchingOrders)
      }
    } catch (error) {
      toast.error(t.errorFetchingOrders)
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [statusValue, value, dates])

  const handleFilter = val => {
    setValue(val)
  }

  const handleStatusValue = e => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  // ** Handle deletion of an order (if applicable)
  const handleDeleteOrder = async orderId => {
    // Implement deletion logic here if needed
    // For example:
    // try {
    //   await axios.delete(`https://camp-coding.site/tradeoffer/api/orders/delete/${orderId}?token=${token}`)
    //   toast.success('Order deleted successfully')
    //   fetchOrders()
    // } catch (error) {
    //   toast.error('Error deleting order')
    // }
  }

  // ** Open confirmation dialog
  const openConfirmDialog = (title, message, action) => {
    setConfirmTitle(title)
    setConfirmMessage(message)
    setConfirmAction(() => action)
    setConfirmDialog(true)
  }

  // ** Define table columns with translation support
  const columns = [
    ...defaultColumns(t),
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: t.actions,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={t.view}>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/apps/invoice/preview?orderID=${row.id}`}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
          {/* Uncomment below if delete functionality is needed
          <Tooltip title={t.delete}>
            <IconButton
              size='small'
              sx={{ color: 'error.main' }}
              onClick={() => {
                openConfirmDialog(
                  t.confirmDelete,
                  t.confirmDeleteMessage,
                  () => handleDeleteOrder(row.id)
                )
              }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
          */}
        </Box>
      )
    }
  ]

  return (
    <DatePickerWrapper>
      <Box
        sx={{
          padding: 4
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={t.filters} />
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      select
                      fullWidth
                      label={t.orderStatus}
                      value={statusValue}
                      onChange={handleStatusValue}
                    >
                      <MenuItem value=''>{t.none}</MenuItem>
                      <MenuItem value='recived'>{t.completed}</MenuItem>
                      <MenuItem value='pending'>{t.pending}</MenuItem>
                      <MenuItem value='canceled'>{t.canceled}</MenuItem>
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      isClearable
                      selectsRange
                      monthsShown={2}
                      endDate={endDateRange}
                      selected={startDateRange}
                      startDate={startDateRange}
                      shouldCloseOnSelect={false}
                      id='date-range-picker-months'
                      onChange={handleOnChangeRange}
                      customInput={
                        <CustomInput
                          dates={dates}
                          setDates={setDates}
                          label={t.orderDate}
                          end={endDateRange}
                          start={startDateRange}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
              <DataGrid
                autoHeight
                pagination
                rowHeight={62}
                rows={orders}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={rows => setSelectedRows(rows)}
                loading={false} // You can manage loading state if needed
              />
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>{confirmTitle}</DialogTitle>
        <DialogContent>
          <Typography>{confirmMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>{t.cancel}</Button>
          <Button
            onClick={() => {
              if (confirmAction) confirmAction()
              setConfirmDialog(false)
            }}
            color='primary'
          >
            {t.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </DatePickerWrapper>
  )
}

export default Orders
