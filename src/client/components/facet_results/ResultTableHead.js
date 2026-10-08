import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import classNames from 'classnames'
import withStyles from '@mui/styles/withStyles'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import TableSortLabel from '@mui/material/TableSortLabel'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/InfoOutlined'

const styles = theme => ({
  headerCol: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1
  },
  emptyHeaderCol: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  }
})

const ResultTableHead = props => {
  const { classes, columns, sortBy, sortDirection, onSortBy, perspectiveConfig, resultClass } = props
  const translationsID = perspectiveConfig.propertiesTranslationsID || resultClass
  const [activeHelpId, setActiveHelpId] = React.useState(null)

  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false

    return window.innerWidth < 600 || window.innerWidth >= 1536
  }

  const renderInfoIcon = ({ id, label, help }) => {
    if (!help) return null

    const isTouchMode = isTouchDevice()
    const isOpen = activeHelpId === id

    if (!isTouchMode) {
      return (
        <Tooltip
          title={help}
          placement='bottom'
          enterDelay={300}
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
            data-table-info-icon='true'
            aria-label={`About ${label}`}
            size='small'
            sx={{ opacity: 0.5, padding: '2px', marginLeft: '4px' }}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            <InfoIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )
    }

    return (
      <Tooltip
        title={help}
        placement='bottom'
        open={isOpen}
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
          data-table-info-icon='true'
          aria-label={`About ${label}`}
          size='small'
          sx={{ opacity: 0.5, padding: '2px', marginLeft: '4px' }}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()

            setActiveHelpId(prev => (prev === id ? null : id))
          }}
        >
          <InfoIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <TableHead
      onClick={() => {
        if (isTouchDevice() && activeHelpId) {
          setActiveHelpId(null)
        }
      }}
    >
      <TableRow>
        <td className={classNames(classes.headerCol, classes.emptyHeaderCol)} key='empty' />
        {columns.map(column => {
          if (column.onlyOnInstancePage) { return null }

          if (column.hideHeader) {
            return (
              <td className={classes.headerCol} key='empty2' />
            )
          }

          const label = intl.get(`perspectives.${translationsID}.properties.${column.id}.label`)
          const description = intl.get(`perspectives.${translationsID}.properties.${column.id}.description`)

          return (
            <React.Fragment key={column.id}>
              {column.disableSort
                ? (
                  <TableCell className={classes.headerCol}>
                    {label}
                    {renderInfoIcon({
                      id: `table-header-${column.id}`,
                      label,
                      help: description
                    })}
                  </TableCell>
                  )
                : (
                  <TableCell
                    className={classes.headerCol}
                    sortDirection={sortBy === column.id ? sortDirection : false}
                  >
                    <Tooltip
                      title={`Sort by ${label}`}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={sortBy === column.id}
                        direction={sortBy === column.id ? sortDirection : 'asc'}
                        hideSortIcon
                        onClick={onSortBy(column.id)}
                      >
                        {label}
                      </TableSortLabel>
                    </Tooltip>

                    {renderInfoIcon({
                      id: `table-header-${column.id}`,
                      label,
                      help: description
                    })}
                  </TableCell>
                  )}
            </React.Fragment>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

ResultTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  onSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string
}

export default withStyles(styles)(ResultTableHead)
