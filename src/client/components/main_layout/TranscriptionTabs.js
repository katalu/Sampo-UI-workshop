import React, { useEffect, useMemo, useState } from "react";

// Extract trailing language tag from text, e.g. "Hello [en]" -> "en"
function langFromText(text) {
  const s = String(text || "");
  const m = s.match(/\[([A-Za-z0-9-]+)\]\s*$/);
  return m ? m[1] : "und"; // und = undetermined
}

// Remove trailing language tag from visible text
function stripTrailingLangTag(text) {
  const s = String(text || "");
  return s.replace(/\s*\[[A-Za-z0-9-]+\]\s*$/, "").trim();
}

function normalizeLangTag(tag) {
  const s = String(tag || "").trim();
  if (!s) return "und";

  // optional normalization for prettier consistency
  if (s.toLowerCase() === "zh-latn") return "zh-Latn";

  return s;
}

function getLanguageLabel(lang) {
  const tag = normalizeLangTag(lang);

  if (tag === "und") return "Unknown";

  const custom = {
    en: "English",
    zh: "Chinese",
    "zh-Latn": "Pinyin",
  };

  if (custom[tag]) return custom[tag];

  try {
    const display = new Intl.DisplayNames(["en"], { type: "language" });
    return display.of(tag) || tag;
  } catch {
    return tag;
  }
}

function normalizeValue(v) {
  if (!v) return null;

  const rawText =
    typeof v === "string"
      ? v
      : String(v.prefLabel ?? "");

  const lang = normalizeLangTag(langFromText(rawText));
  const cleaned = stripTrailingLangTag(rawText);

  return {
    id: typeof v === "string" ? rawText : v.id || rawText,
    text: cleaned,
    lang,
  };
}

export function TranscriptionTabs({ values }) {
  const items = useMemo(() => {
    const arr = Array.isArray(values) ? values : values ? [values] : [];
    return arr
      .map(normalizeValue)
      .filter(Boolean)
      .filter((x) => x.text && x.text.trim().length > 0);
  }, [values]);

  const countsByLang = useMemo(() => {
    const counts = {};
    for (const it of items) {
      counts[it.lang] = (counts[it.lang] || 0) + 1;
    }
    return counts;
  }, [items]);

  const langTabs = useMemo(() => {
    const langs = Array.from(new Set(items.map((x) => x.lang)));

    const preferredOrder = ["en", "zh", "zh-Latn", "und"];

    langs.sort((a, b) => {
      const ia = preferredOrder.indexOf(a);
      const ib = preferredOrder.indexOf(b);

      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;

      return getLanguageLabel(a).localeCompare(getLanguageLabel(b));
    });

    return langs.map((lang) => ({
      key: lang,
      label: getLanguageLabel(lang),
    }));
  }, [items]);

  const [tab, setTab] = useState(null);

  useEffect(() => {
    if (!langTabs.length) {
      setTab(null);
      return;
    }

    const exists = langTabs.some((t) => t.key === tab);
    if (!exists) setTab(langTabs[0].key);
  }, [langTabs, tab]);

  const filtered = useMemo(() => {
    if (!tab) return [];
    return items.filter((x) => x.lang === tab);
  }, [items, tab]);

  if (!items.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          fontSize: 16,
          color: "rgba(0,0,0,0.82)",
          marginBottom: 12,
          lineHeight: 1.5,
          fontFamily: "Arial",
        }}
      >
        Consult the transcriptions and translations of the content
        of this Calli-Writing unit.
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 10,
          flex: "0 0 auto",
        }}
      >
        {langTabs.map((t) => {
          const count = countsByLang[t.key] || 0;

          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              type="button"
              style={{
                padding: "6px 10px",
                borderRadius: 200,
                border: "1px solid #ddd",
                background: tab === t.key ? "#f3f3f3" : "white",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            >
              {t.label}
              <span style={{ opacity: 0.6 }}> ({count})</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          padding: 12,
          background: "white",
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          whiteSpace: "pre-wrap",
          lineHeight: 1.35,
          fontSize: 16,
          fontFamily: "inherit",
        }}
      >
        {filtered.map((x, index) => {
          const isFirst = index === 0;

          return (
            <div
              key={x.id || `${x.lang}-${index}`}
              style={{
                padding: "10px 0",
                borderTop: isFirst ? "none" : "2px solid rgba(0,0,0,0.16)",
                marginTop: isFirst ? 0 : 12,
                paddingTop: isFirst ? 0 : 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>{x.text}</div>

                <div
                  style={{
                    opacity: 0.75,
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    alignSelf: "flex-start",
                    border: "1px solid rgba(0,0,0,0.18)",
                    borderRadius: 999,
                    padding: "3px 8px",
                    background: "rgba(0,0,0,0.03)",
                    fontFamily: "inherit",
                  }}
                  title={getLanguageLabel(x.lang)}
                >
                  {x.lang}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}