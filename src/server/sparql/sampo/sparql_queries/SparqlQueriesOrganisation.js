const perspectiveID = 'organisation';

export const organisationProperties = `
{
  ?id ns2:P2561 ?name .

  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)

  BIND(?id AS ?uri__id)
  BIND(STR(?id) AS ?uri__prefLabel)
  BIND(CONCAT("http://wendang-project.github.io/data/item/", ENCODE_FOR_URI(?localId)) AS ?uri__dataProviderUrl)

  BIND(?id AS ?prefLabel__id)
  BIND(?name AS ?prefLabel__prefLabel)
  BIND(CONCAT("/${perspectiveID}/page/", ENCODE_FOR_URI(?localId), "/table") AS ?prefLabel__dataProviderUrl)
}
UNION
{
  # IMAGE
  ?id ns1:image ?img .
  BIND(?img AS ?image__id)
  BIND(?img AS ?image__url)
}
UNION
{
  # DESCRIPTION
  ?id ns1:description ?descLiteral .
  BIND(?descLiteral AS ?description__prefLabel)
  BIND(?id AS ?description__id)
}  
UNION
{
  # ORGANISATION TYPE
  ?id ns1:hasOrganisationType ?type__id .
  OPTIONAL { ?type__id rdfs:label ?typeLabel }
  BIND(COALESCE(?typeLabel, STR(?type__id)) AS ?type__prefLabel)
}
UNION
{
  # LOCATION
  ?id ns2:P276 ?location__id .
  OPTIONAL { ?location__id rdfs:label ?locationLabel }
  BIND(COALESCE(?locationLabel, STR(?location__id)) AS ?location__prefLabel)
}
UNION
{
  # DATE
  ?id ns2:P571 ?date .
  BIND(STR(?date) AS ?bstr)
  BIND(REPLACE(?bstr, "T.*", "") AS ?dateLex)   # e.g., 1950-05-12T00:00:00Z -> 1950-05-12
  BIND(STRLEN(?dateLex) AS ?len)

  # Format based on length: 10 = YYYY-MM-DD, 7 = YYYY-MM, 4 = YYYY
  BIND(
    IF(?len = 10,
      CONCAT(SUBSTR(?dateLex, 9, 2), "/", SUBSTR(?dateLex, 6, 2), "/", SUBSTR(?dateLex, 1, 4)),
      IF(?len = 7,
        CONCAT(SUBSTR(?dateLex, 6, 2), "/", SUBSTR(?dateLex, 1, 4)),
        IF(?len = 4,
          ?dateLex,
          ?dateLex  
      )
     )
  ) AS ?date__prefLabel
)
BIND(?id AS ?date__id)
}  
UNION 
{
  # HAS MEMBER
  ?id ns2:P527 ?hasMember__id .
  OPTIONAL { ?hasMember__id ns2:P2561 ?hasMemberName }
  BIND(COALESCE(?hasMemberName, STRAFTER(STR(?hasMember__id), "/")) AS ?hasMember__prefLabel)

  # LOCAL_ID
  BIND(REPLACE(STR(?hasMember__id), "^.*/", "") AS ?hasMemberLocalId)

  # Data provider URL
  BIND(CONCAT("/person/page/", ENCODE_FOR_URI(?hasMemberLocalId), "/table") AS ?hasMember__dataProviderUrl)
}  
UNION
{
  # OFFICIAL WEBSITE  
  ?id ns2:P856 ?officialWebsite__id .

  OPTIONAL { ?officialWebsite__id rdfs:label ?officialWebsiteRdfsLabel .}
  BIND( COALESCE( STR(?officialWebsiteRdfsLabel), STR(?officialWebsite__id)) AS ?officialWebsite__prefLabel)
  BIND(STR(?officialWebsite__id) AS ?officialWebsite__dataProviderUrl)
}      
`
