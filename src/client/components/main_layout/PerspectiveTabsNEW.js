import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import intl from 'react-intl-universal'

// helper function for converting a tab path into tab index value
const pathnameToTabValue = (location, tabs) => {
  const activeID = location.pathname.split('/').pop()
  let value = 0

  tabs.forEach(tab => {
    if (tab.id === activeID) {
      value = tab.value
    }
  })

  return value
}

/**
 * A component for generating view tabs for a faceted search perspective or an instance page.
 */
const PerspectiveTabs = props => {
  const { tabs, layoutConfig } = props
  const variant = tabs.length > 4 ? 'scrollable' : 'fullWidth'
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTab(pathnameToTabValue(location, tabs))
    }, 1000)

    return () => clearTimeout(timer)
  }, [location, tabs])

  const handleChange = () => {
    setCurrentTab(false)
  }

  const accentColor = '#B71C1C'

  return (
    <Paper
      elevation={0}
      sx={theme => ({
        flexGrow: 1,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.grey[100],
        borderBottom: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden'
      })}
    >
      <Tabs
        value={currentTab}
        onChange={handleChange}
        variant={variant}
        scrollButtons='auto'
        TabIndicatorProps={{
          sx: {
            height: 3,
            backgroundColor: accentColor
          }
        }}
        sx={theme => ({
          minHeight: layoutConfig.tabHeight,

          '& .MuiTab-root': {
            textTransform: 'uppercase',
            minHeight: layoutConfig.tabHeight,
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),

            color: theme.palette.text.secondary,
            fontWeight: 500,

            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(1),

            transition: 'all 0.2s ease',
            position: 'relative',

            '& .MuiSvgIcon-root': {
              fontSize: '1.25rem'
            },

            '&:hover': {
              backgroundColor: 'rgba(183,28,28,0.05)',
              color: accentColor
            },

            '&.Mui-selected': {
              color: accentColor,
              backgroundColor: 'rgba(183,28,28,0.08)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
            },

            // divider between tabs
            '&:not(:last-of-type)::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: '20%',
              height: '60%',
              width: '1px',
              backgroundColor: theme.palette.divider
            }
          }
        })}
      >
        {tabs.map(tab => (
          <Tab
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            iconPosition="start"
            label={intl.get(`tabs.${tab.id}`)}
            component={Link}
            to={tab.id}
            wrapped={false}
          />
        ))}
      </Tabs>
    </Paper>
  )
}

PerspectiveTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  screenSize: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export default PerspectiveTabs