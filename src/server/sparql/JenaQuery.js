import { runSelectQuery } from './SparqlApi'
import { fullTextQuery } from './SparqlQueriesGeneral'
import { makeObjectList } from './Mappers'

const escapeRegexForSparql = (value = '') =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const queryJenaIndex = async ({
  backendSearchConfig,
  queryTerm,
  resultClass,
  resultFormat
}) => {
  let q = fullTextQuery
  const perspectiveConfig = backendSearchConfig?.[resultClass]

  if (!perspectiveConfig) {
    throw new Error(
      `No backendSearchConfig entry found for resultClass="${resultClass}". Available keys: ${Object.keys(backendSearchConfig || {}).join(', ')}`
    )
  }

  const { endpoint, propertiesQueryBlock } = perspectiveConfig
  const safeTerm = escapeRegexForSparql(queryTerm.trim())

  q = q.replace('<QUERY>', '')
  q = q.replace(
    '<RESULT_SET_PROPERTIES>',
    propertiesQueryBlock.replace(/<SEARCH_TERM>/g, safeTerm)
  )

  console.log('FINAL SPARQL QUERY:\n', endpoint.prefixes + q)

  const results = await runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: makeObjectList,
    resultFormat
  })

  return results
}