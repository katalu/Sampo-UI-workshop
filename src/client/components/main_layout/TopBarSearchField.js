import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import history from '../../History'

/**
 * A search field that can be embedded into the TopBar.
 */
class TopBarSearchField extends React.Component {
  state = {
    value: ''
  };
  inputRef = React.createRef();

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  };

  handleMouseDown = (event) => {
    event.preventDefault()
  };

  handleOnKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.runSearch();
    }
  };

  handleClick = () => {
    this.runSearch();
  };

  runSearch = () => {
    const query = this.inputRef.current
      ? this.inputRef.current.value.trim()
      : this.state.value.trim();

    if (query.length > 2) {
      this.props.clearResults({ resultClass: 'fullTextSearch' });

      this.props.fetchFullTextResults({
        resultClass: 'fullTextSearch',
        query
      });

      history.push({ pathname: `${this.props.rootUrl}/full-text-search/table` });
    }
  };

  hasValidQuery = () => {
    return this.state.value.length > 2
  }

  componentDidUpdate (prevProps) {
    if (prevProps.locationPathname !== this.props.locationPathname) {
      this.setState({ value: '' })
    }
  }

  render () {
    const { screenSize, useShortPlaceholder } = this.props
    const placeholder = useShortPlaceholder || screenSize === 'xs'
      ? intl.get('topBar.searchBarPlaceHolderShort')
      : intl.get('topBar.searchBarPlaceHolder')
    return (
      <Box
        sx={theme => ({
          position: 'relative',
          borderRadius: theme.shape.borderRadius,
          backgroundColor: alpha(theme.palette.common.white, 0.15),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25)
          },
          marginRight: theme.spacing(2),
          marginLeft: 0,
          width: '100%',
          [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
          }
        })}
      >
        <Box
          sx={theme => ({
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          <SearchIcon />
        </Box>
        <InputBase
          inputRef={this.inputRef}
          value={this.state.value}
          placeholder={placeholder}
          inputProps={{ 'aria-label': 'search' }}
          onChange={this.handleChange}
          onKeyDown={this.handleOnKeyDown}
          sx={theme => ({
            color: 'inherit',
            '& .MuiInputBase-input': {
              padding: theme.spacing(1, 1, 1, 0),
              // vertical padding + font size from searchIcon
              paddingLeft: `calc(1em + ${theme.spacing(4)})`,
              transition: theme.transitions.create('width'),
              width: '100%',
              [theme.breakpoints.up('md')]: {
                width: '20ch'
              }
            }
          })}
        />
      </Box>
    )
  }
}

TopBarSearchField.propTypes = {
  fetchFullTextResults: PropTypes.func,
  clearResults: PropTypes.func,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired,
  useShortPlaceholder: PropTypes.bool,
  clearResults: PropTypes.func,
  locationPathname: PropTypes.string
}

export const TopBarSearchFieldComponent = TopBarSearchField

export default TopBarSearchField
