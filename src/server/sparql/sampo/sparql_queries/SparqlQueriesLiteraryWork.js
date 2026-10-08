const perspectiveID = 'literaryWork'

export const literaryWorkProperties = `
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
  # AUTHOR
  ?id ns2:P50 ?author__id .

  # LOCAL name dataset 
  OPTIONAL { ?author__id ns2:P2561 ?authorName }

  # Wikidata / external label
  OPTIONAL { ?author__id rdfs:label ?authorRdfsLabel . }
  BIND(COALESCE(?authorName, ?authorRdfsLabel, STRAFTER(STR(?author__id), "/")) AS ?author__prefLabel)
  BIND(STR(?author__id) AS ?authorStr)

  # check if author is local
  BIND(STRSTARTS(?authorStr, "http://wendang-project.github.io/data/") AS ?isLocal)

  # internal or external link
  BIND(IF(?isLocal, CONCAT("/person/page/", REPLACE(?authorStr, "^.*/", ""), "/table"), ?authorStr) AS ?author__dataProviderUrl)
}
UNION
{
  # DATE OF CREATION
  ?id ns2:P571 ?date .

  OPTIONAL {
    << ?id ns2:P571 ?date >> ns1:accuracy ?dateAccuracy .
  }

  BIND(STR(?date) AS ?bstr)
  BIND(REPLACE(?bstr, "T.*", "") AS ?dateLex)
  BIND(STRLEN(?dateLex) AS ?len)

  # Normalize 3-digit years stored with a leading zero:
  BIND(SUBSTR(?dateLex, 1, 4) AS ?yearLex)

  BIND(
    IF(
      REGEX(?yearLex, "^0[0-9]{3}$"),
      SUBSTR(?yearLex, 2, 3),
      ?yearLex
    ) AS ?displayYear
  )
  BIND(
    IF(
      ?len = 10,
      CONCAT(
        SUBSTR(?dateLex, 9, 2),
        "/",
        SUBSTR(?dateLex, 6, 2),
        "/",
        ?displayYear
      ),
      IF(
        ?len = 7,
        CONCAT(
          SUBSTR(?dateLex, 6, 2),
          "/",
          ?displayYear
        ),
        IF(
          ?len = 4,
          ?displayYear,
          ?dateLex
        )
      )
    ) AS ?formattedDate
  )

  BIND(
    IF(
      BOUND(?dateAccuracy) && ?dateAccuracy = "circa",
      CONCAT(?formattedDate, " ca."),
      IF(
        BOUND(?dateAccuracy) && ?dateAccuracy = "presumably",
        CONCAT("presumably ", ?formattedDate),
        ?formattedDate
      )
    ) AS ?date__prefLabel
  )

  BIND(?id AS ?date__id)
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
`
