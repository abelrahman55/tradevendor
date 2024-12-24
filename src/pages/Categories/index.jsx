/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Select from 'react-select'

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
import { Icon } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { BASE_URL } from 'src/constants'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Link from 'next/link'

const CategoriesPage = () => {
  const { t } = useTranslation()
  console.log(t)
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  console.log(storeData)
  const [allCategories, setAllCategories] = useState([])

  const [selectedCategories, setSelectedCategories] = useState([])

  // const navigate = useNavigate()
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

  const [editImgUrlEn, setEditImgUrlEn] = useState('')
  const [editImgUrlAr, setEditImgUrlAr] = useState('')

  const [img, setImg] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

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
        const { image_ar, image_en } = row
        console.log(row)

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <img style={{ width: '70px' }} src={image_en} alt='' />
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
        const { name_ar } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderName(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {name_ar}
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
        const { name_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderName(row)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {name_en}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Name',
      minWidth: 220,
      headerName: `${t('subs')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/Subcategories/${id}`}>
                <Button variant='contained'>{`${t('subs')}`}</Button>
              </Link>
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
      .get(`${BASE_URL}stores/store_categories/${storeData?.store_id ?? storeData?.id}`)
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
  }, [])

  //selectedMainImageUrl
  const handleAddNewCategory = async (imageLink, imageLink2) => {
    const token = localStorage.getItem('tradeVenddor')

    const dataset = {
      ...newCat,
      image_ar: imageLink,
      image_en: imageLink2
    }

    await axios
      .post(`${BASE_URL}categories/add_new?token=${token}`, dataset)
      .then(res => {
        if (res?.data && res?.data?.status == 'success') {
          toast.success('تم إضافة فئة جديدة بنجاح')
          getCategories()
          setShowAddCatModal(false)
        } else if (res.data.status == 'error') {
          toast.error('هناك مشكلة ! حاول مجدداً')
        } else {
          toast.error('حدث خطأ ما')
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setNewCat({
          title_ar: '',
          title_en: '',
          color: '',
          textColor: '',
          type: 'main',
          description_ar: '',
          description_en: ''
        })

        setImg('')
        setSelectedFile(null)
      })
  }

  const handleAddFile = () => {
    setAddLoading(true)
    let categories = ''
    let selCats = [...selectedCategories]
    console.log(selCats)
    for (let i = 0; i < selCats.length; i++) {
      if (i == 0) {
        categories += selCats[i].value
      } else {
        categories += '*trade*' + selCats[i].value
      }
    }

    const data_send = {
      store_id: storeData?.store_id ?? storeData?.id,
      categories: categories
    }
    axios
      .post(BASE_URL + `stores/assign_cats_to_store`, data_send)
      .then(res => {
        if (res.data.status == 'success') {
          toast.success(res.data.message)
          setShowAddCatModal(false)
          getCategories()
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
    console.log(data_send)
  }

  const updateCategoryData = async () => {
    setUpdateLoading(true)
    const token = localStorage.getItem('tradeVenddor')
    if (editImgAr != null) {
      if (editImgEn != null) {
        const form1 = new FormData()
        form1.append('image', editImgAr)
        axios
          .post(`${BASE_URL}img_upload`, form1)
          .then(res1 => {
            if (res1.data.status == 'success') {
              const form2 = new FormData()
              form2.append('image', editImgEn)
              axios.post(`${BASE_URL}img_upload`, form2).then(res2 => {
                if (res2.data.status == 'success') {
                  const data_send = {
                    ...rowData,
                    image_ar: res1.data?.data?.image,
                    image_en: res2.data?.data?.image
                  }

                  axios
                    .post(`${BASE_URL}categories/update_one/${rowData.id}?token=${token}`, data_send)
                    .then(res => {
                      if (res?.data && res?.data?.status == 'success') {
                        toast.success('تم تعديل الفئة بنجاح')
                        getCategories()
                        console.log(res.data.result)
                      } else if (res.data.status == 'error') {
                        toast.error('هناك مشكلة ! حاول مجدداً')
                      } else {
                        toast.error('حدث خطأ ما')
                      }
                    })
                    .catch(e => console.log(e))
                    .finally(() => {
                      setUpdateModal(false)
                      setRowData({})
                      setUpdateLoading(false)
                      setImg('')
                      setImgUrl('')
                      setSelectedFile(null)
                    })
                }
              })
            }
          })
          .catch(e => console.log(e))
      } else {
        const form1 = new FormData()
        form1.append('image', editImgAr)
        axios
          .post(`${BASE_URL}img_upload`, form1)
          .then(res1 => {
            if (res1.data.status == 'success') {
              const data_send = {
                ...rowData,
                image_ar: res1.data?.data?.image
              }
              axios
                .post(`${BASE_URL}categories/update_one/${rowData.id}?token=${token}`, data_send)
                .then(res => {
                  if (res?.data && res?.data?.status == 'success') {
                    toast.success('تم تعديل الفئة بنجاح')
                    getCategories()
                    console.log(res.data.result)
                  } else if (res.data.status == 'error') {
                    toast.error('هناك مشكلة ! حاول مجدداً')
                  } else {
                    toast.error('حدث خطأ ما')
                  }
                })
                .catch(e => console.log(e))
                .finally(() => {
                  setUpdateModal(false)
                  setRowData({})
                  setUpdateLoading(false)
                  setImg('')
                  setImgUrl('')
                  setSelectedFile(null)
                })
            }
          })
          .catch(e => console.log(e))
      }
    } else {
      if (editImgEn != null) {
        const form2 = new FormData()
        form2.append('image', editImgEn)
        axios.post(`${BASE_URL}img_upload`, form2).then(res2 => {
          if (res2.data.status == 'success') {
            const data_send = {
              ...rowData,
              image_en: res2.data?.data?.image
            }
            axios
              .post(`${BASE_URL}categories/update_one/${rowData.id}?token=${token}`, data_send)
              .then(res => {
                if (res?.data && res?.data?.status == 'success') {
                  toast.success('تم تعديل الفئة بنجاح')
                  getCategories()
                  console.log(res.data.result)
                } else if (res.data.status == 'error') {
                  toast.error('هناك مشكلة ! حاول مجدداً')
                } else {
                  toast.error('حدث خطأ ما')
                }
              })
              .catch(e => console.log(e))
              .finally(() => {
                setUpdateModal(false)
                setRowData({})
                setUpdateLoading(false)
                setImg('')
                setImgUrl('')
                setSelectedFile(null)
              })
          }
        })
      } else {
        const data_send = {
          ...rowData
        }
        axios
          .post(`${BASE_URL}categories/update_one/${rowData.id}?token=${token}`, data_send)
          .then(res => {
            if (res?.data && res?.data?.status == 'success') {
              toast.success('تم تعديل الفئة بنجاح')
              getCategories()
              console.log(res.data.result)
            } else if (res.data.status == 'error') {
              toast.error('هناك مشكلة ! حاول مجدداً')
            } else {
              toast.error('حدث خطأ ما')
            }
          })
          .catch(e => console.log(e))
          .finally(() => {
            setUpdateModal(false)
            setRowData({})
            setUpdateLoading(false)
            setImg('')
            setImgUrl('')
            setSelectedFile(null)
          })
      }
    }

    const dataset = {
      ...rowData
    }
    console.log(dataset)
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

  const getAllCategories = async () => {
    const token = localStorage.getItem('TradeOfferToken')

    setDataLoading(true)
    await axios
      .get(`${BASE_URL}categories/get_all?token=${token}`)
      .then(res => {
        if (res.data.status == 'success') {
          setAllCategories(res.data.data)
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
    getAllCategories()
  }, [])

  return (
    <>
      <div className='rowDiv flex-2-1 page_padding'>
        <div>
          <div className='title_add'>
            <h5>{`${t('cats')}`}</h5>
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
    </>
  )
}

export default CategoriesPage
