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
import { Icon, InputLabel } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { BASE_URL } from 'src/constants'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Link from 'next/link'
import { useRouter } from 'next/router'

const ProductAttributes = () => {
  const { query } = useRouter()
  const { t, i18n } = useTranslation()
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  const [allCategories, setAllCategories] = useState([])

  const [selectedCategories, setSelectedCategories] = useState([])

  const [newBranch, setNewBranch] = useState({
    extra_price: '',
    in_stock: '',
    attribute_id: '',
    attribute: '',
    name_ar: '',
    name_en: ''
  })
  const [allAtts, setAllAtts] = useState([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
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
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

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
      field: 'name_ar',
      minWidth: 220,
      headerName: `${t('name_ar')}`,
      renderCell: ({ row }) => {
        const { name_ar } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p>{name_ar}</p>
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'name_en',
      minWidth: 220,
      headerName: `${t('name_en')}`,
      renderCell: ({ row }) => {
        const { name_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p>{name_en}</p>
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    // {
    //   flex: 0.1,
    //   field: 'In Stock',
    //   minWidth: 220,
    //   headerName: `${t('in_stock')}`,
    //   renderCell: ({ row }) => {
    //     const { in_stock } = row

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //           <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
    //             {in_stock}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     )
    //   }
    // },
    // {
    //   flex: 0.1,
    //   field: 'Extra price',
    //   minWidth: 220,
    //   headerName: `${t('extra_price')}`,
    //   renderCell: ({ row }) => {
    //     const { extra_price } = row

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //           <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
    //             {extra_price}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     )
    //   }
    // },

    {
      flex: 0.1,
      field: 'update',
      minWidth: 220,
      headerName: `${t('edit')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <div
                onClick={() => {
                  setShowUpdateModal(true)
                  setRowData(row)
                }}
                className=''
              >
                <Button variant='contained'>{`${t('edit')}`}</Button>
              </div>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      field: 'values',
      minWidth: 220,
      headerName: `${t('values')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <div className=''>
                <Button variant='contained'>
                  <Link style={{ color: 'white', textDecoration: 'none' }} href={`/AttributeValues/${row?.id}`}>
                    {t('values')}
                  </Link>
                </Button>
              </div>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      field: 'delete',
      minWidth: 220,
      headerName: `${t('Delete')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <div
                onClick={() => {
                  setShowDeleteModal(true)
                  setRowData(row)
                }}
                className=''
              >
                <Button variant='contained'>{`${t('Delete')}`}</Button>
              </div>
            </Box>
          </Box>
        )
      }
    }

    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: false,
    //   field: 'actions',
    //   headerName: 'Actions',
    //   renderCell: () => (
    //     <OptionsMenu
    //       iconButtonProps={{ size: 'small', sx: { color: 'text.secondary' } }}
    //       options={[
    //         'Details',
    //         'Archive',
    //         { divider: true, dividerProps: { sx: { my: theme => `${theme.spacing(2)} !important` } } },
    //         {
    //           text: 'Delete',
    //           menuItemProps: {
    //             sx: {
    //               color: 'error.main',
    //               '&:not(.Mui-focusVisible):hover': {
    //                 color: 'error.main',
    //                 backgroundColor: theme => hexToRGBA(theme.palette.error.main, 0.08)
    //               }
    //             }
    //           }
    //         }
    //       ]}
    //     />
    //   )
    // }
  ]

  const getCategories = async () => {
    setDataLoading(true)
    await axios
      .get(`${BASE_URL}products/get_prod_atts/${query?.id}`)
      .then(res => {
        console.log(res)
        if (res.data.status == 'success') {
          setCategoreis(res.data.data)
          setOriginalData(res.data.data)
          if (res.data.data.length > 0) {
            setNewCat({ ...newCat, parent_id: res.data.data[0].id })
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
  }, [query?.id])

  const handleAddFile = async () => {
    setAddLoading(true)
    try {
      // رفع الصورة الواحدة

      // تجهيز بيانات الطلب النهائي بعد رفع الصورة والصوت
      const requestData = {
        ...newBranch,
        attribute_value_id: newBranch.attribute_id,
        product_id: query?.id
      }

      // إرسال الطلب النهائي إلى السيرفر
      await axios.post(`${BASE_URL}products/add_product_att/${query?.id}`, { ...requestData })

      // استدعاء الدالة بعد الإضافة
      getCategories()
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

  const handleClose = () => {
    setOpen(false)
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  const handleDel = id => {
    setAddLoading(true)
    axios
      .get(BASE_URL + `products/del_attr_prod/${rowData?.id}`)
      .then(res => {
        if (res.data.status == 'success') {
          toast.success(res.data.message)
          getCategories()
          setShowDeleteModal(false)
        } else if (res.data.status == 'faild') {
          toast.error(res.data.message)
        } else {
          toast.error('حدث خطأ ما')
        }
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        setAddLoading(false)
      })
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

  const handleEdit = async () => {
    setAddLoading(true)

    const data_send = {
      ...rowData
    }

    axios
      .post(BASE_URL + `products/update_product_att/${rowData?.id}`, data_send)
      .then(res => {
        if (res.data.status == 'success') {
          setShowUpdateModal(false)
          getCategories()
        } else if (res.data.status == 'error') {
          toast.error(res.data.message)
        } else {
          toast.error(i18n.language == 'ar' ? 'حدث خطأ ما' : 'Something Went Error')
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setAddLoading(false)
      })
  }

  const getAllColors = () => {
    axios
      .get(BASE_URL + 'attributes/get_all')
      .then(res => {
        if (Array.isArray(res.data.data)) {
          setAllAtts(res.data.data)
          if (res.data.data.length > 0) {
            setNewBranch({
              ...newBranch,
              attribute_id: res.data.data[0].id
            })
          }
        }
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    getAllColors()
  }, [])

  return (
    <>
      <div className='rowDiv flex-2-1 page_padding'>
        <div>
          <div className='title_add d-flex align-items-center justify-content-between mb-2'>
            <h5>{`${t('attributes')}`}</h5>
            <button
              onClick={() => {
                setShowAddCatModal(true)
              }}
              className='btn btn-success'
            >
              {t('add')}
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
        pageSizeOptions={[10, 20, 40, 50]}
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
          <Typography variant='h3'>{t('Add New Product Attribute value')}</Typography>
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
                onChange={e => {
                  setNewBranch({ ...newBranch, name_ar: e.target.value })
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
                onChange={e => {
                  setNewBranch({ ...newBranch, name_en: e.target.value })
                }}
                fullWidth
                label={`${t('name_en')}`}
                placeholder={t('name_en')}
              />
            </FormControl>
          </Box>
          {/* <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, in_stock: e.target.value })
                }}
                fullWidth
                label={`${t('in_stock')}`}
                placeholder={t('in_stock')}
              />
            </FormControl>
          </Box> */}
          {/* <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, extra_price: e.target.value })
                }}
                fullWidth
                label={`${t('extra_price')}`}
                placeholder={t('extra_price')}
              />
            </FormControl>
          </Box> */}

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              {/* <InputLabel htmlFor='outlined-age-native-simple'>{t('attributes')}</InputLabel> */}
              {/* <Select
                native
                label='Age'
                defaultValue=''
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
                onChange={e => {
                  setNewBranch({ ...newBranch, attribute_id: e.target.value })
                }}
              >
                {console.log(allAtts)}
                {allAtts &&
                  allAtts?.map(it => {
                    return (
                      <option key={it.id} value={it.id}>
                        {it.name_ar}
                      </option>
                    )
                  })}
              </Select> */}
              {/* <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, attribute: e.target.value })
                }}
                fullWidth
                label={`${t('attribute')}`}
                placeholder={t('attribute')}
              /> */}
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
          setShowUpdateModal(false)
        }}
        open={showUpdateModal}
      >
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{t('Update Product Attribute')}</Typography>
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
                onChange={e => {
                  setRowData({ ...rowData, name_ar: e.target.value })
                }}
                value={rowData?.name_ar}
                fullWidth
                label={`${t('name_ar')}`}
                placeholder={t('name_ar')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setRowData({ ...rowData, name_en: e.target.value })
                }}
                value={rowData?.name_en}
                fullWidth
                label={`${t('name_en')}`}
                placeholder={t('name_en')}
              />
            </FormControl>
          </Box>
          {/* <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, in_stock: e.target.value })
                }}
                fullWidth
                label={`${t('in_stock')}`}
                placeholder={t('in_stock')}
              />
            </FormControl>
          </Box> */}
          {/* <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, extra_price: e.target.value })
                }}
                fullWidth
                label={`${t('extra_price')}`}
                placeholder={t('extra_price')}
              />
            </FormControl>
          </Box> */}

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              {/* <InputLabel htmlFor='outlined-age-native-simple'>{t('attributes')}</InputLabel> */}
              {/* <Select
                native
                label='Age'
                defaultValue=''
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
                onChange={e => {
                  setNewBranch({ ...newBranch, attribute_id: e.target.value })
                }}
              >
                {console.log(allAtts)}
                {allAtts &&
                  allAtts?.map(it => {
                    return (
                      <option key={it.id} value={it.id}>
                        {it.name_ar}
                      </option>
                    )
                  })}
              </Select> */}
              {/* <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, attribute: e.target.value })
                }}
                fullWidth
                label={`${t('attribute')}`}
                placeholder={t('attribute')}
              /> */}
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
                setShowUpdateModal(false)
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
          setShowDeleteModal(false)
        }}
        open={showDeleteModal}
      >
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{t('Delete')}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <p>{t('do_you_want_to_delete_this')}</p>
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
            <Button disabled={addLoading} type='submit' variant='contained' onClick={handleDel}>
              {t('Delete')}
            </Button>
            <Button
              color='secondary'
              variant='tonal'
              onClick={() => {
                setShowDeleteModal(false)
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

export default ProductAttributes
