const perspectiveID = 'graffitiArt'

export const graffitiArtProperties = `
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
  # DESCRIPTION
  ?id ns1:description ?descLiteral .
  BIND(?descLiteral AS ?description__prefLabel)
  BIND(?id AS ?description__id)
}  
UNION
{
  # CREATOR
  ?id ns2:P170 ?creator__id .

  OPTIONAL {
    ?creator__id ns2:P2561 ?creatorName .
    FILTER(LANG(?creatorName) = "")
  }
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
  # GRAFFITI ART TYPE
  ?id ns1:hasGraffitiType ?graffitiArtType__id .
  OPTIONAL { ?graffitiArtType__id rdfs:label ?graffitiArtTypeLabel }
  BIND(COALESCE(?graffitiArtTypeLabel, STR(?graffitiArtType__id)) AS ?graffitiArtType__prefLabel)
  BIND(STR(?graffitiArtType__id) AS ?graffitiArtType__dataProviderUrl) 
}
UNION
{
  # GRAFFITI ART STYLE
  ?id ns1:hasGraffitiStyle ?graffitiArtStyle__id .
  OPTIONAL { ?graffitiArtStyle__id rdfs:label ?graffitiArtStyleLabel }
  BIND(COALESCE(?graffitiArtStyleLabel, STR(?graffitiArtStyle__id)) AS ?graffitiArtStyle__prefLabel)
  BIND(STR(?graffitiArtStyle__id) AS ?graffitiArtStyle__dataProviderUrl)
}
UNION
{
  # GRAFFITI ART GENRE
  ?id ns1:hasGraffitiGenre ?graffitiArtGenre__id .
  OPTIONAL { ?graffitiArtGenre__id rdfs:label ?graffitiArtGenreLabel }
  BIND(COALESCE(?graffitiArtGenreLabel, STR(?graffitiArtGenre__id)) AS ?graffitiArtGenre__prefLabel)
  BIND(STR(?graffitiArtGenre__id) AS ?graffitiArtGenre__dataProviderUrl)
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
  # LOCATION 
  ?id ns2:P276 ?location__id .
  OPTIONAL { ?location__id rdfs:label ?locationLabel }
  BIND(COALESCE(?locationLabel, STR(?location__id)) AS ?location__prefLabel)
}
UNION
{
  # STREET ADDRESS 
  ?id ns2:P6375 ?address__id .
  OPTIONAL { ?address__id rdfs:label ?addressLabel }
  BIND(COALESCE(?addressLabel, STR(?address__id)) AS ?address__prefLabel)
}
UNION
{
  # MATERIAL
  ?id ns2:P186 ?material__id .
  OPTIONAL { ?material__id rdfs:label ?materialLabel }
  BIND(COALESCE(?materialLabel, STR(?material__id)) AS ?material__prefLabel)
  BIND(STR(?material__id) AS ?material__dataProviderUrl)
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
}
UNION
{
  # INSPIRED BY
  ?id ns2:P941 ?inspiredBy__id .

  # LOCAL name dataset 
  OPTIONAL { ?inspiredBy__id ns2:P1476 ?inspiredByTitle 
  FILTER(LANG(?inspiredByTitle) = "en") }

  # Wikidata / external label
  OPTIONAL { ?inspiredBy__id rdfs:label ?inspiredByRdfsLabel . }
  BIND(COALESCE(?inspiredByTitle, ?inspiredByRdfsLabel, STRAFTER(STR(?inspiredBy__id), "/")) AS ?inspiredBy__prefLabel)
  BIND(STR(?inspiredBy__id) AS ?inspiredByStr)

  # check if inspired by is local
  BIND(STRSTARTS(?inspiredByStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/traditionalArtwork/page/", REPLACE(?inspiredByStr, "^.*/", ""), "/table"), ?inspiredByStr) AS ?inspiredBy__dataProviderUrl)

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
  BIND(CONCAT("/seriesOfArtworks/page/", ENCODE_FOR_URI(?partOfSeriesLocalId), "/table") AS ?partOfSeries__dataProviderUrl)
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
  # COMMISSIONER
  ?id ns2:P88 ?commissioner__id .
  OPTIONAL { ?commissioner__id rdfs:label ?commissionerLabel }
  BIND(COALESCE(?commissionerLabel, STR(?commissioner__id)) AS ?commissioner__prefLabel)
  BIND(STR(?commissioner__id) AS ?commissioner__dataProviderUrl)
}
`
export const graffitiArtImagesQuery = `
SELECT DISTINCT ?id ?titleLiteral ?img ?thumbnailUrl ?prefLabel__id ?prefLabel__prefLabel ?prefLabel__dataProviderUrl WHERE {
  <FILTER>

  ?graffitiArt a ns3:Q17514 .

  OPTIONAL { ?graffitiArt ns2:P1476 ?titleLiteral . }
  OPTIONAL { ?graffitiArt sch:thumbnailUrl ?thumbnailUrl . }

  OPTIONAL { ?graffitiArt ns1:imageList/rdf:first ?imgFromList . }
  OPTIONAL { ?graffitiArt ns1:image ?imgFromSet . }
  BIND(COALESCE(?imgFromList, ?imgFromSet) AS ?img)

  BIND(?graffitiArt AS ?id)

  # local id and internal link (same pattern as your properties block)
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?titleLiteral, STR(?id)) AS ?prefLabel__prefLabel)
  BIND(CONCAT("/graffitiArt/page/", ENCODE_FOR_URI(?localId), "/table") AS ?prefLabel__dataProviderUrl)

  FILTER(BOUND(?img))
}
ORDER BY ?titleLiteral
`
export const graffitiArtCreationPlacesQuery = `
 SELECT ?id ?lat ?long ?label (COUNT(DISTINCT ?graffitiArt) AS ?instanceCount)
  WHERE {
  <FILTER>

  ?graffitiArt a ns3:Q17514 .

  ?graffitiArt ns2:P276 ?id .
  ?id ns2:P625 ?coord .

  OPTIONAL { ?id rdfs:label ?label . }

  BIND(STRAFTER(STR(?coord), "Point(") AS ?tmp)
  BIND(STRBEFORE(?tmp, ")") AS ?coords)

  BIND(xsd:decimal(STRBEFORE(?coords, " ")) AS ?long)
  BIND(xsd:decimal(STRAFTER(?coords, " ")) AS ?lat)
}
GROUP BY ?id ?lat ?long ?label
`

export const creationPlaceGraffitiArtInfoWindow = `
{
  OPTIONAL { ?id rdfs:label ?placeLabel . }
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?placeLabel, STR(?id)) AS ?prefLabel__prefLabel)
}
`
export const graffitiArtCreatedAtPlace = `
{
  <FILTER>

  ?related__id a ns3:Q17514 .
  ?related__id ns2:P276 ?id .

  OPTIONAL {
    ?related__id ns2:P1476 ?title .
    FILTER(lang(?title) = "en" || lang(?title) = "")
  }

  BIND(COALESCE(?title, STR(?related__id)) AS ?related__prefLabel)
  BIND(REPLACE(STR(?related__id), "^.*/", "") AS ?grLocalId)
  BIND(CONCAT("/graffitiArt/page/", ENCODE_FOR_URI(?grLocalId), "/table") AS ?related__dataProviderUrl)
}
`
export const graffitiArtByMaterialQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?graffitiArt) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?graffitiArt a ns3:Q17514 .
      ?graffitiArt ns2:P186 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?graffitiArt a ns3:Q17514 .
      FILTER NOT EXISTS {
        ?graffitiArt ns2:P186 [] .
      }
      BIND("unknown" AS ?category)
      BIND("unknown" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const graffitiArtByToolQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?graffitiArt) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?graffitiArt a ns3:Q17514 .
      ?graffitiArt ns1:madeUsingTool ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?graffitiArt a ns3:Q17514 .
      FILTER NOT EXISTS {
        ?graffitiArt ns1:madeUsingTool [] .
      }
      BIND("unknown" AS ?category)
      BIND("unknown" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`