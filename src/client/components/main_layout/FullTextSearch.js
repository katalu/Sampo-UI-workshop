import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import Box from '@mui/material/Box'
import PerspectiveTabs from './PerspectiveTabs'
import ReactVirtualizedTable from '../facet_results/ReactVirtualizedTable'
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay'
import { getSpacing } from '../../helpers/helpers'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import history from '../../History'

/**
 * A component for displaying full text search results.
 */
const FullTextSearch = props => {
  const { rootUrl, layoutConfig, screenSize } = props
  const perspectiveUrl = `${rootUrl}/full-text-search`
  const handleBack = () => {
    history.goBack()
  }

  return (
    <Box
    sx={theme => ({
      position: 'relative',
      margin: theme.spacing(0.5),
      height: 'calc(100vh - 120px)',
      minHeight: 'calc(100vh - 120px)',
      overflow: 'hidden',

      [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
        height: `calc(100% - ${
          layoutConfig.topBar.reducedHeight + getSpacing(theme, 1)
        }px)`
      },

      [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
        height: `calc(100% - ${
          layoutConfig.topBar.defaultHeight + getSpacing(theme, 1)
        }px)`
      }
    })}
  >
      <IconButton
        type='button'
        aria-label='Back'
        onClick={handleBack}
        size='small'
        disableRipple
        sx={{
          display: { xs: 'none', sm: 'inline-flex' },
          position: 'absolute',
          top: 11,
          left: 14,
          zIndex: 999,
          width: 32,
          height: 32,
          color: 'rgba(0,0,0,0.72)',
          backgroundColor: 'rgba(255,255,255,0.94)',
          borderRadius: 1.5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          '&:hover': {
            backgroundColor: '#fff',
            color: '#000'
          }
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 19 }} />
      </IconButton>
      <PerspectiveTabs
        tabs={[{
          id: 'table',
          label: 'table',
          icon: <CalendarViewDayIcon />,
          value: 0
        }]}
        screenSize={screenSize}
        layoutConfig={layoutConfig}
      />
      <Route exact path={perspectiveUrl}>
        <Redirect to={`${perspectiveUrl}/table`} />
      </Route>
      <Route path={`${perspectiveUrl}/table`}>
        <ReactVirtualizedTable
          fullTextSearch={props.fullTextSearch}
          resultClass={props.resultClass}
          sortFullTextResults={props.sortFullTextResults}
          layoutConfig={props.layoutConfig}
        />
      </Route>
    </Box>
  )
}

FullTextSearch.propTypes = {
  fullTextSearch: PropTypes.object.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default FullTextSearch
