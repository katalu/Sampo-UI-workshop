const perspectiveID = 'calliWritingUnit';

export const calliWritingUnitProperties = `
{
  ?id ns1:attributedTitle ?titleLiteral .

  # LOCAL_ID = last path segment of the URI (e.g., "1741")
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)

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
  # MEDIA
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
  # IS UNIT OF
  ?id ns1:isUnitOf ?isUnitOf__id .

  OPTIONAL {
    ?isUnitOf__id ns2:P1476 ?isUnitOfTitle .
    FILTER(LANG(?isUnitOfTitle) = "en")
  }

  BIND(COALESCE(?isUnitOfTitle, STRAFTER(STR(?isUnitOf__id), "/")) AS ?isUnitOf__prefLabel)

  # determine perspective
  ?isUnitOf__id a ?artworkClass .

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
    IF(?artworkClass = ns3:Q184485, "performingArts",
    IF(?artworkClass = ns3:Q17514, "graffitiArt",
    IF(?artworkClass = ns1:DecorativeAndAppliedArt, "decorativeAppliedArts",
      "VisualArts"
)))) AS ?artworkPerspective
  )

  # local id
  BIND(REPLACE(STR(?isUnitOf__id), "^.*/", "") AS ?isUnitOfLocalId)

  # correct internal route
  BIND(CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?isUnitOfLocalId), "/table")
    AS ?isUnitOf__dataProviderUrl)
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
  # SIGNIFICANCE
  ?id ns1:hasSignificance ?significanceLiteral .
  BIND(STR(?significanceLiteral) AS ?hasSignificance__id)
  BIND(?significanceLiteral AS ?hasSignificance__prefLabel) 
}  
UNION
{
  # WRITING SYSTEM
  ?id ns2:P282 ?writingSystem__id .
  OPTIONAL { ?writingSystem__id rdfs:label ?writingSystemLabel }
  BIND(COALESCE(?writingSystemLabel, STR(?writingSystem__id)) AS ?writingSystem__prefLabel)
}
UNION
{
  # CHARACTER FORM
  ?id ns1:hasCharacterForm ?hasCharacterForm__id .
  OPTIONAL { ?hasCharacterForm__id rdfs:label ?hasCharacterFormLabel }
  BIND(COALESCE(?hasCharacterFormLabel, STR(?hasCharacterForm__id)) AS ?hasCharacterForm__prefLabel)
}
UNION
{
  # SCRIPT STYLE
  ?id ns2:P9302 ?scriptStyle__id .
  OPTIONAL { ?scriptStyle__id rdfs:label ?scriptStyleLabel }
  BIND(COALESCE(?scriptStyleLabel, STR(?scriptStyle__id)) AS ?scriptStyle__prefLabel)
}
UNION
{
  # CALLIGRAPHIC LINE
  ?id ns1:hasCalligraphicLine ?hasCalligraphicLine .
  BIND(?id AS ?hasCalligraphicLine__id)
  BIND(IF(?hasCalligraphicLine = true, "present", "not present") AS ?hasCalligraphicLine__prefLabel)
}
UNION
{
  # DIRECTIONALITY
  ?id ns1:directionality ?directionalityLiteral .
  BIND(STR(?directionalityLiteral) AS ?directionality__id)
  BIND(?directionalityLiteral AS ?directionality__prefLabel)
}
UNION
{
  # LANGUAGE
  ?id ns2:P407 ?language__id .
  OPTIONAL { ?language__id rdfs:label ?languageLabel }
  BIND(COALESCE(?languageLabel, STR(?language__id)) AS ?language__prefLabel)
}
UNION 
{
  # TRANSCRIPTION AND TRANSLATION
  ?id ns1:transcriptionAndTranslation ?transLiteral .
  BIND(IF(LANG(?transLiteral) = "", "und", LANG(?transLiteral)) AS ?lang)

  # Make each value its own object by giving it a unique id.
  BIND(CONCAT(
    STR(?id),
    "#trans#",
    ?lang,
    "#len", STR(STRLEN(STR(?transLiteral))),
    "#",
    ENCODE_FOR_URI(SUBSTR(STR(?transLiteral), 1, 80))
  ) AS ?transcriptionAndTranslation__id)

  BIND(CONCAT(STR(?transLiteral), " [", ?lang, "]")
    AS ?transcriptionAndTranslation__prefLabel
  )
} 
UNION
{ 
  # NUMBER OF CHARACTERS
  ?id ns1:numberOfCharacters ?numberOfCharacters .

  OPTIONAL {
    << ?id ns1:numberOfCharacters ?numberOfCharacters >> ns1:accuracy "circa" .
    BIND(true AS ?numberOfCharactersIsCirca)
  }

  BIND(
    IF(
      BOUND(?numberOfCharactersIsCirca),
      CONCAT(STR(?numberOfCharacters), " ca."),
      STR(?numberOfCharacters)
    ) AS ?numberOfCharacters__prefLabel
  )
}
UNION
{ 
  # BASED ON
  ?id ns2:P144 ?basedOn__id .

  # LOCAL name dataset 
  OPTIONAL {
    ?basedOn__id ns2:P1476 ?basedOnTitle .
    FILTER(LANG(?basedOnTitle) = "en" || LANG(?basedOnTitle) = "")
  }

  # Wikidata / external label
  OPTIONAL {
    ?basedOn__id rdfs:label ?basedOnLabel .
    FILTER(LANG(?basedOnLabel) = "en" || LANG(?basedOnLabel) = "")
  }

  BIND(COALESCE(STR(?basedOnTitle), STR(?basedOnLabel), STRAFTER(STR(?basedOn__id), "/")) AS ?basedOn__prefLabel)
  BIND(STR(?basedOn__id) AS ?basedOnStr)

  # check if local
  BIND(STRSTARTS(?basedOnStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # local id
  BIND(REPLACE(?basedOnStr, "^.*/", "") AS ?basedOnLocalId)

  # choose internal perspective
  BIND(IF(EXISTS { ?basedOn__id a ns1:TraditionalArtwork }, "traditionalArtwork", "literaryWork") AS ?basedOnPerspective)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/", ?basedOnPerspective, "/page/", ?basedOnLocalId, "/table"), ?basedOnStr) AS ?basedOn__dataProviderUrl)
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
  # DEPICTS
  ?id ns2:P180 ?depicts__id .
  OPTIONAL { ?depicts__id rdfs:label ?depictsLabel }
  BIND(COALESCE(?depictsLabel, STR(?depicts__id)) AS ?depicts__prefLabel)
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
  # COLOUR
  ?id ns2:P462 ?colour__id .
  OPTIONAL { ?colour__id rdfs:label ?colourLabel }
  BIND(COALESCE(?colourLabel, STR(?colour__id)) AS ?colour__prefLabel)
}
UNION
{
  # BACKGROUND COLOUR
  ?id ns1:hasBackgroundColour ?hasBackgroundColour__id .
  OPTIONAL { ?hasBackgroundColour__id rdfs:label ?hasBackgroundColourLabel }
  BIND(COALESCE(?hasBackgroundColourLabel, STR(?hasBackgroundColour__id)) AS ?hasBackgroundColour__prefLabel)
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
  # GRAFFITI ART STYLE
  ?id ns1:hasGraffitiStyle ?graffitiArtStyle__id .
  OPTIONAL { ?graffitiArtStyle__id rdfs:label ?graffitiArtStyleLabel }
  BIND(COALESCE(?graffitiArtStyleLabel, STR(?graffitiArtStyle__id)) AS ?graffitiArtStyle__prefLabel)
}
UNION
{
  # TAG OF
  ?id ns1:isTagOf ?isTagOf__id .
  OPTIONAL { ?isTagOf__id ns2:P2561 ?isTagOfName 
      FILTER(LANG(?isTagOfName) = "")
  }
  BIND(STR(?isTagOf__id) AS ?isTagOfStr)
  BIND(REPLACE(?isTagOfStr, "^.*/", "") AS ?isTagOfLocalId)

  # local or external
  BIND(STRSTARTS(?isTagOfStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # classify resources
  BIND(
    IF(EXISTS { ?isTagOf__id a ns3:Q1400264 }, "artisticCollective",
      IF(EXISTS { ?isTagOf__id a ns3:Q43229 }, "organisation",
        IF(EXISTS { ?isTagOf__id a ns3:Q215627 }, "person", "agent")
      )
    )
    AS ?agentPerspective
  )

  # internal route for local entities, external URI for Wikidata entities
  BIND(
    IF(
      ?isLocal,
      CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?isTagOfLocalId), "/table"),
      ?isTagOfStr
    )
    AS ?isTagOf__dataProviderUrl
  )

  BIND(
    COALESCE(?isTagOfName, ?isTagOfRdfsLabel, STRAFTER(?isTagOfStr, "/"))
    AS ?isTagOf__prefLabel
  )
}  
UNION
{
  # RELATED UNIT
  ?id ns1:relatedUnit ?relatedUnit__id .
  OPTIONAL { ?relatedUnit__id ns1:attributedTitle ?relatedUnitTitle }
  BIND(COALESCE(?relatedUnitTitle, STRAFTER(STR(?relatedUnit__id), "/")) AS ?relatedUnit__prefLabel)

  # LOCAL_ID
  BIND(REPLACE(STR(?relatedUnit__id), "^.*/", "") AS ?relatedUnitLocalId)

  # Data provider URL
  BIND(CONCAT("/calliWritingUnit/page/", ENCODE_FOR_URI(?relatedUnitLocalId), "/table") AS ?relatedUnit__dataProviderUrl)
}
`
export const calliWritingUnitImagesQuery = `
SELECT DISTINCT ?id ?titleLiteral ?img ?prefLabel__id ?prefLabel__prefLabel ?prefLabel__dataProviderUrl WHERE {
  <FILTER>
  ?calliWritingUnit a ns1:CalliWritingUnit .
  OPTIONAL { ?calliWritingUnit ns1:attributedTitle ?titleLiteral . }

  OPTIONAL { ?calliWritingUnit ns1:imageList/rdf:first ?imgFromList . }
  OPTIONAL { ?calliWritingUnit ns1:image ?imgFromSet . }
  BIND(COALESCE(?imgFromList, ?imgFromSet) AS ?img)

  BIND(?calliWritingUnit AS ?id)

  # local id and internal link (same pattern as your properties block)
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?titleLiteral, STR(?id)) AS ?prefLabel__prefLabel)
  BIND(CONCAT("/calliWritingUnit/page/", ENCODE_FOR_URI(?localId), "/table") AS ?prefLabel__dataProviderUrl)

  FILTER(BOUND(?img))
}
ORDER BY ?titleLiteral
`
export const CWUbyColourQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?calliWritingUnit) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      ?calliWritingUnit ns2:P462 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      FILTER NOT EXISTS {
        ?calliWritingUnit ns2:P462 [] .
      }
      BIND("unknown" AS ?category)
      BIND("unknown" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`

export const CWUbyMaterialQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?calliWritingUnit) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      ?calliWritingUnit ns2:P186 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      FILTER NOT EXISTS {
        ?calliWritingUnit ns2:P186 [] .
      }
      BIND("digital artwork" AS ?category)
      BIND("digital artwork" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`
export const CWUbyToolQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?calliWritingUnit) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      ?calliWritingUnit ns1:madeUsingTool ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      FILTER NOT EXISTS {
        ?calliWritingUnit ns1:madeUsingTool [] .
      }
      BIND("digital artwork" AS ?category)
      BIND("digital artwork" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`
export const CWUbyWritingSystemQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?calliWritingUnit) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      ?calliWritingUnit ns2:P282 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      FILTER NOT EXISTS {
        ?calliWritingUnit ns2:P282 [] .
      }
      BIND("Unknown" AS ?category)
      BIND("Unknown" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`
export const CWUbyScriptStyleQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?calliWritingUnit) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      ?calliWritingUnit ns2:P9302 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
    UNION
    {
      ?calliWritingUnit a ns1:CalliWritingUnit .
      FILTER NOT EXISTS {
        ?calliWritingUnit ns2:P9302 [] .
      }
      BIND("unknown" AS ?category)
      BIND("unknown" AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`
     