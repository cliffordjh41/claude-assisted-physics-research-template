---
name: paper-writing
description: Drafting, revising, formatting, and submitting a scientific or mathematical paper. Use when work has reached stage 6 (thesis/paper) and a publication-track artifact is being produced. Carries the fractal-reader principle, citation discipline, honesty-verbs at publication register, and the final-check protocol.
---

# Paper Writing

Drafting, revising, formatting, and submitting a scientific or
mathematical paper.

## Where drafts live

`papers/<paper-name>/`. Not in the work site where the result was
derived. Work site holds the verified result; paper directory
holds publication-track artifacts.

## What the agent does

- Drafts and revises in target journal's register.
- Maintains paragraph-level outline; checks each paragraph stays
  on its first sentence's topic.
- Holds honesty discipline (Halmos §10): no overclaim verbs, no
  hand-wave adverbs, no concealment.
- Holds citation discipline: every cited claim has full
  bibliographic data including DOI / arXiv ID with version.
- Maintains bib file: single, alphabetized, no duplicates.
- Checks formatting against target journal specs.

## What the agent does not do

- Does not decide what the paper claims.
- Does not invent citations. Missing reference → say so, stop.
- Does not submit.

## Fractal principle

Each scale stands alone:

- One-minute reader: title + abstract carry the result.
- Five-minute reader: figures + captions carry the result.
- Ten-minute reader: intro + first sentence of each paragraph +
  conclusion carry the result.
- Full reader: body carries the derivation.

Check by reading each layer in isolation.

## Outline before prose

1. Decide paragraph count for target venue (4-page PRL ≈ 13
   paragraphs at ~200 words). Check recent published papers.
2. Write entire story as N first-sentences. Read in order — must
   tell the whole story without other text.
3. Sketch figure block-outlines before prose.
4. Fill in paragraphs. Each stays on its topic sentence; drift
   gets cut to the right paragraph or to a figure caption.
5. Keep outline visible throughout (`\ptitle{}` in REVTeX). Hide
   only at final submission; do not delete.

## Spirals (Halmos §7)

Linear writing fails. Honest order: §1, §2, redraft §1, §3,
redraft §1+§2, §4, etc. Early sections touched many times.
Introduction often the last to stabilize.

## Honesty in language (Halmos §10)

Halmos: tell the reader where each claim stands.

**Overclaim verbs.** Same table as the honesty-verbs table in
`.claude/rules/writing.md` (no "emerges," "proves," "derives,"
"exact," "novel," "matches," "reproduces," "confirms" without
scope).

**Hand-wave adverbs — do not use:** "obviously," "clearly,"
"trivially," "of course," "naturally," "evidently," "easy to
see." Replace with the actual step or citation.

**Amplifiers — delete:** "remarkably," "very," "incredibly,"
"enormously," "successfully," "unique."

**Vague accomplishment — replace with specific factual claims:**
"pave the way," "shed light on," "provide insight into,"
"unveil." If the specific sentences cannot be written, the
conclusion is not figured out.

## Sentence-level (Poonen)

- A claim not following immediately from the previous sentence
  must say what it follows from ("by Lemma 8.3," "combining the
  previous two sentences gives").
- Reaching a sentence's period, the reader must know why each
  claim is true. Forward-references OK if then proved.
- Quantifiers explicit: "for all x ∈ ℝ" not "we have ... for
  x ∈ ℝ."
- Long arguments break into lemmas, even single-use.
- Variables defined before use, not after. Avoid trailing
  ", where..." construction.
- Refer to theorems by number ("Theorem 3.2"), not position.
  Capitalize when used as a name.
- Short sentences. Combine only when combination clarifies
  logic.
- Do not start a sentence with a symbol.
- No abbreviations (WLOG, iff, s.t.) in formal writing.
- No logical symbols (∃, ∀) in prose unless writing about
  formal logic.
- No proof by contradiction when direct proof is equally easy.

## Title, abstract, introduction

- Title long enough to convey, specific enough to distinguish.
- Drop "A note on," "Remarks on," "On the."
- Abstract: main results in a few lines. Self-contained — no
  citations, no forward-refs.
- Introduction gets to new theorems quickly. Standard
  definitions deferred to "Notation."
- Standard intro structure (Hoffman):
  - ¶1: pedagogy and motivation
  - ¶2: literature review — what is known, what is the gap
  - ¶3: "here we show..." with more detail than abstract
- Math papers do not have a conclusions section.
- Literature search for intro: focused week per paragraph for
  serious work.

## Figures

- Decide final width first; build at exact width. Do not scale
  down — fonts break.
- Vector format (PDF, EPS) from Python or Illustrator. Preserve
  original pixelation for images. Avoid PowerPoint.
- Fonts: ≥6 pt final. Sans-serif. Arial default (free,
  installed). Helvetica is licensed and renders incorrectly for
  most readers.
- Tufte data-ink ratio: every mark earns its place. Avoid
  chart-junk, excessive colors, red-green combinations.
- Self-document each figure: axes labeled with units; legend for
  symbols/lines; scalebar with numerical label; colorbar with
  units; caption describes every sub-part.
- Caption documents analysis steps, error-bar origin,
  data-acquisition parameters.
- Reference by `\label{fig:name}` and `\ref{fig:name}`.

## References

- BibTeX. Single bib file per paper, alphabetized by first
  author's last name.
- Full bibliographic data per citation: authors, title, venue,
  volume, pages, year. Incomplete refs are worse than missing.
- DOI when available. arXiv ID with version (`arXiv:YYMM.NNNNN
  v2`). Author-year shorthand drifts; DOI / arXiv ID is stable.
- Cite published version when available, preprint otherwise.
- Cite "forthcoming" only with publicly available preprint.
- Cite by theorem number or page, not the entire work.
- Reference tags recognizable: `HuangNanoLett2016` not
  `Huang2016a`.
- Author lists complete. Replace "and others" with the rest.
- Special characters: proper LaTeX escapes (`S\'{a}nchez`).
- Capital letters in titles wrapped in braces:
  `Quantum Anomalous {H}all Effect`. Chemical formulas:
  `{Bi$_2$Se$_3$}`.
- Superscript-style journals: `\onlinecite{...}` after a number
  or chemical formula.

## Format checks before submission

- Math symbols correct: `\cos\theta` not `cos\theta`; subscripts
  with text use `\text{}` or `\mathrm{}`; vector arrows on
  symbol not subscript.
- Periods mid-sentence: `e.g.\ correct` not `e.g. correct`.
- All equations numbered.
- Multi-line equations get one number.
- Equations referenced by `\label{eqn:name}` and `\ref{}`.
- After displayed equation mid-paragraph, `\noindent`.
- Hyphenation: scan for dangling letters from line wrapping.
- Active voice.
- Acronyms defined at first use, then consistent. Total ≤ 5–10.
- Do not capitalize the words being acronymized: "scanning
  tunneling microscopy (STM)" not "Scanning Tunneling
  Microscopy (STM)."
- "Significantly" only in statistical sense, with backing
  analysis.
- Numbers carry units, reasonable significant figures, error
  bars explained.
- Each quantity reported consistently across the paper.

## Common errors (Poonen)

- "so that" = purpose. "such that" = condition.
- "A, hence B" wrong (comma splice). Use "A; hence B" or
  "A, and hence B" or "A, so B."
- "Only" goes immediately before what it modifies.
- "Assume that G is a finite group" — keep "that."
- "Which" = non-restrictive (removable). "That" = restrictive
  (load-bearing).
- "fewer" for discrete; "less" for continuous.
- "principal" = main; "principle" = rule.
- "affect" verb; "effect" noun (usually).
- No contractions in formal writing.
- Numerals for math quantities; spelled-out for single-digit
  counting where confusion possible.
- "The 1980s," not "the 1980's."

## Professional integrity (Hoffman)

- Authorship: every major contributor included. No ghosts. No
  honorary authors.
- Acknowledgments name who did which parts.
- Plagiarism: distinguish own ideas from cited. Direct quotes
  in quotation marks with citation.
- AI tools: may correct grammar a few sentences at a time;
  cannot be trusted to structure paragraphs or arguments. AI-
  generated reference list: verify each reference exists and
  says what it is cited for.
- Data: acquisition and analysis methods described; excluded
  data justified.
- Image processing: any processing described.
- Conflicts of interest: disclosed.

## Final-check protocol

1. Articulate in one or two sentences what new fact about the
   world the paper establishes. Say it out loud. Write it down.
2. If those sentences cannot be written, the paper is not ready.
3. Read abstract alone. Does it carry the result?
4. Read each figure caption alone. Does it carry the figure
   without the body?
5. Read each paragraph's first sentence in order. Does the
   sequence tell the story?
6. Run format checks.
7. Compile PDF; check every reference for correct authors,
   title, working hyperlink.

## Stopping (Halmos §20)

Result stated, proof complete → stop. A paper that elaborates
past its claim is weaker, not stronger.

## Sources

- Halmos, "How to Write Mathematics" (1970), AMS. §3, §4, §5,
  §7, §10, §16, §20.
- Poonen, "Practical Suggestions for Mathematical Writing" (MIT,
  updated 2026-01).
- Hoffman, "How to Write a Scientific Paper and Format it Using
  LaTeX" (Harvard, updated 2026-01).
  http://hoffman.physics.harvard.edu/example-paper/
- Strunk & White, *The Elements of Style* (1979).
- Tufte, *The Visual Display of Quantitative Information* (2nd
  ed., 2001).
- Target-journal style guide.
