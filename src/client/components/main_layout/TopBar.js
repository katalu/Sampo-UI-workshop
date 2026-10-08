import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import { useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { has } from 'lodash'
import TopBarLanguageButton from './TopBarLanguageButton'
import TopBarSearchField from './TopBarSearchField'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const TopBar = props => {
  const theme = useTheme()

  const {
    perspectives,
    currentLocale,
    availableLocales,
    layoutConfig,
    location,
    rootUrl,
    loadLocales,
    isFrontPage
  } = props

  const { topBar } = layoutConfig

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const [isCollectionsMenuOpen, setIsCollectionsMenuOpen] = React.useState(false)
  const [isDesktopMoreMenuOpen, setIsDesktopMoreMenuOpen] = React.useState(false)

  const collectionsButtonRef = React.useRef(null)
  const moreButtonRef = React.useRef(null)
  const headerSearchRef = React.useRef(null)

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const federatedSearchMode = location.pathname.indexOf('federated-search') !== -1

  // New compact/header rules apply only away from homepage
  const useCompactNonHomepageHeader = !isFrontPage

  const handleMobileMenuOpen = event => setMobileMoreAnchorEl(event.currentTarget)
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null)

  const handleCollectionsMenuToggle = () => {
    setIsCollectionsMenuOpen(prev => !prev)
    setIsDesktopMoreMenuOpen(false)
  }

  const handleCollectionsMenuClose = () => {
    setIsCollectionsMenuOpen(false)
  }

  const handleDesktopMoreMenuToggle = () => {
    setIsDesktopMoreMenuOpen(prev => !prev)
    setIsCollectionsMenuOpen(false)
  }

  const handleDesktopMoreMenuClose = () => {
    setIsDesktopMoreMenuOpen(false)
  }

  const AdapterLink = React.forwardRef((linkProps, ref) => (
    <Link ref={ref} {...linkProps} role={undefined} />
  ))
  AdapterLink.displayName = 'AdapterLink'

  const getInternalLink = perspective => {
    const searchMode = has(perspective, 'searchMode')
      ? perspective.searchMode
      : 'faceted-search'

    if (searchMode === 'dummy-internal') {
      return `${rootUrl}${perspective.internalLink}`
    }

    return `${rootUrl}/${perspective.id}/${searchMode}`
  }

  const getPerspectiveById = id => perspectives.find(p => p.id === id)

  const getPerspectiveLabel = perspective =>
    perspective.label || intl.get(`perspectives.${perspective.id}.label`)

  const isPerspectiveActive = perspective =>
    Boolean(
      perspective &&
        !has(perspective, 'externalUrl') &&
        location.pathname.includes(`/${perspective.id}/`)
    )

  const getNavButtonSx = (isActive, isOpen = false) => ({
  px: useCompactNonHomepageHeader ? { lg: 1.5 } : { md: 1, lg: 1.5 },
  py: 1,
  minWidth: 'auto',
  borderRadius: 0,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  color: isActive || isOpen ? '#fff' : 'rgba(255,255,255,0.78)',
  backgroundColor: 'transparent',
  borderBottom: '2px solid transparent',
  textTransform: 'none',
  fontSize: useCompactNonHomepageHeader
    ? { lg: '0.95rem' }
    : { md: '0.88rem', lg: '0.95rem' },
  fontWeight: isActive || isOpen ? 600 : 400,
  letterSpacing: '0.02em',
  transition: 'color 0.2s ease',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#fff',
    borderBottomColor: 'transparent'
  },
  '&:focus': {
    outline: 'none'
  }
})

  const getDropdownPaperSx = minWidth => ({
    mt: 1,
    minWidth,
    borderRadius: 1.5,
    overflow: 'hidden'
  })

  const getMobileMenuItemLabel = perspective =>
    useCompactNonHomepageHeader
      ? getPerspectiveLabel(perspective)
      : getPerspectiveLabel(perspective).toUpperCase()

  const visualArtsPerspective = getPerspectiveById('visualArts')
  const performingArtsPerspective = getPerspectiveById('performingArts')
  const graffitiArtPerspective = getPerspectiveById('graffitiArt')
  const decorativeArtsPerspective = getPerspectiveById('decorativeAppliedArts')

  const calliWritingUnitPerspective = getPerspectiveById('calliWritingUnit')
  const personPerspective = getPerspectiveById('person')
  const seriesPerspective = getPerspectiveById('artworkSeries')
  const exhibitionPerspective = getPerspectiveById('exhibition')

  const collectionPerspectives = [
    visualArtsPerspective,
    performingArtsPerspective,
    graffitiArtPerspective,
    decorativeArtsPerspective
  ].filter(Boolean)

  const morePerspectives = [
    personPerspective,
    seriesPerspective,
    exhibitionPerspective
  ].filter(Boolean)

  const isCollectionsActive = collectionPerspectives.some(isPerspectiveActive)
  const isMoreActive = morePerspectives.some(isPerspectiveActive)

  const renderMobileMenuItem = perspective => {
    if (!perspective) return null

    if (has(perspective, 'externalUrl')) {
      return (
        <Box
          component='a'
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <MenuItem onClick={handleMobileMenuClose}>
            {getMobileMenuItemLabel(perspective)}
          </MenuItem>
        </Box>
      )
    }

    return (
      <MenuItem
        key={perspective.id}
        component={AdapterLink}
        to={getInternalLink(perspective)}
        onClick={handleMobileMenuClose}
      >
        {getMobileMenuItemLabel(perspective)}
      </MenuItem>
    )
  }

  const renderDesktopTopMenuItem = perspective => {
    if (!perspective) return null

    const label = getPerspectiveLabel(perspective)

    if (has(perspective, 'externalUrl')) {
      return (
        <Box
          component='a'
          key={perspective.id}
          href={perspective.externalUrl}
          target='_blank'
          rel='noopener noreferrer'
          sx={{ textDecoration: 'none' }}
        >
          <Button sx={getNavButtonSx(false)}>
            {label}
          </Button>
        </Box>
      )
    }

    return (
      <Button
        key={perspective.id}
        component={AdapterLink}
        to={getInternalLink(perspective)}
        sx={getNavButtonSx(isPerspectiveActive(perspective))}
      >
        {label}
      </Button>
    )
  }

  const renderCollectionsMenuItem = perspective => {
    if (!perspective) return null

    return (
      <MenuItem
        key={perspective.id}
        component={AdapterLink}
        to={getInternalLink(perspective)}
        onClick={handleCollectionsMenuClose}
        selected={isPerspectiveActive(perspective)}
        sx={{
          py: 1.25,
          px: 2,
          fontSize: '0.95rem'
        }}
      >
        {getPerspectiveLabel(perspective)}
      </MenuItem>
    )
  }

  const renderDesktopMoreMenuItem = perspective => {
    if (!perspective) return null

    return (
      <MenuItem
        key={perspective.id}
        component={AdapterLink}
        to={getInternalLink(perspective)}
        onClick={handleDesktopMoreMenuClose}
        selected={isPerspectiveActive(perspective)}
        sx={{
          py: 1.25,
          px: 2,
          fontSize: '0.95rem'
        }}
      >
        {getPerspectiveLabel(perspective)}
      </MenuItem>
    )
  }

  const renderInfoItem = item => {
    const label = useCompactNonHomepageHeader
      ? intl.get(`topBar.info.${item.translatedText}`)
      : intl.get(`topBar.info.${item.translatedText}`).toUpperCase()

    if (item.externalLink) {
      return (
        <a
          key={item.id}
          href={intl.get(`topBar.info.${item.translatedUrl}`)}
          target='_blank'
          rel='noopener noreferrer'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <MenuItem onClick={handleMobileMenuClose}>
            {label}
          </MenuItem>
        </a>
      )
    }

    return (
      <MenuItem
        key={item.id}
        component={AdapterLink}
        to={`${rootUrl}${item.internalLink}`}
        onClick={handleMobileMenuClose}
      >
        {label}
      </MenuItem>
    )
  }

   const renderHomepageMobileMenu = () => (
  <Menu
    anchorEl={mobileMoreAnchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    open={isMobileMenuOpen}
    onClose={handleMobileMenuClose}
  >
    <MenuItem
      component='a'
      href='#write-collections'
      onClick={handleMobileMenuClose}
    >
      EXPLORE
    </MenuItem>

    <MenuItem
      component={AdapterLink}
      to={`${rootUrl}/about`}
      onClick={handleMobileMenuClose}
    >
      ABOUT
    </MenuItem>
  </Menu>
)
  

  const renderCompactMobileMenu = () => {
  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        elevation: 10,
        sx: {
          mt: 1.25,
          minWidth: 280,
          maxWidth: 'calc(100vw - 24px)',
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: '#2b2b2b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          '& .MuiMenuItem-root': {
            minHeight: 44,
            px: 2,
            py: 1.25,
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.88)',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#fff'
            }
          },
          '& .MuiDivider-root': {
            borderColor: 'rgba(255,255,255,0.08)'
          }
        }
      }}
    >

      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 1,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)'
        }}
      >
        WRITE Collections
      </Box>

      {collectionPerspectives.map(perspective => renderMobileMenuItem(perspective))}

      <Divider />

      {calliWritingUnitPerspective && renderMobileMenuItem(calliWritingUnitPerspective)}

      <Divider />

      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 1,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)'
        }}
      >
        More
      </Box>

      {personPerspective && renderMobileMenuItem(personPerspective)}
      {seriesPerspective && renderMobileMenuItem(seriesPerspective)}
      {exhibitionPerspective && renderMobileMenuItem(exhibitionPerspective)}

      <Divider />

      <MenuItem
        component={AdapterLink}
        to={`${rootUrl}/about`}
        onClick={handleMobileMenuClose}
      >
        About
      </MenuItem>
    </Menu>
  )
}

  const renderMobileMenu = () => {
    if (isFrontPage) {
      return renderHomepageMobileMenu()
    }

    return renderCompactMobileMenu()
  }

  return (
    <>
      <AppBar
        position={isFrontPage ? 'absolute' : 'sticky'}
        elevation={0}
        sx={{
          background: isFrontPage
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 58%, rgba(0,0,0,0) 100%)'
            : '#332f2bec',
          boxShadow: 'none',
          borderBottom: isFrontPage ? 'none' : '1px solid rgba(255,255,255,0.12)',
          backdropFilter: isFrontPage ? 'none' : 'saturate(120%) blur(6px)'
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 0.75, md: 1 },
            minHeight: isFrontPage ? 88 : 64,
            display: 'flex',
            alignItems: 'center',
            gap: { md: 0.5, lg: 1 }
          }}
        >
         <Button
            component={AdapterLink}
            to={rootUrl || '/'}
            onClick={() => (federatedSearchMode ? props.clientFSClearResults() : null)}
            sx={
              isFrontPage
                ? {
                    mr: { xs: 1, md: 1.5, lg: 2 },
                    ml: { xs: 1, md: 2, lg: 3 },
                    px: 0,
                    minWidth: 'auto',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: { xs: '1rem', md: '1.02rem', lg: '1.08rem' },
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.92
                    }
                  }
                : {
                    ...getNavButtonSx(location.pathname === rootUrl || location.pathname === `${rootUrl}/`),
                    mr: { xs: 1, md: 1.5 },
                    ml: 0
                  }
            }
          >
            Home
          </Button>
          {!isFrontPage && (
            <Box
              sx={{
                width: { xs: 128, sm: 170, md: 210, lg: 240 },
                ml: { xs: 0.25, md: 0.5 },
                mr: { xs: 0.5, md: 1.5 },
                display: 'flex',
                alignItems: 'center',
                borderRadius: 3.5,
                backgroundColor: 'rgba(92,88,84,0.9)',
                color: '#f4efe6',
                border: 'none',
                overflow: 'hidden',

                '&:hover': {
                  backgroundColor: 'rgba(92,88,84,1)'
                },

                '& > .topbar-search-field': {
                  flex: '1 1 auto',
                  minWidth: 0
                },

                '& .topbar-search-field > div': {
                  marginLeft: '0 !important',
                  marginRight: '0 !important',
                  width: '100%',
                  backgroundColor: 'transparent !important',
                  color: 'inherit !important'
                },

                '& .topbar-search-field > div:hover': {
                  backgroundColor: 'transparent !important'
                },

                '& .topbar-search-field .MuiInputBase-root': {
                  width: '100%',
                  minWidth: 0,
                  height: { xs: 30, sm: 32 },
                  color: 'inherit !important'
                },

                '& .topbar-search-field .MuiInputBase-input, & .topbar-search-field input': {
                  fontSize: { xs: '0.76rem', sm: '0.82rem' },
                  color: '#f4efe6 !important',
                  pr: 0
                },

                '& .topbar-search-field .MuiInputBase-input::placeholder': {
                  color: 'rgba(244,239,230,0.62) !important',
                  opacity: 1
                },

                '& .topbar-search-field .MuiSvgIcon-root': {
                  color: '#fff !important',
                  fontSize: { xs: 18, sm: 20 }
                }
              }}
            >
              <Box className='topbar-search-field'>
                <TopBarSearchField
                  ref={headerSearchRef}
                  fetchFullTextResults={props.fetchFullTextResults}
                  clearResults={props.clearResults}
                  screenSize={props.screenSize}
                  rootUrl={rootUrl}
                  useShortPlaceholder
                  locationPathname={location.pathname}
                />
              </Box>

              <Button
            type='button'
            aria-label='Search'
            onClick={() => {
              headerSearchRef.current?.handleClick()
            }}
            sx={{
              flex: { xs: '0 0 28px', sm: '0 0 32px' },
              minWidth: { xs: 28, sm: 32 },
              width: { xs: 28, sm: 32 },
              height: { xs: 30, sm: 32 },
              p: 0,
              borderRadius: 0,
              color: '#f4efe6',
              backgroundColor: 'transparent',
              lineHeight: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.12)'
              }
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: { xs: 16, sm: 17 } }} />
          </Button>
            </Box>
          )}
          {topBar.logoImageSecondary && !isFrontPage && (
            <a
              href={topBar.logoImageSecondaryLink}
              target='_blank'
              rel='noopener noreferrer'
              style={{ display: 'inline-flex' }}
            >
              <Button
                sx={{
                  minWidth: 'auto',
                  px: { xs: 0.5, md: 1 },
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <Box
                  component='img'
                  src={topBar.logoImageSecondary}
                  alt='logoSecondary'
                  sx={{
                    height: 26,
                    [theme.breakpoints.up('sm')]: {
                      height: 30
                    },
                    [theme.breakpoints.up('lg')]: {
                      height: 32
                    },
                    [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
                      height: 52
                    }
                  }}
                />
              </Button>
            </a>
          )}

          <Box sx={{ flexGrow: 1, minWidth: 0 }} />

          <Box
            sx={{
              display: useCompactNonHomepageHeader
                ? { xs: 'none', lg: 'flex' }
                : { xs: 'none', md: 'flex' },
              alignItems: 'center',
              minWidth: 0
            }}
          >
            {isFrontPage ? (
          <>

              <Box sx={{ flexGrow: 1 }} />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mr: { md: 2, lg: 3 }
                }}
              >
                <Button
                  component='a'
                  href='#write-collections'
                  sx={{
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    fontSize: { md: '1rem', lg: '1.05rem' },
                    px: 0,
                    minWidth: 'auto',
                    textShadow: '0 2px 10px rgba(0,0,0,0.28)',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.92
                    }
                  }}
                >
                  Explore
                </Button>

                <Box
                  component='span'
                  sx={{
                    color: 'rgba(255,255,255,0.75)',
                    userSelect: 'none'
                  }}
                >
                  |
                </Box>

                <Button
                  component={AdapterLink}
                  to={`${rootUrl}/about`}
                  sx={{
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    fontSize: { md: '1rem', lg: '1.05rem' },
                    px: 0,
                    minWidth: 'auto',
                    textShadow: '0 2px 10px rgba(0,0,0,0.28)',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.92
                    }
                  }}
                >
                  About
                </Button>
              </Box>
            </>
          ) : (
              <>
                <ClickAwayListener
                  onClickAway={() => {
                    handleCollectionsMenuClose()
                    handleDesktopMoreMenuClose()
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      position: 'relative',
                      minWidth: 0
                    }}
                  >
                    <Button
                      ref={collectionsButtonRef}
                      onClick={handleCollectionsMenuToggle}
                      endIcon={
                        <ExpandMoreIcon
                          sx={{
                            fontSize: 18,
                            transition: 'transform 0.2s ease',
                            transform: isCollectionsMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                          }}
                        />
                      }
                      sx={{
                        ...getNavButtonSx(isCollectionsActive, isCollectionsMenuOpen),
                        pr: 1
                      }}
                    >
                      WRITE Collections
                    </Button>

                    <Popper
                      open={isCollectionsMenuOpen}
                      anchorEl={collectionsButtonRef.current}
                      placement='bottom-start'
                      disablePortal
                      sx={{ zIndex: theme.zIndex.appBar + 1 }}
                    >
                      <Paper elevation={6} sx={getDropdownPaperSx(240)}>
                        <MenuList autoFocusItem={false}>
                          {collectionPerspectives.map(renderCollectionsMenuItem)}
                        </MenuList>
                      </Paper>
                    </Popper>

                    {renderDesktopTopMenuItem(calliWritingUnitPerspective)}

                    <Button
                      ref={moreButtonRef}
                      onClick={handleDesktopMoreMenuToggle}
                      endIcon={
                        <ExpandMoreIcon
                          sx={{
                            fontSize: 18,
                            transition: 'transform 0.2s ease',
                            transform: isDesktopMoreMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                          }}
                        />
                      }
                      sx={{
                         ...getNavButtonSx(isMoreActive, isDesktopMoreMenuOpen),
                        pr: 1
                      }}
                    >
                      More
                    </Button>

                    <Popper
                      open={isDesktopMoreMenuOpen}
                      anchorEl={moreButtonRef.current}
                      placement='bottom-start'
                      disablePortal
                      sx={{ zIndex: theme.zIndex.appBar + 1 }}
                    >
                      <Paper elevation={6} sx={getDropdownPaperSx(220)}>
                        <MenuList autoFocusItem={false}>
                          {morePerspectives.map(renderDesktopMoreMenuItem)}
                        </MenuList>
                      </Paper>
                    </Popper>
                    <Button
                      component={AdapterLink}
                      to={`${rootUrl}/about`}
                      sx={getNavButtonSx(location.pathname.includes('/about'))}
                    >
                      About
                    </Button>
                  </Box>
                </ClickAwayListener>

                {layoutConfig.topBar.showLanguageButton && (
                  <Box
                    sx={{
                      ml: 2,
                      pl: 2,
                      borderLeft: '1px solid rgba(255,255,255,0.16)',
                      display: { lg: 'flex' },
                      alignItems: 'center'
                    }}
                  >
                    <TopBarLanguageButton
                      currentLocale={currentLocale}
                      availableLocales={availableLocales}
                      loadLocales={loadLocales}
                      location={location}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>

          <Box
            sx={{
              display: useCompactNonHomepageHeader
                ? { xs: 'flex', lg: 'none' }
                : { xs: 'flex', md: 'none' },
              alignItems: 'center'
            }}
          >
            {layoutConfig.topBar.showLanguageButton && (
              <TopBarLanguageButton
                currentLocale={currentLocale}
                availableLocales={availableLocales}
                loadLocales={loadLocales}
                location={location}
              />
            )}

            <IconButton
              aria-label='Open navigation'
              color='inherit'
              onClick={handleMobileMenuOpen}
              size='large'
              sx={{
                ml: 0.5,
                mr: { xs: 0.5, sm: 0.75 },
                color: '#fff',
                border: useCompactNonHomepageHeader
                  ? '1px solid rgba(255,255,255,0.14)'
                  : 'none',
                borderRadius: useCompactNonHomepageHeader ? 1.5 : 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: useCompactNonHomepageHeader
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(255,255,255,0.08)',
                  borderColor: useCompactNonHomepageHeader
                    ? 'rgba(255,255,255,0.24)'
                    : 'transparent'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu()}
    </>
  )
}

TopBar.propTypes = {
  fetchFullTextResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  loadLocales: PropTypes.func.isRequired,
  currentLocale: PropTypes.string.isRequired,
  availableLocales: PropTypes.array.isRequired,
  perspectives: PropTypes.array.isRequired,
  screenSize: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  rootUrl: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired,
  clientFSClearResults: PropTypes.func,
  isFrontPage: PropTypes.bool
}

export default TopBar