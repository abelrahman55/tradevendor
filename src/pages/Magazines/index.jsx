/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Menu, Preview, add, exitModal, eyeOff, eyeOn, search, edit } from 'src/constants/svgIcons'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Loader } from 'rsuite'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'

import { DataGrid } from '@mui/x-data-grid'
import { getInitials } from 'src/@core/utils/get-initials'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
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
import { CiCirclePlus } from 'react-icons/ci'

// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
// import L from 'leaflet'
import moment from 'moment'

// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
// })

const BranchesPage = () => {
  const { t, i18n } = useTranslation()
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date()) // Added state for end date
  const [imagesList, setImagesList] = useState([{ img: null, imgUrl: '', id: 1 }])
  const [branches, setBranches] = useState([])
  const [editProdBranches, setEditProdBranches] = useState([])

  const [selectedBranches, setSelectedBranches] = useState([])
  const [coverImg, setCoverImg] = useState(null)
  const [subcategories, setSubcategories] = useState([])

  const [newBranch, setNewBranch] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    subcategory_id: '',
    discount: '',
    address_en: '',
    phone: '',
    branch_id: '',
    cover: '',
    address_ar: '',
    lat: '',
    lng: '',
    covered_zone: 4
  })
  const [editCoverImg, setEditCoverImg] = useState(null)
  const [editCoverImgUrl, setEditCoverImgUrl] = useState('')
  const [allCategories, setAllCategories] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [imgEdit, setImgEdit] = useState(null)
  const [imgEditUrl, setImgEditUrl] = useState('')
  const [showImagesModal, setShowImagesModal] = useState(false)
  const [images, setImages] = useState([])
  const [showChangeStatus, setShowChangeStatus] = useState(false)

  const [selectedCategories, setSelectedCategories] = useState([])

  // const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('Add')
  const [selectedCheckbox, setSelectedCheckbox] = useState([])
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState(false)
  const [data, setData] = useState(null)
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
  const [prodLoading, setProdLoading] = useState(false)

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

  const getOfferProducts = async id => {
    setProdLoading(true)
    axios
      .get(BASE_URL + 'offers/get_offer_products/' + id)
      .then(res => {
        console.log(res)
        setImages(res.data.message)
      })
      .catch(e => console.log(e))
      .finally(() => {
        setProdLoading(false)
      })
  }

  const columns = [
    {
      flex: 0.1,
      field: 'image',
      minWidth: 220,
      headerName: `${t('img')}`,
      renderCell: ({ row }) => {
        const { cover } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <img style={{ width: '50px' }} src={cover} alt='' />
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'Start At',
      minWidth: 220,
      headerName: `${t('start_at')}`,
      renderCell: ({ row }) => {
        const { start_at } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {moment(start_at).format('l')}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'End Date',
      minWidth: 220,
      headerName: `${t('end_date')}`,
      renderCell: ({ row }) => {
        const { end_at } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {moment(end_at).format('l')}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'title_ar',
      minWidth: 220,
      headerName: `${t('name_ar')}`,
      renderCell: ({ row }) => {
        const { title_ar } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p>{title_ar}</p>
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'title_en',
      minWidth: 220,
      headerName: `${t('name_ar')}`,
      renderCell: ({ row }) => {
        const { title_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p>{title_en}</p>
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'description_ar',
      minWidth: 220,
      headerName: `${t('description_ar')}`,
      renderCell: ({ row }) => {
        const { description_ar } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p>{description_ar}</p>
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'description_en',
      minWidth: 220,
      headerName: `${t('description_en')}`,
      renderCell: ({ row }) => {
        const { description_en } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p>{description_en}</p>
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'branch',
      minWidth: 220,
      headerName: `${t('branch_name')}`,
      renderCell: ({ row }) => {
        const { branch } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                <p>{i18n.language == 'ar' ? branch?.name_ar : branch?.name_en}</p>
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'status',
      minWidth: 220,
      headerName: `${t('status')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {row?.hidden == 0 ? (
                <p>{i18n.language == 'ar' ? 'ظاهر' : 'appearance'}</p>
              ) : (
                <p>{i18n.language == 'ar' ? 'مخفى' : 'Hidden'}</p>
              )}
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'images',
      minWidth: 220,
      headerName: `${t('prods')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`OfferProducts/${row?.id}`}>
                <div className='btn btn-primary' variant='contained'>{`${t('prods')}`}</div>
              </Link>
            </Box>
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      field: 'imageee',
      minWidth: 220,
      headerName: `${t('images')}`,
      renderCell: ({ row }) => {
        // const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`MagazineImages/${row?.id}`}>
                <div className='btn btn-primary' variant='contained'>{`${t('images')}`}</div>
              </Link>
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
              <button
                onClick={() => {
                  setShowDeleteModal(true)
                  setRowData(row)
                  console.log(row)
                }}
                className='btn btn-primary'
              >
                {t('Delete')}
              </button>
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
              <button
                onClick={() => {
                  // console.log(row)

                  // return

                  setShowEditModal(true)
                  setRowData(row)
                  setStartDate(new Date(row?.start_at))
                  setEndDate(new Date(row?.end_at))
                  setImgEditUrl(row?.cover)
                  setEditProdBranches(row?.branches)
                }}
                className='btn btn-primary'
              >
                {t('edit')}
              </button>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'hidden',
      minWidth: 220,
      headerName: `${t('change_status')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                onClick={() => {
                  setChangeStatusModal(true)
                  setRowData(row)
                }}
                variant='contained'
              >{`${t('change_status')}`}</Button>
            </Box>
          </Box>
        )
      }
    }
  ]

  const productsColumns = [
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
      field: 'meta',
      minWidth: 220,
      headerName: `${t('meta')}`,
      renderCell: ({ row }) => {
        const { meta } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {meta}
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
      headerName: `${t('colors')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/ProductColor/${id}`}>
                <Button variant='contained'>{`${t('colors')}`}</Button>
              </Link>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'sizes',
      minWidth: 220,
      headerName: `${t('sizes')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/ProductSizes/${id}`}>
                <Button variant='contained'>{`${t('sizes')}`}</Button>
              </Link>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'addons',
      minWidth: 220,
      headerName: `${t('addons')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/ProductAddons/${id}`}>
                <Button variant='contained'>{`${t('addons')}`}</Button>
              </Link>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      field: 'attributes',
      minWidth: 220,
      headerName: `${t('attributes')}`,
      renderCell: ({ row }) => {
        const { id } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/ProductAttributes/${id}`}>
                <Button variant='contained'>{`${t('attributes')}`}</Button>
              </Link>
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
                  setImgUrl(row?.image)
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

  const getAllData = () => {
    setDataLoading(true)
    axios
      .get(`${BASE_URL}stores/store_offers/${storeData?.store_id ?? storeData?.id}`)
      .then(res => {
        if (res.data.status === 'success') {
          if (Array.isArray(res.data.message)) {
            setData(res.data.message)
            setOriginalData(res.data.message)
          }
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setDataLoading(false)
      })
  }

  const getStoreBranches = () => {
    setDataLoading(true)
    axios
      .get(`${BASE_URL}stores/store_branches/${storeData?.store_id ?? storeData?.id}`)
      .then(res => {
        // console.log(res.data, 'erle')
        if (res.data.status === 'success') {
          if (Array.isArray(res.data.data)) {
            setBranches(res.data.data)
            if (res.data.data.length > 0) {
              setNewBranch({ ...newBranch, branch_id: res.data.data[0].id })
            }
          }
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setDataLoading(false)
      })
  }

  const getStoreStores = () => {
    setDataLoading(true)
    axios
      .get(`${BASE_URL}stores/subcategories/${storeData?.store_id ?? storeData?.id}`)
      .then(res => {
        console.log(res.data, 'erle')
        if (res.data.status === 'success') {
          if (Array.isArray(res.data.data)) {
            setSubcategories(res.data.data)
            if (res.data.data.length > 0) {
              setNewBranch({ ...newBranch, subcategory_id: res.data.data[0].id })
            }
          }
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setDataLoading(false)
      })
  }
  useEffect(() => {
    getAllData()
    getStoreStores()
    getStoreBranches()
  }, [])

  const handleShow_hide = async () => {
    setChangeStatusLoading(true)
    const token = localStorage.getItem('tradeVenddor')
    await axios
      .get(`${BASE_URL}offers/change_status/${rowData?.id}`)
      .then(res => {
        console.log(res.data)
        if (res?.data && res?.data?.status == 'success') {
          toast.success(`تم ${rowData.hidden == '0' ? 'إلغاء تنشيط' : 'تنشيط'} الفئة بنجاح`)
          getAllData()
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

  const formatDate = date => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const handelEditBran = () => {
    setAddLoading(true)
    if (imgEdit != null) {
      const formData = new FormData()
      formData.append('image', imgEdit)
      axios.post(BASE_URL + 'img_upload', formData).then(res2 => {
        if (res2.data.status == 'success') {
          const data_send = {
            ...rowData,
            user_id: storeData?.user_id,
            store_id: storeData?.store_id ?? storeData?.id,
            cover: res2.data?.data?.image,
            start_at: formatDate(startDate) ?? rowData?.start_at,
            end_at: formatDate(endDate) ?? rowData?.end_at,
            branches: editProdBranches.includes('all')
              ? editProdBranches.map(it => it.id).join('**')
              : editProdBranches.join('**')
          }

          axios
            .post(BASE_URL + `offers/update_one/${rowData?.id}`, data_send)
            .then(res => {
              if (res.data.status == 'success') {
                toast.success(res.data.message)
                getAllData()
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
        store_id: storeData?.store_id ?? storeData?.id,
        cover: rowData?.cover,
        start_at: formatDate(startDate) ?? rowData?.start_at,
        end_at: formatDate(endDate) ?? rowData?.end_at,
        branches: editProdBranches.includes('all')
          ? editProdBranches.map(it => it.id).join('**')
          : editProdBranches.join('**')
      }
      axios
        .post(BASE_URL + `offers/update_one/${rowData?.id}`, data_send)
        .then(res => {
          if (res.data.status == 'success') {
            toast.success(res.data.message)
            getAllData()
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
    let images = ''

    try {
      // const uploadPromises = imagesList.map(async (item, index) => {
      //   const formData = new FormData()
      //   formData.append('image', item.img)
      //   const response = await axios.post(`${BASE_URL}img_upload`, formData)

      //   return response.data.data.image
      // })

      // const uploadedImages = await Promise.all(uploadPromises)

      // images = uploadedImages.join('**trade**') // Combine images

      const formData = new FormData()
      formData.append('image', coverImg)
      const response = await axios.post(`${BASE_URL}img_upload`, formData)

      let img = ''
      img = response.data.data.image

      const requestData = {
        // images,
        cover: img,
        start_at: formatDate(startDate),
        end_at: formatDate(endDate),
        description_ar: newBranch.description_ar,
        description_en: newBranch.description_en,
        title_ar: newBranch.name_ar,
        title_en: newBranch.name_en,
        discount: newBranch.discount,
        branch_id: newBranch.branch_id,
        subcategory_id: newBranch.subcategory_id,
        store_id: storeData.store_id ?? storeData?.id,
        branches: selectedBranches.includes('all') ? branches.map(it => it.id).join('**') : selectedBranches.join('**')
      }
      console.log(requestData)

      await axios.post(`${BASE_URL}offers/add_new`, { ...requestData })
      getAllData()
      setShowAddCatModal(false)
      toast.success('Successfully added!')
      setEndDate(new Date())
      setStartDate(new Date())
    } catch (error) {
      console.error(error)
      toast.error('Failed to add new item.')
    } finally {
      setAddLoading(false)
    }
  }

  const changeStatus = () => {
    setAddLoading(true)
    axios
      .get(BASE_URL + 'magazines/change_status/' + rowData?.id)
      .then(res => {
        if (res.data.status == 'success') {
          setShowChangeStatus(false)
          getAllData()
          toast.success(res.data.message)
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

  const getAllCategories = async () => {
    const token = localStorage.getItem('TradeOfferToken')

    setDataLoading(true)
    await axios
      .get(`${BASE_URL}branches/get_all?token=${token}`)
      .then(res => {
        console.log(res.data)
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

  const handleChangeImage = (imgFile, id) => {
    setImagesList(
      imagesList.map(item => {
        if (item.id === id) {
          return { ...item, img: imgFile, imgUrl: URL.createObjectURL(imgFile) }
        }

        return item
      })
    )
  }

  // filteraiton part

  useEffect(() => {
    if (originalData && originalData.length >= 1) {
      if (searchValue.length > 0) {
        console.log(searchValue)

        const newData = originalData.filter(cat => {
          if (
            searchValue.length > 0 &&
            (cat.title_ar.toLowerCase().includes(searchValue.toLowerCase()) ||
              cat.title_en.toLowerCase().includes(searchValue.toLowerCase()) ||
              cat.description_ar.toLowerCase().includes(searchValue.toLowerCase()) ||
              cat.description_en.toLowerCase().includes(searchValue.toLowerCase()))
          ) {
            return true
          }

          return false
        })
        setData(newData)
      } else {
        setData(originalData)
      }
    }
  }, [searchValue])

  const handelDelete = () => {
    setAddLoading(true)
    axios
      .get(BASE_URL + 'offers/delete_one/' + rowData?.id)
      .then(res => {
        if (res.data.status == 'success') {
          toast.success(res.data.message)
          getAllData()
          setShowDeleteModal(false)
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
            <h5>{`${t('offers')}`}</h5>
            <Button
              onClick={() => {
                setShowAddCatModal(true)
              }}
              variant='contained'
            >
              {t('add')}
            </Button>
          </div>

          {/* {dataLoading ? <Loader size='md' /> : <TableLayout headers={categoriesHeader} data={branches} />} */}
        </div>
      </div>

      <DataGrid
        autoHeight
        pagination
        rows={data ? data : []}
        rowHeight={62}
        columns={columns}
        pageSizeOptions={[5, 10, 20, 40]}
        disableRowSelectionOnClick
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={() => {
          setShowImagesModal(false)
        }}
        open={showImagesModal}
      >
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`${t('products')}`}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <div className='image-popup-container'>
            {prodLoading ? (
              'loading...'
            ) : (
              <DataGrid
                autoHeight
                pagination
                rows={images ? images : []}
                rowHeight={62}
                columns={productsColumns}
                pageSizeOptions={[5, 10, 20, 40]}
                disableRowSelectionOnClick
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
              />
            )}
          </div>
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
          setShowChangeStatus(false)
        }}
        open={showChangeStatus}
      >
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`${t('cha_sta')}`}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        ></DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box className='demo-space-x'>
            <Button disabled={addLoading} type='submit' variant='contained' onClick={changeStatus}>
              {t('yes')}
            </Button>
            <Button color='secondary' variant='tonal' onClick={handleClose}>
              {t('cancel')}
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
          <Typography variant='h3'>{t(`Add_New_Magazine`)}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <label htmlFor='start_date'>{t('start_ar')}</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                showTimeSelect
                dateFormat='yyyy-MM-dd HH:mm:ss'
                timeIntervals={1}
                className={`form-control`}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <label htmlFor='start_date'>{t('end_at')}</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                showTimeSelect
                dateFormat='yyyy-MM-dd HH:mm:ss'
                timeIntervals={1}
                className={`form-control`}
              />
            </FormControl>
          </Box>

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
                  setNewBranch({ ...newBranch, description_ar: e.target.value })
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
                onChange={e => {
                  setNewBranch({ ...newBranch, description_en: e.target.value })
                }}
                fullWidth
                label={`${t('description_en')}`}
                placeholder={t('description_en')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('branches')}</InputLabel>
              {/* <Select
                native
                label='Age'
                defaultValue=''
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
                value={newBranch?.branch_id}
                onChange={e => {
                  console.log(e.target.value)
                  setNewBranch({ ...newBranch, branch_id: e.target.value })
                }}
              >
                <option disabled={true}></option>
                <option key={0} value={'all'}>
                  {i18n.language == 'ar' ? 'الكل' : 'all'}
                </option>
                {branches &&
                  branches?.map(it => {
                    return (
                      <option key={it.id} value={it.id}>
                        {i18n.language == 'ar' ? it.name_ar : it.name_en}
                      </option>
                    )
                  })}
              </Select> */}

              <Select
                multiple
                displayEmpty
                value={selectedBranches}
                input={<OutlinedInput />}
                onChange={e => {
                  console.log(e.target.value)
                  setSelectedBranches([...e.target.value])
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem disabled value=''>
                  <em>Placeholder</em>
                </MenuItem>
                <MenuItem key={0} value={'all'}>
                  {i18n.language == 'ar' ? 'الكل' : 'all'}
                </MenuItem>
                {branches &&
                  Array.isArray(branches) &&
                  branches.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name_ar}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('subs')}</InputLabel>
              <Select
                native
                label='Age'
                defaultValue=''
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
                value={newBranch?.subcategory_id}
                onChange={e => {
                  console.log(e.target.value)
                  setNewBranch({ ...newBranch, subcategory_id: e.target.value })
                }}
              >
                <option disabled={true}></option>
                {/*<option key={0} value={'all'}>
                  {i18n.language == 'ar' ? 'الكل' : 'all'}
                </option>*/}
                {subcategories &&
                  subcategories?.map(it => {
                    return (
                      <option key={it.id} value={it.id}>
                        {i18n.language == 'ar' ? it.title_ar : it.title_en}
                      </option>
                    )
                  })}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <FormControl fullWidth>
                <label htmlFor={`file`}>{t('cov_img')}</label>
                <input
                  onChange={e => {
                    setCoverImg(e.target.files[0])
                  }}
                  type='file'
                  id={`file`}
                />
              </FormControl>
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setNewBranch({ ...newBranch, discount: e.target.value })
                }}
                fullWidth
                label={`${t('discount')}%`}
                placeholder={t('discount')}
              />
            </FormControl>
          </Box>

          {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4>إضافه المزيد</h4>
            <CiCirclePlus
              onClick={() => setImagesList([...imagesList, { img: null, imgUrl: '', id: imagesList.length + 1 }])}
              className='text-success'
              style={{ fontSize: '22px', cursor: 'pointer' }}
            />
          </div>
          {imagesList.map((item, index) => (
            <>
              <Box sx={{ my: 4 }}>
                <FormControl fullWidth>
                  <label htmlFor={`file_${item.id}`}>صورة العرض </label>
                  <input
                    onChange={e => handleChangeImage(e.target.files[0], item.id)}
                    type='file'
                    id={`file_${item.id}`}
                  />
                </FormControl>
              </Box>
              {item.imgUrl && (
                <div className='my-2 d-flex gap-2 align-items-center'>
                  <img style={{ width: '100px' }} src={item.imgUrl} alt='' />
                </div>
              )}
              {index !== 0 && (
                <div className='my-2'>
                  <button
                    type='button'
                    onClick={() => handleDelItem(item.id)}
                    className='btn text-light'
                    style={{ backgroundColor: 'red' }}
                  >
                    حذف
                  </button>
                </div>
              )}
            </>
          ))} */}
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
          <Typography variant='h3'>{`${t('edit_maga')}`}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <label htmlFor='start_date'>{t('start_ar')}</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                showTimeSelect
                dateFormat='yyyy-MM-dd HH:mm:ss'
                timeIntervals={1}
                className={`form-control`}
              />
            </FormControl>
          </Box>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <label htmlFor='start_date'>{t('end_at')}</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                showTimeSelect
                dateFormat='yyyy-MM-dd HH:mm:ss'
                timeIntervals={1}
                className={`form-control`}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setRowData({ ...rowData, title_ar: e.target.value })
                }}
                value={rowData?.title_ar}
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
                value={rowData?.title_en}
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
                  setRowData({ ...rowData, description_ar: e.target.value })
                }}
                value={rowData?.description_ar}
                fullWidth
                label={`${t('description_ar')}`}
                placeholder={t('description_ar')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setRowData({ ...rowData, description_en: e.target.value })
                }}
                value={rowData?.description_en}
                fullWidth
                label={`${t('description_en')}`}
                placeholder={t('description_en')}
              />
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('branches')}</InputLabel>
              <Select
                multiple
                displayEmpty
                value={editProdBranches}
                input={<OutlinedInput />}
                onChange={e => {
                  console.log(e.target.value)
                  setEditProdBranches([...e.target.value])
                }}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem disabled value=''>
                  <em>Placeholder</em>
                </MenuItem>
                {branches &&
                  Array.isArray(branches) &&
                  branches.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name_ar}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor='outlined-age-native-simple'>{t('subs')}</InputLabel>
              <Select
                native
                label='Age'
                defaultValue=''
                inputProps={{
                  name: 'age',
                  id: 'outlined-age-native-simple'
                }}
                value={rowData?.subcategory_id}
                onChange={e => {
                  console.log(e.target.value)
                  setRowData({ ...newBranch, subcategory_id: e.target.value })
                }}
              >
                <option disabled={true}></option>
                {subcategories &&
                  subcategories?.map(it => {
                    return (
                      <option key={it.id} value={it.id}>
                        {it.title_ar}
                      </option>
                    )
                  })}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ my: 4 }}>
            <FormControl style={{ width: '100%' }}>
              <FormControl fullWidth>
                <label htmlFor={`file`}>{t('cov_img')}</label>
                <input
                  onChange={e => {
                    setImgEdit(e.target.files[0])
                    setImgEditUrl(URL.createObjectURL(e.target.files[0]))
                  }}
                  type='file'
                  id={`file`}
                />
              </FormControl>
            </FormControl>
          </Box>
          <div>
            {imgEditUrl != '' && (
              <div className='my-2'>
                <img style={{ width: '100px' }} src={imgEditUrl} alt='' />
              </div>
            )}
          </div>

          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <CustomTextField
                onChange={e => {
                  setRowData({ ...rowData, discount: e.target.value })
                }}
                value={rowData?.discount}
                fullWidth
                label={`${t('discount')}%`}
                placeholder={t('discount')}
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
            <Button disabled={addLoading} type='submit' variant='contained' onClick={handelEditBran}>
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
          <Typography variant='h3'>{t('Delete This Offer')}</Typography>
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
              {t('Delete')}
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

      <Dialog
        fullWidth
        maxWidth='md'
        scroll='body'
        onClose={() => {
          setChangeStatusModal(false)
        }}
        open={changeStatusModal}
      >
        <DialogTitle
          component='div'
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h3'>{`${t('change_status')}`}</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <Box sx={{ my: 4 }}>
            <h5>{rowData?.hidden == 0 ? t('do_you_hid') : t('do_you_show')}</h5>
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
            <Button disabled={addLoading} type='submit' variant='contained' onClick={handleShow_hide}>
              {t('yes')}
            </Button>
            <Button
              color='secondary'
              variant='tonal'
              onClick={() => {
                setChangeStatusModal(false)
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

export default BranchesPage
