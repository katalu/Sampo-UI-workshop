const perspectiveID = 'performingArts'

export const performingArtsProperties = `
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
  # TITLES IN OTHER LANGUAGES
  ?id ns2:P1476 ?otherTitle .
  FILTER(LANG(?otherTitle) != "en")

  BIND(IF(LANG(?otherTitle) = "", "und", LANG(?otherTitle)) AS ?lang)

  BIND(CONCAT( STR(?id), "#title#", ?lang, "#len", STR(STRLEN(STR(?otherTitle))), "#", ENCODE_FOR_URI(SUBSTR(STR(?otherTitle), 1, 60))
  ) AS ?titleOtherLang__id)

  BIND(CONCAT(STR(?otherTitle), " [", ?lang, "]") AS ?titleOtherLang__prefLabel)
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
  # VIDEO
  ?id ns1:video ?video .
  BIND(?video AS ?video__id)
  BIND(?video AS ?video__url)
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
 # PERFORMER
?id ns2:P175 ?performer__id .

# Local name dataset
OPTIONAL {
  ?performer__id ns2:P2561 ?performerName .
  FILTER(LANG(?performerName) = "" )
}

# Wikidata / external label
OPTIONAL {
  ?performer__id rdfs:label ?performerRdfsLabel .
}

BIND(STR(?performer__id) AS ?performerStr)
BIND(REPLACE(?performerStr, "^.*/", "") AS ?performerLocalId)
BIND(REPLACE(?performerStr, "^.*/", "") AS ?performerFallbackLabel)

# local or external
BIND(STRSTARTS(?performerStr, "http://wendang-project.github.io/data/") AS ?isLocal)

# classify resources
BIND(
  IF(EXISTS { ?performer__id a ns3:Q1400264 }, "artisticCollective",
    IF(EXISTS { ?performer__id a ns3:Q43229 }, "organisation",
      IF(EXISTS { ?performer__id a ns3:Q215627 }, "person", "agent")
    )
  )
  AS ?agentPerspective
)

# internal route for local entities, external URI for Wikidata entities
BIND(
  IF(
    ?isLocal,
    CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?performerLocalId), "/table"),
    ?performerStr
  )
  AS ?performer__dataProviderUrl
)

BIND(
  COALESCE(?performerName, ?performerRdfsLabel, ?performerFallbackLabel)
  AS ?performer__prefLabel
)
}
UNION 
{
  # CALLIGRAPHER
  ?id ns1:calligrapher ?calligrapher__id .
  OPTIONAL { ?calligrapher__id ns2:P2561 ?calligrapherName }
  BIND(STR(?calligrapher__id) AS ?calligrapherStr)
  BIND(REPLACE(?calligrapherStr, "^.*/", "") AS ?calligrapherLocalId)

  # local or external
  BIND(STRSTARTS(?calligrapherStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # classify resources
  BIND(
    IF(EXISTS { ?calligrapher__id a ns3:Q1400264 }, "artisticCollective",
      IF(EXISTS { ?calligrapher__id a ns3:Q43229 }, "organisation",
        IF(EXISTS { ?calligrapher__id a ns3:Q215627 }, "person", "agent")
      )
    )
    AS ?agentPerspective
  )

  # internal route for local entities, external URI for Wikidata entities
  BIND(
    IF(
      ?isLocal,
      CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?calligrapherLocalId), "/table"),
      ?calligrapherStr
    )
    AS ?calligrapher__dataProviderUrl
  )

  BIND(
    COALESCE(?calligrapherName, ?calligrapherRdfsLabel, STRAFTER(?calligrapherStr, "/"))
    AS ?calligrapher__prefLabel
  )
}
UNION 
{
  # COMPOSER
  ?id ns2:P86 ?composer__id .
  OPTIONAL { ?composer__id ns2:P2561 ?composerName }
  BIND(COALESCE(?composerName, STRAFTER(STR(?composer__id), "/")) AS ?composer__prefLabel)

  # LOCAL_ID
  BIND(REPLACE(STR(?composer__id), "^.*/", "") AS ?composerLocalId)

  # Data provider URL
  BIND(CONCAT("/person/page/", ENCODE_FOR_URI(?composerLocalId), "/table") AS ?composer__dataProviderUrl)
}  
UNION
{
  # PERFORMING ART TYPE
  ?id ns1:hasPerformingArtType ?performingArtType__id .
  OPTIONAL { ?performingArtType__id rdfs:label ?performingArtTypeLabel }
  BIND(COALESCE(?performingArtTypeLabel, STR(?performingArtType__id)) AS ?performingArtType__prefLabel)
}
UNION
{
  # DATE
  ?id ns2:P585 ?date .
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
  # DURATION
  ?id ns2:P2047 ?duration .
  BIND(STR(?duration) AS ?durationStr)

  BIND(
    IF(
      REGEX(?durationStr, "^PT[0-9]+H[0-9]+M[0-9]+S$"),
      CONCAT(
        REPLACE(?durationStr, "^PT([0-9]+)H([0-9]+)M([0-9]+)S$", "$1"), " h ",
        REPLACE(?durationStr, "^PT([0-9]+)H([0-9]+)M([0-9]+)S$", "$2"), " min ",
        REPLACE(?durationStr, "^PT([0-9]+)H([0-9]+)M([0-9]+)S$", "$3"), " s"
      ),
      IF(
        REGEX(?durationStr, "^PT[0-9]+H[0-9]+M$"),
        CONCAT(
          REPLACE(?durationStr, "^PT([0-9]+)H([0-9]+)M$", "$1"), " h ",
          REPLACE(?durationStr, "^PT([0-9]+)H([0-9]+)M$", "$2"), " min"
        ),
        IF(
          REGEX(?durationStr, "^PT[0-9]+M[0-9]+S$"),
          CONCAT(
            REPLACE(?durationStr, "^PT([0-9]+)M([0-9]+)S$", "$1"), " min ",
            REPLACE(?durationStr, "^PT([0-9]+)M([0-9]+)S$", "$2"), " s"
          ),
          IF(
            REGEX(?durationStr, "^PT[0-9]+H$"),
            CONCAT(REPLACE(?durationStr, "^PT([0-9]+)H$", "$1"), " h"),
            IF(
              REGEX(?durationStr, "^PT[0-9]+M$"),
              CONCAT(REPLACE(?durationStr, "^PT([0-9]+)M$", "$1"), " min"),
              IF(
                REGEX(?durationStr, "^PT[0-9]+S$"),
                CONCAT(REPLACE(?durationStr, "^PT([0-9]+)S$", "$1"), " s"),
                ?durationStr
              )
            )
          )
        )
      )
    ) AS ?duration__prefLabel
  )

  BIND(?id AS ?duration__id)
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
  # CREATES ARTWORK
  ?id ns1:createsArtwork ?createsArtwork__id .
  OPTIONAL { ?createsArtwork__id ns2:P1476 ?createsArtworkTitle }
  BIND(COALESCE(?createsArtworkTitle, STRAFTER(STR(?createsArtwork__id), "/")) AS ?createsArtwork__prefLabel)

  # LOCAL_ID
  BIND(REPLACE(STR(?createsArtwork__id), "^.*/", "") AS ?createsArtworkLocalId)

  # Data provider URL
  BIND(CONCAT("/visualArts/page/", ENCODE_FOR_URI(?createsArtworkLocalId), "/table") AS ?createsArtwork__dataProviderUrl)
  FILTER(LANG(?createsArtworkTitle) = "en")
}
UNION
{
 # USES ARTWORK
  ?id ns1:usesArtwork ?usesArtwork__id .
  OPTIONAL { ?usesArtwork__id ns2:P1476 ?usesArtworkTitle }
  FILTER(LANG(?usesArtworkTitle) = "en")
  
  BIND(COALESCE(?usesArtworkTitle, STRAFTER(STR(?usesArtwork__id), "/")) AS ?usesArtwork__prefLabel)

  OPTIONAL { ?usesArtwork__id a ?artworkClass . }

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
      IF(?artworkClass = ns1:TraditionalArtwork, "traditionalArtwork", "artwork") )
    AS ?artworkPerspective
  )

  BIND(REPLACE(STR(?usesArtwork__id), "^.*/", "") AS ?usesArtworkLocalId)

  BIND(
    CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?usesArtworkLocalId), "/table")
    AS ?usesArtwork__dataProviderUrl
  )
}
UNION
{
  # MATERIAL
  ?id ns2:P186 ?material__id .
  OPTIONAL { ?material__id rdfs:label ?materialLabel }
  BIND(COALESCE(?materialLabel, STR(?material__id)) AS ?material__prefLabel)
}
UNION
{
  # TOOL
  ?id ns1:madeUsingTool ?tool__id .
  OPTIONAL { ?tool__id rdfs:label ?toolLabel }
  BIND(COALESCE(?toolLabel, STR(?tool__id)) AS ?tool__prefLabel)
}
UNION
{
  # MUSICAL INSTRUMENT
  ?id ns2:P1303 ?musicalInstrument__id .
  OPTIONAL { ?musicalInstrument__id rdfs:label ?musicalInstrumentLabel }
  BIND(COALESCE(?musicalInstrumentLabel, STR(?musicalInstrument__id)) AS ?musicalInstrument__prefLabel)
}
UNION
{
  # MUSIC STYLE
  ?id ns1:hasMusicStyle ?musicStyle__id .
  OPTIONAL { ?musicStyle__id rdfs:label ?musicStyleLabel }
  BIND(COALESCE(?musicStyleLabel, STR(?musicStyle__id)) AS ?musicStyle__prefLabel)
}
UNION
{
  # SONG TITLE
  ?id ns1:hasSongTitle ?songTitle__id .
  OPTIONAL { ?songTitle__id rdfs:label ?songTitleLabel }
  BIND(COALESCE(?songTitleLabel, STR(?songTitle__id)) AS ?songTitle__prefLabel)
}
UNION
{
  # DEPICTS
  ?id ns2:P180 ?depicts__id .
  OPTIONAL { ?depicts__id rdfs:label ?depictsLabel }
  BIND(COALESCE(?depictsLabel, STR(?depicts__id)) AS ?depicts__prefLabel)
}
UNION
{
  # INSPIRED BY
  ?id ns2:P941 ?inspo__id .
  OPTIONAL { ?inspo__id rdfs:label ?inspoLabel }
  BIND(COALESCE(?inspoLabel, STR(?inspo__id)) AS ?inspo__prefLabel)
}
UNION
{
  # CHINESE CONCEPT
  ?id ns1:hasChineseConcept ?chico__id .
  OPTIONAL { ?chico__id rdfs:label ?chicoLabel }
  BIND(COALESCE(?chicoLabel, STR(?chico__id)) AS ?chico__prefLabel)
}
UNION
{
  # CHINESE VISUAL ELEMENT
  ?id ns1:hasChineseVisualElement ?chivise__id .
  OPTIONAL { ?chivise__id rdfs:label ?chiviseLabel }
  BIND(COALESCE(?chiviseLabel, STR(?chivise__id)) AS ?chivise__prefLabel)
}
UNION
{
  # PART OF SERIES
  ?id ns2:P179 ?partOfSeries__id .
  OPTIONAL { ?partOfSeries__id ns2:P1476 ?partOfSeriesTitle }
  BIND(COALESCE(?partOfSeriesTitle, STRAFTER(STR(?partOfSeries__id), "/")) AS ?partOfSeries__prefLabel)

  # LOCAL_ID
  BIND(REPLACE(STR(?partOfSeries__id), "^.*/", "") AS ?partOfSeriesLocalId)

  # Data provider URL
  BIND(CONCAT("/artworkSeries/page/", ENCODE_FOR_URI(?partOfSeriesLocalId), "/table") AS ?partOfSeries__dataProviderUrl)
  FILTER(LANG(?partOfSeriesTitle) = "en")
}  
UNION
{
  # HAS UNIT
  ?id ns1:hasUnit ?hasUnit__id .
  OPTIONAL { ?hasUnit__id ns1:attributedTitle ?hasUnitTitle }
  BIND(COALESCE(?hasUnitTitle, STRAFTER(STR(?hasUnit__id), "/")) AS ?hasUnit__prefLabel)

  # LOCAL_ID
  BIND(REPLACE(STR(?hasUnit__id), "^.*/", "") AS ?hasUnitLocalId)

  # Data provider URL
  BIND(CONCAT("/calliWritingUnit/page/", ENCODE_FOR_URI(?hasUnitLocalId), "/table") AS ?hasUnit__dataProviderUrl)
}
UNION
{
  # ORGANISER
  ?id ns2:P664 ?organiser__id .

  # LOCAL name dataset 
  OPTIONAL { ?organiser__id ns2:P2561 ?organiserName }

  # Wikidata / external label
  OPTIONAL { ?organiser__id rdfs:label ?organiserRdfsLabel . }
  BIND(COALESCE(?organiserName, ?organiserRdfsLabel, STRAFTER(STR(?organiser__id), "/")) AS ?organiser__prefLabel)
  BIND(STR(?organiser__id) AS ?organiserStr)

  # check if organiser is local
  BIND(STRSTARTS(?organiserStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/person/page/", REPLACE(?organiserStr, "^.*/", ""), "/table"), ?organiserStr) AS ?organiser__dataProviderUrl)
}  
UNION
{
  # EXHIBITION HISTORY
  ?id ns2:P608 ?exhibitionHistory__id .
  OPTIONAL { ?exhibitionHistory__id ns2:P1476 ?exhibitionHistoryTitle }
  BIND(COALESCE(?exhibitionHistoryTitle, STRAFTER(STR(?exhibitionHistory__id), "/")) AS ?exhibitionHistory__prefLabel)

  # LOCAL_ID
  BIND(REPLACE(STR(?exhibitionHistory__id), "^.*/", "") AS ?exhibitionHistoryLocalId)

  # Data provider URL
  BIND(CONCAT("/exhibition/page/", ENCODE_FOR_URI(?exhibitionHistoryLocalId), "/table") AS ?exhibitionHistory__dataProviderUrl)
  FILTER(LANG(?exhibitionHistoryTitle) = "en")
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

export const performingArtsImagesQuery = `
SELECT DISTINCT ?id ?titleLiteral ?img ?thumbnailUrl ?prefLabel__id ?prefLabel__prefLabel ?prefLabel__dataProviderUrl WHERE {
  <FILTER>

  ?performingArts a ns3:Q184485 .

  OPTIONAL { ?performingArts ns2:P1476 ?titleLiteral . }
  OPTIONAL { ?performingArts sch:thumbnailUrl ?thumbnailUrl . }

  OPTIONAL { ?performingArts ns1:imageList/rdf:first ?imgFromList . }
  OPTIONAL { ?performingArts ns1:image ?imgFromSet . }
  BIND(COALESCE(?imgFromList, ?imgFromSet) AS ?img)

  BIND(?performingArts AS ?id)

  # local id and internal link (same pattern as your properties block)
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?titleLiteral, STR(?id)) AS ?prefLabel__prefLabel)
  BIND(CONCAT("/performingArts/page/", ENCODE_FOR_URI(?localId), "/table") AS ?prefLabel__dataProviderUrl)

  FILTER(BOUND(?img))
}
ORDER BY ?titleLiteral
`
export const performingArtsCreationPlacesQuery = `
 SELECT ?id ?lat ?long ?label (COUNT(DISTINCT ?performingArts) AS ?instanceCount)
  WHERE {
  <FILTER>

  ?performingArts a ns3:Q184485 .

  ?performingArts ns2:P276 ?id .
  ?id ns2:P625 ?coord .

  OPTIONAL { ?id rdfs:label ?label . }

  BIND(STRAFTER(STR(?coord), "Point(") AS ?tmp)
  BIND(STRBEFORE(?tmp, ")") AS ?coords)

  BIND(xsd:decimal(STRBEFORE(?coords, " ")) AS ?long)
  BIND(xsd:decimal(STRAFTER(?coords, " ")) AS ?lat)
}
GROUP BY ?id ?lat ?long ?label
`

export const creationPlacePerformingArtsInfoWindow = `
{
  OPTIONAL { ?id rdfs:label ?placeLabel . }
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?placeLabel, STR(?id)) AS ?prefLabel__prefLabel)
}
`
export const performingArtsCreatedAtPlace = `
{
  <FILTER>

  ?related__id a ns3:Q184485 .
  ?related__id ns2:P276 ?id .

  OPTIONAL {
    ?related__id ns2:P1476 ?title .
    FILTER(lang(?title) = "en" || lang(?title) = "")
  }

  BIND(COALESCE(?title, STR(?related__id)) AS ?related__prefLabel)
  BIND(REPLACE(STR(?related__id), "^.*/", "") AS ?paLocalId)
  BIND(CONCAT("/performingArts/page/", ENCODE_FOR_URI(?paLocalId), "/table") AS ?related__dataProviderUrl)
}
`

export const performingArtsByDecade = `
  SELECT ?category (COUNT(DISTINCT ?instance) AS ?count) WHERE {
    ?instance ns2:P585 ?date .

    BIND(REPLACE(STR(?date), "T.*", "") AS ?dateLex)
    BIND(SUBSTR(?dateLex, 1, 4) AS ?yearStr)
    FILTER(STRLEN(?yearStr) = 4)

    BIND(xsd:integer(?yearStr) AS ?year)
    BIND(FLOOR(?year / 5) * 5 AS ?fiveYear)
    BIND(STR(?fiveYear) AS ?category)
  }
  GROUP BY ?category
  ORDER BY xsd:integer(?category)
`