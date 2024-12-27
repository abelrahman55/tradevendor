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

// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'

// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
// })

const BranchesPage = () => {
  const { t, i18n } = useTranslation()
  console.log(t)
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)

  const [mainStatus, setMainStatus] = useState(0)

  const [newBranch, setNewBranch] = useState({
    name_ar: '',
    name_en: '',
    address_en: '',
    phone: '',
    address_ar: '',
    lat: '',
    lng: '',
    covered_zone: 4
  })
  const [editCoverImg, setEditCoverImg] = useState()
  const [editCoverImgUrl, setEditCoverImgUrl] = useState()
  const [allCategories, setAllCategories] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [imgEdit, setImgEdit] = useState(null)
  const [imgEditUrl, setImgEditUrl] = useState('')
  const [coverImg, setCoverImg] = useState(null)
  const [coverImgUrl, setCoverImgUrl] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])

  // const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)
  const [branches, setBranches] = useState(null)
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

  const renderName = (row, type) => {
    if (row.avatar) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={row.avatarColor || 'primary'}
          sx={{ mr: 2.5, width: 38, height: 38, fontSize: theme => theme.typography.body1.fontSize }}
        >
          {getInitials((type == 'ar' ? row.name_ar : row.name_en) || 'John Doe')}
        </CustomAvatar>
      )
    }
  }

  const [position, setPosition] = useState(null)

  // const LocationMarker = () => {
  //   useMapEvents({
  //     click(e) {
  //       console.log(e.latlng)
  //       setNewBranch({ ...newBranch, lat: e.latlng.lat, lng: e.latlng.lng })
  //       setPosition(e.latlng)
  //     }
  //   })

  //   return position === null ? null : <Marker position={position}></Marker>
  // }

  // const LocationMarker2 = () => {
  //   useMapEvents({
  //     click(e) {
  //       console.log(e.latlng)
  //       setRowData({ ...rowData, latitude: e.latlng.lat, longitude: e.latlng.lng })
  //       setPosition(e.latlng)
  //     }
  //   })

  //   let obj = {
  //     lat: rowData?.latitude,
  //     lng: rowData?.longitude
  //   }

  //   return obj === null ? null : <Marker position={obj}></Marker>
  // }

  const columns = [
    {
      flex: 0.1,
      field: 'main',
      minWidth: 220,
      headerName: `${t('main')}`,
      renderCell: ({ row }) => {
        const { image, image_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                {row?.main_status == 1
                  ? i18n.language == 'ar'
                    ? 'الرئيسى'
                    : 'Main'
                  : i18n.language == 'ar'
                  ? 'ليس الرئيسى'
                  : 'Not Main'}
              </div>
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
        const { image, image_en } = row

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
      field: 'cover_img',
      minWidth: 220,
      headerName: `${t('cover_img')}`,
      renderCell: ({ row }) => {
        const { image, cover_img } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <img style={{ width: '60px' }} src={cover_img} alt='' />
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
            {/* {renderName(row, 'ar')} */}
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
            {/* {renderName(row, 'en')} */}
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
      field: 'Arabic Address',
      minWidth: 220,
      headerName: `${t('add_ar')}`,
      renderCell: ({ row }) => {
        const { address_ar } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {address_ar}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'English Address',
      minWidth: 220,
      headerName: `${t('add_en')}`,
      renderCell: ({ row }) => {
        const { address_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {address_en}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Phone',
      minWidth: 220,
      headerName: `${t('phone')}`,
      renderCell: ({ row }) => {
        const { phone } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {phone}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Covered Zone',
      minWidth: 220,
      headerName: `${t('cov_zon')}`,
      renderCell: ({ row }) => {
        const { covered_zone } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {covered_zone}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Active',
      minWidth: 220,
      headerName: `${t('active')}`,
      renderCell: ({ row }) => {
        const { is_active } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {is_active}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Rating',
      minWidth: 220,
      headerName: `${t('rating')}`,
      renderCell: ({ row }) => {
        const { rating } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {rating}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'latitude',
      minWidth: 220,
      headerName: `${t('latitude')}`,
      renderCell: ({ row }) => {
        const { latitude } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {(latitude * 1).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'longtitude',
      minWidth: 220,
      headerName: `${t('longtitude')}`,
      renderCell: ({ row }) => {
        const { longitude } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {(longitude * 1).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      field: 'Edit',
      minWidth: 220,
      headerName: `${t('edit')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                onClick={() => {
                  setShowEditModal(true)
                  setRowData(row)
                  setImgEditUrl(row.image)
                  setEditCoverImgUrl(row.cover_img)
                }}
                variant='contained'
              >{`${t('edit')}`}</Button>
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
              <Link href={`/branProducts/${id}`}>
                <Button variant='contained'>{`${t('products')}`}</Button>
              </Link>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Subcategories',
      minWidth: 220,
      headerName: `${t('subs')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant='contained' component={Link} href={`/BranSubs/${id}`}>
                {t('subs')}
              </Button>
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

  const getBranchies = async () => {
    const token = localStorage.getItem('TradeOfferToken')

    setDataLoading(true)
    await axios
      .get(`${BASE_URL}stores/store_branches/${storeData?.store_id ?? storeData?.id}?token=${token}`)
      .then(res => {
        console.log(res)
        if (res.data.status == 'success') {
          if (storeData?.store_id) {
            if (storeData?.user_type == 'manager_store') {
              console.log(res.data.data, 'Ewklw')
              setBranches(res.data.data.filter(it => it.id == storeData?.branch_id))
              setOriginalData(res.data.data.filter(it => it.id == storeData?.branch_id))
            } else {
              setBranches(res.data.data)
              setOriginalData(res.data.data)
            }
          } else {
            setBranches(res.data.data)
            setOriginalData(res.data.data)
          }
          console.log(res.data.result)
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
    getBranchies()
  }, [])

  //selectedMainImageUrl
  const handleAddNewCategory = async (imageLink, imageLink2) => {
    const token = localStorage.getItem('tradeVenddor')

    const dataset = {
      ...newCat,
      image_ar: imageLink,
      image_en: imageLink2,
      main_status: mainStatus
    }

    await axios
      .post(`${BASE_URL}branches/add_new?token=${token}`, dataset)
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

  const handelEditBran = async () => {
    setAddLoading(true)
    let cover_img = rowData?.cover_img
    if (editCoverImg) {
      const formData2 = new FormData()
      formData2.append('image', editCoverImg)
      const response = await axios.post(`${BASE_URL}img_upload`, formData2)
      cover_img = response.data.data.image
    }
    if (imgEdit != null) {
      const formData = new FormData()
      formData.append('image', imgEdit)
      axios.post(BASE_URL + 'img_upload', formData).then(res2 => {
        if (res2.data.status == 'success') {
          const data_send = {
            ...rowData,
            user_id: storeData?.user_id,
            store_id: storeData?.store_id ?? storeData?.id,
            image: res2.data?.data?.image,
            cover_img
          }
          axios
            .post(BASE_URL + `branches/update_one/${rowData?.id}`, data_send)
            .then(res => {
              if (res.data.status == 'success') {
                toast.success(res.data.message)
                getBranchies()
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
        } else if (res2.data.status == 'error') {
          toast.error(res2.data.message)
        } else {
          toast.error('حدث خطأ فى رفع الصوره')
        }
      })
    } else {
      const data_send = {
        ...rowData,
        user_id: storeData?.user_id,
        cover_img,
        store_id: storeData?.store_id ?? storeData?.id
      }
      axios
        .post(BASE_URL + `branches/update_one/${rowData?.id}`, data_send)
        .then(res => {
          if (res.data.status == 'success') {
            toast.success(res.data.message)
            getBranchies()
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
  }

  const handleAddFile = async () => {
    setAddLoading(true)
    const formData2 = new FormData()
    formData2.append('image', coverImg)
    const response = await axios.post(`${BASE_URL}img_upload`, formData2)
    let img_cover = ''
    img_cover = response.data.data.image
    if (img != null) {
      const formData = new FormData()
      formData.append('image', img)
      await axios
        .post(BASE_URL + `img_upload`, formData)
        .then(res2 => {
          if (res2.data.status == 'success') {
            const data_send = {
              ...newBranch,
              location: null, //'location'
              user_id: storeData?.user_id,
              store_id: storeData?.store_id ?? storeData?.id,
              latitude: newBranch.lat ?? 0,
              longitude: newBranch.lng ?? 0,
              cover_img: img_cover,
              main_status: mainStatus,
              image: res2.data?.data?.image
            }
            console.log(data_send)
            axios
              .post(BASE_URL + 'branches/add_new', data_send)
              .then(res => {
                // console.log(res)
                if (res.data.status == 'success') {
                  toast.success(res.data.message)
                  getBranchies()
                  setShowAddCatModal(false)
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
          } else if (res2.data.status == 'error') {
            toast.error(res2.data.message)
          } else {
            toast.error('حدث خطأ أثناء رفع الصوره')
          }
        })
        .catch(e => console.log(e))
    } else {
      const data_send = {
        ...newBranch,
        location: null, //'location'
        user_id: storeData?.user_id,
        store_id: storeData?.store_id ?? storeData?.id,
        latitude: newBranch.lat ?? 0,
        longitude: newBranch.lng ?? 0,
        cover_img: img_cover,
        main_status: mainStatus
      }
      console.log(data_send)
      await axios
        .post(BASE_URL + 'branches/add_new', data_send)
        .then(res => {
          // console.log(res)
          if (res.data.status == 'success') {
            toast.success(res.data.message)
            getBranchies()
            setShowAddCatModal(false)
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
  }

  const getAllCategories = async () => {
    const token = localStorage.getItem('TradeOfferToken')

    setDataLoading(true)
    await axios
      .get(`${BASE_URL}branches/get_all?token=${token}`)
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
    setShowAddCatModal(false)
    setSelectedCheckbox([])
    setIsIndeterminateCheckbox(false)
  }

  // filteraiton part

  // const handleSearch=()=>{
  //   setBranches(originalData.filter(it=>it.));
  // }

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
        setBranches(newData)
      } else {
        setBranches(originalData)
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
          </div>
          <div className='title_add d-flex align-items-center justify-content-between mb-2'>
            <h5>{`${t('branches')}`}</h5>
            {storeData?.store_id ? (
              storeData?.user_type != 'manager_store' && (
                <Button
                  onClick={() => {
                    setShowAddCatModal(true)
                  }}
                  variant='contained'
                >
                  {t('add')}
                </Button>
              )
            ) : (
              <Button
                onClick={() => {
                  setShowAddCatModal(true)
                }}
                variant='contained'
              >
                {t('add')}
              </Button>
            )}
          </div>

          {/* {dataLoading ? <Loader size='md' /> : <TableLayout headers={categoriesHeader} data={branches} />} */}
        </div>
      </div>

      <DataGrid
        autoHeight
        pagination
        rows={branches ? branches : []}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[10, 20, 40, 50]}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={showAddCatModal}>
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{t('Add_New_Branch')}</Typography>
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
                  setNewBranch({ ...newBranch, address_ar: e.target.value })
                }}
                fullWidth
                label={`${t('add_ar')}`}
                placeholder={t('add_ar')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, address_en: e.target.value })
                }}
                fullWidth
                label={`${t('add_en')}`}
                placeholder={t('add_en')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, phone: e.target.value })
                }}
                fullWidth
                label={`${t('phone')}`}
                placeholder={t('phone')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, covered_zone: e.target.value })
                }}
                fullWidth
                label={`${t('cov_zon')}`}
                placeholder={t('cov_zon')}
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

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <FormControl fullWidth>
                <label htmlFor={`file2`}>{t('cover_img')}</label>
                <input
                  onChange={e => {
                    setCoverImg(e.target.files[0])
                    setCoverImgUrl(URL.createObjectURL(e.target.files[0]))
                  }}
                  type='file'
                  id={`file2`}
                />
              </FormControl>
            </FormControl>
            <div>
              {coverImgUrl != '' && (
                <div className='my-2'>
                  <img style={{ width: '100px' }} src={coverImgUrl} alt='' />
                </div>
              )}
            </div>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <FormControl fullWidth>
                <label htmlFor={`file2`}>{t('main_bran')}</label>
              </FormControl>
              <div
                onClick={() => {
                  setMainStatus(mainStatus == 1 ? 0 : 1)
                }}
                className={mainStatus ? 'parent_stauts active' : 'parent_stauts'}
              >
                <div className='child_status'></div>
              </div>
            </FormControl>
          </Box>
          {/* <Box sx={{ my: 4 }}>
            <div style={{ width: '90%', margin: '10px auto' }}>
              <label htmlFor=''>حدد المكان من الخريطه</label>
              <MapContainer center={[31.95, 35.91]} zoom={13} style={{ height: '80vh', width: '100%' }}>
                <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
              {position && (
                <div style={{ marginTop: '20px' }}>
                  <p>Latitude: {position.lat}</p>
                  <p>Longitude: {position.lng}</p>
                </div>
              )}
            </div>
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
            <Button color='secondary' variant='tonal' onClick={handleClose}>
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
          <Typography variant='h3'>{`${t('edit_branch')}`}</Typography>
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
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.address_ar}
                onChange={e => {
                  setRowData({ ...rowData, address_ar: e.target.value })
                }}
                fullWidth
                label={`${t('add_ar')}`}
                placeholder={t('add_ar')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.address_en}
                onChange={e => {
                  setRowData({ ...rowData, address_en: e.target.value })
                }}
                fullWidth
                label={`${t('add_en')}`}
                placeholder={t('add_en')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.phone}
                onChange={e => {
                  setRowData({ ...rowData, phone: e.target.value })
                }}
                fullWidth
                label={`${t('phone')}`}
                placeholder={t('phone')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                value={rowData?.covered_zone}
                onChange={e => {
                  setRowData({ ...rowData, covered_zone: e.target.value })
                }}
                fullWidth
                label={`${t('cov_zon')}`}
                placeholder={t('cov_zon')}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <div className='field_input'>
              <label htmlFor=''>{t('img')}</label>
              <input
                type='file'
                onChange={e => {
                  setImgEdit(e.target.files[0])
                  setImgEditUrl(URL.createObjectURL(e.target.files[0]))
                }}
              />
            </div>
            <div>
              {imgEditUrl != '' && (
                <div className='my-2'>
                  <img style={{ width: '100px' }} src={imgEditUrl} alt='' />
                </div>
              )}
            </div>
          </Box>
          <Box sx={{ my: 4 }}>
            <div className='field_input'>
              <label htmlFor=''>{t('cover_img')}</label>
              <input
                type='file'
                onChange={e => {
                  setEditCoverImg(e.target.files[0])
                  setEditCoverImgUrl(URL.createObjectURL(e.target.files[0]))
                }}
              />
            </div>
            <div>
              {editCoverImgUrl != '' && (
                <div className='my-2'>
                  <img style={{ width: '100px' }} src={editCoverImgUrl} alt='' />
                </div>
              )}
            </div>
          </Box>
          <Box sx={{ my: 4 }}>
            {/* <div style={{ width: '90%', margin: 'auto' }}>
              <label htmlFor=''>{t('location')}</label>
              <MapContainer
                center={[rowData?.latitude, rowData?.longitude]}
                zoom={13}
                style={{ height: '80vh', width: '100%' }}
              >
                <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker2 />
              </MapContainer>
              {rowData && (
                <div style={{ marginTop: '20px' }}>
                  <p>Latitude: {rowData.latitude}</p>
                  <p>Longitude: {rowData.longitude}</p>
                </div>
              )}
            </div> */}
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
            <Button disabled={addLoading} type='submit' variant='contained' onClick={handelEditBran}>
              {t('yes')}
            </Button>
            <Button color='secondary' variant='tonal' onClick={handleClose}>
              {t('cancel')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BranchesPage
