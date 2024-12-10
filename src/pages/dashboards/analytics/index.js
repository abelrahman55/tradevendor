// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
import AnalyticsOrderVisits from 'src/views/dashboards/analytics/AnalyticsOrderVisits'
import AnalyticsTotalEarning from 'src/views/dashboards/analytics/AnalyticsTotalEarning'
import AnalyticsSourceVisits from 'src/views/dashboards/analytics/AnalyticsSourceVisits'
import AnalyticsEarningReports from 'src/views/dashboards/analytics/AnalyticsEarningReports'
import AnalyticsSupportTracker from 'src/views/dashboards/analytics/AnalyticsSupportTracker'
import AnalyticsSalesByCountries from 'src/views/dashboards/analytics/AnalyticsSalesByCountries'
import AnalyticsMonthlyCampaignState from 'src/views/dashboards/analytics/AnalyticsMonthlyCampaignState'
import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
import axios from 'axios'
import { BASE_URL } from 'src/constants'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const AnalyticsDashboard = () => {
  let localData = localStorage.getItem('tradeVenddor')
  let storeData = localData && JSON.parse(localData)
  const [pageLoading, setPageLoading] = useState(false)
  const [storeStats, setStorStats] = useState({})
  const { t } = useTranslation()

  const getStatistics = () => {
    setPageLoading(true)
    axios
      .get(BASE_URL + `stores/store_statistics/${storeData?.store_id ?? storeData?.id}`)
      .then(res => {
        console.log(res.data.result)
        if (res.data.status == 'success') {
          setStorStats(res.data.result)
        }
      })
      .catch(e => console.log(e))
      .finally(() => {
        setPageLoading(false)
      })
  }
  useEffect(() => {
    getStatistics()
  }, [])

  return (
    <ApexChartWrapper>
      {pageLoading ? (
        <div
          style={{
            height: '100vh'
          }}
        >
          <Spinner />
        </div>
      ) : (
        <KeenSliderWrapper>
          <Grid container spacing={6}>
            <Grid item xs={12} lg={6}>
              <AnalyticsWebsiteAnalyticsSlider stats={storeStats} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <AnalyticsOrderVisits stats={storeStats} />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <CardStatsWithAreaChart
                stats={storeStats?.orders_value}
                chartColor='success'
                avatarColor='success'
                title={t('orders_value')}
                avatarIcon='tabler:credit-card'
                chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AnalyticsEarningReports />
            </Grid>
            <Grid item xs={12} md={6}>
              <AnalyticsSupportTracker />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsSalesByCountries />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsTotalEarning />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsMonthlyCampaignState />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsSourceVisits />
            </Grid>
            <Grid item xs={12} lg={8}>
              <AnalyticsProject />
            </Grid>
          </Grid>
        </KeenSliderWrapper>
      )}
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
