const perspectiveID = 'person'

export const personProperties = `
{
  # Name (prefLabel): only the name without a language tag
  ?id ns2:P2561 ?nameLiteral .
  FILTER(LANG(?nameLiteral) = "")

  FILTER NOT EXISTS {
    ?id ns2:P2561 ?otherNameNoLang .
    FILTER(LANG(?otherNameNoLang) = "")
    FILTER(STR(?otherNameNoLang) < STR(?nameLiteral))
  }

  # LOCAL_ID = last path segment of the URI
  BIND(REPLACE(STR(?id), "^.*/", "") AS ?localId)

  # uri (object)
  BIND(?id AS ?uri__id)
  BIND(STR(?id) AS ?uri__prefLabel)
  BIND(CONCAT("http://wendang-project.github.io/data/item/", ENCODE_FOR_URI(?localId)) AS ?uri__dataProviderUrl)

  # prefLabel (object)
  BIND(?id AS ?prefLabel__id)
  BIND(STR(?nameLiteral) AS ?prefLabel__prefLabel)
  BIND(CONCAT("/${perspectiveID}/page/", ENCODE_FOR_URI(?localId), "/table") AS ?prefLabel__dataProviderUrl)
}
UNION
{
  # Other names: only those with language tags
  ?id ns2:P2561 ?otherName .
  FILTER(LANG(?otherName) != "")

  BIND(CONCAT(STR(?id), "#", LANG(?otherName), "-", ENCODE_FOR_URI(STR(?otherName))) AS ?otherName__id)
  BIND(CONCAT(STR(?otherName), " [", LANG(?otherName), "]") AS ?otherName__prefLabel)
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
  # TAG
  ?id ns1:hasTag ?tagLiteral .

  BIND(IF(LANG(?tagLiteral) = "", "und", LANG(?tagLiteral)) AS ?tagLang)
  BIND(CONCAT(STR(?id),"#tag#",?tagLang,"#len", STR(STRLEN(STR(?tagLiteral))),"#",ENCODE_FOR_URI(SUBSTR(STR(?tagLiteral), 1, 60))
  ) AS ?tag__id)
  BIND(CONCAT(STR(?tagLiteral), " [", ?tagLang, "]") AS ?tag__prefLabel)
}  
UNION
{
  # PSEUDONYM
  ?id ns2:P742 ?pseudonymLiteral .

  BIND(CONCAT(STR(?id),"#pseudonym#len", STR(STRLEN(STR(?pseudonymLiteral))),"#",ENCODE_FOR_URI(SUBSTR(STR(?pseudonymLiteral), 1, 60))
  ) AS ?pseudonym__id)
  BIND(STR(?pseudonymLiteral) AS ?pseudonym__prefLabel)
}  
UNION
{
  # ROLE
  ?id ns2:P106 ?role__id .
  OPTIONAL { ?role__id rdfs:label ?roleLabel }
  BIND(COALESCE(?roleLabel, STR(?role__id)) AS ?role__prefLabel)
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
  # GENDER
  ?id ns2:P21 ?gender__id .
  OPTIONAL { ?gender__id rdfs:label ?genderLabel }
  BIND(COALESCE(?genderLabel, STR(?gender__id)) AS ?gender__prefLabel)
}
UNION
{
  # BIRTH DATE
  ?id ns2:P569 ?birthDate .
  BIND(STR(?birthDate) AS ?bstr)
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
  ) AS ?birthDate__prefLabel
)
BIND(?id AS ?birthDate__id)
}
UNION
{
  # BIRTH PLACE
  ?id ns2:P19 ?birthPlace__id .
  OPTIONAL { ?birthPlace__id rdfs:label ?birthPlaceLabel }
  BIND(COALESCE(?birthPlaceLabel, STR(?birthPlace__id)) AS ?birthPlace__prefLabel)
}
UNION
{
  # COUNTRY OF CITIZENSHIP
  ?id ns2:P27 ?countryOfCitizenship__id .
  OPTIONAL { ?countryOfCitizenship__id rdfs:label ?countryOfCitizenshipLabel }
  BIND(COALESCE(?countryOfCitizenshipLabel, STR(?countryOfCitizenship__id)) AS ?countryOfCitizenship__prefLabel)
}
UNION
{
  # DEATH DATE
  ?id ns2:P570 ?deathDate .
  BIND(STR(?deathDate) AS ?dstr)
  BIND(REPLACE(?dstr, "T.*", "") AS ?dateLex)  # e.g., 1950-05-12T00:00:00Z -> 1950-05-12
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
    ) AS ?deathDate__prefLabel
)
BIND(?id AS ?deathDate__id)
}
UNION
{
  # DEATH PLACE
  ?id ns2:P20 ?deathPlace__id .
  OPTIONAL { ?deathPlace__id rdfs:label ?deathPlaceLabel }
  BIND(COALESCE(?deathPlaceLabel, STR(?deathPlace__id)) AS ?deathPlace__prefLabel)
}  
UNION
{
  # PLACE OF ACTIVITY
  ?id ns2:P937 ?placeOfActivity__id .
  OPTIONAL { ?placeOfActivity__id rdfs:label ?placeOfActivityLabel }
  BIND(COALESCE(?placeOfActivityLabel, STR(?placeOfActivity__id)) AS ?placeOfActivity__prefLabel)
} 
UNION
{
  # NATIVE LANGUAGE
  ?id ns2:P103 ?nativeLanguage__id .
  OPTIONAL { ?nativeLanguage__id rdfs:label ?nativeLanguageLabel }
  BIND(COALESCE(?nativeLanguageLabel, STR(?nativeLanguage__id)) AS ?nativeLanguage__prefLabel)
}
UNION
{
  # OTHER LANGUAGES (USES LANGUAGE)
  ?id ns2:P1412 ?usesLanguage__id .
  OPTIONAL { ?usesLanguage__id rdfs:label ?usesLanguageLabel }
  BIND(COALESCE(?usesLanguageLabel, STR(?usesLanguage__id)) AS ?usesLanguage__prefLabel)
}
UNION
{
  # FIELD OF STUDY
  ?id ns2:P812 ?fieldOfStudy__id .
  OPTIONAL { ?fieldOfStudy__id rdfs:label ?fieldOfStudyLabel }
  BIND(COALESCE(?fieldOfStudyLabel, STR(?fieldOfStudy__id)) AS ?fieldOfStudy__prefLabel)
}
UNION
{
  # CALLIGRAPHIC TRAINING
  ?id ns1:hasCalligraphicTraining ?calligraphicTraining__id .
  BIND(STR(?calligraphicTraining__id) AS ?calligraphicTraining__prefLabel)
}   
UNION
{
  # IS MEMBER OF
  ?id ns2:P361 ?isMemberOf__id .
  OPTIONAL { ?isMemberOf__id ns2:P2561 ?isMemberOfTitle }
  BIND(COALESCE(?isMemberOfTitle, STRAFTER(STR(?isMemberOf__id), "/")) AS ?isMemberOf__prefLabel)

  OPTIONAL { ?isMemberOf__id a ?agentClass . }

  BIND(
    IF(?agentClass = ns3:Q1400264, "artisticCollective",
      IF(?agentClass = ns3:Q43229, "organisation", "agent") )
    AS ?agentPerspective
  )

  BIND(REPLACE(STR(?isMemberOf__id), "^.*/", "") AS ?isMemberOfLocalId)

  BIND(
    CONCAT("/", ?agentPerspective, "/page/", ENCODE_FOR_URI(?isMemberOfLocalId), "/table")
    AS ?isMemberOf__dataProviderUrl
  )
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
  # IS CURATOR OF
  ?id ns1:isCuratorOf ?isCuratorOf__id .
  OPTIONAL { ?isCuratorOf__id ns2:P1476 ?isCuratorOfTitle
        FILTER(LANG(?isCuratorOfTitle) = "en" ) }
  BIND(COALESCE(?isCuratorOfTitle, STRAFTER(STR(?isCuratorOf__id), "/")) AS ?isCuratorOf__prefLabel)

  OPTIONAL { ?isCuratorOf__id a ?artworkClass . }

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
      IF(?artworkClass = ns1:DecorativeAndAppliedArt, "decorativeAppliedArts", 
        IF(?artworkClass = ns3:Q184485, "performingArts",
          IF(?artworkClass = ns3:Q17514, "graffitiArt",
            IF(?artworkClass = ns3:Q7725310, "artworkSeries", 
              IF(?artworkClass = ns3:Q464980, "exhibition", "agent"))))))
    AS ?artworkPerspective
  )

  BIND(REPLACE(STR(?isCuratorOf__id), "^.*/", "") AS ?isCuratorOfLocalId)

  BIND(
    CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?isCuratorOfLocalId), "/table")
    AS ?isCuratorOf__dataProviderUrl
  )
}    
UNION
{
  # IS COMPOSER OF
  ?id ns1:isComposerOf ?isComposerOf__id .
  OPTIONAL { ?isComposerOf__id ns2:P1476 ?isComposerOfTitle
        FILTER(LANG(?isComposerOfTitle) = "en" ) }
  BIND(COALESCE(?isComposerOfTitle, STRAFTER(STR(?isComposerOf__id), "/")) AS ?isComposerOf__prefLabel)

  OPTIONAL { ?isComposerOf__id a ?artworkClass . }

  BIND(
    IF(?artworkClass = ns3:Q4502142, "visualArts",
      IF(?artworkClass = ns1:DecorativeAndAppliedArt, "decorativeAppliedArts", 
        IF(?artworkClass = ns3:Q184485, "performingArts",
          IF(?artworkClass = ns3:Q17514, "graffitiArt",
            IF(?artworkClass = ns3:Q7725310, "artworkSeries", "agent")))))
    AS ?artworkPerspective
  )

  BIND(REPLACE(STR(?isComposerOf__id), "^.*/", "") AS ?isComposerOfLocalId)

  BIND(
    CONCAT("/", ?artworkPerspective, "/page/", ENCODE_FOR_URI(?isComposerOfLocalId), "/table")
    AS ?isComposerOf__dataProviderUrl
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
export const peopleWorkPlacesQuery = `
  SELECT ?id ?lat ?long ?label (COUNT(DISTINCT ?person) AS ?instanceCount)
  WHERE {
  <FILTER>

  ?person ns2:P937 ?id .
  ?id ns2:P625 ?coord .

  OPTIONAL { ?id rdfs:label ?label . }

  BIND(STRAFTER(STR(?coord), "Point(") AS ?tmp)
  BIND(STRBEFORE(?tmp, ")") AS ?coords)

  BIND(xsd:decimal(STRBEFORE(?coords, " ")) AS ?long)
  BIND(xsd:decimal(STRAFTER(?coords, " ")) AS ?lat)
}
GROUP BY ?id ?lat ?long ?label
`

export const placePeopleInfoWindow = `
{
  OPTIONAL { ?id rdfs:label ?placeLabel . }
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?placeLabel, STR(?id)) AS ?prefLabel__prefLabel)
}
`
export const peopleWorkingAtPlace = `
{
  <FILTER>

  ?related__id ns2:P937 ?id .
  ?related__id ns2:P2561 ?personName .

  BIND(REPLACE(STR(?related__id), "^.*/", "") AS ?personLocalId)
  BIND(?personName AS ?related__prefLabel)
  BIND(CONCAT("/person/page/", ENCODE_FOR_URI(?personLocalId), "/table") AS ?related__dataProviderUrl)
}
`

export const peopleBirthPlacesQuery = `
  SELECT ?id ?lat ?long ?label (COUNT(DISTINCT ?person) AS ?instanceCount)
  WHERE {
  <FILTER>

  ?person ns2:P19 ?id .
  ?id ns2:P625 ?coord .

  OPTIONAL { ?id rdfs:label ?label . }

  BIND(STRAFTER(STR(?coord), "Point(") AS ?tmp)
  BIND(STRBEFORE(?tmp, ")") AS ?coords)

  BIND(xsd:decimal(STRBEFORE(?coords, " ")) AS ?long)
  BIND(xsd:decimal(STRAFTER(?coords, " ")) AS ?lat)
}
GROUP BY ?id ?lat ?long ?label
`
export const birthPlacePeopleInfoWindow = `
{
  OPTIONAL { ?id rdfs:label ?placeLabel . }
  BIND(?id AS ?prefLabel__id)
  BIND(COALESCE(?placeLabel, STR(?id)) AS ?prefLabel__prefLabel)
}
`
export const peopleBornAtPlace = `
{
  <FILTER>

  ?related__id ns2:P19 ?id .
  ?related__id ns2:P2561 ?personName .

  BIND(REPLACE(STR(?related__id), "^.*/", "") AS ?personLocalId)
  BIND(?personName AS ?related__prefLabel)
  BIND(CONCAT("/person/page/", ENCODE_FOR_URI(?personLocalId), "/table") AS ?related__dataProviderUrl)
}
`

export const peopleByGenderQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?people) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?people a ns3:Q215627 .
      ?people ns2:P21 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`
export const peopleByRoleQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?people) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?people a ns3:Q215627 .
      ?people ns2:P106 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`
export const peopleByCalligraphicTrainingQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?people) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?people a ns3:Q215627 .
      ?people ns1:hasCalligraphicTraining ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`
export const peopleByFieldOfStudyQuery = `
  SELECT ?category ?prefLabel (COUNT(DISTINCT ?people) AS ?instanceCount)
  WHERE {
    <FILTER>
    {
      ?people a ns3:Q215627 .
      ?people ns2:P812 ?category .

      OPTIONAL {
        ?category rdfs:label ?prefLabel_ .
      }

      BIND(COALESCE(?prefLabel_, STR(?category)) AS ?prefLabel)
    }
  }
  GROUP BY ?category ?prefLabel
  ORDER BY DESC(?instanceCount)
`