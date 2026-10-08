import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import TopBarSearchField from '../../main_layout/TopBarSearchField'
import has from 'lodash/has'
import MainCard from './MainCard'
import heroImage from '../../../img/main_page/hero.jpg'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import grungeTexture from '../../../img/main_page/grunge.jpg'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

/**
 * A component for generating a front page for a semantic portal.
 */
const Main = props => {
  const {
    perspectives,
    screenSize,
    layoutConfig,
    rootUrl,
    fetchFullTextResults,
    clearResults
  } = props
  const { mainPage } = layoutConfig

  const heroSearchRef = React.useRef(null)
  
  const isSmallScreen = screenSize === 'xs' || screenSize === 'sm'
  const isBigScreen = screenSize === 'xl'

  const showScrollHint = isBigScreen

  let headingVariant = 'h5'
  let subheadingVariant = 'body1'
  let descriptionVariant = 'body1'

  switch (screenSize) {
    case 'xs':
      headingVariant = 'h5'
      subheadingVariant = 'body1'
      descriptionVariant = 'body1'
      break
    case 'sm':
      headingVariant = 'h4'
      subheadingVariant = 'h6'
      descriptionVariant = 'h6'
      break
    case 'md':
      headingVariant = 'h3'
      subheadingVariant = 'h6'
      descriptionVariant = 'h6'
      break
    case 'lg':
      headingVariant = 'h2'
      subheadingVariant = 'h5'
      descriptionVariant = 'h6'
      break
    case 'xl':
      headingVariant = 'h1'
      subheadingVariant = 'h4'
      descriptionVariant = 'h6'
      break
    default:
      break
  }

  const getPerspectiveById = id => perspectives.find(p => p.id === id)

  const isVisibleOnFrontPage = perspective =>
    perspective && !(has(perspective, 'hideCardOnFrontPage') && perspective.hideCardOnFrontPage)

  const writeCollections = [
    getPerspectiveById('visualArts'),
    getPerspectiveById('performingArts'),
    getPerspectiveById('graffitiArt'),
    getPerspectiveById('decorativeAppliedArts')
  ].filter(isVisibleOnFrontPage)

  const exploreArchive = [
    getPerspectiveById('calliWritingUnit'),
    getPerspectiveById('person'),
    getPerspectiveById('artworkSeries'),
    getPerspectiveById('exhibition')
  ].filter(isVisibleOnFrontPage)

  return (
    <Box
      sx={{
        backgroundColor: '#f6f4ef',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'stretch',
          overflow: 'hidden',
          backgroundColor: '#111'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: {
              xs: '32% 22%',   
              sm: 'center center',
              md: 'left center'  
            },
            transform: 'scale(1.01)'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(
                to right,
                rgba(0,0,0,0.78) 0%,
                rgba(0,0,0,0.55) 20%,
                rgba(0,0,0,0.32) 38%,
                rgba(0,0,0,0.12) 52%,
                rgba(0,0,0,0.03) 62%,
                rgba(0,0,0,0.0) 68%
              ),
              linear-gradient(
                140deg,
                rgba(0,0,0,0.22) 0%,
                rgba(0,0,0,0.10) 35%,
                rgba(0,0,0,0.04) 55%,
                rgba(0,0,0,0.0) 70%
              ),
              linear-gradient(
                to bottom,
                rgba(0,0,0,0.04) 0%,
                rgba(0,0,0,0.10) 40%,
                rgba(0,0,0,0.28) 100%
              )
            `
          }}
        />

       <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'stretch'
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 1400,
              mx: 'auto',
              px: { xs: 2, sm: 3, md: 5, lg: 6 },
              pl: { xs: 3, sm: 6, md: 10, lg: 12 },
              pt: { xs: 8, sm: 10, md: 10, lg: 12, xl: 14 },
              pb: { xs: 5, sm: 6, md: 6 },
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Grid
              container
              sx={{
                minHeight: { xs: 'calc(100vh - 150px)', md: '78vh' },
                alignItems: 'center'
              }}
            >
              <Grid item xs={12} md={7} lg={6}>
                <Box
                  sx={{
                    minHeight: {
                      xs: 'calc(100vh - 120px)',
                      sm: '62vh',
                      md: '72vh',
                      lg: '76vh',
                      xl: '80vh'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    maxWidth: { xs: '100%', md: 680, lg: 760, xl: 820 }
                  }}
                >
                  {/* TEXT BLOCK */}
                  <Box>
                    <Typography
                      component='h1'
                      variant={headingVariant}
                      sx={{
                        pt: { xs: 18, sm: 0 },
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        letterSpacing: '-0.015em',
                        lineHeight: 1.02,
                        color: '#fff',
                        textAlign: 'left',
                        textShadow: 'none',
                        fontSize: {
                          xs: '2.3rem',
                          sm: '2.6rem',
                          md: '3.2rem',
                          lg: '3.6rem',
                          xl: '4rem'
                        }
                      }}
                    >
                      {intl.get('appTitle.long')}
                    </Typography>

                    <Box
                      sx={theme => ({
                        mt: 2.5,
                        width: '100%',
                        ...(mainPage.wrapSubheading && {
                          [theme.breakpoints.up('md')]: {
                            display: 'block'
                          }
                        })
                      })}
                    >
                      <Typography
                        component='p'
                        variant={subheadingVariant}
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: {
                            xs: '1.2rem',
                            sm: '1.2rem',
                            md: '1.3rem',
                            lg: '1.4rem',
                            xl: '1.5rem'
                          },
                          letterSpacing: '0.005em',
                          lineHeight: 1,
                          color: 'rgba(255, 255, 255, 0.93)',
                          maxWidth: 520,
                          mt: 2
                        }}
                      >
                        {intl.get('appTitle.subheading')}
                      </Typography>
                    </Box>

                    <Typography
                      component='p'
                      sx={{
                        mt: 2.5,
                        color: 'rgba(255,255,255,0.82)',
                        fontSize: { xs: '1rem', md: '1.05rem' },
                        lineHeight: 1.6,
                        maxWidth: 560,
                        textAlign: 'left',
                        textShadow: '0 2px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      {intl.getHTML('appDescription')}
                    </Typography>
                  </Box>

                  {/* SEARCH BLOCK */}
                  <Box
                    sx={{
                      mb: { xs: 5, sm: 5, md: 5, lg: 6, xl: 7 },
                      width: '100%',
                      maxWidth: { xs: '90%', sm: 600, md: 680, lg: 720 },
                      display: 'flex',
                      alignItems: 'center',
                      alignSelf: { xs: 'flex-start', sm: 'flex-start' },
                      backgroundColor: '#fff',
                      borderRadius: 6,
                      p: { xs: 0.5, sm: 0.75 },
                      boxShadow: '0 16px 28px rgba(0,0,0,0.22)',

                      '& > .hero-search-field': {
                        flex: '1 1 auto',
                        minWidth: 0
                      },

                      '& .hero-search-field form': {
                        width: '100%',
                        minWidth: 0
                      },

                      '& .hero-search-field .MuiFormControl-root': {
                        width: '100%',
                        minWidth: 0
                      },

                      '& .hero-search-field .MuiInputBase-root': {
                        width: '100%',
                        minWidth: 0,
                        display: 'flex',
                        backgroundColor: 'transparent !important',
                        color: 'rgba(0,0,0,0.5) !important'
                      },

                      '& .hero-search-field .MuiOutlinedInput-notchedOutline': {
                        border: 'none !important'
                      },

                      '& .hero-search-field .MuiInputAdornment-positionStart': {
                        order: -1,
                        marginRight: 1
                      },

                      '& .hero-search-field .MuiInputAdornment-positionEnd': {
                        display: 'none'
                      },

                      '& .hero-search-field .MuiInputBase-input, & .hero-search-field input': {
                        flex: '1 1 auto',
                        minWidth: 0,
                        width: '100%',
                        color: 'rgba(0,0,0,0.5) !important'
                      },

                      '& .hero-search-field .MuiInputBase-input::placeholder': {
                        color: 'rgba(0,0,0,0.28) !important',
                        opacity: 1
                      },

                      '& .hero-search-field .MuiSvgIcon-root': {
                        color: 'rgba(0,0,0,0.4) !important'
                      }
                    }}
                  >
                    <Box className='hero-search-field'>
                      <TopBarSearchField
                        ref={heroSearchRef}
                        fetchFullTextResults={fetchFullTextResults}
                        clearResults={clearResults}
                        screenSize={screenSize}
                        rootUrl={rootUrl}
                      />
                    </Box>

                    <Button
                      type='button'
                      variant='contained'
                      onClick={() => {
                        heroSearchRef.current?.handleClick()
                      }}
                      sx={{
                        flex: '0 0 auto',
                        ml: 1,
                        borderRadius: 999,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        whiteSpace: 'nowrap',
                        px: { xs: 1.5, md: 2.4 },
                        py: { xs: 0.8, md: 1 },
                        backgroundColor: '#333',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#222'
                        }
                      }}
                    >
                      <ArrowForwardIcon />
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
       {showScrollHint && (
          <Box
            component='button'
            type='button'
            aria-label='Scroll to archive cards'
            onClick={() => {
              document
                .getElementById('write-collections')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: { xs: 18, sm: 22, md: 26 },
              transform: 'translateX(-50%)',
              zIndex: 3,
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.45)',
              backgroundColor: 'rgba(0,0,0,0.22)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              backdropFilter: 'blur(3px)',
              animation: 'scrollHintBounce 1.8s ease-in-out infinite',
              '@keyframes scrollHintBounce': {
                '0%, 100%': {
                  transform: 'translateX(-50%) translateY(0)'
                },
                '50%': {
                  transform: 'translateX(-50%) translateY(6px)'
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.34)'
              }
            }}
          >
            <KeyboardArrowDownIcon fontSize='medium' />
          </Box>
        )}
      </Box>

      
      <Box
        sx={{
          backgroundColor: '#e3e3e3',
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
          width: '100%',
          px: { xs: 2, sm: 3, md: 5 },
          pt: 6,
          pb: 0,
          boxSizing: 'border-box'
        }}
      >
        <Box
          aria-hidden='true'
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            backgroundImage: `url(${grungeTexture})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5, 
            mixBlendMode: 'normal'
          }}
        />
        <Box
          id='write-collections'
          sx={{
            position: 'relative', 
            zIndex: 1,         
            scrollMarginTop: { xs: 50, md: 68 }
          }}
        >
          <Box
            sx={{
              pl: { xs: 1, sm: 3, md: 5, lg: 7 },
              mb: 3
            }}
          >
            <Typography
              variant='h3'
              fontFamily='Inter, sans-serif'
              sx={{
                color: '#222222be',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                mb: 1,
                fontSize: {
                  xs: '1.9rem',
                  sm: '2.2rem',
                  md: '2.6rem',
                  lg: '3rem'
                }
              }}
            >
              WRITE Collections
            </Typography>

            <Typography
              variant='body1'
              sx={{
                color: 'rgba(0,0,0,0.62)',
                maxWidth: 620,
                fontSize: '1.05rem',
                lineHeight: 1.6
              }}
            >
              Explore the archive through its four main collection perspectives.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1, width: '100%', overflowX: 'clip' }}>
            <Grid
              container
              columnSpacing={1.5}
              rowSpacing={1.5}
              sx={{
                width: 'auto',
                margin: 0,
                mb: 0,
                '& > .MuiGrid-item': {
                  pl: { xs: '0 !important', sm: '12px !important' }
                }
              }}
            >
              {writeCollections.map(perspective => (
                <MainCard
                  key={perspective.id}
                  perspective={perspective}
                  cardHeadingVariant='h4'
                  rootUrl={rootUrl}
                  variant='editorial'
                />
              ))}
            </Grid>
          </Box>
        </Box>

        <Box id='explore-archive' sx={{ position: 'relative', zIndex: 1, pt: 8, pb: 10 }}>
          <Box
            sx={{
              pl: { xs: 1, sm: 3, md: 5, lg: 7 },
              mb: 3
            }}
          >
            <Typography
              variant='h3'
              fontFamily='Inter, sans-serif'
              sx={{
                color: '#222222be',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                mb: 1,
                fontSize: {
                  xs: '1.9rem',
                  sm: '2.2rem',
                  md: '2.6rem',
                  lg: '3rem'
                }
              }}
            >
              Further Explorations
            </Typography>

            <Typography
              variant='body1'
              sx={{
                color: 'rgba(0,0,0,0.62)',
                maxWidth: 620,
                fontSize: '1.05rem',
                lineHeight: 1.6
              }}
            >
              Discover additional pathways through the perspectives below.
            </Typography>
          </Box>

          <Box sx={{ width: '100%', overflowX: 'clip' }}>
            <Grid
              container
              columnSpacing={1.5}
              rowSpacing={1.5}
              sx={{
                width: 'auto',
                margin: 0,
                '& > .MuiGrid-item': {
                  pl: { xs: '0 !important', sm: '12px !important' }
                }
              }}
            >
              {exploreArchive.map(perspective => (
                <MainCard
                  key={perspective.id}
                  perspective={perspective}
                  cardHeadingVariant='h4'
                  rootUrl={rootUrl}
                  variant='secondary'
                />
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>

        <Box
          sx={{
            mt: 1,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {/* <Typography
            sx={theme => ({
              marginTop: theme.spacing(0.5),
              fontSize: '0.7em'
            })}
          >
            {intl.getHTML('mainPageImageLicence')}
          </Typography> */}
        </Box>
      </Box>
  )
}
Main.propTypes = {
  perspectives: PropTypes.array.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired,
  fetchFullTextResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired
}

export default Main