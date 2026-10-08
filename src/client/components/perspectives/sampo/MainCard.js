import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import intl from 'react-intl-universal'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import makeStyles from '@mui/styles/makeStyles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { has } from 'lodash'
import defaultImage from '../../../img/main_page/thumb.png'

const useStyles = makeStyles(theme => ({
  gridItem: props => {
    const isPrimary = props.variant === 'primary'
    const isEditorial = props.variant === 'editorial'

    return {
      textDecoration: 'none',
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center'
      },
      height: isEditorial ? 'clamp(440px, 56vh, 640px)' : isPrimary ? 300 : 210,
      [theme.breakpoints.down('lg')]: {
        height: isEditorial ? 460 : isPrimary ? 240 : 180
      },
      [theme.breakpoints.down('md')]: {
  height: isEditorial ? 320 : isPrimary ? 240 : 180,
  maxWidth: 'none'
},
[theme.breakpoints.down('sm')]: {
  height: isEditorial ? 260 : isPrimary ? 220 : 180
},
      ...(has(props.perspective, 'frontPageElement') &&
        props.perspective.frontPageElement === 'card' && {
          height: 'inherit',
          maxWidth: 'none',
          minWidth: 0
        })
    }
  },

  perspectiveCardPaper: props => {
    const isPrimary = props.variant === 'primary'
    const isEditorial = props.variant === 'editorial'

    return {
      padding: theme.spacing(isEditorial ? 3 : isPrimary ? 2.25 : 1.5),
      boxSizing: 'border-box',
      color: '#fff',
      background: `
        linear-gradient(
          to top,
          rgba(0,0,0,0.65) 0%,
          rgba(0,0,0,0.7) 18%,
          rgba(0,0,0,0.4) 30%,
          rgba(0,0,0,0.1) 45%,
          rgba(0,0,0,0.0) 60%
        ),
        url(${props.perspective.frontPageImage})
      `,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: props.perspective.frontPageImagePosition || 'center',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
     '&:hover': {
        background: `
          linear-gradient(
            to top,
            rgba(0,0,0,0.65) 0%,
            rgba(0,0,0,0.7) 18%,
            rgba(0,0,0,0.4) 30%,
            rgba(0,0,0,0.1) 45%,
            rgba(0,0,0,0.0) 60%
          ),
          url(${props.perspective.frontPageImage})
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: props.perspective.frontPageImagePosition || 'center',
        transform: 'translateY(-6px) scale(1.01)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.25)'
      },
      borderRadius: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'flex-end'
    }
  },

  editorialContent: {
    width: '100%',
    maxWidth: 360
  },

  cardMedia: props => ({
    height: props.variant === 'primary' ? 150 : 120
  }),

  cardContent: props => ({
    height: 'auto'
  }),

  card: {
    width: '100%',
    height: '100%'
  }
}))

/**
 * A component for generating a Material-UI Card for a perspective on the portal's landing page.
 */
const MainCard = props => {
  const classes = useStyles(props)
  const { perspective, cardHeadingVariant, variant } = props
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const externalPerspective = has(perspective, 'externalUrl')
  const card = has(perspective, 'frontPageElement') && perspective.frontPageElement === 'card'
  const searchMode = has(perspective, 'searchMode') ? perspective.searchMode : 'faceted-search'

  let gridSizeProps = { xs: 12, sm: 12, md: 6, lg: 3 }

  if (variant === 'primary') {
    gridSizeProps = { xs: 12, sm: 6 }
  }

  if (variant === 'editorial') {
    gridSizeProps = { xs: 12, sm: 12, md: 6, lg: 3 }
  }

  return (
    <Grid
      className={classes.gridItem}
      key={perspective.id}
      item
      {...gridSizeProps}
      component='a'
      href={
        externalPerspective
          ? perspective.externalUrl
          : `${props.rootUrl}/${perspective.id}/${searchMode}`
      }
      container={xsScreen}
      target={externalPerspective ? '_blank' : undefined}
      rel={externalPerspective ? 'noopener noreferrer' : undefined}
    >
      {!card && (
        <Paper className={classes.perspectiveCardPaper}>
          <div className={variant === 'editorial' ? classes.editorialContent : undefined}>
            <Typography
              gutterBottom
              variant={cardHeadingVariant}
              component='h2'
              sx={{
                color: '#fff',
                fontWeight: variant === 'editorial' || variant === 'primary' ? 500 : 400,
                fontSize: variant === 'editorial'  ? 'clamp(1.4rem, 1.8vw, 1.8rem)' : '1.2rem',
                lineHeight: 1.05,
                textShadow: '0 2px 8px rgba(0,0,0,0.22)',
                mb: variant === 'editorial' ? 0.75 : undefined
              }}
            >
              {intl.get(`perspectives.${perspective.id}.label`)}
            </Typography>

            <Typography
              component='p'
              sx={{
                color: 'rgba(255,255,255,0.94)',
                fontSize: variant === 'editorial' ? '1.02rem' : variant === 'primary' ? '1rem' : '0.95rem',
                lineHeight: 1.45,
                textShadow: '0 2px 8px rgba(0,0,0,0.18)'
              }}
            >
              {intl.get(`perspectives.${perspective.id}.shortDescription`)}
            </Typography>
          </div>
        </Paper>
      )}

      {card && (
        <Card className={classes.card} sx={{ borderRadius: 0, height: '100%'}}
        >
          <CardActionArea sx={{ height: '100%' }}>
            <CardMedia
              className={classes.cardMedia}
              image={
                has(perspective, 'frontPageImage')
                  ? perspective.frontPageImage
                  : defaultImage
              }
              title={intl.get(`perspectives.${perspective.id}.label`)}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant='h5' component='h2'>
                {intl.get(`perspectives.${perspective.id}.label`)}
              </Typography>
              <Typography component='p'>
                {intl.get(`perspectives.${perspective.id}.shortDescription`)}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </Grid>
  )
}

MainCard.propTypes = {
  perspective: PropTypes.object.isRequired,
  cardHeadingVariant: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'editorial'])
}

MainCard.defaultProps = {
  variant: 'secondary'
}

export default MainCard