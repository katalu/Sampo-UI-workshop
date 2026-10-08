const perspectiveID = 'exhibition'

export const exhibitionProperties = `
{
  # English title
  ?id ns2:P1476 ?titleLiteral .
  FILTER(LANG(?titleLiteral) = "en")

  # local id
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)

  # uri
  BIND(?id AS ?uri__id)
  BIND(STR(?id) AS ?uri__prefLabel)
  BIND(CONCAT("http://wendang-project.github.io/data/item/", ENCODE_FOR_URI(?localId)) AS ?uri__dataProviderUrl)

  # prefLabel (kept)
  BIND(?id AS ?prefLabel__id)
  BIND(?titleLiteral AS ?prefLabel__prefLabel)
  BIND(CONCAT("/${perspectiveID}/page/", ENCODE_FOR_URI(?localId), "/table") AS ?prefLabel__dataProviderUrl)

  # NEW — English title property binding
  BIND(?id AS ?titleEN__id)
  BIND(?titleLiteral AS ?titleEN__prefLabel)
}
UNION
{
  ?id ns2:P1476 ?otherTitle .
  FILTER(LANG(?otherTitle) != "en")

  BIND(CONCAT(STR(?id), "#", LANG(?otherTitle)) AS ?titleOtherLang__id)
  BIND(CONCAT(STR(?otherTitle), " [", LANG(?otherTitle), "]") AS ?titleOtherLang__prefLabel)
}
UNION
{
  # DESCRIPTION 

  ?id ns1:description ?descLiteral .
  BIND(?descLiteral AS ?description__prefLabel)
}
UNION
{
  # CURATOR
  ?id ns2:P1640 ?curator__id .

  # LOCAL name dataset 
  OPTIONAL { ?curator__id ns2:P2561 ?curatorName }

  # Wikidata / external label
  OPTIONAL { ?curator__id rdfs:label ?curatorRdfsLabel . }
  BIND(COALESCE(?curatorName, ?curatorRdfsLabel, STRAFTER(STR(?curator__id), "/")) AS ?curator__prefLabel)
  BIND(STR(?curator__id) AS ?curatorStr)

  # check if curator is local
  BIND(STRSTARTS(?curatorStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/person/page/", REPLACE(?curatorStr, "^.*/", ""), "/table"), ?curatorStr) AS ?curator__dataProviderUrl)
}
UNION
{
  # ORGANISER
  ?id ns2:P664 ?organiser__id .

  # Local name dataset
  OPTIONAL {
    ?organiser__id ns2:P2561 ?organiserName .
    FILTER(LANG(?organiserName) = "" )
  }

  # Wikidata / external label
  OPTIONAL {
    ?organiser__id rdfs:label ?organiserRdfsLabel . }

  BIND(STR(?organiser__id) AS ?organiserStr)
  BIND(REPLACE(?organiserStr, "^.*/", "") AS ?organiserLocalId)
  BIND(REPLACE(?organiserStr, "^.*/", "") AS ?organiserFallbackLabel)

  # local or external
  BIND(STRSTARTS(?organiserStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # classify resources
  BIND(
    IF(EXISTS { ?organiser__id a ns3:Q1400264 }, "artisticCollective",
      IF(EXISTS { ?organiser__id a ns3:Q43229 }, "organisation",
        IF(EXISTS { ?organiser__id a ns3:Q215627 }, "person", "agent")
      )
    )
    AS ?agentPerspective
  )

  # internal route for local entities, external URI for Wikidata entities
  BIND(
    IF(
      ?isLocal,
      CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?organiserLocalId), "/table"),
      ?organiserStr
    )
    AS ?organiser__dataProviderUrl
  )

  BIND(
    COALESCE(?organiserName, ?organiserRdfsLabel, ?organiserFallbackLabel)
    AS ?organiser__prefLabel
  )
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
  # START TIME
  ?id ns2:P580 ?startTime .
  BIND(STR(?startTime) AS ?bstr)
  BIND(REPLACE(?bstr, "T.*", "") AS ?startTimeLex)   # e.g., 1950-05-12T00:00:00Z -> 1950-05-12
  BIND(STRLEN(?startTimeLex) AS ?len)

  # Format based on length: 10 = YYYY-MM-DD, 7 = YYYY-MM, 4 = YYYY
  BIND(
    IF(?len = 10,
      CONCAT(SUBSTR(?startTimeLex, 9, 2), "/", SUBSTR(?startTimeLex, 6, 2), "/", SUBSTR(?startTimeLex, 1, 4)),
      IF(?len = 7,
        CONCAT(SUBSTR(?startTimeLex, 6, 2), "/", SUBSTR(?startTimeLex, 1, 4)),
        IF(?len = 4,
          ?startTimeLex,
          ?startTimeLex  # fallback: show as-is if format is unexpected
      )
     )
  ) AS ?startTime__prefLabel
)
BIND(?id AS ?startTime__id)
}
UNION
{
  # END TIME
  ?id ns2:P582 ?endTime .
  BIND(STR(?endTime) AS ?bstr)
  BIND(REPLACE(?bstr, "T.*", "") AS ?endTimeLex)   # e.g., 1950-05-12T00:00:00Z -> 1950-05-12
  BIND(STRLEN(?endTimeLex) AS ?len)

  # Format based on length: 10 = YYYY-MM-DD, 7 = YYYY-MM, 4 = YYYY
  BIND(
    IF(?len = 10,
      CONCAT(SUBSTR(?endTimeLex, 9, 2), "/", SUBSTR(?endTimeLex, 6, 2), "/", SUBSTR(?endTimeLex, 1, 4)),
      IF(?len = 7,
        CONCAT(SUBSTR(?endTimeLex, 6, 2), "/", SUBSTR(?endTimeLex, 1, 4)),
        IF(?len = 4,
          ?endTimeLex,
          ?endTimeLex  # fallback: show as-is if format is unexpected
      )
     )
  ) AS ?endTime__prefLabel
)
BIND(?id AS ?endTime__id)
}
UNION
{
  # EXHIBITED ARTIST
  ?id ns2:P10661 ?exhibitedArtist__id .
  
  # Local dataset name
  OPTIONAL { ?exhibitedArtist__id ns2:P2561 ?exhibitedArtistName
    FILTER(LANG(?exhibitedArtistName) = "" )}

  BIND(STR(?exhibitedArtist__id) AS ?exhibitedArtistStr)
  BIND(REPLACE(?exhibitedArtistStr, "^.*/", "") AS ?exhibitedArtistLocalId)

  # local or external
  BIND(STRSTARTS(?exhibitedArtistStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # classify resources
  BIND(
    IF(EXISTS { ?exhibitedArtist__id a ns3:Q1400264 }, "artisticCollective",
      IF(EXISTS { ?exhibitedArtist__id a ns3:Q43229 }, "organisation",
        IF(EXISTS { ?exhibitedArtist__id a ns3:Q215627 }, "person", "agent")
      )
    )
    AS ?agentPerspective
  )

  # internal route for local entities, external URI for Wikidata entities
  BIND(
    IF(
      ?isLocal,
      CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?exhibitedArtistLocalId), "/table"),
      ?exhibitedArtistStr
    )
    AS ?exhibitedArtist__dataProviderUrl
  )

  BIND(
    COALESCE(?exhibitedArtistName, ?exhibitedArtistRdfsLabel, STRAFTER(?exhibitedArtistStr, "/"))
    AS ?exhibitedArtist__prefLabel
  )
}
UNION
{
  # EXHIBITED ARTWORK
  ?id ns1:exhibitedArtwork ?exhibitedArtwork__id .

  OPTIONAL {
    ?exhibitedArtwork__id ns2:P1476 ?exhibitedArtworkTitle .
    FILTER(LANG(?exhibitedArtworkTitle) = "en")
  }

  BIND(
    COALESCE(
      ?exhibitedArtworkTitle,
      STRAFTER(STR(?exhibitedArtwork__id), "/")
    ) AS ?exhibitedArtwork__prefLabel
  )

  # determine perspective
  ?exhibitedArtwork__id a ?artworkClass .

  BIND(
    IF(?artworkClass = ns3:Q4502142, "VisualArts",
    IF(?artworkClass = ns3:Q184485, "PerformingArts",
    IF(?artworkClass = ns3:Q17514, "GraffitiArt",
      "VisualArts"
    ))) AS ?artworkPerspective
  )

  # local id
  BIND(REPLACE(STR(?exhibitedArtwork__id), "^.*/", "") AS ?exhibitedArtworkLocalId)

  # correct internal route
  BIND(
    CONCAT(
      "/", ?artworkPerspective,
      "/page/",
      ENCODE_FOR_URI(?exhibitedArtworkLocalId),
      "/table"
    )
    AS ?exhibitedArtwork__dataProviderUrl
  )
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
export const exhibitionCreationPlacesQuery = `
 SELECT ?id ?lat ?long ?label (COUNT(DISTINCT ?exhibition) AS ?instanceCount)
  WHERE {
  <FILTER>

  ?exhibition a ns3:Q464980 .

  ?exhibition ns2:P276 ?id .
  ?id ns2:P625 ?coord .

  OPTIONAL { ?id rdfs:label ?label . }

  BIND(STRAFTER(STR(?coord), "Point(") AS ?tmp)
  BIND(STRBEFORE(?tmp, ")") AS ?coords)

  BIND(xsd:decimal(STRBEFORE(?coords, " ")) AS ?long)
  BIND(xsd:decimal(STRAFTER(?coords, " ")) AS ?lat)
}
GROUP BY ?id ?lat ?long ?label
`

export const creationPlaceExhibitionInfoWindow = `
{
  OPTIONAL { ?id rdfs:label ?placeLabel . }
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?placeLabel, STR(?id)) AS ?prefLabel__prefLabel)
}
UNION
{
  ?exhibition a ns3:Q464980 .
  ?exhibition ns2:P276 ?id .

  OPTIONAL {
    ?exhibition ns2:P1476 ?title .
    FILTER(lang(?title) = "en" || lang(?title) = "")
  }
  BIND(COALESCE(?title, STR(?exhibition)) AS ?exhibitionLabel)

  BIND(REPLACE(STR(?exhibition), "^.*/", "") AS ?exhibitionLocalId)

  BIND(?exhibition AS ?related__id)
  BIND(?exhibitionLabel AS ?related__prefLabel)
  BIND(CONCAT("/exhibition/page/", ENCODE_FOR_URI(?exhibitionLocalId), "/table") AS ?related__dataProviderUrl)
}
`
export const exhibitionTimelineQuery = `
 SELECT DISTINCT ?id ?prefLabel ?startDate ?recordUrl
 WHERE {
  <FILTER>

  ?id a ns3:Q464980 .

  OPTIONAL {
    ?id ns2:P1476 ?prefLabel .
    FILTER(lang(?prefLabel) = "en" || lang(?prefLabel) = "")
  }
  OPTIONAL { ?id ns2:P580 ?startDate . }

  FILTER(BOUND(?startDate))

  BIND(REPLACE(STR(?id), "^.*/", "") AS ?exhibitionLocalId)
  BIND(CONCAT("/exhibition/page/", ENCODE_FOR_URI(?exhibitionLocalId), "/table") AS ?recordUrl)
 }
 ORDER BY ?startDate
`