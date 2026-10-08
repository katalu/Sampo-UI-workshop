import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import Tooltip from '@mui/material/Tooltip'
import { Link as RouterLink, useLocation, useHistory } from 'react-router-dom'
import intl from 'react-intl-universal'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Divider from '@mui/material/Divider'

const InfoHeader = props => {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()
  const history = useHistory()

  const pathParts = (location?.pathname || '').split('/').filter(Boolean)
  const locale = pathParts[0] || 'en'

  const label =
    props.pageType === 'facetResults'
      ? intl.get(`perspectives.${props.resultClass}.label`)
      : intl.get(`perspectives.${props.resultClass}.instancePage.label`)

  const descriptionKey =
    props.pageType === 'facetResults'
      ? `perspectives.${props.resultClass}.sectionDescription`
      : `perspectives.${props.resultClass}.instancePage.sectionDescription`

  const sectionDescription = intl.get(descriptionKey)

  const hasSectionDescription =
    sectionDescription && sectionDescription !== descriptionKey

  const tableLink = `/${locale}/${props.resultClass}/faceted-search/table?page=0`

  const nonClickableLabelClasses = new Set([
    'artisticCollective',
    'literaryWork',
    'organisation',
    'traditionalArtwork'
  ])

  const isLabelClickable = !nonClickableLabelClasses.has(props.resultClass)

  const handleAccordionChange = () => {
    if (hasSectionDescription) {
      setExpanded(previousExpanded => !previousExpanded)
    }
  }

  const handleBack = event => {
    event.stopPropagation()

    if (history.length > 1) {
      history.goBack()
    } else {
      history.push(tableLink)
    }
  }

  return (
    <Box
      sx={theme => ({
        marginTop: 0,
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.10)'
      })}
    >
      <Accordion
        expanded={expanded}
        onChange={handleAccordionChange}
        disableGutters
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          '&:before': {
            display: 'none'
          }
        }}
      >
        <AccordionSummary
          expandIcon={hasSectionDescription ? <ExpandMoreIcon /> : null}
          aria-controls='infoheader-content'
          id='infoheader-header'
          sx={theme => ({
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1.5),
            minHeight: 36,
            backgroundColor: '#fff',
            borderBottom: expanded
              ? '1px solid rgba(0,0,0,0.08)'
              : 'none',

            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              margin: 0
            },

            '& .MuiAccordionSummary-expandIconWrapper': {
              color: 'rgba(0,0,0,0.55)'
            }
          })}
        >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          minWidth: 0,
          gap: 1.25
        }}
      >
        <IconButton
          aria-label={intl.get('common.back') || 'Back'}
          onClick={handleBack}
          onFocus={event => {
            event.stopPropagation()
          }}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            width: 28,
            height: 28,
            flexShrink: 0,
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

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            minWidth: 0,
            flex: 1
          }}
        >
          {isLabelClickable ? (
        <RouterLink
          to={tableLink}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            minWidth: 0,
            display: 'block'
          }}
          onClick={event => {
            event.stopPropagation()
          }}
        >
          <Typography
            component='h1'
            variant='subtitle1'
            noWrap
            sx={{
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'rgba(0,0,0,0.88)',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(0,0,0,0.22)',
              textUnderlineOffset: '3px',
              textDecorationThickness: '1px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              '&:hover': {
                textDecorationColor: 'rgba(0,0,0,0.45)',
                color: 'rgba(0,0,0,1)'
              }
            }}
          >
            {label}
          </Typography>
        </RouterLink>
      ) : (
        <Typography
          component='h1'
          variant='subtitle1'
          noWrap
          sx={{
            fontWeight: 500,
            lineHeight: 1.2,
            color: 'rgba(0,0,0,0.88)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </Typography>
      )}

    {hasSectionDescription && (
      <Tooltip title={intl.get('infoHeader.toggleInstructions')}>
        <IconButton
          aria-label='toggle instructions'
          size='small'
          onClick={event => {
            event.stopPropagation()
            handleAccordionChange()
          }}
          sx={{
            width: 32,
            height: 32,
            padding: 0,
            flexShrink: 0,
            color: 'rgba(0,0,0,0.45)',
            '&:hover': {
              color: 'rgba(0,0,0,0.75)',
              backgroundColor: 'rgba(0,0,0,0.04)'
            }
          }}
        >
          <InfoIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    )}
  </Box>
</Box>
        </AccordionSummary>

        {hasSectionDescription && (
          <AccordionDetails
            id='infoheader-content'
            sx={theme => ({
              paddingTop: theme.spacing(1),
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(2),
              paddingBottom: theme.spacing(1.25),
              backgroundColor: 'rgba(0,0,0,0.015)',
              borderTop: '1px solid rgba(0,0,0,0.06)',

              '& p': {
                ...theme.typography.body2,
                marginTop: 0,
                marginBottom: theme.spacing(1),
                color: 'rgba(0,0,0,0.72)',
                lineHeight: 1.45
              },

              '& p:last-child': {
                marginBottom: 0
              }
            })}
          >
            <Typography variant='body2'>
              {sectionDescription}
            </Typography>
          </AccordionDetails>
        )}
      </Accordion>
    </Box>
  )
}

InfoHeader.propTypes = {
  resultClass: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired
}

export default InfoHeader