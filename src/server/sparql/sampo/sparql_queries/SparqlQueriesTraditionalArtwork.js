const perspectiveID = 'traditionalArtwork'

export const traditionalArtworkProperties = `
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
  # DESCRIPTION
  ?id ns1:description ?descLiteral .
  BIND(?descLiteral AS ?description__prefLabel)
  BIND(?id AS ?description__id)
}  
UNION
{
  # CREATOR
  ?id ns2:P170 ?creator__id .

  # LOCAL name dataset 
  OPTIONAL { ?creator__id ns2:P2561 ?creatorName }

  # Wikidata / external label
  OPTIONAL { ?creator__id rdfs:label ?creatorRdfsLabel . }
  BIND(COALESCE(?creatorName, ?creatorRdfsLabel, STRAFTER(STR(?creator__id), "/")) AS ?creator__prefLabel)
  BIND(STR(?creator__id) AS ?creatorStr)

  # check if creator is local
  BIND(STRSTARTS(?creatorStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/person/page/", REPLACE(?creatorStr, "^.*/", ""), "/table"), ?creatorStr) AS ?creator__dataProviderUrl)
}
UNION
{
  # TRADITIONAL ARTWORK TYPE
  ?id ns1:hasArtworkType ?traditionalArtType__id .
  OPTIONAL { ?traditionalArtType__id rdfs:label ?traditionalArtTypeLabel }
  BIND(COALESCE(?traditionalArtTypeLabel, STR(?traditionalArtType__id)) AS ?traditionalArtType__prefLabel)
  BIND(STR(?traditionalArtType__id) AS ?traditionalArtType__dataProviderUrl)
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
`