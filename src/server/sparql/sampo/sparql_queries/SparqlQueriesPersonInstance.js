const perspectiveID = 'personInstancePage'

export const personInstanceProperties = `
{
  {
  BIND(?id AS ?uri__id)
  BIND(?id AS ?uri__dataProviderUrl)
  BIND(STR(?id) AS ?uri__prefLabel)

  OPTIONAL { ?id ns2:P2561 ?prefLabel__prefLabel }
  OPTIONAL {
    ?id ns2:P106 ?role__id .
    OPTIONAL { ?role__id rdfs:label ?role__prefLabel }
  }
}
`
