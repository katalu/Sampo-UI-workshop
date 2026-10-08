import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import withStyles from '@mui/styles/withStyles'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated'

const styles = () => ({
  root: {
    width: 'calc(100% - 64px)',
    height: 'calc(100% - 72px)',
    paddingLeft: 32,
    paddingRight: 32,
    position: 'relative'
  },
  chart: {
    width: '100%',
    height: '100%'
  }
})

/**
 * A simple exhibition timeline for Sampo-UI.
 *
 * This visualization focuses only on dates.
 * Each exhibition is shown as a dot on a DateAxis using startDate.
 *
 * Expected result item shape:
 * {
 *   id: string,
 *   prefLabel: string,
 *   startDate: 'YYYY-MM-DD'
 * }
 */
class ExhibitionTimeline extends React.Component {
  constructor (props) {
    super(props)
    this.chartId = `exhibition-timeline-${Math.random().toString(36).slice(2)}`
  }

  componentDidMount () {
    this.props.fetchResults({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass,
      sortBy: null
    })
    this.initChart()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.results !== this.props.results) {
      this.setChartData(this.props.results || [])
    }

    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.props.fetchResults({
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        sortBy: null
      })
    }
  }

  componentWillUnmount () {
    if (this.root) {
      this.root.dispose()
    }
  }

  initChart = () => {
    this.root = am5.Root.new(this.chartId)

    if (this.root._logo) {
      const logo = this.root._logo
      logo.setAll({
        scale: 0.5,
        opacity: 0.4,
        cursorOverStyle: 'default'
      })
      logo.set('interactive', false)
      logo.events.disableType('click')
      logo.events.disableType('pointerdown')
    }

    this.root.setThemes([am5themesAnimated.new(this.root)])

    const chart = this.root.container.children.push(am5xy.XYChart.new(this.root, {
      panX: true,
      panY: false,
      wheelX: 'panX',
      wheelY: 'zoomX',
      pinchZoomX: true,
      layout: this.root.verticalLayout,
      paddingBottom: 8
    }))

    const cursor = chart.set('cursor', am5xy.XYCursor.new(this.root, {
      behavior: 'zoomX'
    }))
    cursor.lineY.set('visible', false)

    const xAxis = chart.xAxes.push(am5xy.DateAxis.new(this.root, {
      maxDeviation: 0.2,
      baseInterval: { timeUnit: 'day', count: 1 },
      groupData: false,
      renderer: am5xy.AxisRendererX.new(this.root, {
        minGridDistance: 80
      }),
      tooltip: am5.Tooltip.new(this.root, {})
    }))

    const yRenderer = am5xy.AxisRendererY.new(this.root, {
      minGridDistance: 20
    })
    yRenderer.grid.template.setAll({ strokeOpacity: 0.08 })
    yRenderer.labels.template.setAll({ forceHidden: true })

    const yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(this.root, {
      categoryField: 'lane',
      renderer: yRenderer
    }))

    yAxis.data.setAll(
      Array.from({ length: 30 }, (_, i) => ({ lane: String(i) }))
    )

    const series = chart.series.push(am5xy.LineSeries.new(this.root, {
      name: 'Exhibitions',
      xAxis,
      yAxis,
      valueXField: 'date',
      categoryYField: 'lane',
      strokeOpacity: 0
    }))

    series.strokes.template.set('visible', false)

    series.bullets.push(() => {
      const tooltip = am5.Tooltip.new(this.root, {})

      tooltip.set('getFillFromSprite', false)
      tooltip.set('getStrokeFromSprite', false)

      tooltip.get('background').setAll({
        fill: am5.color(0x494949),
        fillOpacity: 0.85,
        stroke: am5.color(0x424242)
      })

      tooltip.label.setAll({
        fill: am5.color(0xffffff),
        maxWidth: 300,
        oversizedBehavior: 'wrap'
      })

      const circle = am5.Circle.new(this.root, {
        radius: 5,
        fill: am5.color(0xd32f2f),
        stroke: am5.color(0xffffff),
        strokeWidth: 1,
        tooltipY: 0,
        interactive: true,
        cursorOverStyle: 'pointer',
        showTooltipOn: 'hover',
        tooltip,
        tooltipText: '{prefLabel}\n\n{startDateLabel}'
      })

      circle.states.create('hover', {
        scale: 1.3
      })

      circle.events.on('click', ev => {
        const dataItem = ev.target.dataItem
        const context = dataItem && dataItem.dataContext

        if (context && context.recordUrl) {
          const locale = window.location.pathname.split('/')[1] || 'en'
          const targetUrl = `${window.location.origin}/${locale}${context.recordUrl}`
          window.open(targetUrl, '_blank', 'noopener,noreferrer')
        }
      })

      return am5.Bullet.new(this.root, {
        sprite: circle
      })
    })

    const scrollbarX = am5.Scrollbar.new(this.root, {
      orientation: 'horizontal',
      height: 8
    })

    // place it below the timeline
    chart.bottomAxesContainer.children.push(scrollbarX)

    // connect it to x-axis scrolling/zooming
    chart.set('scrollbarX', scrollbarX)

    // spacing
    scrollbarX.setAll({
      marginTop: 18,
      marginBottom: 12
    })

    // subtle track
    scrollbarX.get('background').setAll({
      fillOpacity: 0.1
    })

    // subtle thumb
    scrollbarX.thumb.setAll({
      fill: am5.color(0x999999),
      fillOpacity: 0.5,
      cornerRadiusBL: 4,
      cornerRadiusBR: 4,
      cornerRadiusTL: 4,
      cornerRadiusTR: 4
    })

    scrollbarX.thumb.states.create('hover', {
      fillOpacity: 0.75
    })

    // keep grips if you want full interaction
    scrollbarX.startGrip.setAll({
      scale: 0.8,
      opacity: 0.6
    })

    scrollbarX.endGrip.setAll({
      scale: 0.8,
      opacity: 0.6
    })


    this.chart = chart
    this.xAxis = xAxis
    this.yAxis = yAxis
    this.series = series
  }

  setChartData = (results) => {
    if (!this.series || !this.yAxis) {
      return
    }

    const validResults = (results || []).filter(item => item && item.startDate)

    const data = validResults
      .map((item, index) => {
        const normalizedDate = normalizeDate(item.startDate)
        const parsedDate = normalizedDate ? new Date(normalizedDate).getTime() : NaN

        return {
          id: item.id || `${index}`,
          prefLabel: item.prefLabel || item.id || 'Untitled exhibition',
          date: parsedDate,
          startDateLabel: formatDisplayDate(item.startDate),
          lane: String(index % 30),
          recordUrl: item.recordUrl || null
        }
      })
      .filter(item => !Number.isNaN(item.date))
      .sort((a, b) => a.date - b.date)

    this.series.data.setAll(data)

    if (data.length > 0) {
      const minDate = Math.min(...data.map(d => d.date))
      const maxDate = Math.max(...data.map(d => d.date))
      this.xAxis.zoomToValues(minDate, maxDate)
    }

    this.series.appear(800)
    this.chart.appear(800, 100)
  }

  render () {
    const { classes } = this.props

    return (
      <Paper square className={classes.root}>
        <div id={this.chartId} className={classes.chart} />
      </Paper>
    )
  }
}

const normalizeDate = value => {
  if (!value) return null
  if (/^\d{4}$/.test(value)) return `${value}-01-01`
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`
  return value
}

const formatDisplayDate = value => {
  if (!value) return ''

  if (/^\d{4}$/.test(value)) {
    return value
  }

  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split('-')
    const date = new Date(`${year}-${month}-01`)
    return date.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric'
    })
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(value)
    return date.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return value
}

ExhibitionTimeline.propTypes = {
  classes: PropTypes.object.isRequired,
  results: PropTypes.array,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  fetchResults: PropTypes.func.isRequired,
  facetUpdateID: PropTypes.number.isRequired
}

export const ExhibitionTimelineComponent = ExhibitionTimeline

export default withStyles(styles)(ExhibitionTimeline)