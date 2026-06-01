# Evaluating a voice skill against real data

A voice skill almost always nails *content and vocabulary* on the first pass but
**over-polishes form**. The eval exists to catch that. Run it every time before declaring
the skill done.

## Method

1. **Generate held-out drafts.** Using ONLY the skill, draft one short message per audience
   register, for plausible scenarios that are NOT lifted from the sample. Held-out matters —
   you're testing generalisation, not memorisation.
2. **Score blind against real data.** Ideally spawn an independent subagent that:
   - pulls the person's real messages for each audience as ground truth,
   - scores each draft 1–5 on: (a) register fit, (b) gear/length/cadence, (c)
     mechanics/fingerprint, (d) vocabulary, (e) overall "would this pass as them?",
   - quotes the single closest real message, and names specific **tells** that it reads as
     AI-written or off-voice,
   - gives one concrete fix per draft.
   Keeping generation and scoring separate reduces self-grading bias.
3. **Fix systemic gaps, re-test.** Apply fixes to `SKILL.md`, then re-run the same scenarios
   and confirm the weak registers improve without regressing the strong ones.

## The common over-polish failure modes (check all of these)

These recur across almost everyone. Look for each explicitly:

1. **Paragraphing instead of fragmenting.** Real people often fire 2–4 short separate
   messages where a draft writes one tidy block. Usually the single biggest tell — especially
   in casual/customer/friend registers. Fix: instruct the skill to output separate messages.
2. **Over-scaffolded diplomacy.** Drafts add hedging preambles ("I get the logic, but…", "To
   be clear, I'm not arguing…") and open warmer/slower than the person really does. Many
   people open cold and get to the point fast.
3. **Explaining instead of landing a one-liner.** If the person tends to land a punchy
   reframe/aphorism, drafts that argue thoroughly but never deliver the closing line miss the
   voice.
4. **Signature tokens in the wrong habitat.** A real construction (e.g. an "=" cascade, a
   particular bracketed aside) gets borrowed into the wrong place. Constrain where signature
   moves are allowed.
5. **Too clean.** In fast threads the person has rough edges/typos; error-free drafts read
   *less* like them. (Still default to clean unless they want raw — but don't add polish the
   person doesn't have, e.g. perfect punctuation in a quick reply.)
6. **Generic corporate closers.** "Thanks for the patience here", "Hope this helps", "How are
   things landing?" replacing the person's plainer/warmer real sign-offs. List the banned
   closers and the real alternatives.

## Scoring guidance

- A mean of ~3.5/5 on first pass is normal. Strong registers (peer, technical) often score
  4+; weak ones (customer, friend) often sit lower because they fail on fragmentation.
- Don't force quantitative assertions onto inherently subjective quality — the blind
  comparison + named tells are more useful than a pass/fail number. Use the score to track
  movement across iterations, not as an absolute truth.
