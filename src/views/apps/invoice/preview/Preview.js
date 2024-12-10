// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/invoice/preview/PreviewCard'
import PreviewActions from 'src/views/apps/invoice/preview/PreviewActions'
import AddPaymentDrawer from 'src/views/apps/invoice/shared-drawer/AddPaymentDrawer'
import SendInvoiceDrawer from 'src/views/apps/invoice/shared-drawer/SendInvoiceDrawer'

const InvoicePreview = ({ id }) => {
  // ** State
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const [sendInvoiceOpen, setSendInvoiceOpen] = useState(false)

  const getOrders = () => {
    const token = localStorage.getItem('accessToken')

    if (!token) {
      console.error('Token is not available.')
      setError(true)

      return
    }

    axios
      .get('https://camp-coding.site/tradeoffer/api/orders/get_orders', {
        params: { token }
      })
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) {
          const foundOrder = res.data.data.find(order => order.id === parseInt(id))

          if (foundOrder) {
            setData(foundOrder)
            setError(false)
          } else {
            console.error('Order not found.')
            setData(null)
            setError(true)
          }
        } else {
          console.error('Invalid response data format.')
          setData(null)
          setError(true)
        }
      })
      .catch(error => {
        console.error('Error fetching orders:', error)
        setData(null)
        setError(true)
      })
  }

  useEffect(() => {
    // Fetch all orders data and filter for the specific order by ID

    getOrders()
  }, [id])

  const toggleSendInvoiceDrawer = () => setSendInvoiceOpen(!sendInvoiceOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)

  if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <PreviewCard data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <PreviewActions
              id={id}
              toggleAddPaymentDrawer={toggleAddPaymentDrawer}
              toggleSendInvoiceDrawer={toggleSendInvoiceDrawer}
              getOrders={getOrders}
            />
          </Grid>
        </Grid>
        {/* <SendInvoiceDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer} /> */}
        {/* <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} /> */}
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Order with the id: {id} does not exist. Please check the list of orders:{' '}
            <Link href='/apps/invoice/list'>Orders List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default InvoicePreview
