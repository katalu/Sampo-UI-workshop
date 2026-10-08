// ResultTable.js

import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import withStyles from '@mui/styles/withStyles'
import clsx from 'clsx'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import ResultTableCell from './ResultTableCell'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import querystring from 'querystring'
import ResultTableHead from './ResultTableHead'
import TablePagination from '@mui/material/TablePagination'
import ResultTablePaginationActions from './ResultTablePaginationActions'
import history from '../../History'

const styles = theme => ({
  tableContainer: props => ({
    overflow: 'auto',
    '& td, & th': {
      fontSize: props.layoutConfig.tableFontSize
    },
    // properties for the browse table 
    '& th': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontWeight: 500,
      fontSize: '0.78rem',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      backgroundColor: 'rgba(247, 247, 247, 0.85)',
      paddingTop: 2,
      paddingBottom: 2
      },
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${props.layoutConfig.tabHeight + props.layoutConfig.paginationToolbarHeight + 2}px)`
    },
    backgroundColor: theme.palette.background.paper,
    borderTop: '1px solid rgba(224, 224, 224, 1);'
  }),
  progressContainer: {
    width: '100%',
    height: 'calc(100% - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  expandCell: {
    paddingRight: '0px !important'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

class ResultTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expandedRows: new Set(),
      defaultFacetFetchingRequired: false
    }
  }

  componentDidMount = () => {
    let page
    let constraints = []

    if (this.props.location && this.props.location.search === '') {
      page = this.props.data.page === -1 ? 0 : this.props.data.page
    } else {
      const qs = this.props.location.search.replace('?', '')
      page = parseInt(querystring.parse(qs).page) ? parseInt(querystring.parse(qs).page) : 0
      const parsedConstraints = querystring.parse(qs).constraints
      constraints = parsedConstraints ? JSON.parse(decodeURIComponent(parsedConstraints)) : []
    }

    for (const constraint of constraints) {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: constraint.facetId,
        option: constraint.filterType,
        value: constraint.value
      })
    }

    this.props.updatePage(this.props.resultClass, page)
    history.replace({
      pathname: `${this.props.rootUrl}/${this.props.resultClass}/faceted-search/table`,
      search: `?page=${page}`
    })

    if (this.props.facetUpdateID > 0 || this.props.perspectiveConfig.enableDynamicLanguageChange) {
      this.fetchResults()
    }

    if (constraints.length > 0) {
      this.setState({ defaultFacetFetchingRequired: true })
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.data.page !== this.props.data.page) {
      this.fetchResults()
      history.replace({
        pathname: `${this.props.rootUrl}/${this.props.resultClass}/faceted-search/table`,
        search: `?page=${this.props.data.page}`
      })
    }

    let someFacetIsFetching = false
    if (this.props.facetState) Object.values(this.props.facetState.facets).forEach(facet => { if (facet.isFetching) { someFacetIsFetching = true } })
    if (this.state.defaultFacetFetchingRequired && this.props.facetUpdateID > 0 && !someFacetIsFetching) {
      const defaultFacets = this.props.perspectiveConfig.defaultActiveFacets
      for (const facet of defaultFacets) {
        if (this.props.perspectiveConfig.facets[facet].filterType !== 'textFilter') this.props.fetchFacet({ facetClass: this.props.facetClass, facetID: facet })
      }
      this.setState({ defaultFacetFetchingRequired: false })
    }

    if (this.needNewResults(prevProps)) {
      if (this.props.data.page === 0) {
        this.fetchResults()
      } else {
        this.props.updatePage(this.props.resultClass, 0)
      }
    }

    window.onpopstate = () => {
      const qs = this.props.location.search.replace('?', '')
      const newPage = parseInt(querystring.parse(qs).page)
      if (newPage !== this.props.data.page) {
        this.props.updatePage(this.props.resultClass, newPage)
      }
    }
  }

  fetchResults = () => {
    this.props.fetchPaginatedResults(this.props.resultClass, this.props.facetClass, this.props.data.sortBy)
  }

  needNewResults = prevProps => {
    return (
      prevProps.data.sortBy !== this.props.data.sortBy ||
      prevProps.data.sortDirection !== this.props.data.sortDirection ||
      (!this.state.defaultFacetFetchingRequired && prevProps.facetUpdateID !== this.props.facetUpdateID) ||
      prevProps.data.pagesize !== this.props.data.pagesize
    )
  }

  handlePageChange = (event, page) => {
    if (event != null && !this.props.data.fetching) {
      this.props.updatePage(this.props.resultClass, page)
    }
  }

  handleRowsPerPageChange = event => {
    const rowsPerPage = event.target.value
    if (rowsPerPage !== this.props.data.pagesize) {
      this.props.updateRowsPerPage(this.props.resultClass, rowsPerPage)
    }
  }

  handleSortBy = sortBy => event => {
    if (event != null) {
      this.props.sortResults(this.props.resultClass, sortBy)
    }
  }

  handleExpandRow = rowId => event => this.updateExpanedRows(rowId)

  handleExpandRowFromChildComponent = rowId => this.updateExpanedRows(rowId)

  updateExpanedRows = rowId => {
    const expandedRows = this.state.expandedRows
    if (expandedRows.has(rowId)) {
      expandedRows.delete(rowId)
    } else {
      expandedRows.add(rowId)
    }
    this.setState({ expandedRows })
  }

  rowRenderer = row => {
    const { classes, screenSize, data } = this.props
    const expanded = data.paginatedResultsAlwaysExpandRows
      ? true
      : this.state.expandedRows.has(row.id)

    const firstColumn = data.properties[0]
    const firstColumnData = row[firstColumn.id] == null ? '-' : row[firstColumn.id]
    let hasExpandableContent = false

    if (
      Array.isArray(firstColumnData) &&
      firstColumnData.length > 1 &&
      firstColumn.valueType !== 'image'
    ) {
      hasExpandableContent = true
    } else if (
      firstColumn.collapsedMaxWords &&
      ((firstColumn.valueType === 'string' && firstColumnData.split(' ').length > firstColumn.collapsedMaxWords) ||
        (firstColumn.valueType === 'object' && firstColumnData.prefLabel?.split(' ').length > firstColumn.collapsedMaxWords))
    ) {
      hasExpandableContent = true
    }

    const dataCells = data.properties.map(column => {
      const {
        id,
        valueType,
        makeLink,
        externalLink,
        sortValues,
        sortBy,
        sortByConvertDataTypeTo,
        numberedList,
        minWidth,
        height,
        linkAsButton,
        collapsedMaxWords,
        showExtraCollapseButton,
        sourceExternalLink,
        renderAsHTML,
        HTMLParserTask,
        mainInlineList,
        inlineSeparator,
        mainTableSimpleList
      } = column

      let { previewImageHeight } = column
      if (screenSize === 'xs' || screenSize === 'sm') previewImageHeight = 50

      if (column.onlyOnInstancePage) return null

      const columnData = row[id] == null ? '-' : row[id]

      let shortenLabel = false
      if (!Array.isArray(columnData) && collapsedMaxWords && columnData !== '-') {
        if (
          (valueType === 'string' && columnData.split(' ').length > collapsedMaxWords) ||
          (valueType === 'object' && columnData.prefLabel?.split(' ').length > collapsedMaxWords)
        ) {
          shortenLabel = !expanded
        }
      }

      return (
        <ResultTableCell
          key={id}
          rowId={row.id}
          columnId={id}
          tableData={data}
          data={columnData}
          thumbnailData={row.thumbnailUrl}
          valueType={valueType}
          makeLink={makeLink}
          externalLink={externalLink}
          sortValues={sortValues}
          sortBy={sortBy}
          sortByConvertDataTypeTo={sortByConvertDataTypeTo}
          numberedList={numberedList}
          height={height}
          minWidth={minWidth}
          previewImageHeight={previewImageHeight}
          container='cell'
          expanded={expanded}
          onExpandClick={this.handleExpandRowFromChildComponent}
          linkAsButton={linkAsButton}
          collapsedMaxWords={collapsedMaxWords}
          showExtraCollapseButton={showExtraCollapseButton}
          shortenLabel={shortenLabel}
          showSource={false}
          sourceExternalLink={sourceExternalLink}
          renderAsHTML={renderAsHTML}
          HTMLParserTask={HTMLParserTask}
          referencedTerm={columnData?.referencedTerm}
          mainInlineList={mainInlineList}
          inlineSeparator={inlineSeparator}
          linkStyle={column.linkStyle}
          mainTableSimpleList={mainTableSimpleList}
          previewImageWidth={96}
          isTableThumbnail={true}
        />
      )
    })

    return (
      <TableRow key={row.id}>
        <TableCell className={classes.expandCell}>
          {hasExpandableContent && (
            <IconButton
              className={clsx(classes.expand, { [classes.expandOpen]: expanded })}
              onClick={this.handleExpandRow(row.id)}
              aria-expanded={expanded}
              aria-label='Show more'
              size='large'
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
        </TableCell>

        {dataCells}
      </TableRow>
    )
  }

  render () {
    const { classes } = this.props
    const { resultCount, paginatedResults, page, pagesize, sortBy, sortDirection, fetching } = this.props.data
    return (
      <>
        <TablePagination
          component='div'
          count={resultCount == null ? 0 : resultCount}
          labelDisplayedRows={resultCount == null
            ? () => '-'
            : ({ from, to, count }) => `${from}-${to} of ${count}`}
          rowsPerPage={parseInt(pagesize)}
          labelRowsPerPage={intl.get('table.rowsPerPage')}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50, 100]}
          page={page === -1 || resultCount === 0 ? 0 : page}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true
          }}
          onPageChange={this.handlePageChange}
          onRowsPerPageChange={this.handleRowsPerPageChange}
          ActionsComponent={ResultTablePaginationActions}
          sx={theme => ({
            display: 'flex',
            backgroundColor: '#fff',
            borderTop: '1px solid rgba(224, 224, 224, 1);',
            alignItems: 'center',
            '& .MuiTablePagination-toolbar': {
              '& p': {
                fontSize: '0.75rem',
                marginTop: 0,
                marginBottom: 0
              },
              minHeight: this.props.layoutConfig.paginationToolbarHeight,
              [theme.breakpoints.down('sm')]: {
                display: 'flex',
                flexWrap: 'wrap',
                marginTop: theme.spacing(0.5)
              }
            },
            '& .MuiTablePagination-displayedRows': {
              minWidth: 110
            }
          })}
        />
        <div className={classes.tableContainer}>
          {fetching
            ? (
              <div className={classes.progressContainer}>
                <CircularProgress />
              </div>
              )
            : (
              <Table
                size='small'
                stickyHeader
                sx={{
                  '& tbody td[data-linkstyle="primary"] a': {
                    color: 'inherit',
                    cursor: 'pointer',
                    textDecorationLine: 'underline',
                    textDecorationColor: 'rgba(0,0,0,0.18)',
                    textDecorationThickness: '1px',
                    textUnderlineOffset: '3px',
                    transition: 'color 120ms ease, text-decoration-color 120ms ease'
                  },

                  '& tbody td[data-linkstyle="primary"] a:hover': {
                    color: 'rgba(0,0,0,0.90)',
                    textDecorationColor: 'rgba(0,0,0,0.45)',
                    fontWeight: 500
                  },

                  '& tbody a.inlineLink': {
                    color: 'inherit',
                    textDecoration: 'none'
                  },
                  '& tbody a.inlineLink:hover': {
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(0,0,0,0.35)',
                    textUnderlineOffset: '3px'
                  }
                }}
              >
                <ResultTableHead
                  perspectiveConfig={this.props.perspectiveConfig}
                  resultClass={this.props.resultClass}
                  columns={this.props.data.properties}
                  onSortBy={this.handleSortBy}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                />
                <TableBody>
                  {paginatedResults.map(row => this.rowRenderer(row))}
                </TableBody>
              </Table>
              )}
        </div>
      </>
    )
  }
}

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  facetUpdateID: PropTypes.number.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  rootUrl: PropTypes.string.isRequired,
  currentLocale: PropTypes.string.isRequired
}

export const ResultTableComponent = ResultTable

export default withStyles(styles)(ResultTable)