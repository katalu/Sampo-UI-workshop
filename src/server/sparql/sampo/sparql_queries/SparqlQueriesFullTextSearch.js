export const fullTextSearchProperties = `
{
  ?id a ns3:Q215627 ;
      ns2:P2561 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns3:Q215627 AS ?type__id)
  BIND("Person"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/person/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}
UNION
{
  ?id a ns3:Q4502142 ;
      ns2:P1476 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns3:Q4502142 AS ?type__id)
  BIND("Visual Arts"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/visualArts/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}
UNION
{
  ?id a ns3:Q17514 ;
      ns2:P1476 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns3:Q17514 AS ?type__id)
  BIND("Graffiti Art"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/graffitiArt/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}
UNION
{
  ?id a ns3:Q184485 ;
      ns2:P1476 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns3:Q184485 AS ?type__id)
  BIND("Performing Arts"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/performingArts/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}
UNION
{
  ?id a ns1:DecorativeAndAppliedArt ;
      ns2:P1476 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns1:DecorativeAndAppliedArt AS ?type__id)
  BIND("Decorative and Applied Arts"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/decorativeAppliedArts/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}
UNION
{
  ?id a ns3:Q464980 ;
      ns2:P1476 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns3:Q464980 AS ?type__id)
  BIND("Exhibition"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/exhibition/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}
UNION
{
  ?id a ns1:CalliWritingUnit ;
      ns1:attributedTitle ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns1:CalliWritingUnit AS ?type__id)
  BIND("Calli-Writing Unit"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/calliWritingUnit/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}
UNION
{
  ?id a ns3:Q1400264 ;
      ns2:P2561 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns3:Q1400264 AS ?type__id)
  BIND("Artistic Collective"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/artisticCollective/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}
UNION
{
  ?id a ns3:Q43229 ;
      ns2:P2561 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns3:Q43229 AS ?type__id)
  BIND("Organisation"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/organisation/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}  
UNION
{
  ?id a ns3:Q7725310 ;
      ns2:P1476 ?prefLabel__id .
  FILTER(LANG(?prefLabel__id) = "en" || LANG(?prefLabel__id) = "")
  FILTER(REGEX(STR(?prefLabel__id), "<SEARCH_TERM>", "i"))
  BIND(ns3:Q7725310 AS ?type__id)
  BIND("Series of Creative Works"@en AS ?type__prefLabel)
  BIND(?prefLabel__id AS ?prefLabel__prefLabel)
  BIND(CONCAT("/artworkSeries/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
}  
`