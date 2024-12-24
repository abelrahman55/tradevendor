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

const ProductAddons = () => {
  const { query } = useRouter()
  const { t } = useTranslation()
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  const [allCategories, setAllCategories] = useState([])

  const [selectedCategories, setSelectedCategories] = useState([])

  const [newBranch, setNewBranch] = useState({
    price: '',
    in_stock: '',
    color_id: '',
    name_ar: '',
    name_en: ''
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [allAtts, setAllAtts] = useState([])

  // const navigate = useNavigate()
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
      field: 'name_ar',
      minWidth: 220,
      headerName: `${t('name_ar')}`,
      renderCell: ({ row }) => {
        const { color } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: color?.color }}>
                  {row?.name_ar}
                </p>
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
        const { color } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: color?.color }}>
                  {row?.name_en}
                </p>
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'In Stock',
      minWidth: 220,
      headerName: `${t('in_stock')}`,
      renderCell: ({ row }) => {
        const { in_stock } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {in_stock}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Extra price',
      minWidth: 220,
      headerName: `${t('price')}`,
      renderCell: ({ row }) => {
        const { price } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {price}
              </Typography>
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
    },
    {
      flex: 0.1,
      field: 'edit',
      minWidth: 220,
      headerName: `${t('edit')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <div
                onClick={() => {
                  setShowEditModal(true)
                  setRowData(row)
                  setEditImgUrl(row?.image)
                }}
                className=''
              >
                <Button variant='contained'>{`${t('edit')}`}</Button>
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
      .get(`${BASE_URL}products/get_addons/${query?.id}`)
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

  useEffect(() => {
    getCategories()
  }, [query?.id])

  const handleAddFile = async () => {
    setAddLoading(true)
    try {
      // رفع الصورة الواحدة

      const formDataImage = new FormData()
      formDataImage.append('image', img) // تأكد أن `imageFile` هو ملف الصورة الواحد

      const imageResponse = await axios.post(`${BASE_URL}img_upload`, formDataImage)

      const image = imageResponse.data // الحصول على رابط أو مسار الصورة

      // تجهيز بيانات الطلب النهائي بعد رفع الصورة والصوت
      const requestData = {
        ...newBranch,
        image: image?.data.image,
        product_id: query?.id
      }

      // إرسال الطلب النهائي إلى السيرفر
      await axios.post(`${BASE_URL}products/add_product_addon/${query?.id}`, { ...requestData })

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

  const handleClose = () => {
    setOpen(false)
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  const handleDel = id => {
    setAddLoading(true)
    axios
      .get(BASE_URL + `products/del_addon/${rowData?.id}`)
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
          if (
            searchValue.length > 0 &&
            (cat.name_ar.toLowerCase().includes(searchValue.toLowerCase()) ||
              cat.name_en.toLowerCase().includes(searchValue.toLowerCase()))
          ) {
            return true
          }

          return false
        })
        setCategoreis(newData)
      } else {
        setCategoreis(originalData)
      }
    }
  }, [searchValue])

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
      await axios.post(`${BASE_URL}products/edit_product_addon/${rowData?.id}`, { ...requestData })

      // استدعاء الدالة بعد الإضافة
      getCategories()
      toast.success('Successfully added!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to Edit item.')
    } finally {
      setShowEditModal(false)
      setEditImg(null)
      setEditImgUrl('')
      setAddLoading(false)
    }
  }

  const getAllColors = () => {
    axios
      .get(BASE_URL + 'colors/get_all')
      .then(res => {
        if (Array.isArray(res.data.data)) {
          setAllAtts(res.data.data)
          if (res.data.data.length > 0) {
            setNewBranch({
              ...newBranch,
              color_id: res.data.data[0].id
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
          <div className='my-2 search_item'>
            <div className='field_input'>
              <CustomTextField
                onChange={e => {
                  setSearchValue(e.target.value)
                }}
                fullWidth
                label={`${t('search_here')}`}
                placeholder={t('search_here')}
              />
            </div>
          </div>{' '}
          <div className='title_add d-flex align-items-center justify-content-between mb-2'>
            <h5>{`${t('addons')}`}</h5>
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
        pageSizeOptions={[5, 10, 20, 40]}
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
          <Typography variant='h3'>{t('add_product_addon')}</Typography>
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
          <Box sx={{ my: 4 }}>
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
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, price: e.target.value })
                }}
                fullWidth
                label={`${t('price')}`}
                placeholder={t('price')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <div className='field_input'>
              <label htmlFor=''>{t('img')}</label>
              <input
                type='file'
                onChange={e => {
                  setImg(e.target.files[0])
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
          <Typography variant='h3'>{t('edit_product_addon')}</Typography>
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
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setRowData({ ...rowData, in_stock: e.target.value })
                }}
                value={rowData?.in_stock}
                fullWidth
                label={`${t('in_stock')}`}
                placeholder={t('in_stock')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setRowData({ ...rowData, price: e.target.value })
                }}
                value={rowData?.price}
                fullWidth
                label={`${t('price')}`}
                placeholder={t('price')}
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
                  setEditImgUrl(URL.createObjectURL(e.target.files[0]))
                }}
              />
            </div>
            <div>
              {editImgUrl != '' && (
                <div className='my-2'>
                  <img style={{ width: '100px' }} src={editImgUrl} alt='' />
                </div>
              )}
            </div>
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
          <Typography variant='h3'>{t(`Delete`)}</Typography>
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

export default ProductAddons
