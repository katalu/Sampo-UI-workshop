const perspectiveID = 'decorativeAppliedArts'

export const decorativeAppliedArtsProperties = `
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
  # DESCRIPTION
  ?id ns1:description ?descLiteral .
  BIND(?descLiteral AS ?description__prefLabel)
  BIND(?id AS ?description__id)
}  
UNION
{
  # MANUFACTURER
  ?id ns2:P176 ?manufacturer__id .

  # LOCAL name dataset 
  OPTIONAL { ?manufacturer__id ns2:P2561 ?manufacturerName }

  # Wikidata / external label
  OPTIONAL { ?manufacturer__id rdfs:label ?manufacturerRdfsLabel . }
  BIND(COALESCE(?manufacturerName, ?manufacturerRdfsLabel, STRAFTER(STR(?manufacturer__id), "/")) AS ?manufacturer__prefLabel)
  BIND(STR(?manufacturer__id) AS ?manufacturerStr)

  # check if manufacturer is local
  BIND(STRSTARTS(?manufacturerStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/person/page/", REPLACE(?manufacturerStr, "^.*/", ""), "/table"), ?manufacturerStr) AS ?manufacturer__dataProviderUrl)
}
UNION
{
  # DESIGNER
  ?id ns2:P287 ?designer__id .

  # Local dataset name
  OPTIONAL { ?designer__id ns2:P2561 ?designerName }

  # External / Wikidata label
  OPTIONAL {
    ?designer__id rdfs:label ?designerRdfsLabel .
    FILTER(LANG(?designerRdfsLabel) = "en" || LANG(?designerRdfsLabel) = "")
  }

  BIND(STR(?designer__id) AS ?designerStr)
  BIND(REPLACE(?designerStr, "^.*/", "") AS ?designerLocalId)

  # local or external
  BIND(STRSTARTS(?designerStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # classify resources
  BIND(
    IF(EXISTS { ?designer__id a ns3:Q1400264 }, "artisticCollective",
      IF(EXISTS { ?designer__id a ns3:Q43229 }, "organisation",
        IF(EXISTS { ?designer__id a ns3:Q215627 }, "person", "agent")
      )
    )
    AS ?agentPerspective
  )

  # internal route for local entities, external URI for Wikidata entities
  BIND(
    IF(
      ?isLocal,
      CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?designerLocalId), "/table"),
      ?designerStr
    )
    AS ?designer__dataProviderUrl
  )

  BIND(
    COALESCE(?designerName, ?designerRdfsLabel, STRAFTER(?designerStr, "/"))
    AS ?designer__prefLabel
  )
}
UNION
{
  # CALLIGRAPHER
  ?id ns1:calligrapher ?calligrapher__id .

  # LOCAL name dataset 
  OPTIONAL { ?calligrapher__id ns2:P2561 ?calligrapherName }

  # Wikidata / external label
  OPTIONAL { ?calligrapher__id rdfs:label ?calligrapherRdfsLabel . }
  BIND(COALESCE(?calligrapherName, ?calligrapherRdfsLabel, STRAFTER(STR(?calligrapher__id), "/")) AS ?calligrapher__prefLabel)
  BIND(STR(?calligrapher__id) AS ?calligrapherStr)

  # check if calligrapher is local
  BIND(STRSTARTS(?calligrapherStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/person/page/", REPLACE(?calligrapherStr, "^.*/", ""), "/table"), ?calligrapherStr) AS ?calligrapher__dataProviderUrl)
}
UNION
{
  # ARCHITECT
  ?id ns2:P84 ?architect__id .

  # LOCAL name dataset 
  OPTIONAL { ?architect__id ns2:P2561 ?architectName }

  # External / Wikidata label
  OPTIONAL {
    ?architect__id rdfs:label ?architectRdfsLabel .
    FILTER(LANG(?architectRdfsLabel) = "en" || LANG(?architectRdfsLabel) = "")
  }

  BIND(STR(?architect__id) AS ?architectStr)
  BIND(REPLACE(?architectStr, "^.*/", "") AS ?architectLocalId)

  # local or external
  BIND(STRSTARTS(?architectStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # classify resources
  BIND(
    IF(EXISTS { ?architect__id a ns3:Q1400264 }, "artisticCollective",
      IF(EXISTS { ?architect__id a ns3:Q43229 }, "organisation",
        IF(EXISTS { ?architect__id a ns3:Q215627 }, "person", "agent")
      )
    )
    AS ?agentPerspective
  )

  # internal route for local entities, external URI for Wikidata entities
  BIND(
    IF(
      ?isLocal,
      CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?architectLocalId), "/table"),
      ?architectStr
    )
    AS ?architect__dataProviderUrl
  )

  BIND(
    COALESCE(?architectName, ?architectRdfsLabel, STRAFTER(?architectStr, "/"))
    AS ?architect__prefLabel
  )
}
UNION
{
  # PRICE
  ?id ns2:P2284 ?priceLiteral .
  BIND(?priceLiteral AS ?price__prefLabel)
  BIND(?id AS ?price__id)
}
UNION
{
  # DECORATIVE APPLIED ART TYPE
  ?id ns1:hasProductType ?productType__id .
  OPTIONAL { ?productType__id rdfs:label ?productTypeLabel }
  BIND(COALESCE(?productTypeLabel, STR(?productType__id)) AS ?productType__prefLabel)
  BIND(STR(?productType__id) AS ?productType__dataProviderUrl) 
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
  # VECTORISED OR DIGITISED
  ?id ns1:vectorisedOrDigitised ?vectorisedOrDigitisedLiteral .  
  BIND(?id AS ?vectorisedOrDigitised__id)
  BIND(IF(?vectorisedOrDigitisedLiteral = true, "yes", "no") AS ?vectorisedOrDigitised__prefLabel)
}
UNION
{
  # HAS CHINESE CONCEPT
  ?id ns1:hasChineseConcept ?hasChineseConcept__id .
  OPTIONAL { ?hasChineseConcept__id rdfs:label ?hasChineseConceptLabel }
  BIND(COALESCE(?hasChineseConceptLabel, STR(?hasChineseConcept__id)) AS ?hasChineseConcept__prefLabel)
  BIND(STR(?hasChineseConcept__id) AS ?hasChineseConcept__dataProviderUrl)
}
UNION
{
  # HAS CHINESE VISUAL ELEMENT
  ?id ns1:hasChineseVisualElement ?hasChineseVisualElement__id .
  OPTIONAL { ?hasChineseVisualElement__id rdfs:label ?hasChineseVisualElementLabel }
  BIND(COALESCE(?hasChineseVisualElementLabel, STR(?hasChineseVisualElement__id)) AS ?hasChineseVisualElement__prefLabel)
  BIND(STR(?hasChineseVisualElement__id) AS ?hasChineseVisualElement__dataProviderUrl)
}
UNION
{
  # HAS OTHER VISUAL ELEMENT
  ?id ns1:hasOtherVisualElement ?hasOtherVisualElement__id .
  OPTIONAL { ?hasOtherVisualElement__id rdfs:label ?hasOtherVisualElementLabel }
  BIND(COALESCE(?hasOtherVisualElementLabel, STR(?hasOtherVisualElement__id)) AS ?hasOtherVisualElement__prefLabel)
  BIND(STR(?hasOtherVisualElement__id) AS ?hasOtherVisualElement__dataProviderUrl)
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
{
  # DERIVES FROM
  ?id ns1:derivesFrom ?derivesFrom__id .
  OPTIONAL { ?derivesFrom__id ns2:P1476 ?derivesFromTitle }
  FILTER(LANG(?derivesFromTitle) = "en")
  BIND(COALESCE(?derivesFromTitle, STRAFTER(STR(?derivesFrom__id), "/")) AS ?derivesFrom__prefLabel)

  OPTIONAL { ?derivesFrom__id a ?artworkClass . }

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
      IF(?artworkClass = ns3:Q184485, "performingArts", "artwork") ) 
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
export const decAppArtsImagesQuery = `
SELECT DISTINCT ?id ?titleLiteral ?img ?thumbnailUrl ?prefLabel__id ?prefLabel__prefLabel ?prefLabel__dataProviderUrl WHERE {
  <FILTER>

  ?decorativeAppliedArts a ns1:DecorativeAndAppliedArt .

  OPTIONAL { ?decorativeAppliedArts ns2:P1476 ?titleLiteral . }
  OPTIONAL { ?decorativeAppliedArts sch:thumbnailUrl ?thumbnailUrl . }

  OPTIONAL { ?decorativeAppliedArts ns1:imageList/rdf:first ?imgFromList . }
  OPTIONAL { ?decorativeAppliedArts ns1:image ?imgFromSet . }
  BIND(COALESCE(?imgFromList, ?imgFromSet) AS ?img)

  BIND(?decorativeAppliedArts AS ?id)

  # local id and internal link (same pattern as your properties block)
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?titleLiteral, STR(?id)) AS ?prefLabel__prefLabel)
  BIND(CONCAT("/decorativeAppliedArts/page/", ENCODE_FOR_URI(?localId), "/table") AS ?prefLabel__dataProviderUrl)

  FILTER(BOUND(?img))
}
ORDER BY ?titleLiteral
`

export const decorativeAppliedArtsCreationPlacesQuery = `
SELECT ?id ?lat ?long ?label (COUNT(DISTINCT ?decorativeAppliedArts) AS ?instanceCount)
WHERE {
  <FILTER>

  ?decorativeAppliedArts a ns1:DecorativeAndAppliedArt .

  ?decorativeAppliedArts ns2:P1071 ?id .
  ?id ns2:P625 ?coord .
  OPTIONAL { ?id rdfs:label ?label . }

  BIND(STRAFTER(STR(?coord), "Point(") AS ?tmp)
  BIND(STRBEFORE(?tmp, ")") AS ?coords)
  BIND(xsd:decimal(STRBEFORE(?coords, " ")) AS ?long)
  BIND(xsd:decimal(STRAFTER(?coords, " ")) AS ?lat)
}
GROUP BY ?id ?lat ?long ?label
`

export const creationPlaceDecorativeAppliedArtsInfoWindow = `
{
  OPTIONAL { ?id rdfs:label ?placeLabel . }
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?placeLabel, STR(?id)) AS ?prefLabel__prefLabel)
}
`
export const decorativeAppliedArtsCreatedAtPlace = `
{
  <FILTER>

  ?related__id a ns1:DecorativeAndAppliedArt .
  ?related__id ns2:P1071 ?id .

  OPTIONAL {
    ?related__id ns2:P1476 ?title .
    FILTER(lang(?title) = "en" || lang(?title) = "")
  }

  BIND(COALESCE(?title, STR(?related__id)) AS ?related__prefLabel)
  BIND(REPLACE(STR(?related__id), "^.*/", "") AS ?daLocalId)
  BIND(CONCAT("/decorativeAppliedArts/page/", ENCODE_FOR_URI(?daLocalId), "/table") AS ?related__dataProviderUrl)
}
`

export const decorativeAppliedArtsByMaterialQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?decorativeAppliedArts) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?decorativeAppliedArts a ns1:DecorativeAndAppliedArt .
      ?decorativeAppliedArts ns2:P186 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?decorativeAppliedArts a ns1:DecorativeAndAppliedArt .
      FILTER NOT EXISTS {
        ?decorativeAppliedArts ns2:P186 [] .
      }
      BIND("digital artwork" AS ?category)
      BIND("digital artwork" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const decorativeAppliedArtsByToolQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?decorativeAppliedArts) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?decorativeAppliedArts a ns1:DecorativeAndAppliedArt .
      ?decorativeAppliedArts ns2:P186 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?decorativeAppliedArts a ns1:DecorativeAndAppliedArt .
      FILTER NOT EXISTS {
        ?decorativeAppliedArts ns2:P186 [] .
      }
      BIND("digital artwork" AS ?category)
      BIND("digital artwork" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`