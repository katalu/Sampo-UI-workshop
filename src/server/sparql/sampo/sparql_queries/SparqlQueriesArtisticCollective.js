const perspectiveID = 'artisticCollective';

export const artisticCollectiveProperties = `
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
  # ARISTIC COLLECTIVE TYPE
  ?id ns1:hasArtisticCollectiveType ?type__id .
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
  OPTIONAL { ?hasMember__id ns2:P2561 ?hasMemberName 
      FILTER(LANG(?hasMemberName) = "")
  }
  BIND(COALESCE(?hasMemberName, STRAFTER(STR(?hasMember__id), "/")) AS ?hasMember__prefLabel)

  # LOCAL_ID
  BIND(REPLACE(STR(?hasMember__id), "^.*/", "") AS ?hasMemberLocalId)

  # Data provider URL
  BIND(CONCAT("/person/page/", ENCODE_FOR_URI(?hasMemberLocalId), "/table") AS ?hasMember__dataProviderUrl)
} 
UNION
{
  # IS CREATOR OF
  ?id ns2:P800 ?isCreatorOf__id .
  OPTIONAL { ?isCreatorOf__id ns2:P1476 ?isCreatorOfTitle
        FILTER(LANG(?isCreatorOfTitle) = "en" ) }
  BIND(COALESCE(?isCreatorOfTitle, STRAFTER(STR(?isCreatorOf__id), "/")) AS ?isCreatorOf__prefLabel)

  OPTIONAL { ?isCreatorOf__id a ?artworkClass . }

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
      IF(?artworkClass = ns1:DecorativeAndAppliedArt, "decorativeAppliedArts", 
        IF(?artworkClass = ns3:Q184485, "performingArts",
          IF(?artworkClass = ns3:Q17514, "graffitiArt",
            IF(?artworkClass = ns3:Q7725310, "artworkSeries",
              IF(?artworkClass = ns1:TraditionalArtwork, "traditionalArtwork", "agent"))))))
    AS ?artworkPerspective
  )

  BIND(REPLACE(STR(?isCreatorOf__id), "^.*/", "") AS ?isCreatorOfLocalId)

  BIND(
    CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?isCreatorOfLocalId), "/table")
    AS ?isCreatorOf__dataProviderUrl
  )
}   
UNION
{
  # IS CALLIGRAPHER OF
  ?id ns1:isCalligrapherOf ?isCalligrapherOf__id .
  OPTIONAL { ?isCalligrapherOf__id ns2:P1476 ?isCalligrapherOfTitle
        FILTER(LANG(?isCalligrapherOfTitle) = "en" ) }
  BIND(COALESCE(?isCalligrapherOfTitle, STRAFTER(STR(?isCalligrapherOf__id), "/")) AS ?isCalligrapherOf__prefLabel)

  OPTIONAL { ?isCalligrapherOf__id a ?artworkClass . }

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
      IF(?artworkClass = ns1:DecorativeAndAppliedArt, "decorativeAppliedArts", 
        IF(?artworkClass = ns3:Q184485, "performingArts",
          IF(?artworkClass = ns3:Q17514, "graffitiArt",
            IF(?artworkClass = ns3:Q7725310, "artworkSeries", "agent")))))
    AS ?artworkPerspective
  )

  BIND(REPLACE(STR(?isCalligrapherOf__id), "^.*/", "") AS ?isCalligrapherOfLocalId)

  BIND(
    CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?isCalligrapherOfLocalId), "/table")
    AS ?isCalligrapherOf__dataProviderUrl
  )
}
UNION
{
  # IS PERFORMER OF
  ?id ns2:P453 ?isPerformerOf__id .
  OPTIONAL { ?isPerformerOf__id ns2:P1476 ?isPerformerOfTitle
      FILTER(LANG(?isPerformerOfTitle) = "en" ) }
  BIND(COALESCE(?isPerformerOfTitle, STRAFTER(STR(?isPerformerOf__id), "/")) AS ?isPerformerOf__prefLabel)

  # LOCAL_ID for performerOf
  BIND(REPLACE(STR(?isPerformerOf__id), "^.*/", "") AS ?isPerformerOfLocalId)

  # Internal path to Person perspective
  BIND(CONCAT("/performingArts/page/", ENCODE_FOR_URI(?isPerformerOfLocalId), "/table") AS ?isPerformerOf__dataProviderUrl)
}
UNION
{
  # IS DESIGNER OF
  ?id ns1:isDesignerOf ?isDesignerOf__id .
  OPTIONAL { ?isDesignerOf__id ns2:P1476 ?isDesignerOfTitle
        FILTER(LANG(?isDesignerOfTitle) = "en" ) }
  BIND(COALESCE(?isDesignerOfTitle, STRAFTER(STR(?isDesignerOf__id), "/")) AS ?isDesignerOf__prefLabel)

  OPTIONAL { ?isDesignerOf__id a ?artworkClass . }

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
      IF(?artworkClass = ns1:DecorativeAndAppliedArt, "decorativeAppliedArts", 
        IF(?artworkClass = ns3:Q184485, "performingArts",
          IF(?artworkClass = ns3:Q17514, "graffitiArt",
            IF(?artworkClass = ns3:Q7725310, "artworkSeries", "agent")))))
    AS ?artworkPerspective
  )

  BIND(REPLACE(STR(?isDesignerOf__id), "^.*/", "") AS ?isDesignerOfLocalId)

  BIND(
    CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?isDesignerOfLocalId), "/table")
    AS ?isDesignerOf__dataProviderUrl
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
