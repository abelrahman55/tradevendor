/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Select from '@mui/material/Select'

import { Menu, Preview, add, exitModal, eyeOff, eyeOn, search, edit } from 'src/constants/svgIcons'
import { useTranslation } from 'react-i18next'

import { Loader } from 'rsuite'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import { getInitials } from 'src/@core/utils/get-initials'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Icon, InputLabel, MenuItem, OutlinedInput } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { BASE_URL } from 'src/constants'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Link from 'next/link'
import { useRouter } from 'next/router'

const BranSubs = () => {
  const { query } = useRouter()
  console.log(query?.id)
  const { t } = useTranslation()
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  const [selectedSubs, setSelectedSubs] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [notAssign, setNotAssign] = useState([])

  const [selectedCategories, setSelectedCategories] = useState([])
  const [showUpStock, setShowUpStock] = useState(false)

  const [newBranch, setNewBranch] = useState({
    name_en: '',
    name_ar: '',
    meta: '',
    price: '',
    discount: '',
    in_stock: '',
    subcats: '',
    in_bran: 1,
    description_en: '',
    description_ar: ''
  })

  // const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false)
  const [editImg, setEditImg] = useState('')
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)
  const [categories, setCategoreis] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [showAddCatModal, setShowAddCatModal] = useState(false)
  const [changeStatusModal, setChangeStatusModal] = useState(false)
  const [rowData, setRowData] = useState({})
  const [updateModal, setUpdateModal] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [productData, setProductData] = useState({})
  const [product_id, set_product_id] = useState({})
  const [currentNumber, setCurrentNumber] = useState(null)
  const [loader, setLoader] = useState(false)

  const [searchValue, setSearchValue] = useState('')
  const [dataLoading, setDataLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [changeStatusLoading, setChangeStatusLoading] = useState(false)

  const [newCat, setNewCat] = useState({
    name_en: '',
    name_ar: '',
    order: '',
    parent_id: ''
  })
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [imgEn, setImgEn] = useState(null)
  const [imgAr, setImgAr] = useState(null)

  const [imgUrlEn, setImgUrlEn] = useState('')
  const [imgUrlAr, setImgUrlAr] = useState('')

  const [editImgEn, setEditImgEn] = useState(null)
  const [editImgAr, setEditImgAr] = useState(null)

  const [editImgUrl, setEditImgUrl] = useState('')
  const [editImgUrlAr, setEditImgUrlAr] = useState('')

  const [img, setImg] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const [branches, setBranches] = useState([])

  const renderName = row => {
    if (row.avatar) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={row.avatarColor || 'primary'}
          sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
        >
          {getInitials(row.name_ar || 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  const columns = [
    {
      flex: 0.1,
      field: 'image',
      minWidth: 220,
      headerName: `${t('img')}`,
      renderCell: ({ row }) => {
        const { image } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <img style={{ width: '100px' }} src={image} alt='' />
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Arabic name',
      minWidth: 220,
      headerName: `${t('name_ar')}`,
      renderCell: ({ row }) => {
        const { title_ar } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {title_ar}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'English Name',
      minWidth: 220,
      headerName: `${t('name_en')}`,
      renderCell: ({ row }) => {
        const { title_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {title_en}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Remove',
      minWidth: 220,
      headerName: `${t('Remove')}`,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <button
                  onClick={() => {
                    setShowUpStock(true)
                    setRowData(row)
                  }}
                  className='btn btn-primary'
                >
                  remove
                </button>
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'products',
      minWidth: 220,
      headerName: `${t('products')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/Products/${id}?branch_id=${query?.id}`}>
                <Button variant='contained'>{`${t('products')}`}</Button>
              </Link>
            </Box>
          </Box>
        )
      }
    }
  ]

  const getCategories = async () => {
    setDataLoading(true)
    await axios
      .get(`${BASE_URL}branches/branch_subs/` + query?.id + `?store_id=${storeData?.store_id ?? storeData?.id}`)
      .then(res => {
        console.log(res)
        if (res.data.status == 'success') {
          setCategoreis(res.data.result)
          setOriginalData(res.data.result)
          if (res.data.result.length > 0) {
            setNewCat({ ...newCat, parent_id: res.data.result[0].id })
          }
        } else if (res.data.status == 'error') {
          toast.error(res.data.message)
        } else {
          toast.error('حدث خطأ ما')
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setDataLoading(false)
      })
  }

  const notAssignFunction = async () => {
    await axios
      .get(`${BASE_URL}branches/branch_not_ass_subs/` + query?.id + `?store_id=${storeData?.store_id ?? storeData?.id}`)
      .then(res => {
        console.log(res)
        if (res.data.status == 'success') {
          setNotAssign(res.data.result)
        } else if (res.data.status == 'error') {
          toast.error(res.data.message)
        } else {
          toast.error('حدث خطأ ما')
        }
      })
      .catch(e => console.log(e))
      .finally(() => {})
  }

  const storeBranches = async () => {
    await axios
      .get(`${BASE_URL}stores/store_branches/${storeData?.store_id ?? storeData?.id}`)
      .then(res => {
        console.log(res)
        if (res.data.status == 'success') {
          setBranches(res.data.data)
          console.log(res.data.data)
          if (res.data.data.length > 0) {
            setNewBranch({ ...newBranch, branch_id: res.data.data[0]?.id })
          }
        } else if (res.data.status == 'error') {
          toast.error(res.data.message)
        } else {
          toast.error('حدث خطأ ما')
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setDataLoading(false)
      })
  }

  useEffect(() => {
    storeBranches()
  }, [])

  useEffect(() => {
    getCategories()
    notAssignFunction()
  }, [query?.id])

  const handleAddFile = async () => {
    setAddLoading(true)
    try {
      // تجهيز بيانات الطلب النهائي بعد رفع الصورة والصوت
      const requestData = {
        branch_id: query?.id,
        subs: selectedSubs.includes('all') ? notAssign.map(it => it.id).join('**') : selectedSubs.join('**')
      }
      await axios.post(`${BASE_URL}branches/assign_subs/${query?.id}`, { ...requestData })

      // استدعاء الدالة بعد الإضافة
      getCategories()
      notAssignFunction()
      toast.success('Successfully added!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to add new item.')
    } finally {
      setShowAddCatModal(false)
      setAddLoading(false)
    }
  }

  const handleShow_hide = async () => {
    setChangeStatusLoading(true)
    const token = localStorage.getItem('tradeVenddor')
    await axios
      .get(`${BASE_URL}categories/update_status/${rowData?.id}token=${token}`)
      .then(res => {
        console.log(res.data)
        if (res?.data && res?.data?.status == 'success') {
          toast.success(`تم ${rowData.is_active == '1' ? 'إلغاء تنشيط' : 'تنشيط'} الفئة بنجاح`)
          getCategories()
        } else if (res.data.status == 'error') {
          toast.error(res.data.message)
        } else {
          toast.error('حدث خطأ ما')
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setChangeStatusModal(false)
        setChangeStatusLoading(false)
        setRowData({})
      })
  }

  const getStoreSubcategories = async () => {
    const token = localStorage.getItem('TradeOfferToken')

    setDataLoading(true)
    await axios
      .get(`${BASE_URL}stores/subcategories/${storeData?.store_id ?? storeData?.id}?token=${token}`)
      .then(res => {
        console.log(res.data)
        if (res.data.status == 'success') {
          if (Array.isArray(res.data.data)) {
            setSubcategories(res.data.data)
            if (res.data.data.length > 0) {
              setNewBranch({ ...newBranch, subcats: res.data.data[0]?.id })
            }
          }
        }
      })
      .catch(e => console.log(e))
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  // filteraiton part

  useEffect(() => {
    if (originalData && originalData.length >= 1) {
      if (searchValue.length > 0) {
        console.log(searchValue)

        const newData = originalData.filter(cat => {
          if (searchValue.length >= 1 && !cat.name_ar.includes(searchValue) && !cat.name_en.includes(searchValue)) {
            return false
          }

          return true
        })
        setCategoreis(newData)
      } else {
        setCategoreis(originalData)
      }
    }
  }, [searchValue])

  useEffect(() => {
    getStoreSubcategories()
  }, [])

  const handleEdit = async () => {
    setAddLoading(true)
    try {
      // رفع الصورة الواحدة
      const formDataImage = new FormData()
      let image = ''
      formDataImage.append('image', editImg) // تأكد أن `imageFile` هو ملف الصورة الواحد
      if (editImg) {
        const imageResponse = await axios.post(`${BASE_URL}img_upload`, formDataImage)

        image = imageResponse.data // الحصول على رابط أو مسار الصورة
      }

      // تجهيز بيانات الطلب النهائي بعد رفع الصورة والصوت
      const requestData = {
        ...rowData,
        meta: rowData?.meta,
        image: editImg ? image?.data.image : rowData?.image,
        store_id: storeData?.store_id ?? storeData?.id
      }

      // إرسال الطلب النهائي إلى السيرفر
      await axios.post(`${BASE_URL}products/update_product/${rowData?.id}`, { ...requestData })

      // استدعاء الدالة بعد الإضافة
      getCategories()
      toast.success('Successfully added!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to add new item.')
    } finally {
      setShowEditModal(false)
      setEditImg(null)
      setEditImgUrl('')
      setAddLoading(false)
    }
  }

  const handleEditStock = () => {
    setAddLoading(true)

    const data_send = {
      branch_id: query?.id
    }

    axios
      .post(BASE_URL + `branches/remove_assign/${rowData?.id}`, data_send)
      .then(res => {
        if (res.data.status == 'success') {
          setShowUpStock(false)
          getCategories()
          notAssignFunction()
          toast.success(res.data.message)
        } else if (res.data.status == 'error') {
          toast.error(res.data.message)
        } else {
          toast.error('حدث خطأ ما')
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setAddLoading(false)
      })
  }

  return (
    <>
      <div className='rowDiv flex-2-1 page_padding'>
        <div>
          <div className='title_add d-flex align-items-center justify-content-between mb-2'>
            <h5>{`${t('subs')}`}</h5>
            <button
              onClick={() => {
                setShowAddCatModal(true)
              }}
              className='btn btn-success'
            >
              {t('assign')}
            </button>
          </div>

          {/* {dataLoading ? <Loader size='md' /> : <TableLayout headers={categoriesHeader} data={categories} />} */}
        </div>
      </div>

      <DataGrid
        autoHeight
        pagination
        rows={categories ? categories : []}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`Add New Catgory`}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField fullWidth label='Role Name' placeholder='Enter Role Name' />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button type='submit' variant='contained' onClick={handleClose}>
              Submit
            </Button>
            <Button color='secondary' variant='tonal' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={() => {
          setShowAddCatModal(false)
        }}
        open={showAddCatModal}
      >
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`ass_new_subs`}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('branches')}</InputLabel>
              <Select
                multiple
                displayEmpty
                value={selectedSubs}
                input={<OutlinedInput />}
                onChange={e => {
                  console.log(e.target.value)
                  setSelectedSubs([...e.target.value])
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem disabled value=''>
                  <em>Placeholder</em>
                </MenuItem>
                <MenuItem key={0} value={'all'}>
                  all
                </MenuItem>
                {notAssign &&
                  Array.isArray(notAssign) &&
                  notAssign.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.title_ar}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button disabled={addLoading} type='submit' variant='contained' onClick={handleAddFile}>
              {t('add')}
            </Button>
            <Button
              color='secondary'
              variant='tonal'
              onClick={() => {
                setShowAddCatModal(false)
              }}
            >
              {t('cancel')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={() => {
          setShowEditModal(false)
        }}
        open={showEditModal}
      >
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`Edit Product`}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.name_ar}
                onChange={e => {
                  setRowData({ ...rowData, name_ar: e.target.value })
                }}
                fullWidth
                label={`${t('name_ar')}`}
                placeholder={t('name_ar')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.name_en}
                onChange={e => {
                  setRowData({ ...rowData, name_en: e.target.value })
                }}
                fullWidth
                label={`${t('name_en')}`}
                placeholder={t('name_en')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <div className='field_input'>
              <label htmlFor=''>{t('img')}</label>
              <input
                type='file'
                onChange={e => {
                  setEditImg(e.target.files[0])
                  setImgUrl(URL.createObjectURL(e.target.files[0]))
                }}
              />
            </div>
            <div>
              {imgUrl != '' && (
                <div className='my-2'>
                  <img style={{ width: '100px' }} src={imgUrl} alt='' />
                </div>
              )}
            </div>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.description_ar}
                onChange={e => {
                  setRowData({ ...rowData, description_ar: e.target.value })
                }}
                fullWidth
                label={`${t('description_ar')}`}
                placeholder={t('description_ar')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.description_en}
                onChange={e => {
                  setrow({ ...rowData, description_en: e.target.value })
                }}
                fullWidth
                label={`${t('description_en')}`}
                placeholder={t('description_en')}
              />
            </FormControl>
          </Box>
          {/*
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.price}
                onChange={e => {
                  setRowData({ ...rowData, price: e.target.value })
                }}
                fullWidth
                label={`${t('total_price')}`}
                placeholder={t('total_price')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('branches')}</InputLabel>
              <Select
                native
                label='Age'
                defaultValue=''
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
                value={rowData?.branch_id}
                onChange={e => {
                  console.log(e.target.value)
                  setRowData({ ...rowData, branch_id: e.target.value })
                }}
              >
                {branches &&
                  branches?.map(it => {
                    return (
                      <option key={it.id} value={it.id}>
                        {it.name_ar}
                      </option>
                    )
                  })}
              </Select>
            </FormControl>
          </Box> */}

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.discount}
                onChange={e => {
                  setRowData({ ...rowData, discount: e.target.value })
                }}
                fullWidth
                label={`${t('discount')}`}
                placeholder={t('discount')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.meta}
                onChange={e => {
                  setRowData({ ...rowData, meta: e.target.value })
                }}
                fullWidth
                label={`${t('meta')}`}
                placeholder={t('meta')}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button disabled={addLoading} type='submit' variant='contained' onClick={handleEdit}>
              {t('edit')}
            </Button>
            <Button
              color='secondary'
              variant='tonal'
              onClick={() => {
                setShowEditModal(false)
              }}
            >
              {t('cancel')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={() => {
          setShowUpStock(false)
        }}
        open={showUpStock}
      >
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`remove`}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <p>{t('are_you_sure')}</p>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button disabled={addLoading} type='submit' variant='contained' onClick={handleEditStock}>
              {t('remove')}
            </Button>
            <Button
              color='secondary'
              variant='tonal'
              onClick={() => {
                setShowUpStock(false)
              }}
            >
              {t('cancel')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BranSubs
