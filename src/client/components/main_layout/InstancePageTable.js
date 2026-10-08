// InstancePageTable.js

import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import withStyles from '@mui/styles/withStyles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import ResultTableCell from '../facet_results/ResultTableCell'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { TranscriptionTabs } from './TranscriptionTabs'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const styles = theme => ({
  root: {
    width: '100%',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    boxSizing: 'border-box',
    overflowX: 'clip',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },

  headerActionsCompact: {
    marginTop: theme.spacing(1.25),
    marginBottom: theme.spacing(1.25),
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    justifyContent: 'flex-end',
    alignItems: 'center',

    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-end',
      gap: theme.spacing(1.75),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1)
    }
  },

  layoutRow: {
    width: '100%',
    maxWidth: 1400,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 340px) 24px minmax(0, 1fr)',
    columnGap: theme.spacing(2),
    alignItems: 'start',
    boxSizing: 'border-box',
    [theme.breakpoints.up('xl')]: {
      maxWidth: 1680,
      gridTemplateColumns: 'minmax(320px, 380px) 24px minmax(0, 1fr)',
      columnGap: theme.spacing(3)
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
      rowGap: theme.spacing(2)
    }
  },

  layoutRowNoImage: {
    width: '100%',
    maxWidth: 1400,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1100px)',
    justifyContent: 'center',
    boxSizing: 'border-box'
  },

  midDivider: {
    width: 1,
    justifySelf: 'center',
    alignSelf: 'stretch',
    background: 'rgba(241, 16, 16, 0.1)',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },

  leftPanel: {
    position: 'sticky',
    top: theme.spacing(2),
    alignSelf: 'start',
    maxWidth: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: { position: 'relative', top: 'auto' }
  },

  leftInner: {
    display: 'grid',
    gap: theme.spacing(1),
    maxWidth: '100%',
    overflow: 'hidden'
  },

  leftImageWrap: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'visible',
    '& *': {
      maxWidth: '100%'
    },
    '& img, & svg, & canvas, & video': {
      display: 'block',
      margin: '0 auto',
      maxWidth: '100%'
    }
  },

  headerBlock: {
    marginBottom: theme.spacing(1.25)
  },

  headerActionRow: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    justifyContent: 'flex-start'
  },

  rightColumn: {
    minWidth: 0,
    background: '#f9f9f9',
    padding: theme.spacing(3),
    borderRadius: 8,
    [theme.breakpoints.up('xl')]: {
      padding: theme.spacing(4)
    }
  },

  englishTitle: {
    fontSize: 26,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: 0.2,
    overflowWrap: 'anywhere',
    marginBottom: theme.spacing(1),

    [theme.breakpoints.down('md')]: {
      fontSize: 22
    },

    [theme.breakpoints.down('sm')]: {
      fontSize: 20,         
      lineHeight: 1.2
    }
  },

  descriptionBlock: {
    fontSize: 14,
    lineHeight: 1.55,
    color: 'rgba(0,0,0,0.82)',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
    width: '100%',
    maxWidth: '65rem',
    textAlign: 'justify',
    paddingTop: theme.spacing(1.2),
    fontFamily: `${theme.typography.fontFamily} !important`,
    '&, & *': {
      fontFamily: `${theme.typography.fontFamily} !important`
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: 1.3,
      textAlign: 'justify',
      maxWidth: '100%'
    }
  },

  descActions: {
    marginTop: theme.spacing(0.5)
  },

  showMoreLink: {
    padding: 0,
    minWidth: 0,
    textTransform: 'none',
    fontWeight: 500,
    fontSize: 14,
    color: 'rgba(155, 8, 8, 0.7)',
    '&:hover': { textDecoration: 'underline', background: 'transparent' }
  },

  smallOutlineButton: {
    textTransform: 'none',
    fontWeight: 500,
    color: 'rgba(0,0,0,0.75)',
    borderColor: 'rgba(183, 20, 20, 0.18)',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    transition: 'all 0.15s ease',
    '&:hover': {
      borderColor: 'rgba(0,0,0,0.35)',
      backgroundColor: 'rgba(0,0,0,0.05)'
    }
  },

  mobileTextButton: {
    textTransform: 'none',
    minWidth: 0,
    padding: 0,
    border: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,0.92)',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.4,
    textDecoration: 'underline',
    textDecorationColor: 'rgba(49, 49, 49, 0.25)',
    textUnderlineOffset: '4px',
    textDecorationThickness: '1px',
    WebkitTapHighlightColor: 'transparent',
    transition: 'text-decoration-color 0.15s ease, color 0.15s ease',

    '&:hover': {
      backgroundColor: 'transparent',
      textDecorationColor: 'rgba(0,0,0,0.45)'
    },

    '&:active': {
      backgroundColor: 'transparent',
      textDecorationColor: 'rgba(0,0,0,0.55)'
    },

    '&:focus-visible': {
      outline: '2px solid rgba(0,0,0,0.18)',
      outlineOffset: 4,
      borderRadius: 3
    }
  },

  desktopTextButton: {
    textTransform: 'none',
    minWidth: 0,
    padding: 0,
    border: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,0.78)',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,
    textDecoration: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.18)',
    WebkitTapHighlightColor: 'transparent',
    transition: [
      'color 0.15s ease',
      'border-bottom-color 0.15s ease',
      'opacity 0.15s ease'
    ].join(', '),

    '&:hover': {
      backgroundColor: 'transparent',
      color: '#000',
      borderBottomColor: 'rgba(0,0,0,0.55)'
    },

    '&:focus-visible': {
      outline: '2px solid rgba(0,0,0,0.18)',
      outlineOffset: 4,
      borderRadius: 3
    }
  },

  metaDivider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    opacity: 0.6
  },

  tableContainer: {
    overflow: 'hidden',
    maxWidth: '100%',
    minWidth: 0
  },

  instanceTable: {
    width: '100%',
    borderTop: '1px solid rgba(0,0,0,0.10)',
    borderCollapse: 'separate',
    borderSpacing: 0
  },

  groupRow: {
    '& td': {
      paddingTop: theme.spacing(1.6),
      paddingBottom: theme.spacing(0.6),
      borderBottom: 'none'
    }
  },

  groupLabel: {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: 'rgba(177, 61, 61, 0.6)'
  },

  mobileGroupCell: {
    paddingLeft: '0 !important',
    paddingRight: '0 !important',
    paddingTop: `${theme.spacing(1.4)} !important`,
    paddingBottom: `${theme.spacing(0.8)} !important`,
    borderBottom: 'none !important'
  },

  mobileGroupButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    margin: 0,
    background: 'transparent',
    border: 0,
    cursor: 'pointer',
    textAlign: 'left',
    font: 'inherit'
  },

  mobileGroupLabel: {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: 'rgba(177, 61, 61, 0.6)'
  },

  mobileGroupIcon: {
    color: 'rgba(0,0,0,0.42)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  dataRow: {
    '& td': {
      paddingTop: theme.spacing(0.55),
      paddingBottom: theme.spacing(0.55),
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      verticalAlign: 'top'
    }
  },

  labelCell: {
    width: 260,
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(0,0,0,0.68)',
    [theme.breakpoints.down('md')]: { width: 'auto' }
  },

  valueCell: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.88)',
    minWidth: 0,
    maxWidth: '100%',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    '& *': {
      minWidth: 0,
      maxWidth: '100%'
    },
    '& a': {
      display: 'inline',
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
      wordBreak: 'break-word'
    },
    '& span': {
      maxWidth: '100%',
      whiteSpace: 'normal'
    },
    '& a.inlineLink': {
      textDecoration: 'none',
      color: 'rgba(0, 0, 0, 0.95)',
      fontWeight: 400,
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      padding: '2px 4px',
      borderRadius: 3,
      transition: [
        'background-color 0.2s ease',
        'color 0.2s ease'
      ].join(', ')
    },

    '& a.inlineLink:hover': {
      backgroundColor: 'rgba(155, 8, 8, 0.12)',
      color: 'rgba(0, 0, 0, 0.95)'
    }
  },

  labelLine: {
    display: 'inline-flex',
    alignItems: 'center'
  },

  infoBtn: {
    padding: 2,
    marginLeft: theme.spacing(0.5),
    opacity: 0.45,
    '&:hover': { opacity: 1, background: 'transparent' },
    '&:focus-visible': { opacity: 1 }
  },

  tooltip: {
    maxWidth: 360,
    fontSize: 13,
    lineHeight: 1.35
  },

  mobileRow: {
    '& td': {
      paddingTop: theme.spacing(0.9),
      paddingBottom: theme.spacing(0.9),
      borderBottom: '1px solid rgba(0,0,0,0.06)'
    }
  },

  mobileLabel: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0,
    textTransform: 'none',
    color: 'rgba(0,0,0,0.68)',
    display: 'inline-flex',
    alignItems: 'center'
  },

  mobileValue: {
    marginTop: 6,
    fontSize: 15,
    color: 'rgba(0,0,0,0.88)',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',

    [theme.breakpoints.down('sm')]: {
      '& a': {
        color: 'rgba(0,0,0,0.92)',
        textDecoration: 'underline',
        textDecorationColor: 'rgba(49, 49, 49, 0.25)',
        textUnderlineOffset: '4px',
        textDecorationThickness: '1px',
        WebkitTapHighlightColor: 'transparent',
        transition: 'text-decoration-color 0.15s ease'
      },

      '& a:active': {
        textDecorationColor: 'rgba(0,0,0,0.5)'
      },

      '& a.inlineLink': {
        color: 'rgba(0,0,0,0.92)'
      }
    }
  },

  rightColumnNoImage: {
    minWidth: 0,
    background: '#f9f9f9',
    padding: theme.spacing(3),
    borderRadius: 8
  },

  videoCalloutWrap: {
  marginTop: theme.spacing(1.25),
  marginBottom: theme.spacing(1.5),
  display: 'flex',
  justifyContent: 'flex-end'
},

  videoCallout: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 0,
    margin: 0,
    border: 0,
    background: 'transparent',
    cursor: 'pointer',
    color: 'rgba(0,0,0,0.78)',
    font: 'inherit',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,
    textAlign: 'left',
    WebkitTapHighlightColor: 'transparent',
    transition: [
      'color 0.15s ease',
      'border-bottom-color 0.15s ease',
      'opacity 0.15s ease'
    ].join(', '),

    '&:hover': {
      color: '#000',
      background: 'transparent'
    },

    '&:hover $videoCalloutText': {
      borderBottomColor: 'rgba(0,0,0,0.55)'
    },

    '&:focus-visible': {
      outline: '2px solid rgba(0,0,0,0.18)',
      outlineOffset: 4,
      borderRadius: 3
    }
  },

  videoCalloutIcon: {
    display: 'none'
  },

  videoCalloutText: {
    borderBottom: '1px solid rgba(0,0,0,0.18)',
    textDecoration: 'none',
    transition: 'border-bottom-color 0.15s ease'
  },

  floatingDialogClose: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 2,
    color: 'rgba(0,0,0,0.65)',
    backgroundColor: 'transparent',
    boxShadow: 'none',

    '&:hover': {
      backgroundColor: 'transparent',
      color: '#000'
    }
  },

  floatingDialogCloseDark: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 2,
    color: 'rgba(255,255,255,0.85)',
    backgroundColor: 'transparent',
    boxShadow: 'none',

    '&:hover': {
      backgroundColor: 'transparent',
      color: '#fff'
    }
  },
  transcriptionDialogInner: {
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',

    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      backgroundColor: '#fff'
    }
  },

  transcriptionDialogContent: {
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
    padding: theme.spacing(2.5),
    paddingTop: theme.spacing(5),

    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1.5),
      paddingTop: theme.spacing(5)
    },

    '& *': {
      fontFamily: `${theme.typography.fontFamily} !important`
    }
  },
})

class InstancePageTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expandedTextFields: new Set(),
      transcriptionOpen: false,
      expandedGroups: new Set([ ]),
      imageOpen: false,
      videoOpen: false,
      activeHelpId: null
    }
  }

  componentDidMount = () => {
    if (this.props.fetchResultsWhenMounted) {
      this.props.fetchResults({
        perspectiveID: this.props.perspectiveConfig.id,
        resultClass: this.props.resultClass,
        facetClass: this.props.facetClass,
        uri: this.props.uri
      })
    }
  }

  toggleTextField = fieldId => {
    this.setState(prev => {
      const next = new Set(prev.expandedTextFields)
      if (next.has(fieldId)) next.delete(fieldId)
      else next.add(fieldId)
      return { expandedTextFields: next }
    })
  }

  toggleGroup = groupName => {
    this.setState(prev => {
      const next = new Set(prev.expandedGroups)
      if (next.has(groupName)) next.delete(groupName)
      else next.add(groupName)
      return { expandedGroups: next }
    })
  }

  openTranscription = () => {
    this.setState({ transcriptionOpen: true })
  }

  closeTranscription = () => {
    this.setState({ transcriptionOpen: false })
  }

  openImage = () => {
    this.setState({ imageOpen: true })
  }

  closeImage = () => {
    this.setState({ imageOpen: false })
  }

  openVideo = () => {
    this.setState({ videoOpen: true })
  }

  closeVideo = () => {
    this.setState({ videoOpen: false })
  }

  handlePageClick = () => {
    if (this.isTouchDevice() && this.state.activeHelpId) {
      this.setState({ activeHelpId: null })
    }
  }

  isTouchDevice = () => {
    const { screenSize } = this.props

    return (
      screenSize === 'xs' ||
      screenSize === 'sm' ||
      screenSize === 'xl'
    )
  }
  
  isProbablyUrl = s => typeof s === 'string' && /^https?:\/\/\S+$/i.test(s.trim())

  toHumanText = v => {
    if (v === null || v === undefined) return ''
    if (typeof v === 'string') return this.isProbablyUrl(v) ? '' : v
    if (typeof v === 'number') return String(v)
    if (Array.isArray(v)) return this.toHumanText(v[0])
    if (typeof v === 'object') {
      if (typeof v['@value'] === 'string') return this.isProbablyUrl(v['@value']) ? '' : v['@value']
      if (typeof v.prefLabel === 'string') return this.isProbablyUrl(v.prefLabel) ? '' : v.prefLabel
      if (typeof v.label === 'string') return this.isProbablyUrl(v.label) ? '' : v.label
      if (typeof v.name === 'string') return this.isProbablyUrl(v.name) ? '' : v.name
      if (typeof v.value === 'string') return this.isProbablyUrl(v.value) ? '' : v.value
      if (typeof v.text === 'string') return this.isProbablyUrl(v.text) ? '' : v.text
    }
    return ''
  }
  
  // embedded video
  getVideoSrc = value => {
    if (!value) return null

    if (typeof value === 'string') {
      return this.isProbablyUrl(value) ? value.trim() : null
    }

    if (Array.isArray(value)) return this.getVideoSrc(value[0])

    if (typeof value === 'object') {
      if (typeof value.dataProviderUrl === 'string' && this.isProbablyUrl(value.dataProviderUrl)) return value.dataProviderUrl.trim()
      if (typeof value.url === 'string' && this.isProbablyUrl(value.url)) return value.url.trim()
      if (typeof value.id === 'string' && this.isProbablyUrl(value.id)) return value.id.trim()
      if (typeof value.value === 'string' && this.isProbablyUrl(value.value)) return value.value.trim()
      if (typeof value['@id'] === 'string' && this.isProbablyUrl(value['@id'])) return value['@id'].trim()
      if (typeof value['@value'] === 'string' && this.isProbablyUrl(value['@value'])) return value['@value'].trim()
      if (typeof value.prefLabel === 'string' && this.isProbablyUrl(value.prefLabel)) return value.prefLabel.trim()
    }

    return null
  }

  getEnglishTitle = data => {
    return (
      this.toHumanText(data?.title) ||
      this.toHumanText(data?.prefLabel) ||
      this.toHumanText(data?.label) ||
      this.toHumanText(data?.name) ||
      ''
    ).trim()
  }

  getDescriptionText = data => {
    return (
      this.toHumanText(data?.description) ||
      this.toHumanText(data?.abstract) ||
      this.toHumanText(data?.summary) ||
      ''
    ).trim()
  }

  wordCount = text => (text ? text.trim().split(/\s+/).filter(Boolean).length : 0)

  truncateWords = (text, maxWords) => {
    const parts = text.trim().split(/\s+/).filter(Boolean)
    if (parts.length <= maxWords) return text
    return parts.slice(0, maxWords).join(' ') + '…'
  }

  rowHasData = (row, data) => {
    const value = data?.[row.id]
    if (value === null || value === undefined) return false
    if (Array.isArray(value) && value.length === 0) return false
    if (typeof value === 'string' && value.trim() === '') return false
    return true
  }

  getLeftImageProperty = properties => {
    return (
      properties.find(p => p.showInLeftPanel) ||
      properties.find(p => p.valueType === 'image') ||
      null
    )
  }

  getLabel = row => {
    const perspectiveID = this.props.perspectiveConfig.id
    return intl.get(`perspectives.${perspectiveID}.properties.${row.id}.label`)
  }

  getHelpText = row => {
    const perspectiveID = this.props.perspectiveConfig.id
    return intl.get(`perspectives.${perspectiveID}.properties.${row.id}.description`)
  }

  renderInfoIcon = ({ id, label, help }) => {
    const { classes } = this.props

    if (!help) return null

    const isTouchMode = this.isTouchDevice()
    const isOpen = this.state.activeHelpId === id

    if (!isTouchMode) {
      return (
        <Tooltip
          title={help}
          placement='bottom'
          enterDelay={400}
          classes={{ tooltip: classes.tooltip }}
          PopperProps={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -10]
                }
              }
            ]
          }}
        >
          <IconButton
            size='small'
            className={classes.infoBtn}
            aria-label={`About ${label}`}
          >
            <InfoIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      )
    }

    return (
      <Tooltip
        title={help}
        placement='bottom'
        open={isOpen}
        classes={{ tooltip: classes.tooltip }}
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10]
              }
            }
          ]
        }}
        disableHoverListener
        disableFocusListener
        disableTouchListener
      >
        <IconButton
          size='small'
          className={classes.infoBtn}
          aria-label={`About ${label}`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            this.setState(prev => ({
              activeHelpId: prev.activeHelpId === id ? null : id
            }))
          }}
        >
          <InfoIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    )
  }

  isExpandableLongTextRow = row => {
    if (row.expandAsText) return true
    const id = String(row.id || '').toLowerCase()
    return id === 'description'
  }

  renderLeftPanel = leftImageProp => {
    const { classes, data } = this.props
    const imageData = leftImageProp ? data?.[leftImageProp.id] : null
    const hasImage = imageData && imageData !== '-'

    if (!hasImage) return null

    return (
      <div className={classes.leftPanel}>
        <div className={classes.leftInner}>
          <div className={classes.leftImageWrap}>
            {hasImage ? (
              <>
                <ResultTableCell
                  container='div'
                  rowId={leftImageProp.id}
                  columnId={leftImageProp.id}
                  data={imageData}
                  thumbnailData={data?.thumbnailUrl}
                  valueType='image'
                  makeLink={false}
                  externalLink={false}
                  sortValues={false}
                  numberedList={false}
                  expanded={false}
                  onExpandClick={() => {}}
                  previewImageHeight={340}
                  instancePageImage
                />

                <div
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    color: 'rgba(0, 0, 0, 0.43)',
                    textAlign: 'left'
                  }}
                >
                  Click on image to zoom
                </div>
              </>
            ) : (
              <div style={{ padding: 16, opacity: 0.6 }}>Image</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderHeader = (data, hasLeftImage) => {
    const { classes, screenSize } = this.props
    const isMobile = screenSize === 'xs' || screenSize === 'sm'
    const title = this.getEnglishTitle(data)
    const desc = this.getDescriptionText(data)

    const maxWords = isMobile ? 60 : 150
    const expanded = this.state.expandedTextFields.has('description')
    const needsTruncate = this.wordCount(desc) > maxWords
    const shownDesc = !desc
      ? ''
      : (!needsTruncate ? desc : (expanded ? desc : this.truncateWords(desc, maxWords)))

    return (
      <div className={classes.headerBlock}>
        {!!title && <div className={classes.englishTitle}>{title}</div>}
        {!!desc && (
          <>
            <div className={classes.descriptionBlock}>{shownDesc}</div>
            {needsTruncate && (
              <div className={classes.descActions}>
                <Button
                  className={classes.showMoreLink}
                  onClick={() => this.toggleTextField('description')}
                  size='small'
                >
                  {expanded ? 'Show less' : 'Show more'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // header actions for buttons
  renderHeaderActions = ({ data, hasLeftImage, hasTrans, transCount }) => {
    const { classes, screenSize } = this.props
    const isMobile = screenSize === 'xs' || screenSize === 'sm'
    const actionButtonClass = isMobile ? classes.mobileTextButton : classes.desktopTextButton
    const actionButtonVariant = 'text'
    const videoSrc = this.getVideoSrc(data?.video || data?.['ns1:video'])
    const hasVideo = !!videoSrc

    const shouldShowImageButton = isMobile && hasLeftImage
    const shouldShowVideoButton = hasVideo
    const shouldShowTransButton = hasTrans

    if (!shouldShowImageButton && !shouldShowVideoButton && !shouldShowTransButton) {
      return null
    }

    return (
      <div className={classes.headerActionsCompact}>
        {shouldShowImageButton && (
          <Button
            variant={actionButtonVariant}
            size='small'
            onClick={this.openImage}
            className={actionButtonClass}
          >
            Image
          </Button>
        )}

        {isMobile && shouldShowVideoButton && (
          <Button
            variant={actionButtonVariant}
            size='small'
            onClick={this.openVideo}
            className={actionButtonClass}
          >
            {isMobile ? 'Video' : 'Watch video'}
          </Button>
        )}

        {shouldShowTransButton && (
          <Button
            variant={actionButtonVariant}
            size='small'
            onClick={this.openTranscription}
            className={actionButtonClass}
          >
            Transcriptions &amp; translations
            {transCount ? ` (${transCount})` : ''}
          </Button>
        )}
      </div>
    )
  }

  // video button
  renderVideoButton = data => {
    const { classes } = this.props
    const videoSrc = this.getVideoSrc(data?.video || data?.['ns1:video'])

    if (!videoSrc) return null

    return (
      <div
        className={classes.headerActionRow}
        style={{ justifyContent: 'flex-end' }}
      >
        <Button
          variant='outlined'
          size='small'
          onClick={this.openVideo}
          className={classes.smallOutlineButton}
        >
          Watch video
        </Button>
      </div>
    )
  }

  renderVideoCallToAction = data => {
    const { classes } = this.props
    const videoSrc = this.getVideoSrc(data?.video || data?.['ns1:video'])
    if (!videoSrc) return null

    return (
      <div className={classes.videoCalloutWrap}>
        <Button
          variant='text'
          size='small'
          onClick={this.openVideo}
          className={classes.desktopTextButton}
          aria-label='Watch video'
        >
          Watch video
        </Button>
      </div>
    )
  }

  renderMetadataTable = ({ groupedProperties, data }) => {
    const { classes, screenSize } = this.props
    const isMobile = screenSize === 'xs' || screenSize === 'sm'

    return (
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.instanceTable} size='small'>
          <TableBody>
            {Object.keys(groupedProperties).map(groupName => {
              const rowsWithData = groupedProperties[groupName].filter(row => this.rowHasData(row, data))
              if (rowsWithData.length === 0) return null

              const isExpanded = this.state.expandedGroups.has(groupName)
              const shouldShowRows = !isMobile || groupName === 'Other' || isExpanded

              return (
                <React.Fragment key={groupName}>
                  {groupName !== 'Other' && (
                    <TableRow className={isMobile ? undefined : classes.groupRow}>
                      <TableCell colSpan={2} className={isMobile ? classes.mobileGroupCell : undefined}>
                        {isMobile ? (
                          <button
                            type='button'
                            className={classes.mobileGroupButton}
                            onClick={() => this.toggleGroup(groupName)}
                            aria-expanded={isExpanded}
                            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${groupName}`}
                          >
                            <span className={classes.mobileGroupLabel}>{groupName}</span>
                            <span className={classes.mobileGroupIcon}>
                              {isExpanded ? <KeyboardArrowUpIcon fontSize='small' /> : <KeyboardArrowDownIcon fontSize='small' />}
                            </span>
                          </button>
                        ) : (
                          <div className={classes.groupLabel}>{groupName}</div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}

                  {shouldShowRows && rowsWithData.map(row => {
                    const label = this.getLabel(row)
                    const help = this.getHelpText(row)

                    let { previewImageHeight } = row
                    if (isMobile) previewImageHeight = 60

                    const isLongText = this.isExpandableLongTextRow(row)

                    const rawVal = data?.[row.id]
                    const textVal = typeof rawVal === 'string' ? rawVal : this.toHumanText(rawVal)

                    const maxWords = row.collapsedMaxWords || 80
                    const expanded = this.state.expandedTextFields.has(row.id)
                    const needsTruncate = isLongText && this.wordCount(textVal) > maxWords
                    const shownText =
                      !isLongText
                        ? ''
                        : (!needsTruncate ? textVal : (expanded ? textVal : this.truncateWords(textVal, maxWords)))

                    if (isMobile) {
                      return (
                        <TableRow key={row.id} className={classes.mobileRow}>
                          <TableCell colSpan={2}>
                            <div className={classes.mobileLabel}>
                              {label}
                              {this.renderInfoIcon({ id: row.id, label, help })}
                            </div>

                            <div className={classes.mobileValue}>
                              {isLongText ? (
                                <>
                                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{shownText}</div>
                                  {needsTruncate && (
                                    <div className={classes.descActions}>
                                      <Button
                                        className={classes.showMoreLink}
                                        onClick={() => this.toggleTextField(row.id)}
                                        size='small'
                                      >
                                        {expanded ? 'Show less' : 'Show more'}
                                      </Button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <ResultTableCell
                                  rowId={row.id}
                                  columnId={row.id}
                                  data={data[row.id]}
                                  valueType={row.valueType}
                                  makeLink={row.makeLink !== false}
                                  externalLink={!!row.externalLink}
                                  sortValues={!!row.sortValues}
                                  sortBy={row.sortBy}
                                  sortByConvertDataTypeTo={row.sortByConvertDataTypeTo}
                                  numberedList={!!row.numberedList}
                                  minWidth={row.minWidth}
                                  previewImageHeight={previewImageHeight}
                                  container='div'
                                  expanded={true}
                                  onExpandClick={() => {}}
                                  shortenLabel={false}
                                  linkAsButton={row.linkAsButton}
                                  collapsedMaxWords={row.collapsedMaxWords}
                                  showSource={row.showSource}
                                  sourceExternalLink={row.sourceExternalLink}
                                  renderAsHTML={row.renderAsHTML}
                                  HTMLParserTask={row.HTMLParserTask}
                                  referencedTerm={data.referencedTerm}
                                  instanceInlineList={row.instanceInlineList}
                                  inlineSeparator={row.inlineSeparator}
                                  simpleList={row.simpleList}
                                />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    }

                    return (
                      <TableRow key={row.id} className={classes.dataRow}>
                        <TableCell className={classes.labelCell}>
                          <span className={classes.labelLine}>
                            {label}
                            {this.renderInfoIcon({ id: row.id, label, help })}
                          </span>
                        </TableCell>

                        <TableCell className={classes.valueCell}>
                          {isLongText ? (
                            <>
                              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{shownText}</div>
                              {needsTruncate && (
                                <div className={classes.descActions}>
                                  <Button
                                    className={classes.showMoreLink}
                                    onClick={() => this.toggleTextField(row.id)}
                                    size='small'
                                  >
                                    {expanded ? 'Show less' : 'Show more'}
                                  </Button>
                                </div>
                              )}
                            </>
                          ) : (
                            <ResultTableCell
                              rowId={row.id}
                              columnId={row.id}
                              data={data[row.id]}
                              valueType={row.valueType}
                              makeLink={row.makeLink !== false}
                              externalLink={!!row.externalLink}
                              sortValues={!!row.sortValues}
                              sortBy={row.sortBy}
                              sortByConvertDataTypeTo={row.sortByConvertDataTypeTo}
                              numberedList={!!row.numberedList}
                              minWidth={row.minWidth}
                              previewImageHeight={previewImageHeight}
                              container='div'
                              expanded={true}
                              onExpandClick={() => {}}
                              shortenLabel={false}
                              linkAsButton={row.linkAsButton}
                              collapsedMaxWords={row.collapsedMaxWords}
                              showSource={row.showSource}
                              sourceExternalLink={row.sourceExternalLink}
                              renderAsHTML={row.renderAsHTML}
                              HTMLParserTask={row.HTMLParserTask}
                              referencedTerm={data.referencedTerm}
                              instanceInlineList={row.instanceInlineList}
                              inlineSeparator={row.inlineSeparator}
                              simpleList={row.simpleList}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  render () {
    const { classes, data, properties, screenSize } = this.props
    if (!data) return null

    const isMobile = screenSize === 'xs' || screenSize === 'sm'

    const leftImageProp = this.getLeftImageProperty(properties)
    const leftImagePropId = leftImageProp?.id
    const leftImageData = leftImageProp ? data?.[leftImageProp.id] : null
    const hasLeftImage = leftImageData && leftImageData !== '-'
    const videoSrc = this.getVideoSrc(data?.video || data?.['ns1:video'])

    const excludedIds = new Set(['uri', leftImagePropId, 'prefLabel', 'description', 'video'].filter(Boolean))

    const propertiesForTable = properties
      .filter(row => row.id !== 'uri')
      .filter(row => row.id !== leftImagePropId)
      .filter(row => !excludedIds.has(row.id))

    const groupedProperties = propertiesForTable.reduce((acc, row) => {
      const group = row.group || 'Other'
      if (!acc[group]) acc[group] = []
      acc[group].push(row)
      return acc
    }, {})

    const transValues = data?.transcriptionAndTranslation
    const transCount = Array.isArray(transValues) ? transValues.length : (transValues ? 1 : 0)
    const hasTrans = transCount > 0

    return (
      <div className={classes.root} onClick={this.handlePageClick}>
        <div className={hasLeftImage && !isMobile ? classes.layoutRow : classes.layoutRowNoImage}>
          {hasLeftImage && !isMobile && this.renderLeftPanel(leftImageProp)}
          {hasLeftImage && !isMobile && <div className={classes.midDivider} />}

          <div className={hasLeftImage && !isMobile ? classes.rightColumn : classes.rightColumnNoImage}>
            {this.renderHeader(data, hasLeftImage)}
            {!isMobile && this.renderVideoCallToAction(data)}

            {this.renderHeaderActions({
              data,
              hasLeftImage,
              hasTrans,
              transCount
            })}

            <Divider className={classes.metaDivider} />

            {this.renderMetadataTable({ groupedProperties, data })}
            
            <Dialog
              open={this.state.imageOpen}
              onClose={this.closeImage}
              fullWidth
              maxWidth='md'
              PaperProps={{
                sx: {
                  borderRadius: { xs: 0, sm: 2 },
                  overflow: 'visible',
                  backgroundColor: { xs: 'transparent', sm: '#fff' },
                  boxShadow: { xs: 'none', sm: undefined },
                  margin: { xs: 0, sm: undefined },
                  maxHeight: { xs: '100vh', sm: undefined }
                }
              }}
            >
              <IconButton
                onClick={this.closeImage}
                size='small'
                aria-label='Close image'
                className={classes.floatingDialogClose}
                disableRipple
              >
                <CloseIcon fontSize='small' />
              </IconButton>

              <DialogContent 
                sx={{
                  p: { xs: 0, sm: 2 },
                  pt: { xs: 0, sm: 5 },
                  backgroundColor: 'transparent',
                  overflow: 'visible'
                }}
              >
                {leftImageProp && (
                  <ResultTableCell
                    container='div'
                    rowId={leftImageProp.id}
                    columnId={leftImageProp.id}
                    data={leftImageData}
                    thumbnailData={data?.thumbnailUrl}
                    valueType='image'
                    makeLink={false}
                    externalLink={false}
                    sortValues={false}
                    numberedList={false}
                    expanded={true}
                    onExpandClick={() => {}}
                    previewImageHeight={420}
                    instancePageImage
                  />
                )}
              </DialogContent>
            </Dialog>

            <Dialog
                open={this.state.videoOpen}
                onClose={this.closeVideo}
                fullWidth
                maxWidth='md'
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    overflow: 'hidden'
                  }
                }}
              >
                <IconButton
                  onClick={this.closeVideo}
                  size='small'
                  aria-label='Close video'
                  className={classes.floatingDialogCloseDark}
                >
                  <CloseIcon fontSize='small' />
                </IconButton>

                <DialogContent
                  sx={{
                    p: 2,
                    pt: 5,
                    backgroundColor: '#111'
                  }}
                >
                 {videoSrc && (
                  <div
                    style={{
                      width: '100%',
                      maxHeight: '70vh',
                      background: '#000',
                      borderRadius: 6,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <video
                      controls
                      controlsList='nodownload'
                      onContextMenu={e => e.preventDefault()}
                      preload='metadata'
                      src={videoSrc}
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                        background: '#000'
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                </DialogContent>
              </Dialog>
            <Dialog
              open={this.state.transcriptionOpen}
              onClose={this.closeTranscription}
              fullWidth
              maxWidth='md'
              PaperProps={{
                sx: {
                  height: { xs: '72vh', sm: '78vh' },
                  maxHeight: { xs: '72vh', sm: '78vh' },
                  width: { xs: 'calc(100vw - 24px)', sm: undefined },
                  margin: { xs: '12px', sm: undefined },
                  borderRadius: { xs: 2, sm: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  backgroundColor: 'transparent',
                  boxShadow: { xs: 'none', sm: undefined }
                }
              }}
            >
              <IconButton
                onClick={this.closeTranscription}
                size='small'
                aria-label='Close transcriptions and translations'
                className={classes.floatingDialogClose}
                disableRipple
              >
                <CloseIcon fontSize='small' />
              </IconButton>

              <DialogContent
                sx={{
                  p: 0,
                  fontFamily: 'inherit',
                  flex: '1 1 auto',
                  minHeight: 0,
                  overflow: 'hidden'
                }}
              >
                <div className={classes.transcriptionDialogInner}>
                  <div className={classes.transcriptionDialogContent}>
                    <TranscriptionTabs values={transValues} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    )
  }
}

InstancePageTable.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  data: PropTypes.object,
  properties: PropTypes.array.isRequired,
  fetchResultsWhenMounted: PropTypes.bool,
  fetchResults: PropTypes.func,
  perspectiveConfig: PropTypes.object.isRequired,
  facetClass: PropTypes.string,
  uri: PropTypes.string,
  screenSize: PropTypes.string
}

export const InstanceHomePageTableComponent = InstancePageTable
export default withStyles(styles)(InstancePageTable)