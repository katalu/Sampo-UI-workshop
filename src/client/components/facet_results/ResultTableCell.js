// ResultTableCell.js

import React from 'react'
import PropTypes from 'prop-types'
import TableCell from '@mui/material/TableCell'
import ObjectListCollapsible from './ObjectListCollapsible'
import StringList from './StringList'
import SimpleReactLightbox from 'simple-react-lightbox'
import ImageGallerySRL from '../main_layout/ImageGallerySRL'
import intl from 'react-intl-universal'

const ResultTableCell = props => {
  const {
    data,
    thumbnailData,
    tableData,
    valueType,
    makeLink,
    externalLink,
    sortValues,
    sortBy,
    sortByConvertDataTypeTo,
    numberedList,
    minWidth,
    height,
    container,
    columnId,
    expanded,
    linkAsButton,
    collapsedMaxWords,
    showSource,
    sourceExternalLink,
    renderAsHTML,
    HTMLParserTask,
    referencedTerm,
    previewImageHeight,
    onExpandClick,
    showExtraCollapseButton,
    rowId,
    shortenLabel = false,
    mainInlineList,
    instanceInlineList,
    inlineSeparator,
    mainTableSimpleList,
    simpleList,
    previewImageWidth,
    isTableThumbnail,
    instancePageImage
  } = props

  let cellContent = null

  const cellStyle = {
    paddingTop: 4,
    paddingBottom: 4,
    ...(height && { height }),
    ...(minWidth && { minWidth })
  }

  const isObjectLike = Array.isArray(data) || (data && typeof data === 'object')

  const normalizeItems = input => {
    if (!input) return []
    return Array.isArray(input) ? [...input] : [input]
  }

  const normalizeObject = item => (Array.isArray(item) ? Object.fromEntries(item) : item)

  const getObjectLabel = obj => obj?.prefLabel || obj?.label || obj?.id || ''
  const getObjectUrl = obj => obj?.dataProviderUrl || obj?.id || ''

  const getSortedItems = input => {
    const items = normalizeItems(input)

    if (!sortValues) return items

    return items.sort((a, b) => {
      const objA = normalizeObject(a)
      const objB = normalizeObject(b)

      const valA = getObjectLabel(objA)
      const valB = getObjectLabel(objB)

      return String(valA).localeCompare(String(valB), undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    })
  }

  const renderLabelWithLang = label => {
    const text = typeof label === 'string' ? label : ''
    const match = text.match(/^(.*?)\s*\[([^\]]+)\]$/)

    if (!match) return label

    return (
      <>
        {match[1].trim()}{' '}
        <span style={{ color: '#666', fontSize: '0.85em' }}>({match[2].trim()})</span>
      </>
    )
  }

  switch (valueType) {
    case 'object': {
      if (
        (columnId === 'titleOtherLang' || columnId === 'tag' || columnId === 'otherName') &&
        isObjectLike
      ) {
        const items = normalizeItems(data)

        cellContent = (
          <div style={{ lineHeight: 1.6 }}>
            {items.map((item, idx) => {
              const text = item?.prefLabel || ''
              const match = text.match(/^(.*?)\s*\[([^\]]+)\]$/)

              if (match) {
                const label = match[1].trim()
                const lang = match[2].trim()

                return (
                  <div key={idx}>
                    {label}{' '}
                    <span style={{ color: '#666', fontSize: '0.85em' }}>({lang})</span>
                  </div>
                )
              }

              return <div key={idx}>{text}</div>
            })}
          </div>
        )
        break
      }

      if (mainTableSimpleList && isObjectLike) {
        const items = getSortedItems(data)

        cellContent = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.6 }}>
            {items.map((item, i) => {
              const obj = normalizeObject(item)
              const label = getObjectLabel(obj)
              const url = getObjectUrl(obj)
              const shouldLink = makeLink !== false && url
              const renderedLabel = renderLabelWithLang(label)

              return shouldLink ? (
                <a
                  key={i}
                  className={props.linkStyle === 'primary' ? undefined : 'inlineLink'}
                  href={url}
                  target={externalLink ? '_blank' : undefined}
                  rel={externalLink ? 'noopener noreferrer' : undefined}
                  onClick={e => e.stopPropagation()}
                  style={{ display: 'block' }}
                >
                  {renderedLabel}
                </a>
              ) : (
                <div
                  key={i}
                  style={{
                    display: 'block',
                    borderBottom: '1px solid rgba(0,0,0,0.10)',
                    paddingBottom: 2
                  }}
                >
                  {renderedLabel}
                </div>
              )
            })}
          </div>
        )
        break
      }

      if ((mainInlineList || instanceInlineList) && isObjectLike) {
        const items = getSortedItems(data)
        const separator = inlineSeparator || ' · '

        cellContent = (
          <span style={{ display: 'inline', lineHeight: 2 }}>
            {items.map((item, i) => {
              const obj = normalizeObject(item)
              const label = getObjectLabel(obj)
              const url = getObjectUrl(obj)
              const shouldLink = makeLink !== false && url
              const renderedLabel = renderLabelWithLang(label)
              const isLast = i === items.length - 1

              return (
                <React.Fragment key={i}>
                  {shouldLink ? (
                    <a
                      className='inlineLink'
                      href={url}
                      target={externalLink ? '_blank' : undefined}
                      rel={externalLink ? 'noopener noreferrer' : undefined}
                      onClick={e => e.stopPropagation()}
                    >
                      {renderedLabel}
                    </a>
                  ) : (
                    <span>{renderedLabel}</span>
                  )}
                  {!isLast ? <span>{separator}</span> : null}
                </React.Fragment>
              )
            })}
          </span>
        )
        break
      }

      if (simpleList && isObjectLike) {
        const items = getSortedItems(data)

        cellContent = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            {items.map((item, i) => {
              const obj = normalizeObject(item)
              const label = getObjectLabel(obj)
              const url = getObjectUrl(obj)
              const shouldLink = makeLink !== false && url
              const renderedLabel = renderLabelWithLang(label)

              return (
                <React.Fragment key={i}>
                  {shouldLink ? (
                    <a
                      className='inlineLink'
                      href={url}
                      target={externalLink ? '_blank' : undefined}
                      rel={externalLink ? 'noopener noreferrer' : undefined}
                      onClick={e => e.stopPropagation()}
                      style={{ display: 'inline-block' }}
                    >
                      {renderedLabel}
                    </a>
                  ) : (
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        padding: '2px 4px',
                        borderRadius: 3
                      }}
                    >
                      {renderedLabel}
                    </span>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )

        break
      }

      if (columnId === 'description' && typeof data === 'object') {
        const fullText = typeof data === 'string' ? data : data?.prefLabel || ''
        const threshold = collapsedMaxWords || 40
        const words = fullText.trim().split(/\s+/)
        const isLong = words.length > threshold
        const preview = words.slice(0, threshold).join(' ') + '…'

        const toggle = (
          <span
            onClick={e => {
              e.stopPropagation()
              onExpandClick(rowId)
            }}
            style={{
              color: '#1976d2',
              cursor: 'pointer',
              fontSize: '0.85em'
            }}
          >
            {expanded
              ? intl.get('general.showLess', 'Show less')
              : intl.get('general.showMore', 'Show more')}
          </span>
        )

        cellContent = (
          <span>
            {expanded || !isLong ? fullText : preview}
            {isLong && (
              <div style={{ marginTop: 4 }}>
                {toggle}
              </div>
            )}
          </span>
        )

        break
      }

      cellContent = (
        <ObjectListCollapsible
          data={data}
          tableData={tableData}
          makeLink={makeLink}
          externalLink={externalLink}
          sortValues={sortValues}
          sortBy={sortBy}
          sortByConvertDataTypeTo={sortByConvertDataTypeTo}
          numberedList={numberedList}
          rowId={rowId}
          columnId={columnId}
          expanded={expanded}
          onExpandClick={onExpandClick}
          collapsedMaxWords={collapsedMaxWords}
          shortenLabel={shortenLabel}
          linkAsButton={linkAsButton}
          showSource={showSource}
          sourceExternalLink={sourceExternalLink}
        />
      )
      break
    }

    case 'string':
      cellContent = (
        <StringList
          data={data}
          tableData={tableData}
          expanded={expanded}
          onExpandClick={onExpandClick}
          rowId={rowId}
          collapsedMaxWords={collapsedMaxWords}
          showExtraCollapseButton={showExtraCollapseButton}
          shortenLabel={shortenLabel}
          renderAsHTML={renderAsHTML}
          HTMLParserTask={HTMLParserTask}
          referencedTerm={referencedTerm}
          numberedList={numberedList}
        />
      )
      break

    case 'image':
  cellContent =
    data && data !== '-' ? (
      <SimpleReactLightbox>
        <ImageGallerySRL
          data={data}
          thumbnailData={thumbnailData}
          previewImageHeight={previewImageHeight}
          previewImageWidth={previewImageWidth}
          isTableThumbnail={isTableThumbnail}
          instancePageImage={instancePageImage}
        />
      </SimpleReactLightbox>
    ) : (
      ''
    )
  break

    default:
      cellContent = null
  }

  if (container === 'div') {
    return <div>{cellContent}</div>
  }

  return (
    <TableCell
      style={cellStyle}
      data-col={columnId}
      data-linkstyle={props.linkStyle || undefined}
    >
      {cellContent}
    </TableCell>
  )
}

ResultTableCell.propTypes = {
  columnId: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  valueType: PropTypes.string.isRequired,
  makeLink: PropTypes.bool.isRequired,
  externalLink: PropTypes.bool.isRequired,
  sortValues: PropTypes.bool.isRequired,
  sortBy: PropTypes.string,
  numberedList: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  collapsedMaxWords: PropTypes.number,
  minWidth: PropTypes.number,
  previewImageHeight: PropTypes.number,
  showSource: PropTypes.bool,
  sourceExternalLink: PropTypes.bool,
  mainInlineList: PropTypes.bool,
  instanceInlineList: PropTypes.bool,
  inlineSeparator: PropTypes.string,
  simpleList: PropTypes.bool,
  mainTableSimpleList: PropTypes.bool,
  previewImageWidth: PropTypes.number,
  isTableThumbnail: PropTypes.bool,
  instancePageImage: PropTypes.bool,
  thumbnailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ]),
}

export default ResultTableCell