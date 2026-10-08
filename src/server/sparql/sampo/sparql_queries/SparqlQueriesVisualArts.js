const perspectiveID = 'visualArts'

export const visualArtsProperties = `
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
  # All titles (with language tags) for instance page
  ?id ns2:P1476 ?otherTitle .
  FILTER(LANG(?otherTitle) != "en")

  BIND(CONCAT(STR(?id), "#", LANG(?otherTitle)) AS ?titleOtherLang__id)
  BIND(CONCAT(STR(?otherTitle), " [", LANG(?otherTitle), "]") AS ?titleOtherLang__prefLabel)
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
  # CREATOR
  ?id ns2:P170 ?creator__id .
  OPTIONAL { ?creator__id ns2:P2561 ?creatorName
      FILTER(LANG(?creatorName) = "") }
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
  # VISUAL ART TYPE
  ?id ns1:hasArtworkType ?visualArtType__id .
  OPTIONAL { ?visualArtType__id rdfs:label ?visualArtTypeLabel }
  BIND(COALESCE(?visualArtTypeLabel, STR(?visualArtType__id)) AS ?visualArtType__prefLabel)
  BIND(STR(?visualArtType__id) AS ?visualArtType__dataProviderUrl)
}
UNION
{
  # DATE OF CREATION
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
          ?dateLex  # fallback: show as-is if format is unexpected
      )
     )
  ) AS ?date__prefLabel
)
BIND(?id AS ?date__id)
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
  BIND(STR(?tool__id) AS ?tool__dataProviderUrl)
}
UNION
{
  # WIDTH
  ?id ns2:P2049 ?widthLiteral .
  BIND(?widthLiteral AS ?width__prefLabel)
  BIND(?id AS ?width__id)
}
UNION
{
  # HEIGHT
  ?id ns2:P2048 ?heightLiteral .
  BIND(?heightLiteral AS ?height__prefLabel)
  BIND(?id AS ?height__id)
}
UNION
{
  # COLOUR
  ?id ns2:P462 ?colour__id .
  OPTIONAL { ?colour__id rdfs:label ?colourLabel }
  BIND(COALESCE(?colourLabel, STR(?colour__id)) AS ?colour__prefLabel)
}
UNION
{
  # HAS SEAL
  ?id ns1:hasSeal ?hasSealLiteral .
  BIND(?id AS ?hasSeal__id)
  BIND(IF(?hasSealLiteral = true, "present", "not present") AS ?hasSeal__prefLabel)
}
UNION
{
  # HAS COLOPHON
  ?id ns1:hasColophon ?hasColophonLiteral .
  BIND(?id AS ?hasColophon__id)
  BIND(IF(?hasColophonLiteral = true, "present", "not present") AS ?hasColophon__prefLabel)
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
      IF(?artworkClass = ns1:TraditionalArtwork, "traditionalArtwork",
        IF(?artworkClass = ns1:DecorativeAndAppliedArt, "decorativeAppliedArts", "artwork") ) )
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
  # DERIVES FROM
  ?id ns1:derivesFrom ?derivesFrom__id .
  OPTIONAL { ?derivesFrom__id ns2:P1476 ?derivesFromTitle }
  FILTER(LANG(?derivesFromTitle) = "en")
  BIND(COALESCE(?derivesFromTitle, STRAFTER(STR(?derivesFrom__id), "/")) AS ?derivesFrom__prefLabel)

  OPTIONAL { ?derivesFrom__id a ?artworkClass . }

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
      IF(?artworkClass = ns3:Q184485, "performingArts",
        IF(?artworkClass = ns1:DecorativeAndAppliedArt, "decorativeAppliedArts", "artwork") ) )
    AS ?artworkPerspective
  )

  BIND(REPLACE(STR(?derivesFrom__id), "^.*/", "") AS ?derivesFromLocalId)

  BIND(
    CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?derivesFromLocalId), "/table")
    AS ?derivesFrom__dataProviderUrl
  )
}    
UNION
{
  # VECTORISED OR DIGITISED
  ?id ns1:vectorisedOrDigitised ?vectorisedOrDigitisedLiteral .  
  BIND(?id AS ?vectorisedOrDigitised__id)
  BIND(IF(?vectorisedOrDigitisedLiteral = true, "yes", "no") AS ?vectorisedOrDigitised__prefLabel)
}
UNION
{
  # DEPICTS
  ?id ns2:P180 ?depicts__id .
  OPTIONAL { ?depicts__id rdfs:label ?depictsLabel }
  BIND(COALESCE(?depictsLabel, STR(?depicts__id)) AS ?depicts__prefLabel)
  BIND(STR(?depicts__id) AS ?depicts__dataProviderUrl)
}
UNION
{
  # INSPIRED BY
  ?id ns2:P941 ?inspiredBy__id .

  # LOCAL name dataset 
  OPTIONAL { ?inspiredBy__id ns2:P1476 ?inspiredByTitle
  FILTER(LANG(?inspiredByTitle) = "en")
  }

  # Wikidata / external label
  OPTIONAL { ?inspiredBy__id rdfs:label ?inspiredByLabel . }
  BIND(COALESCE(?inspiredByTitle, ?inspiredByLabel, STRAFTER(STR(?inspiredBy__id), "/")) AS ?inspiredBy__prefLabel)
  BIND(STR(?inspiredBy__id) AS ?inspiredByStr)

  # check if Literary work is local
  BIND(STRSTARTS(?inspiredByStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/literaryWork/page/", REPLACE(?inspiredByStr, "^.*/", ""), "/table"), ?inspiredByStr) AS ?inspiredBy__dataProviderUrl)

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
  # OWNER
  ?id ns2:P127 ?owner__id .
  OPTIONAL { ?owner__id rdfs:label ?ownerLabel }
  BIND(COALESCE(?ownerLabel, STR(?owner__id)) AS ?owner__prefLabel)
}
UNION
{
  # COMMISSIONER
  ?id ns2:P88 ?commissioner__id .
  OPTIONAL { ?commissioner__id rdfs:label ?commissionerLabel }
  BIND(COALESCE(?commissionerLabel, STR(?commissioner__id)) AS ?commissioner__prefLabel)
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
export const visualArtsImagesQuery = `
SELECT DISTINCT ?id ?titleLiteral ?img ?thumbnailUrl ?prefLabel__id ?prefLabel__prefLabel ?prefLabel__dataProviderUrl WHERE {
  <FILTER>

  ?visualArts a ns3:Q4502142 .

  OPTIONAL { ?visualArts ns2:P1476 ?titleLiteral . }
  OPTIONAL { ?visualArts sch:thumbnailUrl ?thumbnailUrl . }

  OPTIONAL { ?visualArts ns1:imageList/rdf:first ?imgFromList . }
  OPTIONAL { ?visualArts ns1:image ?imgFromSet . }
  BIND(COALESCE(?imgFromList, ?imgFromSet) AS ?img)

  BIND(?visualArts AS ?id)

  # local id and internal link (same pattern as your properties block)
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?titleLiteral, STR(?id)) AS ?prefLabel__prefLabel)
  BIND(CONCAT("/visualArts/page/", ENCODE_FOR_URI(?localId), "/table") AS ?prefLabel__dataProviderUrl)

  FILTER(BOUND(?img))
}
ORDER BY ?titleLiteral
`
export const visualArtsCreationPlacesQuery = `
 SELECT ?id ?lat ?long ?label (COUNT(DISTINCT ?visualArts) AS ?instanceCount)
  WHERE {
  <FILTER>

  ?visualArts a ns3:Q4502142 .

  ?visualArts ns2:P1071 ?id .
  ?id ns2:P625 ?coord .

  OPTIONAL { ?id rdfs:label ?label . }

  BIND(STRAFTER(STR(?coord), "Point(") AS ?tmp)
  BIND(STRBEFORE(?tmp, ")") AS ?coords)

  BIND(xsd:decimal(STRBEFORE(?coords, " ")) AS ?long)
  BIND(xsd:decimal(STRAFTER(?coords, " ")) AS ?lat)
}
GROUP BY ?id ?lat ?long ?label
`

export const creationPlaceVisualArtsInfoWindow = `
{
  OPTIONAL { ?id rdfs:label ?placeLabel . }
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?placeLabel, STR(?id)) AS ?prefLabel__prefLabel)
}
`
export const visualArtsCreatedAtPlace = `
{
  <FILTER>

  ?related__id a ns3:Q4502142 .
  ?related__id ns2:P1071 ?id .

  OPTIONAL {
    ?related__id ns2:P1476 ?title .
    FILTER(lang(?title) = "en" || lang(?title) = "")
  }

  BIND(COALESCE(?title, STR(?related__id)) AS ?related__prefLabel)
  BIND(REPLACE(STR(?related__id), "^.*/", "") AS ?vaLocalId)
  BIND(CONCAT("/visualArts/page/", ENCODE_FOR_URI(?vaLocalId), "/table") AS ?related__dataProviderUrl)
}
`

export const visualArtsByMaterialQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?visualArt) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?visualArt a ns3:Q4502142 .
      ?visualArt ns2:P186 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?visualArt a ns3:Q4502142 .
      FILTER NOT EXISTS {
        ?visualArt ns2:P186 [] .
      }
      BIND("digital artwork" AS ?category)
      BIND("digital artwork" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const visualArtsByToolQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?visualArt) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?visualArt a ns3:Q4502142 .
      ?visualArt ns1:madeUsingTool ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?visualArt a ns3:Q4502142 .
      FILTER NOT EXISTS {
        ?visualArt ns1:madeUsingTool [] .
      }
      BIND("digital artwork" AS ?category)
      BIND("digital artwork" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`
