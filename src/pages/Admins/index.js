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

const Admins = () => {
  const { t } = useTranslation()
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  const [allCategories, setAllCategories] = useState([])

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    user_type: 'online_users',
    branch_id: ''
  })
  const [selectedCategories, setSelectedCategories] = useState([])

  const [newBranch, setNewBranch] = useState({
    name_en: '',
    name_ar: '',
    meta: '',
    price: '',
    discount: '',
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
      field: 'bran_image',
      minWidth: 220,
      headerName: `${t('bran_image')}`,
      renderCell: ({ row }) => {
        const { name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <img style={{ width: '100px' }} src={row?.branch?.image} alt='' />
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'name',
      minWidth: 220,
      headerName: `${t('name')}`,
      renderCell: ({ row }) => {
        const { name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* {renderName(row)} */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'email',
      minWidth: 220,
      headerName: `${t('email')}`,
      renderCell: ({ row }) => {
        const { email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* {renderName(row)} */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'User Type',
      minWidth: 220,
      headerName: `${t('user_type')}`,
      renderCell: ({ row }) => {
        const { user_type } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {user_type}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'bran_name',
      minWidth: 220,
      headerName: `${t('bran_name')}`,
      renderCell: ({ row }) => {
        const { name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {row?.branch?.name_ar}
              </Typography>
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
        const { name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <button
                  onClick={() => {
                    setShowEditModal(true)
                    setRowData(row)
                  }}
                  className='btn btn-primary'
                >
                  {t('edit')}
                </button>
              </Typography>
            </Box>
          </Box>
        )
      }
    }
  ]

  const getCategories = async () => {
    setDataLoading(true)
    await axios
      .get(BASE_URL + `stores/get_all_users/${storeData?.store_id ?? storeData?.id}`)
      .then(res => {
        console.log(res)
        if (res.data.status == 'success') {
          setCategoreis(res.data.data)
          console.log(res.data.data)
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
            setNewUser({ ...newUser, branch_id: res.data.data[0]?.id })
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
    storeBranches()
  }, [])

  const handleAddFile = async () => {
    setAddLoading(true)

    const data_send = {
      ...newUser,
      store_id: storeData?.store_id ?? storeData?.id
    }
    console.log(data_send)
    axios
      .post(BASE_URL + `store_users/add_new`, data_send)
      .then(res => {
        if (res.data.status == 'success') {
          toast.success(res.data.message)
          getCategories()
          setShowAddCatModal(false)
        } else if (res.data.status == 'faild') {
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
      ...rowData,
      store_id: storeData?.store_id ?? storeData?.id
    }
    console.log(data_send)
    axios
      .post(BASE_URL + `store_users/update_one/${rowData?.id}`, data_send)
      .then(res => {
        if (res.data.status == 'success') {
          toast.success(res.data.message)
          getCategories()
          setShowEditModal(false)
        } else if (res.data.status == 'faild') {
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
            <h5>{`${t('st_us')}`}</h5>
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

      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={showAddCatModal}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`Add New Admin`}</Typography>
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
                  setNewUser({ ...newUser, name: e.target.value })
                }}
                fullWidth
                label={`${t('name')}`}
                placeholder={t('name')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewUser({ ...newUser, email: e.target.value })
                }}
                fullWidth
                label={`${t('email')}`}
                placeholder={t('email')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewUser({ ...newUser, password: e.target.value })
                }}
                fullWidth
                label={`${t('password')}`}
                placeholder={t('password')}
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
                onChange={e => {
                  console.log(e.target.value)
                  setNewUser({ ...newUser, branch_id: e.target.value })
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
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('st_us')}</InputLabel>
              <Select
                native
                label='Age'
                defaultValue=''
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
                onChange={e => {
                  console.log(e.target.value)
                  setNewUser({ ...newUser, user_type: e.target.value })
                }}
              >
                <option value='online_users'>مسوق إلكترونى</option>
                <option value='manager_store'>مدير المتجر</option>
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
          <Typography variant='h3'>{`Edit Admin`}</Typography>
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
                value={rowData?.name}
                onChange={e => {
                  setRowData({ ...rowData, name: e.target.value })
                }}
                fullWidth
                label={`${t('name')}`}
                placeholder={t('name')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.email}
                onChange={e => {
                  setRowData({ ...rowData, email: e.target.value })
                }}
                fullWidth
                label={`${t('email')}`}
                placeholder={t('email')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.password}
                onChange={e => {
                  setRowData({ ...rowData, password: e.target.value })
                }}
                fullWidth
                label={`${t('password')}`}
                placeholder={t('password')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('branches')}</InputLabel>
              <Select
                value={rowData?.branch_id}
                native
                label='Age'
                defaultValue=''
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
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
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('st_us')}</InputLabel>
              <Select
                native
                label='Age'
                defaultValue=''
                value={rowData?.user_type}
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
                onChange={e => {
                  console.log(e.target.value)
                  setRowData({ ...rowData, user_type: e.target.value })
                }}
              >
                <option value='online_users'>مسوق إلكترونى</option>
                <option value='manager_store'>مدير المتجر</option>
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
    </>
  )
}

export default Admins
