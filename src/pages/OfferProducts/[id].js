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

const OfferProducts = () => {
  const { query } = useRouter()
  const { t, i18n } = useTranslation()
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  const [brabchesProducts, setBrabchesProducts] = useState([])
  const [originalBranchesProducts, setOriginalBranchesProducts] = useState([])
  const [allCategories, setAllCategories] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSubcats, setSelectedSubCats] = useState([])
  const [branchesSubcategories, setBranchesSubcategories] = useState([])
  const [searchValue2, setSearchValue2] = useState('')

  const [newBranch, setNewBranch] = useState({
    name_en: '',
    name_ar: '',
    meta: '',
    price: '',
    discount: '',
    description_en: '',
    description_ar: ''
  })
  const [products, setProducts] = useState([])
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
  const [paginationModel2, setPaginationModel2] = useState({ page: 0, pageSize: 10 })

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

  const columnsProducts = [
    {
      flex: 0.1,
      field: 'Select',
      minWidth: 220,
      headerName: `${t('select')}`,
      renderCell: ({ row }) => {
        const { id, selected } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* {renderName(row)} */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <input
                style={{ width: '20px', height: '20px' }}
                onClick={() => {
                  setBrabchesProducts(
                    brabchesProducts.map(it => ({ ...it, selected: it.id == row?.id ? !it.selected : it.selected }))
                  )
                }}
                type='checkbox'
                checked={selected}
              />
            </Box>
          </Box>
        )
      }
    },
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
              <img style={{ width: '60px' }} src={image} alt='' />
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
            {/* {renderName(row)} */}
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
            {/* {renderName(row)} */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {name_en}
              </Typography>
            </Box>
          </Box>
        )
      }
    }
  ]

  const offer_branches_products = () => {
    axios
      .get(BASE_URL + `offers/offer_branches_subcats/${query?.id}`)
      .then(res => {
        console.log(res)
        if (res.data.status == 'success') {
          setBranchesSubcategories(Array.isArray(res.data.result) ? res.data.result : [])
        }
      })
      .catch(e => console.log(e))
  }

  const getMagBranches = () => {
    axios
      .get(BASE_URL + `offers/offer_branches_products/${query?.id}`)
      .then(res => {
        console.log(res.data)
        if (res.data.status == 'success') {
          if (Array.isArray(res.data.result)) {
            setBrabchesProducts(res.data.result.map(it => ({ ...it, selected: false })))
            setOriginalBranchesProducts(res.data.result.map(it => ({ ...it, selected: false })))
          }
        }
      })
      .catch(e => console.log(e))
      .finally(() => {})
  }

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
      field: 'Arabic Desciprtion',
      minWidth: 220,
      headerName: `${t('description_ar')}`,
      renderCell: ({ row }) => {
        const { description_ar } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {description_ar}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'English Desciprtion',
      minWidth: 220,
      headerName: `${t('description_en')}`,
      renderCell: ({ row }) => {
        const { description_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {description_en}
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
      headerName: `${t('delete')}`,
      renderCell: ({ row }) => {
        const { description_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <button
                  onClick={() => {
                    setShowDeleteModal(true)
                    setRowData(row)
                  }}
                  className='btn btn-primary'
                >
                  delete
                </button>
              </Typography>
            </Box>
          </Box>
        )
      }
    }

    // {
    //   flex: 0.1,
    //   field: 'Name',
    //   minWidth: 220,
    //   headerName: `${t('colors')}`,
    //   renderCell: ({ row }) => {
    //     const { id} = row

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //           <Link href={`/ProductColor/${id}`}>
    //             <Button variant='contained'>{`${t('colors')}`}</Button>
    //           </Link>
    //         </Box>
    //       </Box>
    //     )
    //   }
    // },
    // {
    //   flex: 0.1,
    //   field: 'sizes',
    //   minWidth: 220,
    //   headerName: `${t('sizes')}`,
    //   renderCell: ({ row }) => {
    //     const { id} = row

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //           <Link href={`/ProductSizes/${id}`}>
    //             <Button variant='contained'>{`${t('sizes')}`}</Button>
    //           </Link>
    //         </Box>
    //       </Box>
    //     )
    //   }
    // },
    // {
    //   flex: 0.1,
    //   field: 'addons',
    //   minWidth: 220,
    //   headerName: `${t('addons')}`,
    //   renderCell: ({ row }) => {
    //     const { id} = row

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //           <Link href={`/ProductAddons/${id}`}>
    //             <Button variant='contained'>{`${t('addons')}`}</Button>
    //           </Link>
    //         </Box>
    //       </Box>
    //     )
    //   }
    // },
    // {
    //   flex: 0.1,
    //   field: 'attributes',
    //   minWidth: 220,
    //   headerName: `${t('attributes')}`,
    //   renderCell: ({ row }) => {
    //     const { id} = row

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //           <Link href={`/ProductAttributes/${id}`}>
    //             <Button variant='contained'>{`${t('attributes')}`}</Button>
    //           </Link>
    //         </Box>
    //       </Box>
    //     )
    //   }
    // },
    // {
    //   flex: 0.1,
    //   field: 'edit',
    //   minWidth: 220,
    //   headerName: `${t('edit')}`,
    //   renderCell: ({ row }) => {
    //     const { id} = row

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    //           <div
    //             onClick={() => {
    //               setShowEditModal(true)
    //               setRowData(row)
    //               setImgUrl(row?.image)
    //             }}
    //             className=''
    //           >
    //             <Button variant='contained'>{`${t('edit')}`}</Button>
    //           </div>
    //         </Box>
    //       </Box>
    //     )
    //   }
    // }

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

  const getAllProducts = () => {
    axios
      .get(BASE_URL + 'products/get_all_store_products_not_ass/' + query?.id)
      .then(res => {
        console.log(res)
        if (Array.isArray(res.data.message)) {
          setProducts(res.data.message)
        }
      })
      .catch(e => console.log(e))
  }

  const getCategories = async () => {
    setDataLoading(true)
    await axios
      .get(`${BASE_URL}offers/get_offer_store_products/${query?.id}`)
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
    getAllProducts()
    storeBranches()
    getCategories()
    getMagBranches()
    offer_branches_products()
  }, [query?.id])

  const handleAddFile = async () => {
    console.log(brabchesProducts)

    let selsProds = brabchesProducts
      .filter(it => it.selected)
      .map(it => it.id)
      .join('**')
    console.log(selsProds)

    let selectedSubcats = brabchesProducts
      .filter(it => it.selected) // Keep only selected products
      .flatMap(it => it.subcats) // Extract and flatten the subcats arrays
      .filter((subcat, index, self) => self.indexOf(subcat) === index)
      .join('**')
    console.log(selectedSubcats)

    // return
    setAddLoading(true)

    const data_send = {
      selsProds,
      selectedSubcats
    }
    axios
      .post(BASE_URL + 'offers/add_prods_in_offer/' + query.id, data_send)
      .then(res => {
        if (res.data.status == 'success') {
          toast.success(res.data.message)
          setShowAddCatModal(false)
          getAllProducts()
          getCategories()
          getMagBranches()
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

  // useEffect(() => {
  //   console.log(selectedSubcats)
  //   if (originalBranchesProducts && originalBranchesProducts.length >= 1) {
  //     if (searchValue2.length > 0) {
  //       // console.log(searchValue2)

  //       const newData = originalBranchesProducts.filter(cat => {
  //         if (searchValue2.length >= 1 && !cat.name_ar.includes(searchValue2) && !cat.name_en.includes(searchValue2)) {
  //           return false
  //         }
  //         if (selectedSubcats.length > 0) {
  //           if (!cat.subcats.some(subcat => selectedSubcats.includes(subcat))) {
  //             return false
  //           }
  //         }

  //         return true
  //       })
  //       setBrabchesProducts(newData)
  //     } else {
  //       if (selectedSubcats.length > 0) {
  //         if (selectedSubcats.includes('all')) {
  //           console.log('All categories selected')
  //           setBrabchesProducts(originalBranchesProducts)
  //         } else {
  //           setBrabchesProducts(
  //             originalBranchesProducts &&
  //               originalBranchesProducts.filter(it => {
  //                 // Check if any of the selected subcategories exist in `it.subcats`
  //                 return it.subcats.some(subcat => selectedSubcats.includes(subcat))
  //               })
  //           )
  //         }
  //       } else {
  //         setBrabchesProducts(originalBranchesProducts)
  //       }
  //     }
  //   }
  // }, [searchValue2, selectedSubcats])
  useEffect(() => {
    if (originalBranchesProducts && originalBranchesProducts.length >= 1) {
      let filteredData = [...originalBranchesProducts]

      // Step 1: Apply search filter if `searchValue2` is non-empty
      if (searchValue2.trim().length > 0) {
        filteredData = filteredData.filter(
          cat => cat.name_ar.includes(searchValue2) || cat.name_en.includes(searchValue2)
        )
      }

      // Step 2: Apply subcategory filter if `selectedSubcats` is non-empty
      if (selectedSubcats.length > 0 && !selectedSubcats.includes('all')) {
        filteredData = filteredData.filter(cat => cat.subcats.some(subcat => selectedSubcats.includes(subcat)))
      }

      // Step 3: Update the state with the filtered data
      setBrabchesProducts(filteredData)
    }
  }, [searchValue2, selectedSubcats, originalBranchesProducts])

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

  const handelDelete = () => {
    setAddLoading(true)
    axios
      .get(BASE_URL + 'offers/delete_product_from_offer/' + rowData?.prod_offer_id)
      .then(res => {
        if (res.data.status == 'success') {
          toast.success(res.data.message)
          setShowDeleteModal(false)
          getAllProducts()
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
  }

  return (
    <>
      <div className='rowDiv flex-2-1 page_padding'>
        <div>
          <div className='title_add d-flex align-items-center justify-content-between mb-2'>
            <h5>{`${t('prods')}`}</h5>
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
        paginationModel={paginationModel2}
        onPaginationModelChange={setPaginationModel2}
      />

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={() => {
          setOpen(false)
        }}
        open={open}
      >
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
            <Button
              type='submit'
              variant='contained'
              onClick={() => {
                setOpen(false)
              }}
            >
              Submit
            </Button>
            <Button
              color='secondary'
              variant='tonal'
              onClick={() => {
                setOpen(false)
              }}
            >
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
          <Typography variant='h3'>{`Delete This Product From Offer`}</Typography>
        </DialogTitle>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button
              type='submit'
              variant='contained'
              onClick={() => {
                handelDelete()
              }}
            >
              {t('delete')}
            </Button>
            <Button
              color='secondary'
              variant='tonal'
              onClick={() => {
                setShowDeleteModal(false)
              }}
            >
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
          <Typography variant='h3'>{t(`Add New Products`)}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <div className='field_input'>
            <CustomTextField
              onChange={e => {
                setSearchValue2(e.target.value)
              }}
              fullWidth
              label={`${t('search_here')}`}
              placeholder={t('search_here')}
            />
          </div>

          <div className='filter_products'>
            <div className='w-100 my-2'>
              <h4>Subcategories</h4>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='age-select-label'>{i18n.language === 'ar' ? 'الفئة العمرية' : 'Age'}</InputLabel>
                <Select
                  labelId='age-select-label'
                  multiple
                  value={selectedSubcats}
                  onChange={e => {
                    setSelectedSubCats(e.target.value)
                  }}
                >
                  <MenuItem disabled value=''>
                    <em>{i18n.language === 'ar' ? 'اختر' : 'Select'}</em>
                  </MenuItem>
                  <MenuItem key='all' value='all'>
                    {i18n.language === 'ar' ? 'الكل' : 'All'}
                  </MenuItem>
                  {branchesSubcategories &&
                    branchesSubcategories.map(it => (
                      <MenuItem key={it.id} value={it.id}>
                        {i18n.language === 'ar' ? it.title_ar : it.title_en}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <DataGrid
            autoHeight
            pagination
            rows={brabchesProducts ? brabchesProducts : []}
            rowHeight={62}
            columns={columnsProducts}
            pageSizeOptions={[10, 20, 40, 50]}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
          {/* <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('prods')}</InputLabel>
              <Select
                multiple
                displayEmpty
                value={selectedProducts}
                input={<OutlinedInput />}
                onChange={e => {
                  console.log(e.target.value)
                  setSelectedProducts([...e.target.value])
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem disabled value=''>
                  <em>Placeholder</em>
                </MenuItem>
                {products &&
                  Array.isArray(products) &&
                  products.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name_ar}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box> */}
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
          </Box>

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
    </>
  )
}

export default OfferProducts
