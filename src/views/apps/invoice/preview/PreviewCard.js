// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Translation Objects
const translations = {
  en: {
    changeOrderStatus: 'Change Order Status',
    assignDriverCompany: 'Assign Driver/Company',
    orderStatus: 'Order Status',
    driver: 'Driver',
    company: 'Company',
    cancel: 'Cancel',
    save: 'Save',
    assign: 'Assign',
    customer: 'Customer',
    phone: 'Phone',
    location: 'Location',
    orderStatusLabel: 'Order Status',
    orderValue: 'Order Value',
    salesperson: 'Salesperson',
    notAssigned: 'Not Assigned',
    thanksForBusiness: 'Thanks for your business',
    orderID: 'Order ID',
    createdAt: 'Created At:',
    updatedAt: 'Updated At:',
    orderTotal: 'Order Total:',
    productName: 'Product Name',
    description: 'Description',
    quantity: 'Quantity',
    price: 'Price',
    totalPrice: 'Total Price',
    none: 'None',
    pending: 'Pending',
    canceled: 'Canceled',
    rejected: 'Rejected',
    confirmed: 'Approved',
    onDelivery: 'In Delivery',
    orderStatusTooltip: 'Change the status of the order',
    assignTooltip: 'Assign a driver or company to the order',
    orderStatusChangeSuccess: 'Order status updated successfully',
    orderStatusChangeError: 'Failed to update order status',
    assignSuccess: 'Order assigned successfully',
    assignError: 'Failed to assign order'
  },
  ar: {
    changeOrderStatus: 'تغيير حالة الطلب',
    assignDriverCompany: 'تعيين السائق/الشركة',
    orderStatus: 'حالة الطلب',
    driver: 'السائق',
    company: 'الشركة',
    cancel: 'إلغاء',
    save: 'حفظ',
    assign: 'تعيين',
    customer: 'العميل',
    phone: 'الهاتف',
    location: 'الموقع',
    orderStatusLabel: 'حالة الطلب',
    orderValue: 'قيمة الطلب',
    salesperson: 'مندوب المبيعات',
    notAssigned: 'غير معين',
    thanksForBusiness: 'شكرًا لتعاملك معنا',
    orderID: 'معرف الطلب',
    createdAt: 'تاريخ الإنشاء:',
    updatedAt: 'تاريخ التحديث:',
    orderTotal: 'إجمالي الطلب:',
    productName: 'اسم المنتج',
    description: 'الوصف',
    quantity: 'الكمية',
    price: 'السعر',
    totalPrice: 'السعر الإجمالي',
    none: 'لا شيء',
    pending: 'قيد الانتظار',
    canceled: 'ملغي',
    rejected: 'مرفوض',
    confirmed: 'موافق عليه',
    onDelivery: 'في التسليم',
    orderStatusTooltip: 'تغيير حالة الطلب',
    assignTooltip: 'تعيين سائق أو شركة للطلب',
    orderStatusChangeSuccess: 'تم تحديث حالة الطلب بنجاح',
    orderStatusChangeError: 'فشل في تحديث حالة الطلب',
    assignSuccess: 'تم تعيين الطلب بنجاح',
    assignError: 'فشل في تعيين الطلب'
  }
}

// ** Styled Components
const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

// ** Function to format the date
const formatDate = dateStr => {
  const dateObj = new Date(dateStr)

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
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

const PreviewCard = ({ data, getOrders }) => {
  // ** State
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [orderStatus, setOrderStatus] = useState(data.order_status)
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedDriver, setSelectedDriver] = useState('')
  const [assignToDriver, setAssignToDriver] = useState(true) // Switch between assigning to driver or company
  const [companies, setCompanies] = useState([])
  const [drivers, setDrivers] = useState([])
  const [assignLoading, setAssignLoading] = useState(false)
  const [changeStatusLoading, setChangeStatusLoading] = useState(false)

  const theme = useTheme()

  // ** Translation
  const lang = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'en' : 'en'
  const t = translations[lang] || translations.en

  // ** Fetch Companies
  const getCompanies = () => {
    axios
      .get('https://camp-coding.site/tradeoffer/api/' + `drive_companies/get_all`)
      .then(res => {
        if (Array.isArray(res.data.data)) {
          setCompanies(res.data.data)
          if (res.data.data.length > 0) {
            setSelectedCompany(res.data.data[0]?.id)
          }
        }
      })
      .catch(e => console.log(e))
  }

  // ** Fetch Drivers
  const getDrivers = () => {
    axios
      .get('https://camp-coding.site/tradeoffer/api/' + `drivers/get_ind_drivers`)
      .then(res => {
        if (Array.isArray(res.data.data)) {
          setDrivers(res.data.data)
          if (res.data.data.length > 0) {
            setSelectedDriver(res.data.data[0]?.id)
          }
        }
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getCompanies()
    getDrivers()
  }, [])

  // ** Handle Change Order Status
  const handleChangeStatus = () => {
    setChangeStatusLoading(true)
    const data_send = { new_status: orderStatus }
    axios
      .post('https://camp-coding.site/tradeoffer/api/' + `orders/change_status/${data.id}`, data_send)
      .then(res => {
        getOrders()
        if (res.data.status === 'success') {
          toast.success(t.orderStatusChangeSuccess)
          setShowStatusModal(false)
          getOrders()
        } else {
          toast.error(res.data.message || t.orderStatusChangeError)
        }
      })
      .catch(e => {
        console.log(e)
        toast.error(t.orderStatusChangeError)
      })
      .finally(() => setChangeStatusLoading(false))
  }

  // ** Handle Assign
  const handleAssign = () => {
    setAssignLoading(true)

    const data_send = assignToDriver ? { driver_id: selectedDriver } : { company_id: selectedCompany }

    axios
      .post('https://camp-coding.site/tradeoffer/api/' + `assign_orders/assign_order/${data.id}`, data_send)
      .then(res => {
        getOrders()
        if (res.data.status === 'success') {
          toast.success(t.assignSuccess)
          setShowAssignModal(false)
          getOrders()
        } else {
          toast.error(res.data.message || t.assignError)
        }
      })
      .catch(e => {
        console.log(e)
        toast.error(t.assignError)
      })
      .finally(() => setAssignLoading(false))
  }

  return (
    <Card
      sx={{
        padding: 4
      }}
    >
      <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
        {/* Status Change and Assign Buttons */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant='contained' onClick={() => setShowStatusModal(true)}>
              {t.changeOrderStatus}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant='contained' onClick={() => setShowAssignModal(true)}>
              {t.assignDriverCompany}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    {/* SVG content remains unchanged */}
                  </svg>
                  <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px' }}>
                    {data?.products[0]?.product?.store?.name_en || t.none}
                  </Typography>
                </Box>
                <div>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                    {t.customer}: {data?.user?.name || t.none}
                  </Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                    {t.phone}: {data.phone || t.none}
                  </Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                    {t.location}: {data.location || t.none}
                  </Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                    {t.orderStatusLabel}: {t[data.order_status] || data.order_status}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {t.orderValue}: ${data.order_value}
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '210px' }}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h4'>{t.orderID}</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h4'>{`#${data.id}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{t.createdAt}</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{formatDate(data.created_at)}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{t.updatedAt}</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography sx={{ color: 'text.secondary' }}>{formatDate(data.updated_at)}</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t.productName}</TableCell>
                <TableCell>{t.description}</TableCell>
                <TableCell>{t.quantity}</TableCell>
                <TableCell>{t.price}</TableCell>
                <TableCell>{t.totalPrice}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableCell-root': {
                  py: `${theme.spacing(2.5)} !important`,
                  fontSize: theme.typography.body1.fontSize
                }
              }}
            >
              {data.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.product.name_en || t.none}</TableCell>
                  <TableCell>{product.product.description_en || t.none}</TableCell>
                  <TableCell>{product.quantity || 0}</TableCell>
                  <TableCell>${product.item_price || 0}</TableCell>
                  <TableCell>${product.total_price || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t.salesperson}:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {data.salesperson ? data.salesperson : t.notAssigned}
                </Typography>
              </Box>

              <Typography sx={{ color: 'text.secondary' }}>{t.thanksForBusiness}</Typography>
            </Grid>
            <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <CalcWrapper>
                <Typography sx={{ color: 'text.secondary' }}>{t.orderTotal}</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>${data.order_value || 0}</Typography>
              </CalcWrapper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Status Modal */}
      <Dialog open={showStatusModal} onClose={() => setShowStatusModal(false)}>
        <DialogTitle>{t.changeOrderStatus}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label={t.orderStatus}
            value={orderStatus}
            onChange={e => setOrderStatus(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value='pending'>{t.pending}</MenuItem>
            <MenuItem value='canceled'>{t.canceled}</MenuItem>
            <MenuItem value='rejected'>{t.rejected}</MenuItem>
            <MenuItem value='confirmed'>{t.confirmed}</MenuItem>
            <MenuItem value='on_delivery'>{t.onDelivery}</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusModal(false)}>{t.cancel}</Button>
          <Button
            onClick={handleChangeStatus}
            disabled={changeStatusLoading}
            startIcon={changeStatusLoading && <CircularProgress size={16} />}
          >
            {t.save}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Modal */}
      <Dialog open={showAssignModal} onClose={() => setShowAssignModal(false)}>
        <DialogTitle>{t.assignDriverCompany}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch checked={assignToDriver} onChange={() => setAssignToDriver(!assignToDriver)} color='primary' />
            }
            label={assignToDriver ? t.driver : t.company}
          />

          {assignToDriver ? (
            <TextField
              select
              fullWidth
              label={t.driver}
              value={selectedDriver}
              onChange={e => setSelectedDriver(e.target.value)}
              sx={{ mt: 2 }}
            >
              {drivers.map(driver => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.name}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              select
              fullWidth
              label={t.company}
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
              sx={{ mt: 2 }}
            >
              {companies.map(company => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAssignModal(false)}>{t.cancel}</Button>
          <Button
            onClick={handleAssign}
            disabled={assignLoading}
            startIcon={assignLoading && <CircularProgress size={16} />}
          >
            {t.assign}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default PreviewCard
