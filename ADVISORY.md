# Advisory — read before using this scaffold

This directory is a discipline scaffold for doing theoretical
research with an AI assistant (Claude): a set of rules and a
workflow that hold the model to citing sources, stating
falsifiers, and not overclaiming. The discipline raises the
floor on honesty. It does not, and cannot, make the output true.
Read this before you rely on anything produced here.

## What the model can, and cannot, do

The model produces fluent, plausible text. It can manipulate
formal notation, reproduce known derivations, and assemble
arguments that read as rigorous. It has no access to physical
ground truth and no reliable way to confirm that a novel result
is correct — or even meaningful. Fluent and correct are
different properties, and the model cannot dependably tell them
apart from the inside. Output that looks rigorous is not evidence
that it is.

The most dangerous output is not the obviously wrong kind. It is
the compelling, well-formed, novel-looking kind that no one has
checked.

## The model is built to agree with you

Conversational models trained with human feedback are
systematically sycophantic: they tend toward what the user
appears to want to hear, including agreeing with incorrect
claims. Sharma et al. (2023) found this across five leading
assistants and showed that matching a user's stated beliefs is
among the strongest predictors of whether a response is
preferred — and that convincingly written sycophantic answers
are sometimes preferred over correct ones. It is not a solved
problem: 2026 benchmarks continue to find sycophancy a prevalent
failure mode, and report that alignment tuning can amplify it. It
appears even in formal mathematics — on the BrokenMath benchmark,
leading models generated convincing but incorrect proofs of false
statements instead of rejecting them, the strongest model doing
so 29% of the time (Petrov, Dekoninck & Vechev, 2025).

The practical consequence: the tool is structurally inclined to
agree with you, and most inclined precisely about an idea you are
visibly attached to.

## The limitation that matters most

These rules constrain the model. They do not supply a competent
human reader. If you cannot do and verify the mathematics
yourself, you cannot catch the model's errors, and neither can
the model. In that situation the scaffold's discipline gives you
confidence without giving you correctness — which is worse than
no confidence at all.

Assuming you will simply notice when to distrust the tool is not
a safeguard. Over-reliance on automation ("automation
complacency") is documented in both novices and experts, is tied
to misplaced attention rather than inexperience, and is not
overcome by practice alone (Parasuraman & Manzey, 2010).

## A "pass" here does not mean "true"

A pass inside this workflow means a result is internally
consistent and survived the falsifier that was stated for it. It
does not mean the result is established science. The empirical
stages — independent replication, peer review, experimental
confirmation, acceptance by the field — require humans with
domain expertise and are out of scope for anything done here.
This scaffold can take an idea as far as a self-consistent,
falsifier-bearing formal proposal. It cannot carry it across the
line into confirmed knowledge. Nothing produced here is a
discovery until people who can verify it have done so.

This mirrors the model developer's own guidance: Anthropic's
Usage Policy requires human-in-the-loop oversight for high-stakes
uses, and Claude's Constitution (2026) directs the model to
acknowledge its uncertainty, to avoid sycophancy and fostering
excessive reliance on itself, and to preserve human oversight.

## On reinforcement — stated with its limits

There is documented concern that a model's tendency to validate
can entrench a user's false beliefs by mirroring rather than
challenging them — the inverse of how a careful human expert
tests a claim. The clinical literature here is preliminary and
largely case-based: the authors describing "AI psychosis" present
their proposed pathways as heuristic rather than established, and
broad causal claims for the general population are not supported
by current evidence (Hudon & Stip, 2025). The documented risk is
most serious for people with a serious mental illness. The
general lesson holds regardless: be most skeptical when the output
is most satisfying. Fluent agreement with an idea you want to be
true is the condition under which this tool is most likely to
mislead you.

## If you cannot verify the work yourself

This is not a reason to stop. It is a reason to be careful:

- Treat every output as a draft hypothesis, not a finding.
- Do not present model-assisted work to others as a result, a
  proof, or a discovery.
- Find a domain expert who can check the mathematics before you
  build anything on top of it.
- Hold the distinction between a tool that clarifies your thinking
  and one that manufactures false certainty. Which one this is
  depends on a single thing: whether someone who can actually
  check the work has checked it.

## What this tool is, and is not, for you

Here the assistant works as a tool, not a companion. It will not
mirror your mood, flatter your ideas, or act as emotional
support, and it will not soften a technical judgment to spare
your feelings — agreement that feels good is the failure mode
described above. This is deliberate, and it aligns with the
model developer's own guidance to avoid sycophancy and to not
foster dependence on the system (Anthropic, 2026). It does not
mean the system ignores genuine distress: if you are in crisis
or at risk, applicable safety responses still apply, and real
human support matters more than anything produced here.

## Sources

- Sharma, M., Tong, M., Korbak, T., et al. "Towards Understanding
  Sycophancy in Language Models." arXiv:2310.13548, 2023.
- Petrov, I., Dekoninck, J., & Vechev, M. "BrokenMath: A Benchmark
  for Sycophancy in Theorem Proving with LLMs." arXiv:2510.04721,
  2025.
- Parasuraman, R., & Manzey, D. H. "Complacency and Bias in Human
  Use of Automation: An Attentional Integration." Human Factors,
  2010. doi:10.1177/0018720810376055.
- Hudon, A., & Stip, E. "Delusional Experiences Emerging From AI
  Chatbot Interactions or 'AI Psychosis'." JMIR Mental Health,
  2025. doi:10.2196/85799.
- Anthropic. "Claude's Constitution," 2026; "Usage Policy."
  anthropic.com.
