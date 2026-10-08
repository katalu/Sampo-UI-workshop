import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import { Link as RouterLink } from 'react-router-dom'
import Masonry from '@mui/lab/Masonry'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

const ImageGridResults = ({ perspectiveState, fetchResults, perspectiveID, resultClass, facetClass }) => {
  const rows = perspectiveState?.results || []

  console.log('IMAGE RESULTS:', rows)

  useEffect(() => {
    fetchResults({ perspectiveID, resultClass, facetClass })
  }, [fetchResults, perspectiveID, resultClass, facetClass])

  const MAX_PER_PAGE = 96
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search)
    const value = parseInt(params.get('page'), 10)

    return Number.isNaN(value) || value < 0 ? 0 : value
  }

  const [page, setPage] = useState(getInitialPage)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [imageMeta, setImageMeta] = useState({})

  const scrollContainerRef = useRef(null)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'auto'
      })
    }
  }, [page])
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (page === 0) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }

    const search = params.toString()

    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${search ? `?${search}` : ''}`
    )
  }, [page])

  const safeRowsPerPage = Math.min(rowsPerPage, MAX_PER_PAGE)

  const visibleRows = useMemo(() => {
    const start = page * safeRowsPerPage
    const end = start + safeRowsPerPage
    return rows.slice(start, end)
  }, [rows, page, safeRowsPerPage])

  const first = (v) => (Array.isArray(v) ? v[0] : v)

  const normalize = (u) => {
    const v = first(u)
    if (!v) return null
    if (typeof v === 'string') return v
    return v.url || v.value || v.id || v.uri || null
  }

  const getTitle = (r) =>
    normalize(r?.prefLabel__prefLabel) ||
    normalize(r?.titleLiteral) ||
    ''

  const getImageUrl = (r) => {
    const img = normalize(r?.img)
    if (img) return img
    return normalize(first(r?.image)) || normalize(r?.image__url) || normalize(r?.image__id)
  }

  const getThumbnailUrl = (r) => {
    return (
      normalize(r?.thumbnailUrl) ||
      normalize(r?.thumbnailUrl__url) ||
      normalize(r?.thumbnailUrl__id) ||
      getImageUrl(r)
    )
  }

  const getKey = (r, idx) => normalize(r?.id) || r?.localId || idx

  const getInstancePath = (r) => {
    const uri = normalize(r?.id) || normalize(r?.prefLabel__id)
    if (!uri) return null
    const localId = uri.replace(/^.*\//, '')
    return `/${perspectiveID}/page/${encodeURIComponent(localId)}/table`
  }

  const getAspectType = (key) => {
    const meta = imageMeta[key]
    if (!meta?.width || !meta?.height) return 'normal'

    const ratio = meta.width / meta.height

    // Only crop real outliers
    if (ratio > 4) return 'wide'
    if (ratio < 0.25) return 'tall'
    return 'normal'
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isBigScreen = useMediaQuery(theme.breakpoints.up('xl'))

  const showTitleBelow = isMobile || isBigScreen

  const getFrameSize = (aspectType) => {
  switch (aspectType) {
    case 'wide':
      return {
        width: '100%',
        height: {
          xs: 190,
          sm: 210,
          md: 230,
          lg: 250
        }
      }

    case 'tall':
      return {
        width: '100%',
        height: {
          xs: 260,
          sm: 320,
          md: 360,
          lg: 400
        }
      }

    default:
      return {
        width: '100%',
        height: 'auto'
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: 'calc(100dvh - 150px)',
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden',
        bgcolor: '#d6d6d6'
      }}
    >
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={safeRowsPerPage}
        onRowsPerPageChange={(e) => {
          const next = parseInt(e.target.value, 10)
          setRowsPerPage(next)
          setPage(0)
        }}
        rowsPerPageOptions={[12, 24, 48, 96]}
        labelRowsPerPage="Images per page"
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
          flexShrink: 0,

          '& .MuiTablePagination-spacer': {
            display: 'none'
          },
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'flex-start',
            minHeight: 40,
            paddingRight: 8
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.75rem'       
          },
          '& .MuiTablePagination-select': {
            fontSize: '0.75rem'
          }
        }}
      />

      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: 1,
          boxSizing: 'border-box'
        }}
        >
        <Masonry
          columns={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 4 }}
          spacing={2}
          defaultColumns={3}
          defaultSpacing={2}
          sx={{
            margin: 0,
            width: 'auto',
            minWidth: 0
          }}
        >
    {visibleRows.map((r, idx) => {
      const originalUrl = getImageUrl(r)
      const url = getThumbnailUrl(r)
      if (!url) return null

      const key = getKey(r, idx)
      const title = getTitle(r)
      const to = getInstancePath(r)

      const aspectType = getAspectType(key)
      const frameSize = getFrameSize(aspectType)
      const isCropped = aspectType === 'wide' || aspectType === 'tall'

      return (
        <Box
          key={key}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#f7f7f7',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            '&:hover img, &:focus-within img': {
              transform: 'scale(1.03)'
            },
            '&:hover .hoverOverlay, &:focus-within .hoverOverlay': {
              opacity: 1
            },
            '&:hover .hoverTitle, &:focus-within .hoverTitle': {
              transform: 'translateY(0px)',
              opacity: 1
            }
          }}
        >
          <Box
            component={to ? RouterLink : 'div'}
            to={to || undefined}
            sx={{
              display: 'block',
              position: 'relative',
              color: 'inherit',
              textDecoration: 'none',
              outline: 'none',
              '&:focus-visible': {
                outline: '2px solid rgba(255,255,255,0.9)',
                outlineOffset: '-2px'
              }
            }}
          >
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                bgcolor: '#f7f7f7',
                ...frameSize
              }}
            >
              <Box
                component="img"
                src={url}
                alt={title || 'image'}
                loading="lazy"
                decoding="async"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget
                  console.log(
      'GALLERY IMAGE:',
      url,
      naturalWidth,
      naturalHeight
    )
                  setImageMeta((prev) => {
                    const existing = prev[key]
                    if (
                      existing?.width === naturalWidth &&
                      existing?.height === naturalHeight
                    ) {
                      return prev
                    }

                    return {
                      ...prev,
                      [key]: { width: naturalWidth, height: naturalHeight }
                    }
                  })
                }}
                onError={(e) => {
                  const img = e.currentTarget

                  if (originalUrl && img.dataset.fallback !== 'true') {
                    img.dataset.fallback = 'true'
                    img.src = originalUrl
                    return
                  }

                  img.style.display = 'none'
                }}
                sx={{
                  display: 'block',
                  transition: 'transform 180ms ease',
                  ...(isCropped
                    ? {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center center'
                      }
                    : {
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain'
                      })
                }}
              />
            </Box>

            {title && showTitleBelow ? (
              <Box
                sx={{
                  px: 0.75,
                  py: 0.75,
                  bgcolor: 'rgba(0, 0, 0, 0.61)',  
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: '-webkit-box',
                    color: '#fff',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    lineHeight: 1.25,
                    overflow: 'hidden',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {title}
                </Typography>
              </Box>
            ) : null}

            {title && !showTitleBelow ? (
              <Box
                className="hoverOverlay"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0,0,0,0.42)',
                  opacity: 0,
                  transition: 'opacity 180ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  px: 1.5,
                  pointerEvents: 'none'
                }}
              >
                <Typography
                  className="hoverTitle"
                  variant="subtitle1"
                  sx={{
                    color: '#fff !important',
                    WebkitTextFillColor: '#fff',
                    textDecoration: 'none',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    textShadow: '0 2px 8px rgba(0,0,0,0.65)',
                    transform: 'translateY(8px)',
                    opacity: 0,
                    transition: 'transform 180ms ease, opacity 180ms ease',
                    pointerEvents: 'none',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    maxWidth: 260
                  }}
                >
                  {title}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>
      )
    })}
  </Masonry>
</Box>
    </Box>
  )
}


ImageGridResults.propTypes = {
  perspectiveState: PropTypes.object,
  fetchResults: PropTypes.func.isRequired,
  perspectiveID: PropTypes.string.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired
}

export default ImageGridResults