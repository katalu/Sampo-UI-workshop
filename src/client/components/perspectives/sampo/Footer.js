import React from 'react'
import Paper from '@mui/material/Paper'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'

import deptLogo from '../../../img/logos/logo1.png'
import fareLogo from '../../../img/logos/logo2.jpg'
import murLogo from '../../../img/logos/logo3.png'
import ercLogo from '../../../img/logos/logo4.jpg'
import writeLogo from '../../../img/logos/logo5.jpg'

/**
 * A component for creating a footer. The logos are imported inside this component.
 */
const Footer = props => {
  const logos = [
  {
    src: deptLogo,
    alt: 'Department of Interpreting and Translation logo',
    href: 'https://dit.unibo.it/it',
    wide: false
  },
  {
    src: fareLogo,
    alt: 'FARE logo',
    href: 'https://fare.mur.gov.it/app.php/en/',
    wide: false
  },
  {
    src: murLogo,
    alt: 'MUR logo',
    href: 'https://www.mur.gov.it/it',
    wide: false
  },
  {
    src: ercLogo,
    alt: 'ERC logo',
    href: 'https://erc.europa.eu/homepage',
    wide: false
  },
  {
    src: writeLogo,
    alt: 'WRITE Project logo',
    href: 'https://writecalligraphyproject.eu/',
    wide: true
  }
]

  return (
    <Paper
      component='footer'
      elevation={0}
      sx={{
        borderRadius: 0,
        backgroundColor: '#5b2424',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        px: { xs: 3, sm: 4, md: 8 },
        py: { xs: 3, md: 4 },
        boxShadow: '0 -18px 32px rgba(0,0,0,0.16)',
        minHeight: {
          xs: props.layoutConfig.footer.reducedHeight,
          hundredPercentHeight: props.layoutConfig.footer.reducedHeight,
          reducedHeight: props.layoutConfig.footer.defaultHeight
        },

        '& .MuiTypography-root': {
          fontFamily: 'Inter, sans-serif',
          color: '#fff'
        },

        '& .MuiLink-root': {
          fontFamily: 'Inter, sans-serif',
          color: '#fff'
        }
      }}
    >
      <Box
        sx={{
          maxWidth: 1400,
          mx: 'auto'
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1.35fr 0.85fr 1fr'
            },
            gap: { xs: 3, md: 4 },
            alignItems: 'start'
          }}
        >
          <Box>
            <Typography
              component='h2'
              sx={{
                fontSize: { xs: '1.15rem', md: '1.25rem' },
                fontWeight: 600,
                letterSpacing: '-0.015em',
                lineHeight: 1.2,
                m: 0,
                mb: 1.5
              }}
            >
              WenDAng – WRITE Digital Archive
            </Typography>

            <Typography
              sx={{
                maxWidth: 560,
                fontSize: '0.96rem',
                lineHeight: 1.65,
                mb: 1.5
              }}
            >
              This project is funded through Bando Fare{' '}
              <Box component='span' sx={{ whiteSpace: 'nowrap' }}>
                CINECA code: R20K7ZB983
              </Box>
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: 'left',
              justifySelf: { xs: 'start', md: 'start' }
            }}
          >
            <Typography
              component='h2'
              sx={{
                fontSize: { xs: '1.15rem', md: '1.25rem' },
                fontWeight: 600,
                letterSpacing: '-0.015em',
                lineHeight: 1.2,
                m: 0,
                mb: 1
              }}
            >
              Part of
            </Typography>

            <Link
              href='https://writecalligraphyproject.eu/'
              target='_blank'
              rel='noopener noreferrer'
              underline='hover'
            >
              WRITE Project (GA n. 949645)
            </Link>

            <Typography
              component='h2'
              sx={{
                fontSize: { xs: '1.15rem', md: '1.25rem' },
                fontWeight: 600,
                letterSpacing: '-0.015em',
                lineHeight: 1.2,
                m: 0,
                mt: 2.5,
                mb: 1
              }}
            >
              In collaboration with
            </Typography>

            <Link
              href='https://centri.unibo.it/dharc/en'
              target='_blank'
              rel='noopener noreferrer'
              underline='hover'
            >
              /DH.arc Research Center
            </Link>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 112px)',
                md: 'repeat(2, 130px)'
              },
              gap: { xs: 1.5, md: 1.75 },
              alignItems: 'center',
              justifyContent: { xs: 'start', md: 'end' },
              justifySelf: { xs: 'start', md: 'end' }
            }}
          >
            {logos.map(logo => (
              <Box
                key={logo.alt}
                component='a'
                href={logo.href}
                target='_blank'
                rel='noopener noreferrer'
                sx={{
                  gridColumn: logo.wide ? '1 / -1' : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: logo.wide
                    ? { xs: 236, md: 274 }
                    : { xs: 112, md: 130 },
                  height: logo.wide
                    ? { xs: 52, md: 60 }
                    : { xs: 48, md: 54 },
                  p: 0.75,
                  boxSizing: 'border-box',
                  backgroundColor: '#fff'
                }}
              >
                <Box
                  component='img'
                  src={logo.src}
                  alt={logo.alt}
                  sx={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <Divider
          sx={{
            my: { xs: 2.5, md: 3 },
            borderColor: 'rgba(255,255,255,0.25)'
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'flex-start', md: 'center' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 1, md: 1.5 },
            fontSize: '0.875rem'
          }}
        >
          <Link
            href='https://wendang-project.github.io/documentation/'
            target='_blank'
            rel='noopener noreferrer'
            underline='hover'
            sx={{
              fontSize: '0.875rem'
            }}
          >
            Documentation
          </Link>

          <Typography
            component='span'
            sx={{
              display: { xs: 'none', md: 'inline' },
              fontSize: '0.875rem'
            }}
          >
            |
          </Typography>

          <Typography
            component='span'
            sx={{
              fontSize: '0.875rem'
            }}
          >
            Project development and realisation: Katarina Lučić
          </Typography>

          <Typography
            component='span'
            sx={{
              display: { xs: 'none', md: 'inline' },
              fontSize: '0.875rem'
            }}
          >
            |
          </Typography>

          <Typography
            component='span'
            sx={{
              fontSize: '0.875rem'
            }}
          >
            © WenDAng 2026
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

Footer.propTypes = {
  layoutConfig: PropTypes.object.isRequired
}

export default Footer