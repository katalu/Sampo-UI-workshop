import React, { useMemo, useState, useCallback } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Button from '@mui/material/Button'

import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

const useStyles = makeStyles({
  previewButton: {
    minWidth: 0,
    padding: 0,
    lineHeight: 0
  },
  previewImage: {
    border: '1px solid lightgray',
    display: 'block'
  }
})

const getImageOrder = item => {
  const url = item?.url || item?.id || ''
  const filename = decodeURIComponent(url.split('/').pop() || '')

  // Matches:
  // 1271_1.jpg
  // 1271_1_HR.jpg
  // 1271_2.jpg
  // 1271_2_HR.jpg
  const match = filename.match(/_(\d+)(?:_[^.]*)?\.(jpg|jpeg|png|webp|tif|tiff)$/i)

  if (match) {
    return Number(match[1])
  }

  // If no _1, _2 etc., treat it as the first/main image
  return 0
}

const getUrl = value => {
  if (!value) return null

  const first = Array.isArray(value) ? value[0] : value

  if (typeof first === 'string') return first

  return first?.url || first?.id || null
}

const ImageGalleryYARL = props => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [imageMeta, setImageMeta] = useState({})

  let {
    data,
    thumbnailData,
    previewImageHeight,
    previewImageWidth,
    isTableThumbnail,
    instancePageImage
  } = props

  const orderedData = useMemo(() => {
    const items = Array.isArray(data) ? data : [data]

    const uniqueItems = Array.from(
      new Map(
        items
          .filter(item => item?.url)
          .map(item => [item.url, item])
      ).values()
    )

    return uniqueItems.sort((a, b) => {
      const orderA = getImageOrder(a)
      const orderB = getImageOrder(b)

      if (orderA !== orderB) {
        return orderA - orderB
      }

      return (a?.url || '').localeCompare(b?.url || '')
    })
  }, [data])

  const isSingleImage = orderedData.length <= 1

  const handleImageLoad = useCallback((src, e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget

    setImageMeta(prev => {
      const existing = prev[src]
      if (
        existing &&
        existing.width === naturalWidth &&
        existing.height === naturalHeight
      ) {
        return prev
      }

      return {
        ...prev,
        [src]: {
          width: naturalWidth,
          height: naturalHeight
        }
      }
    })
  }, [])

  const slides = useMemo(() => {
    return orderedData.map(item => {
      const meta = imageMeta[item.url]

      return {
        src: item.url,
        alt: item.description || 'preview image',
        description: item.description || '',
        width: meta?.width || 1600,
        height: meta?.height || 900
      }
    })
  }, [orderedData, imageMeta])

  const thumbnailSrc = getUrl(thumbnailData)
  const originalSrc = slides[0]?.src
  const tablePreviewSrc = thumbnailSrc || originalSrc

  const firstSrc = originalSrc
  const instancePreviewSrc = thumbnailSrc || originalSrc
  const meta = imageMeta[firstSrc]
  const ratio = meta ? meta.width / meta.height : 1
  const shouldCropWide = instancePageImage && ratio > 4
  const shouldCropTall = instancePageImage && ratio < 0.65
  const shouldCropInstanceImage = shouldCropWide || shouldCropTall

  const plugins = [Zoom, Fullscreen]
  if (!isSingleImage) {
    plugins.push(Thumbnails)
  }
  return (
    <>
      <Button
        aria-label='open larger image'
        onClick={() => setOpen(true)}
        className={classes.previewButton}
        style={{
          width: instancePageImage ? '100%' : undefined,
          display: instancePageImage ? 'block' : undefined
        }}
      >
        {isTableThumbnail ? (
          <div
            style={{
              width: previewImageWidth || 96,
              height: previewImageWidth || 96,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#f7f7f7',
              border: '1px solid lightgray',
              boxSizing: 'border-box'
            }}
          >
            <img
              src={tablePreviewSrc}
              alt='preview image'
              onLoad={e => handleImageLoad(slides[0].src, e)}
              onContextMenu={e => e.preventDefault()}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
              }}
            />
          </div>
        ) : instancePageImage ? (
          shouldCropWide ? (
            <div
              style={{
                width: '100%',
                height: 'clamp(120px, 16vw, 220px)',
                overflow: 'hidden'
              }}
            >
              <img
                src={instancePreviewSrc}
                alt='preview image'
                loading='lazy'
                decoding='async'
                onLoad={e => handleImageLoad(instancePreviewSrc, e)}
                onContextMenu={e => e.preventDefault()}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '27% 57%',
                  display: 'block'
                }}
              />
            </div>
          ) : shouldCropTall ? (
            <div
              style={{
                width: '100%',
                height: 'clamp(280px, 62vh, 480px)',
                overflow: 'hidden',
                border: '1px solid lightgray',
                boxSizing: 'border-box'
              }}
            >
              <img
                src={instancePreviewSrc}
                alt='preview image'
                loading='lazy'
                decoding='async'
                onLoad={e => handleImageLoad(instancePreviewSrc, e)}
                onContextMenu={e => e.preventDefault()}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block'
                }}
              />
            </div>
          ) : (
            <img
              className={classes.previewImage}
              src={instancePreviewSrc}
              alt='preview image'
              loading='lazy'
              decoding='async'
              onLoad={e => handleImageLoad(instancePreviewSrc, e)}
              onContextMenu={e => e.preventDefault()}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          )
        ) : (
          <img
            className={classes.previewImage}
            height={previewImageHeight}
            src={slides[0].src}
            alt='preview image'
            onLoad={e => handleImageLoad(slides[0].src, e)}
            onContextMenu={e => e.preventDefault()}
          />
        )}
      </Button>

      <div onContextMenu={e => e.preventDefault()}>
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          plugins={plugins}
          carousel={{
            finite: true
          }}
          render={{
            buttonPrev: isSingleImage ? () => null : undefined,
            buttonNext: isSingleImage ? () => null : undefined
          }}
          thumbnails={
            isSingleImage
              ? undefined
              : {
                  position: 'bottom',
                  width: 80,
                  height: 60,
                  border: 0,
                  borderRadius: 0,
                  padding: 4,
                  gap: 8
                }
          }
          zoom={{
            maxZoomPixelRatio: 4,
            zoomInMultiplier: 2,
            scrollToZoom: true,
            wheelZoomDistanceFactor: 80
          }}
        />
      </div>
    </>
  )
}

export default ImageGalleryYARL