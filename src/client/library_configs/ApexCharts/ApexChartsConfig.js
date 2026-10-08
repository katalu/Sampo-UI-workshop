
import intl from 'react-intl-universal'
import { generateLabelForMissingValue } from '../../helpers/helpers'

// list of colors generated with http://phrogz.net/css/distinct-colors.html
const pieChartColors = ['#a12a3c', '#0f00b5', '#81c7a4', '#ffdea6', '#ff0033', '#424cff', '#1b6935', '#ff9d00', '#5c3c43',
  '#5f74b8', '#18b532', '#3b3226', '#fa216d', '#153ca1', '#00ff09', '#703a00', '#b31772', '#a4c9fc', '#273623',
  '#f57200', '#360e2c', '#001c3d', '#ccffa6', '#a18068', '#ba79b6', '#004e75', '#547500', '#c2774c', '#f321fa', '#1793b3',
  '#929c65', '#b53218', '#563c5c', '#1ac2c4', '#c4c734', '#4c150a', '#912eb3', '#2a5252', '#524b00', '#bf7d7c', '#24005e',
  '#20f2ba', '#b5882f']

const defaultSliceVisibilityThreshold = 0.01

export const createSingleLineChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize
}) => {
  const {
    xaxisType,
    xaxisTickAmount,
    xaxisLabels,
    title,
    seriesTitle,
    xaxisTitle,
    yaxisTitle,
    stroke,
    fill,
    tooltip
  } = resultClassConfig
  const customizedCategoryLabels = resultClassConfig.resultMapperConfig && resultClassConfig.resultMapperConfig.customizedCategoryLabels
  const apexChartOptionsWithData = {
    chart: {
      type: 'line',
      width: '100%',
      height: '100%',
      fontFamily: 'Roboto'
    },
    series: [
      {
        name: seriesTitle,
        data: results.seriesData
      }
    ],
    title: {
      text: title
    },
    xaxis: {
      ...(xaxisType) && { type: xaxisType }, // default is 'category'
      ...(xaxisTickAmount) && { tickAmount: xaxisTickAmount },
      ...(xaxisLabels) && { labels: xaxisLabels },
      ...(customizedCategoryLabels) && { overwriteCategories: results.categeryLabels },
      categories: results.categoriesData,
      title: {
        text: xaxisTitle
      }
    },
    yaxis: {
      title: {
        text: yaxisTitle
      }
    },
    ...(stroke) && { stroke },
    ...(fill) && { fill },
    ...(tooltip) && { tooltip }
  }
  return apexChartOptionsWithData
}

export const createMultipleLineChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize
}) => {
  const {
    xaxisType,
    xaxisTickAmount,
    xaxisLabels,
    title,
    xaxisTitle,
    yaxisTitle,
    stroke,
    fill,
    tooltip
  } = resultClassConfig

  const isMobile = screenSize === 'xs' || screenSize === 'sm'
  const chartTitle = isMobile
    ? (resultClassConfig.mobileTitle || title)
    : title

  const series = []
  for (const lineID in results) {
    series.push({
      name: intl.get(`lineChart.${lineID}`) || lineID,
      data: results[lineID]
    })
  }

  const apexChartOptionsWithData = {
    chart: {
      type: 'area',
      width: '100%',
      height: isMobile ? 320 : '100%',
      fontFamily: 'Roboto',
      toolbar: {
        show: !isMobile
      }
    },
    series,
    title: {
      text: chartTitle,
      style: {
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: isMobile ? '12px' : '14px',
        fontWeight: 400
      }
    },
    dataLabels: {
      enabled: false
    },

    legend: {
      position: isMobile ? 'bottom' : 'top'
    },

    xaxis: {
      ...(xaxisType && { type: xaxisType }),
      ...(xaxisTickAmount && !isMobile && { tickAmount: xaxisTickAmount }),
      labels: {
        ...(xaxisLabels || {}),
        hideOverlappingLabels: true,
        rotate: isMobile ? -45 : 0,
        style: {
          fontSize: isMobile ? '10px' : '12px'
        }
      },
      title: {
        text: isMobile ? undefined : xaxisTitle
      }
    },
    yaxis: {
      title: {
        text: isMobile ? undefined : yaxisTitle
      }
    },
    grid: {
      padding: {
        top: isMobile ? 20 : 0
      }
    },
    colors: ['#d32f2f'],

    ...(stroke && { stroke }),
    ...(fill && { fill }),
    ...(tooltip && { tooltip })
  }

  return apexChartOptionsWithData
}

export const createTopTimelineChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize
}) => {
  // console.log('topN', results.topN)
  const {
    title,
    fill,
    tooltip,
    legend,
    grid
  } = resultClassConfig
  results.series.forEach(x => { x.name = intl.get(`lineChart.${x.name}`) || x.name })
  const apexChartOptionsWithData = {
    chart: {
      id: 'topN',
      type: 'scatter',
      width: '100%',
      height: '100%',
      fontFamily: 'Roboto',
      toolbar: {
        autoSelected: 'pan',
        show: true
      }
    },
    series: results.series,
    title: {
      text: title.replace(/{}/g, results.topN.toString()),
      align: 'left'
    },
    xaxis: {
      type: 'datetime',
      min: results.minUTC,
      max: results.maxUTC,
      lines: {
        show: true
      }
    },
    yaxis: {
      min: -1,
      max: results.topTies.length,
      tickAmount: results.topTies.length + 1,
      reversed: true,
      labels: {
        formatter: function (value) {
          return (value >= 0) ? results.topTies[value] || '' : ''
        },
        minWidth: 150,
        maxWidth: 300,
        align: 'right'
      }
    },
    ...(grid) && { grid },
    ...(tooltip) && { tooltip },
    ...(legend) && { legend },
    ...(fill) && { fill }
  }
  return apexChartOptionsWithData
}

export const createTopTimelineChartData2 = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize
}) => {
  const {
    title,
    stroke,
    fill,
    tooltip,
    xaxis,
    yaxis,
    grid
  } = resultClassConfig
  results.forEach(x => { x.name = intl.get(`lineChart.${x.name}`) || x.name })
  const apexChartOptionsWithData = {
    series: results,
    chart: {
      id: 'area-datetime',
      type: 'area',
      height: '100%'
      /**
       brush: { target: 'topN', enabled: true },
       selection: {
         enabled: true,
         xaxis: {
           min: results.minUTC,
           max: results.maxUTC2
          }
        }
        */
    },
    dataLabels: { enabled: false },
    ...(title) && { title },
    ...(xaxis) && { xaxis },
    ...(yaxis) && { yaxis },
    ...(grid) && { grid },
    ...(tooltip) && { tooltip },
    ...(stroke) && { stroke },
    ...(fill) && { fill }
  }
  return apexChartOptionsWithData
}

export const createApexPieChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize
}) => {
  const labels = []
  const series = []
  let otherCount = 0
  const arraySum = results.reduce((sum, current) => sum + current.instanceCount, 0)
  const { sliceVisibilityThreshold = defaultSliceVisibilityThreshold, propertyID, title = null } = resultClassConfig
  results.forEach(item => {
    const sliceFraction = item.instanceCount / arraySum
    if (sliceFraction <= sliceVisibilityThreshold) {
      otherCount += item.instanceCount
    } else {
      if (item.id === 'http://ldf.fi/MISSING_VALUE' || item.category === 'http://ldf.fi/MISSING_VALUE') {
        item.prefLabel = generateLabelForMissingValue({ perspective: facetClass, property: propertyID })
      }
      labels.push(item.prefLabel)
      series.push(item.instanceCount)
    }
  })
  if (otherCount !== 0) {
    labels.push(intl.get('apexCharts.other') || 'Other')
    series.push(otherCount)
  }
  let chartColors = []
  if (series.length > pieChartColors.length) {
    const quotient = Math.ceil(series.length / pieChartColors.length)
    for (let i = 0; i < quotient; i++) {
      chartColors = chartColors.concat(pieChartColors)
    }
  } else {
    chartColors = pieChartColors
  }
  chartColors = chartColors.slice(0, series.length)
  if (screenSize === 'xs' || screenSize === 'sm') {
    apexPieChartOptions.legend = {
      ...apexPieChartOptions.legend,
      position: 'bottom',
      width: '100%',
      fontSize: 12,
      horizontalAlign: 'left'
    }
    apexPieChartOptions.dataLabels = { enabled: false }
  }
  const apexChartOptionsWithData = {
    ...apexPieChartOptions,
    colors: chartColors,
    series,
    labels,
    ...(title) && { title }
  }
  return apexChartOptionsWithData
}

const apexPieChartOptions = {
  // see https://apexcharts.com/docs --> Options
  chart: {
    type: 'pie',
    width: '100%',
    height: '100%',
    parentHeightOffset: 10,
    fontFamily: 'Roboto'
  },
  legend: {
    position: 'right',
    width: 400,
    fontSize: 16,
    itemMargin: {
      horizontal: 5
    },
    onItemHover: {
      highlightDataSeries: false
    },
    onItemClick: {
      toggleDataSeries: false
    },
    markers: {
      width: 18,
      height: 18
    },
    formatter: (seriesName, opts) => {
      const { series } = opts.w.globals
      const value = series[opts.seriesIndex]
      const arrSum = series.reduce((a, b) => a + b, 0)
      const percentage = value / arrSum * 100
      return `${seriesName}: ${value} (${percentage.toFixed(2)} %)`
    }
  },
  tooltip: {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const arrSum = series.reduce((a, b) => a + b, 0)
      const value = series[seriesIndex]
      const percentage = value / arrSum * 100
      return `
                <div class="apexcharts-custom-tooltip">
                  <span>${w.config.labels[seriesIndex]}: ${value} (${percentage.toFixed(2)} %)</span> 
                </div>  
      
            `
    }
  }
}

export const createApexBarChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  chartTypeObj,
  resultClassConfig,
  screenSize
}) => {
  const {
    title,
    seriesTitle,
    xaxisTitle,
    yaxisTitle
  } = resultClassConfig
  const categories = []
  const colors = []
  const data = []
  let otherCount = 0
  const arraySum = results.reduce((sum, current) => sum + current.instanceCount, 0)
  const { sliceVisibilityThreshold = defaultSliceVisibilityThreshold, propertyID } = resultClassConfig
  if (chartTypeObj && chartTypeObj.sortByLocaleCompare) {
    const prop = chartTypeObj.sortByLocaleCompare
    results.sort((a, b) => a[prop].localeCompare(b[prop]))
  }
  results.forEach(item => {
    const sliceFraction = item.instanceCount / arraySum
    if (sliceFraction <= sliceVisibilityThreshold) {
      otherCount += item.instanceCount
    } else {
      if (item.id === 'http://ldf.fi/MISSING_VALUE' || item.category === 'http://ldf.fi/MISSING_VALUE') {
        item.prefLabel = generateLabelForMissingValue({ perspective: facetClass, property: propertyID })
      }
      categories.push(item.prefLabel)
      colors.push('#000000')
      data.push(item.instanceCount)
    }
  })
  if (otherCount !== 0) {
    categories.push(intl.get('apexCharts.other') || 'Other')
    colors.push('#000000')
    data.push(otherCount)
  }
  const apexChartOptionsWithData = {
    ...apexBarChartOptions,
    series: [{
      data,
      name: seriesTitle
    }],
    title: {
      text: title
    },
    xaxis: {
      categories,
      title: {
        text: xaxisTitle
      }
    },
    yaxis: {
      title: {
        text: yaxisTitle
      }
    },
    dataLabels: {
      offsetY: -20,
      style: {
        fontWeight: 400,
        colors
      }
    }
  }
  return apexChartOptionsWithData
}

const apexBarChartOptions = {
  // see https://apexcharts.com/docs --> Options
  chart: {
    type: 'bar',
    width: '100%',
    height: '100%',
    parentHeightOffset: 10,
    fontFamily: 'Roboto'
  },
  plotOptions: {
    bar: {
      dataLabels: {
        position: 'top',
        maxItems: 100,
        hideOverflowingLabels: true,
        orientation: 'horizontal'
      }
    }
  }
}

export const createApexTimelineChartData = ({
  resultClass,
  facetClass,
  perspectiveState,
  results,
  resultClassConfig,
  screenSize,
  fetchInstanceAnalysis
}) => {
  const {
    xaxisTitle,
    yaxisTitle
  } = resultClassConfig
  let min
  let max
  if (results && results.length > 0) {
    preprocessTimelineData(results)
    min = new Date(results[0].beginDate).getTime()
    max = new Date(results[results.length - 1].endDate).getTime()
  }
  const apexChartOptionsWithData = {
    ...timelineOptions,
    chart: {
      type: 'rangeBar',
      width: '100%',
      height: '100%',
      events: {
        click: (event, chartContext, config) => {
          if (chartContext.w.globals.initialSeries[config.seriesIndex]) {
            const data = chartContext.w.globals.initialSeries[config.seriesIndex].data[config.dataPointIndex]
            fetchInstanceAnalysis({
              resultClass: `${resultClass}Dialog`,
              facetClass,
              period: data.period,
              province: data.id
            })
          }
        },
        beforeResetZoom: (chartContext, opts) => {
          return { xaxis: { min, max } }
        }
      }
    },
    xaxis: {
      ...timelineOptions.xaxis,
      title: {
        text: xaxisTitle
      },
      min,
      max
    },
    yaxis: { title: { text: yaxisTitle } },
    series: results
  }
  return apexChartOptionsWithData
}

const timelineOptions = {
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '70%'
      // rangeBarGroupRows: true
    }
  },
  colors: [
    '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
    '#3F51B5', '#546E7A', '#D4526E', '#8D5B4C', '#F86624',
    '#D7263D', '#1B998B', '#2E294E', '#F46036', '#E2C044'
  ],
  fill: {
    type: 'solid'
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: value => {
        return new Date(value).getFullYear()
      }
    }
  },
  legend: {
    position: 'top'
  },
  tooltip: {
    custom: opts => {
      const data = opts.w.globals.initialSeries[opts.seriesIndex].data[opts.dataPointIndex]
      const { ylabel, seriesName } = opts.ctx.rangeBar.getTooltipValues(opts)
      // const startYear = new Date(opts.y1).getFullYear()
      // const endYear = new Date(opts.y2).getFullYear()
      return `
      <div class="apexcharts-custom-tooltip">
        <p><b>Maakunta:</b> ${ylabel.replace(':', '')}</p>
        <p><b>Aikakausi:</b> ${seriesName.replace(':', '')}</p>
        <p><b>Löytöjen lukumäärä:</b> ${data.instanceCount}</p> 
      </div>  
    `
    }
    // fixed: {
    //   enabled: true,
    //   position: 'topLeft',
    //   offsetX: 0,
    //   offsetY: 0
    // }
  },
  grid: {
    borderColor: '#000',
    // row: {
    //   opacity: 0
    // },
    padding: {
      right: 15
    }
  }
}

const preprocessTimelineData = rawData => {
  const lengths = []
  rawData.sort((a, b) => new Date(a.beginDate) - new Date(b.beginDate) || new Date(a.endDate) - new Date(b.endDate))
  rawData.forEach((obj, index) => {
    if (!Array.isArray(obj.data)) { obj.data = [obj.data] }
    obj.data.forEach(dataObj => {
      dataObj.y = [
        new Date(obj.beginDate).getTime(),
        new Date(obj.endDate).getTime()
      ]
    })
    obj.data.sort((a, b) => a.x.localeCompare(b.x))
    lengths.push({ index, length: obj.data.length })
  })
  lengths.sort((a, b) => b.length - a.length)
  if (rawData[0].data.length < lengths[0].length) {
    const indexOfLongestArr = lengths[0].index
    /*
    * The first data array must hold all possible values,
    * because it is used for sortable y-axis.
    */
    rawData[indexOfLongestArr].data.forEach((obj, index) => {
      if (!rawData[0].data.find(x => x.id === obj.id)) {
        rawData[0].data.push({
          id: obj.id,
          x: obj.x,
          y: [null, null],
          instanceCount: 0
        })
      }
    })
  }
  rawData[0].data.sort((a, b) => a.x.localeCompare(b.x))
}

// new timeline
export const createTimelineChartData = ({
  results,
  resultClassConfig,
  screenSize
}) => {
  const normalizeDate = value => {
    if (!value) return null
    if (/^\d{4}$/.test(value)) return `${value}-01-01`
    if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`
    return value
  }

  const formatDate = value => {
    if (!value) return ''

    if (/^\d{4}$/.test(value)) {
      return value
    }

    if (/^\d{4}-\d{2}$/.test(value)) {
      const [y, m] = value.split('-')
      return new Date(`${y}-${m}-01`).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric'
      })
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    return value
  }

  const isSmallScreen = screenSize === 'xs' || screenSize === 'sm'
  const isBigScreen = screenSize === 'xl'

  const isTouchMode = isSmallScreen || isBigScreen

  const laneCount = isSmallScreen
    ? (resultClassConfig.mobileLaneCount || 14)
    : (resultClassConfig.desktopLaneCount || resultClassConfig.laneCount || 20)

  const markerSize = isSmallScreen
    ? (resultClassConfig.mobileMarkerSize || 4)
    : (resultClassConfig.desktopMarkerSize || resultClassConfig.markerSize || 5)

  const color = resultClassConfig.color || '#d32f2f'

  const sortedItems = (results || [])
    .map(item => {
      const d = normalizeDate(item.startDate)
      const x = d ? new Date(d).getTime() : NaN

      return {
        x,
        label: item.label || item.prefLabel || item.id || 'Untitled',
        dateLabel: formatDate(item.startDate),
        url: item.url || item.recordUrl || null
      }
    })
    .filter(point => !Number.isNaN(point.x))
    .sort((a, b) => a.x - b.x)

  const data = sortedItems.map((point, i) => ({
    ...point,
    y: i % laneCount
  }))

  const minX = data.length > 0 ? Math.min(...data.map(d => d.x)) : undefined
  const maxX = data.length > 0 ? Math.max(...data.map(d => d.x)) : undefined
  const xPadding = 1000 * 60 * 60 * 24 * 30

  const openPointUrl = point => {
    if (!point || !point.url) return

    const locale = window.location.pathname.split('/')[1] || 'en'
    const targetUrl = `${window.location.origin}/${locale}${point.url}`
    window.location.assign(targetUrl)
  }

  return {
   chart: {
    type: 'scatter',
    height: isSmallScreen ? 300 : '100%',
    zoom: {
      enabled: !isTouchMode,
      type: 'x'
    },
    toolbar: {
      show: !isTouchMode
    },
    events: {
      mounted: chartContext => {
        if (!isTouchMode) return

        const openFromTooltip = event => {
          const tooltip =
            event.target instanceof Element
              ? event.target.closest('.timeline-tooltip')
              : null
          if (!tooltip) return

          event.preventDefault()
          event.stopPropagation()

          const url = tooltip.getAttribute('data-url')
          if (!url) return

          window.location.assign(url)
        }

        if (window.__timelineTooltipClickHandler) {
          document.removeEventListener('click', window.__timelineTooltipClickHandler)
          document.removeEventListener('touchend', window.__timelineTooltipClickHandler)
        }

        window.__timelineTooltipClickHandler = openFromTooltip

        document.addEventListener('click', window.__timelineTooltipClickHandler)
        document.addEventListener('touchend', window.__timelineTooltipClickHandler)
      },

        dataPointSelection: (event, ctx, config) => {
          const point =
            config.w.config.series[config.seriesIndex].data[config.dataPointIndex]

          if (!point) return

          if (isTouchMode) {
            if (ctx.showTooltip) {
              ctx.showTooltip(config.seriesIndex, config.dataPointIndex)
            } else if (ctx.tooltip && ctx.tooltip.show) {
              ctx.tooltip.show({
                seriesIndex: config.seriesIndex,
                dataPointIndex: config.dataPointIndex
              })
            }

            return
          }

          openPointUrl(point)
        },

      dataPointMouseEnter: event => {
        if (!isTouchMode) {
          event.target.style.cursor = 'pointer'
        }
      },

      dataPointMouseLeave: event => {
        if (!isTouchMode) {
          event.target.style.cursor = 'default'
        }
      }
    }
  },

    series: [{
      name: resultClassConfig.seriesTitle || 'Timeline',
      data
    }],

    xaxis: {
      type: 'datetime',
      tickAmount: isSmallScreen
        ? (resultClassConfig.mobileXaxisTickAmount || 4)
        : (resultClassConfig.xaxisTickAmount || 10),
      min: minX !== undefined ? minX - xPadding : undefined,
      max: maxX !== undefined ? maxX + xPadding : undefined,
      crosshairs: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      labels: {
        datetimeUTC: false,
        rotate: isSmallScreen ? -45 : 0,
        hideOverlappingLabels: true,
        trim: true,
        style: {
          fontSize: isSmallScreen ? '10px' : '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },

    yaxis: {
      show: false,
      min: 0,
      max: data.length > 0
        ? Math.max(laneCount - 1, ...data.map(d => d.y))
        : laneCount - 1,
      labels: {
        show: false
      },
      axisBorder: {
        show: true,
        color: '#d6d6d6'
      },
      axisTicks: {
        show: false
      }
    },

    grid: {
      borderColor: '#d6d6d6',
      strokeDashArray: 1,
      xaxis: {
        lines: {
           show: !isSmallScreen
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        top: isSmallScreen ? 28 : 0,
        right: isSmallScreen ? 8 : 20,
        bottom: isSmallScreen ? 8 : 0,
        left: isSmallScreen ? 8 : 20
      }
    },

    markers: {
      size: markerSize,
      strokeWidth: 1,
      strokeColors: '#ffffff',
      hover: {
        sizeOffset: 2
      }
    },

    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },

    tooltip: {
      enabled: true,
      theme: 'dark',
      intersect: true,
      shared: false,
      followCursor: false,

      fixed: {
        enabled: isTouchMode,
        position: 'topLeft',
        offsetX: 8,
        offsetY: 8
      },

      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const p = w.config.series[seriesIndex].data[dataPointIndex]
        const locale =
          typeof window !== 'undefined'
            ? window.location.pathname.split('/')[1] || 'en'
            : 'en'

        const targetUrl = p?.url
          ? `${window.location.origin}/${locale}${p.url}`
          : ''

        return `
          <div
            class="timeline-tooltip"
            ${isTouchMode && p?.url ? `data-url="${targetUrl}"` : ''}
            style="
              padding: 10px 12px;
              max-width: ${isSmallScreen ? '220px' : '280px'};
              white-space: normal;
              pointer-events: ${isTouchMode ? 'auto' : 'none'};
              line-height: 1.45;
              word-break: break-word;
              font-family: Roboto, Arial, sans-serif;
              font-size: ${isSmallScreen ? '13px' : '14px'};
              cursor: ${isTouchMode && p?.url ? 'pointer' : 'default'};
            "
          >
            <div style="
              font-weight: 600;
              margin-bottom: 6px;
              font-size: ${isSmallScreen ? '13px' : '14px'};
              white-space: normal;
              word-break: break-word;
            ">
              ${p.label}
            </div>

            <div style="opacity: 0.9;">
              ${p.dateLabel}
            </div>

            ${isTouchMode && p?.url
              ? `<div style="
                  margin-top: 8px;
                  font-size: 12px;
                  opacity: 0.75;
                  text-decoration: underline;
                  text-decoration-color: rgba(255,255,255,0.4);
                  text-underline-offset: 3px;
                ">
                  Tap to open
                </div>`
              : ''
            }
          </div>
        `
      }
    },

    title: {
      text: resultClassConfig.title || 'Timeline',
      align: 'left',
      style: {
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: isSmallScreen ? '13px' : '16px',
        fontWeight: 300
      }
    },

    legend: {
      show: false
    },

    colors: [color]
  }
}