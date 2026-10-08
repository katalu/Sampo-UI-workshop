const perspectiveID = 'artworkSeries'

export const artworkSeriesProperties = `
{
  # Title (prefLabel) and localId extraction
  ?id ns2:P1476 ?titleLiteral .

  # LOCAL_ID = last path segment of the URI (e.g., "1741")
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)
  FILTER(LANG(?titleLiteral) = "en")

  # uri (object)
  BIND(?id AS ?uri__id)
  BIND(STR(?id) AS ?uri__prefLabel)
  BIND(CONCAT("http://wendang-project.github.io/data/item/", ENCODE_FOR_URI(?localId)) AS ?uri__dataProviderUrl)

  # prefLabel (object) — bind internal link using LOCAL_ID
  BIND(?id AS ?prefLabel__id)
  BIND(?titleLiteral AS ?prefLabel__prefLabel)
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
  # THUMBNAIL
  ?id sch:thumbnailUrl ?thumbnailUrl .
  BIND(?thumbnailUrl AS ?thumbnailUrl__id)
  BIND(?thumbnailUrl AS ?thumbnailUrl__url)
}  
UNION
{
  ?id ns1:image ?img .

  BIND(
    IF(CONTAINS(STR(?img), "_1"), CONCAT("001-", STR(?img)),
    IF(CONTAINS(STR(?img), "_2"), CONCAT("002-", STR(?img)),
    IF(CONTAINS(STR(?img), "_3"), CONCAT("003-", STR(?img)),
       CONCAT("999-", STR(?img)))))
    AS ?image__id
  )

  BIND(?img AS ?image__url)
  BIND("" AS ?image__description)
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
  # LOCATION OF CREATION
  ?id ns2:P1071 ?location__id .
  OPTIONAL { ?location__id rdfs:label ?locationLabel }
  BIND(COALESCE(?locationLabel, STR(?location__id)) AS ?location__prefLabel)
}
UNION
{
  # CREATOR
  ?id ns2:P170 ?creator__id .
  OPTIONAL { ?creator__id ns2:P2561 ?creatorName }
  BIND(STR(?creator__id) AS ?creatorStr)
  BIND(REPLACE(?creatorStr, "^.*/", "") AS ?creatorLocalId)

  # local or external
  BIND(STRSTARTS(?creatorStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # classify resources
  BIND(
    IF(EXISTS { ?creator__id a ns3:Q1400264 }, "artisticCollective",
      IF(EXISTS { ?creator__id a ns3:Q43229 }, "organisation",
        IF(EXISTS { ?creator__id a ns3:Q215627 }, "person", "agent")
      )
    )
    AS ?agentPerspective
  )

  # internal route for local entities, external URI for Wikidata entities
  BIND(
    IF(
      ?isLocal,
      CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?creatorLocalId), "/table"),
      ?creatorStr
    )
    AS ?creator__dataProviderUrl
  )

  BIND(
    COALESCE(?creatorName, ?creatorRdfsLabel, STRAFTER(?creatorStr, "/"))
    AS ?creator__prefLabel
  )
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
  # INCLUDES ARTWORK
  ?id ns1:includesArtwork ?includesArtwork__id .

  OPTIONAL {
    ?includesArtwork__id ns2:P1476 ?includesArtworkTitle .
    FILTER(LANG(?includesArtworkTitle) = "en")
  }

  BIND(
    COALESCE(?includesArtworkTitle, STRAFTER(STR(?includesArtwork__id), "/")) AS ?includesArtwork__prefLabel)

  # determine perspective
  ?includesArtwork__id a ?artworkClass . 

  BIND(
    IF(?artworkClass = ns3:Q4502142, "VisualArts",
      IF(?artworkClass = ns3:Q184485, "PerformingArts",
        IF(?artworkClass = ns3:Q17514, "GraffitiArt",
          IF(?artworkClass = ns1:DecorativeAndAppliedArt, "DecorativeAppliedArts", "")
        )
      )
    )
    AS ?artworkPerspective
  )

  # local id
  BIND(REPLACE(STR(?includesArtwork__id), "^.*/", "") AS ?includesArtworkLocalId)

  # correct internal route
  BIND(CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?includesArtworkLocalId), "/table" )
    AS ?includesArtwork__dataProviderUrl
  )
}
`

export const artworkSeriesTimelineQuery = `
 SELECT DISTINCT ?id ?prefLabel ?startDate ?recordUrl
 WHERE {
  <FILTER>

  ?id a ns3:Q7725310 .

  OPTIONAL {
    ?id ns2:P1476 ?prefLabel .
    FILTER(lang(?prefLabel) = "en" || lang(?prefLabel) = "")
  }
  OPTIONAL { ?id ns2:P580 ?startDate . }

  FILTER(BOUND(?startDate))

  BIND(REPLACE(STR(?id), "^.*/", "") AS ?seriesLocalId)
  BIND(CONCAT("/artworkSeries/page/", ENCODE_FOR_URI(?seriesLocalId), "/table") AS ?recordUrl)
 }
 ORDER BY ?startDate
`