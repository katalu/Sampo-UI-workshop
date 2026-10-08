import React, { useEffect, lazy } from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import { has } from 'lodash'
import { connect } from 'react-redux'
import { Route, Redirect, Switch, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import {
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchInstanceAnalysis,
  fetchFullTextResults,
  sortFullTextResults,
  clearResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  clearFacet,
  clearAllFacets,
  fetchGeoJSONLayers,
  fetchGeoJSONLayersBackend,
  clearGeoJSONLayers,
  sortResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  updateMapBounds,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap,
  updateVideoPlayerTime,
  clientFSToggleDataset,
  clientFSFetchResults,
  clientFSSortResults,
  clientFSClearResults,
  clientFSUpdateQuery,
  clientFSUpdateFacet,
  fetchKnowledgeGraphMetadata
} from '../actions'
import { filterResults } from '../selectors'
import {
  processPortalConfig,
  createPerspectiveConfig,
  createPerspectiveConfigOnlyInfoPages,
  getScreenSize,
  usePageViews
} from '../helpers/helpers'
import * as apexChartsConfig from '../library_configs/ApexCharts/ApexChartsConfig'
import * as leafletConfig from '../library_configs/Leaflet/LeafletConfig'
import * as networkToolsGeneral from '../library_configs/Cytoscape.js/NetworkToolsGeneral'
import * as networkToolsPortalSpecific from '../library_configs/Cytoscape.js/NetworkToolsPortalSpecific'

// ** Generate portal configuration based on JSON configs **
import portalConfig from '../../configs/portalConfig.json'
await processPortalConfig(portalConfig)
const {
  portalID,
  rootUrl,
  perspectives,
  layoutConfig,
  knowledgeGraphMetadataConfig
} = portalConfig
const perspectiveConfig = await createPerspectiveConfig({
  portalID,
  searchPerspectives: perspectives.searchPerspectives
})
const perspectiveConfigOnlyInfoPages = await createPerspectiveConfigOnlyInfoPages({
  portalID,
  onlyInstancePagePerspectives: perspectives.onlyInstancePages
})
const networkConfig = {
  ...networkToolsGeneral,
  ...networkToolsPortalSpecific
}
// ** portal configuration end **

// ** Import general components **
const TopBar = lazy(() => import('../components/main_layout/TopBar'))
const TextPage = lazy(() => import('../components/main_layout/TextPage'))
const Message = lazy(() => import('../components/main_layout/Message'))
const FullTextSearch = lazy(() => import('../components/main_layout/FullTextSearch'))
const FacetedSearchPerspective = lazy(() => import('../components/facet_results/FacetedSearchPerspective'))
const FederatedSearchPerspective = lazy(() => import('../components/facet_results/FederatedSearchPerspective'))
const InstancePagePerspective = lazy(() => import('../components/main_layout/InstancePagePerspective'))
const KnowledgeGraphMetadataTable = lazy(() => import('../components/main_layout/KnowledgeGraphMetadataTable'))
// ** General components end **

// ** Import portal specific components **
const Main = lazy(() => import(`../components/perspectives/${portalID}/Main`))
const Footer = lazy(() => import(`../components/perspectives/${portalID}/Footer`))
// ** Portal specific components end **

/**
 * A top-level container component, which connects all Sampo-UI components to the Redux store. Also
 * the main routes of the portal are defined here based on JSON configs, using React Router.
 * Currently it is not possible to render this component in Storybook.
 */
const SemanticPortal = props => {
  const { error } = props
  const location = useLocation()
  const rootUrlWithLang = `${rootUrl}/${props.options.currentLocale}`
  const screenSize = getScreenSize()

  const normalizePath = path => path.replace(/\/+$/, '') || '/'
  const isFrontPage = normalizePath(location.pathname) === normalizePath(rootUrlWithLang)

  const federatedSearchPerspectives = []
  let noClientFSResults = true
  perspectiveConfig.forEach(perspective => {
    if (perspective.searchMode === 'federated-search') {
      federatedSearchPerspectives.push(perspective)
      noClientFSResults = props.clientFSState && props.clientFSState.results === null
    }
  })

  // trigger a new "page view" event whenever a new page loads
  usePageViews()

  // set HTML title and description dynamically based on translations
  useEffect(() => {
    document.title = intl.get('html.title')
    document.documentElement.lang = props.options.currentLocale
    document.querySelector('meta[name="description"]').setAttribute('content', intl.get('html.description'))
  }, [props.options.currentLocale])

  return (
    <Box
      sx={theme => ({
        backgroundColor: '#bdbdbd',
        overflowX: 'hidden',
        ...(isFrontPage
          ? {
              minHeight: '100vh',
              height: 'auto',
              overflow: 'visible'
            }
          : {
              minHeight: '100%',
              [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
                overflow: 'hidden',
                height: '100%'
              }
            })
      })}
    >
      {/* error messages are shown on top of the app */}
      <Message error={error} />

      <>
        <TopBar
          rootUrl={rootUrlWithLang}
          search={props.fullTextSearch}
          fetchFullTextResults={props.fetchFullTextResults}
          clearResults={props.clearResults}
          clientFSClearResults={props.clientFSClearResults}
          perspectives={perspectiveConfig}
          currentLocale={props.options.currentLocale}
          availableLocales={props.options.availableLocales}
          loadLocales={props.loadLocales}
          screenSize={screenSize}
          location={location}
          layoutConfig={layoutConfig}
          isFrontPage={isFrontPage}
        />

        {/* enforce a lang tag */}
        <Route exact path={`${rootUrl}/`}>
          <Redirect to={rootUrlWithLang} />
        </Route>

        {/* create a route for portal front page */}
        <Route exact path={[rootUrlWithLang, `${rootUrlWithLang}/`]}>
          <Box
            sx={{
              minHeight: '100vh',
              height: 'auto',
              overflow: 'visible'
            }}
          >
            <Main
              perspectives={perspectiveConfig}
              screenSize={screenSize}
              rootUrl={rootUrlWithLang}
              layoutConfig={layoutConfig}
              search={props.fullTextSearch}
              fetchFullTextResults={props.fetchFullTextResults}
              clearResults={props.clearResults}
            />
            <Footer
              portalConfig={portalConfig}
              layoutConfig={layoutConfig}
            />
          </Box>
        </Route>

        {/* create a route for full text search results */}
        <Route path={`${rootUrlWithLang}/full-text-search`}>
          <FullTextSearch
            fullTextSearch={props.fullTextSearch}
            resultClass='fullTextSearch'
            sortFullTextResults={props.sortFullTextResults}
            screenSize={screenSize}
            rootUrl={rootUrlWithLang}
            layoutConfig={layoutConfig}
          />
        </Route>

        {/* create routes for faceted search perspectives and corresponding instance pages */}
        {perspectiveConfig.map(perspective => {
          if (!has(perspective, 'externalUrl') && perspective.searchMode === 'faceted-search') {
            return (
              <React.Fragment key={perspective.id}>
                <Route path={`${rootUrlWithLang}/${perspective.id}/faceted-search`}>
                  <FacetedSearchPerspective
                    portalConfig={portalConfig}
                    perspectiveConfig={perspective}
                    layoutConfig={layoutConfig}
                    facetedSearchMode='serverFS'
                    facetState={props[`${perspective.id}Facets`]}
                    facetStateConstrainSelf={props[`${perspective.id}FacetsConstrainSelf`]}
                    perspectiveState={props[perspective.id]}
                    facetClass={perspective.id}
                    resultClass={perspective.id}
                    fetchingResultCount={props[perspective.id].fetchingResultCount}
                    resultCount={props[perspective.id].resultCount}
                    fetchFacet={props.fetchFacet}
                    fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                    fetchResults={props.fetchResults}
                    clearFacet={props.clearFacet}
                    clearAllFacets={props.clearAllFacets}
                    fetchResultCount={props.fetchResultCount}
                    updateFacetOption={props.updateFacetOption}
                    showError={props.showError}
                    defaultActiveFacets={perspective.defaultActiveFacets}
                    rootUrl={rootUrlWithLang}
                    screenSize={screenSize}
                    apexChartsConfig={apexChartsConfig}
                    leafletConfig={leafletConfig}
                    networkConfig={networkConfig}
                    leafletMapState={props.leafletMap}
                    fetchPaginatedResults={props.fetchPaginatedResults}
                    fetchInstanceAnalysis={props.fetchInstanceAnalysis}
                    fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                    fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                    clearGeoJSONLayers={props.clearGeoJSONLayers}
                    fetchByURI={props.fetchByURI}
                    updatePage={props.updatePage}
                    updateRowsPerPage={props.updateRowsPerPage}
                    updateMapBounds={props.updateMapBounds}
                    updatePerspectiveHeaderExpanded={props.updatePerspectiveHeaderExpanded}
                    sortResults={props.sortResults}
                    perspective={perspective}
                    animationValue={props.animationValue}
                    animateMap={props.animateMap}
                  />
                </Route>

                {perspective.resultClasses[perspective.id].instanceConfig &&
                  <Switch>
                    <Redirect
                      from={`/${perspective.id}/page/:id`}
                      to={{
                        pathname: `${rootUrlWithLang}/${perspective.id}/page/:id`,
                        hash: location.hash
                      }}
                    />
                    <Route path={`${rootUrlWithLang}/${perspective.id}/page/:id`}>
                      <InstancePagePerspective
                        portalConfig={portalConfig}
                        layoutConfig={layoutConfig}
                        perspectiveConfig={perspective}
                        perspectiveState={props[`${perspective.id}`]}
                        leafletMapState={props.leafletMap}
                        fetchPaginatedResults={props.fetchPaginatedResults}
                        fetchResults={props.fetchResults}
                        fetchInstanceAnalysis={props.fetchInstanceAnalysis}
                        fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                        fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                        fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                        clearGeoJSONLayers={props.clearGeoJSONLayers}
                        fetchByURI={props.fetchByURI}
                        updatePage={props.updatePage}
                        updateRowsPerPage={props.updateRowsPerPage}
                        updateFacetOption={props.updateFacetOption}
                        updateMapBounds={props.updateMapBounds}
                        sortResults={props.sortResults}
                        showError={props.showError}
                        perspective={perspective}
                        animationValue={props.animationValue}
                        animateMap={props.animateMap}
                        videoPlayerState={props.videoPlayer}
                        updateVideoPlayerTime={props.updateVideoPlayerTime}
                        updatePerspectiveHeaderExpanded={props.updatePerspectiveHeaderExpanded}
                        screenSize={screenSize}
                        rootUrl={rootUrlWithLang}
                        apexChartsConfig={apexChartsConfig}
                        leafletConfig={leafletConfig}
                        networkConfig={networkConfig}
                      />
                    </Route>
                  </Switch>}
              </React.Fragment>
            )
          }
          return null
        })}

        {/* create routes for perspectives that have only instance pages */}
        {perspectiveConfigOnlyInfoPages.map(perspective =>
          <Switch key={perspective.id}>
            <Redirect
              from={`${rootUrl}/${perspective.id}/page/:id`}
              to={`${rootUrlWithLang}/${perspective.id}/page/:id`}
            />
            <Route path={`${rootUrlWithLang}/${perspective.id}/page/:id`}>
              <InstancePagePerspective
                portalConfig={portalConfig}
                layoutConfig={layoutConfig}
                perspectiveConfig={perspective}
                perspectiveState={props[`${perspective.id}`]}
                leafletMapState={props.leafletMap}
                fetchPaginatedResults={props.fetchPaginatedResults}
                fetchResults={props.fetchResults}
                fetchInstanceAnalysis={props.fetchInstanceAnalysis}
                fetchFacetConstrainSelf={props.fetchFacetConstrainSelf}
                fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                clearGeoJSONLayers={props.clearGeoJSONLayers}
                fetchByURI={props.fetchByURI}
                updatePage={props.updatePage}
                updateRowsPerPage={props.updateRowsPerPage}
                updateFacetOption={props.updateFacetOption}
                updateMapBounds={props.updateMapBounds}
                sortResults={props.sortResults}
                showError={props.showError}
                perspective={perspective}
                animationValue={props.animationValue}
                animateMap={props.animateMap}
                videoPlayerState={props.videoPlayer}
                updateVideoPlayerTime={props.updateVideoPlayerTime}
                updatePerspectiveHeaderExpanded={props.updatePerspectiveHeaderExpanded}
                screenSize={screenSize}
                rootUrl={rootUrlWithLang}
                apexChartsConfig={apexChartsConfig}
                leafletConfig={leafletConfig}
                networkConfig={networkConfig}
              />
            </Route>
          </Switch>
        )}

        {/* optional: create routes for client side faceted search */}
        {federatedSearchPerspectives.length > 0 &&
          federatedSearchPerspectives.map(perspective =>
            <Route key={perspective.id} path={`${rootUrlWithLang}/${perspective.id}/federated-search`}>
              <FederatedSearchPerspective
                portalConfig={portalConfig}
                layoutConfig={layoutConfig}
                facetedSearchMode='clientFS'
                facetClass={perspective.id}
                resultClass={perspective.id}
                facetState={props.clientFSState}
                clientFSFacetValues={props.clientFSFacetValues}
                fetchingResultCount={props.clientFSState.textResultsFetching}
                resultCount={noClientFSResults ? 0 : props.clientFSState.results.length}
                noClientFSResults={noClientFSResults}
                clientFSState={props.clientFSState}
                clientFSToggleDataset={props.clientFSToggleDataset}
                clientFSFetchResults={props.clientFSFetchResults}
                clientFSClearResults={props.clientFSClearResults}
                clientFSUpdateQuery={props.clientFSUpdateQuery}
                clientFSUpdateFacet={props.clientFSUpdateFacet}
                defaultActiveFacets={perspective.defaultActiveFacets}
                updateMapBounds={props.updateMapBounds}
                screenSize={screenSize}
                showError={props.showError}
                rootUrl={rootUrlWithLang}
                location={location}
                apexChartsConfig={apexChartsConfig}
                leafletConfig={leafletConfig}
                networkConfig={networkConfig}
                perspective={perspective}
                clientFSResults={props.clientFSResults}
                clientFSSortResults={props.clientFSSortResults}
                leafletMapState={props.leafletMap}
                fetchGeoJSONLayersBackend={props.fetchGeoJSONLayersBackend}
                fetchGeoJSONLayers={props.fetchGeoJSONLayers}
                clearGeoJSONLayers={props.clearGeoJSONLayers}
              />
            </Route>
          )}

        {/* create routes for top bar info buttons */}
        {!layoutConfig.topBar.externalAboutPage &&
          <Route path={`${rootUrlWithLang}/about`}>
            <TextPage layoutConfig={layoutConfig}>
              {intl.getHTML('aboutThePortalPartOne')}
              {knowledgeGraphMetadataConfig.showTable &&
                <KnowledgeGraphMetadataTable
                  portalConfig={portalConfig}
                  layoutConfig={layoutConfig}
                  perspectiveID={knowledgeGraphMetadataConfig.perspective}
                  resultClass='knowledgeGraphMetadata'
                  fetchKnowledgeGraphMetadata={props.fetchKnowledgeGraphMetadata}
                  knowledgeGraphMetadata={props[knowledgeGraphMetadataConfig.perspective]
                    ? props[knowledgeGraphMetadataConfig.perspective].knowledgeGraphMetadata
                    : null}
                />}
              {intl.getHTML('aboutThePortalPartTwo')}
            </TextPage>
          </Route>}

        {/* create a route for instructions page */}
        {!layoutConfig.topBar.externalInstructions &&
          <Route path={`${rootUrlWithLang}/instructions`}>
            <TextPage layoutConfig={layoutConfig}>
              {intl.getHTML('instructions')}
            </TextPage>
          </Route>}
      </>
    </Box>
  )
}

// state: connect the Redux store and React components
const mapStateToProps = state => {
  const stateToProps = {}
  perspectiveConfig.forEach(perspective => {
    const { id, searchMode } = perspective
    if (searchMode && searchMode === 'federated-search') {
      const perspectiveState = state[id]
      const { clientFSResults, clientFSFacetValues } = filterResults(perspectiveState)
      stateToProps.clientFSState = perspectiveState
      stateToProps.clientFSResults = clientFSResults
      stateToProps.clientFSFacetValues = clientFSFacetValues
    } else {
      stateToProps[id] = state[id]
      stateToProps[`${id}Facets`] = state[`${id}Facets`]
      if (has(state, `${id}FacetsConstrainSelf`)) {
        stateToProps[`${id}FacetsConstrainSelf`] = state[`${id}FacetsConstrainSelf`]
      }
    }
  })
  perspectiveConfigOnlyInfoPages.forEach(perspective => {
    const { id } = perspective
    stateToProps[id] = state[id]
  })
  stateToProps.leafletMap = state.leafletMap
  stateToProps.fullTextSearch = state.fullTextSearch
  stateToProps.animationValue = state.animation.value
  stateToProps.videoPlayer = state.videoPlayer
  stateToProps.options = state.options
  stateToProps.error = state.error
  return stateToProps
}

// actions: connect the Redux store and React components
const mapDispatchToProps = ({
  fetchResultCount,
  fetchPaginatedResults,
  fetchResults,
  fetchInstanceAnalysis,
  fetchFullTextResults,
  sortFullTextResults,
  fetchByURI,
  fetchFacet,
  fetchFacetConstrainSelf,
  clearFacet,
  clearAllFacets,
  fetchGeoJSONLayers,
  fetchGeoJSONLayersBackend,
  clearGeoJSONLayers,
  sortResults,
  clearResults,
  updateFacetOption,
  updatePage,
  updateRowsPerPage,
  updateMapBounds,
  showError,
  updatePerspectiveHeaderExpanded,
  loadLocales,
  animateMap,
  updateVideoPlayerTime,
  clientFSToggleDataset,
  clientFSFetchResults,
  clientFSClearResults,
  clientFSSortResults,
  clientFSUpdateQuery,
  clientFSUpdateFacet,
  fetchKnowledgeGraphMetadata
})

SemanticPortal.propTypes = {
  options: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  leafletMap: PropTypes.object,
  animationValue: PropTypes.array,
  fetchResults: PropTypes.func.isRequired,
  fetchResultCount: PropTypes.func.isRequired,
  fetchFullTextResults: PropTypes.func,
  fetchPaginatedResults: PropTypes.func.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  fetchGeoJSONLayers: PropTypes.func,
  clearGeoJSONLayers: PropTypes.func,
  fetchGeoJSONLayersBackend: PropTypes.func,
  sortResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  clearFacet: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  updatePerspectiveHeaderExpanded: PropTypes.func.isRequired,
  updateMapBounds: PropTypes.func.isRequired,
  loadLocales: PropTypes.func.isRequired,
  animateMap: PropTypes.func,
  clientFS: PropTypes.object,
  clientFSToggleDataset: PropTypes.func,
  clientFSFetchResults: PropTypes.func,
  clientFSClearResults: PropTypes.func,
  clientFSSortResults: PropTypes.func,
  clientFSUpdateQuery: PropTypes.func,
  clientFSUpdateFacet: PropTypes.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SemanticPortal)