// ** Demo Components Imports
import { useRouter } from 'next/router'
import Preview from 'src/views/apps/invoice/preview/Preview'

const InvoicePreview = () => {
  const router = useRouter()
  const orderID = router.query.orderID

  return <Preview id={orderID} />
}

export default InvoicePreview
