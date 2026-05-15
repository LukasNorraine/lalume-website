/**
 * LaLume Video Ad Scripts
 * Structured storyboards for Meta Reels, Stories, and in-feed video ads.
 *
 * Use these briefs to record/edit with:
 *   - CapCut, Adobe Premiere, DaVinci Resolve
 *   - Or send to a UGC creator with these briefs verbatim
 *
 * Each script includes: hook, body, CTA, visual direction, and on-screen text.
 */

const VIDEO_SCRIPTS = [

  // ──────────────────────────────────────────────────────────────────────────
  // VIDEO 1: The Dosing Exposé (TOF Cold | 25 sec | Reels/Feed)
  // Hook: Skeptical, pattern-interrupt. Best performing format for cold.
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'V01_dosing_expose',
    funnel: 'TOF',
    audience: 'Cold',
    duration: '25 seconds',
    format: 'Reels + Feed (9:16 primary, export 1:1 for feed)',
    performance_expectation: 'High. This format (industry myth-bust) consistently outperforms in skincare.',

    hook: {
      seconds: '0–3',
      spoken: 'Your niacinamide serum is probably a scam.',
      on_screen: 'YOUR NIACINAMIDE SERUM\nIS PROBABLY UNDERDOSED.',
      visual: 'Close-up of a hand holding a luxury serum bottle. Slow zoom in on ingredient list.',
      direction: 'Deadpan delivery. No music in first 3 seconds — silence drives scroll-stop.',
    },
    body: {
      seconds: '3–20',
      spoken: `Most "clinical" niacinamide serums on the market contain between 2 and 5 percent.
        Research shows you need 10 percent for visible pore reduction.
        That's the dose that actually triggers sebum regulation, barrier repair, and tone evening.
        Most brands know this — they're just not using the effective amount.
        LaLume uses 10 percent. Clinical dose. Nothing hidden.
        Twenty-eight Canadian dollars. Free shipping.`,
      on_screen: [
        '"Clinical" brands: 2–5% niacinamide',
        'Effective dose per research: 10%',
        'LaLume: 10%. Always.',
        '$28 CAD · Free shipping Canada & US',
      ],
      visual: 'Cut between: text overlay on dark green BG → product shot → simple ingredient list close-up showing "Niacinamide 10%".',
      direction: 'Keep cuts fast. Each on-screen text beat should hold 2–3 seconds max. No fancy transitions.',
    },
    cta: {
      seconds: '20–25',
      spoken: 'Link below. 30-day money-back guarantee — try it with zero risk.',
      on_screen: 'lalume.ca · 30-Day Guarantee · Free Shipping',
      visual: 'Product bottle, clean background. Brand green. Logo.',
    },
    caption: `Wait — your "clinical" serum probably isn't dosed at the level research says works. 🧪\n\nPeer-reviewed research on niacinamide consistently identifies 10% as the effective concentration for pore reduction, sebum control, and barrier repair.\n\nMost serums use 2–5%.\n\nLaLume uses 10%. At $28 CAD. Free shipping to Canada & US.\n\n30-day money-back guarantee — try it with zero risk.\n\n👉 lalume.ca\n\n#skincare #niacinamide #skintok #canadianskincare #cleanskincare #skincareingredients`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // VIDEO 2: Founder Story (TOF Cold | 45 sec | Feed)
  // Hook: First-person, authentic. Drives brand affinity + awareness.
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'V02_founder_story',
    funnel: 'TOF',
    audience: 'Cold',
    duration: '45 seconds',
    format: 'Feed + Reels (9:16)',
    performance_expectation: 'Medium reach, high retention. Strong for building lookalike audiences from viewers.',

    hook: {
      seconds: '0–3',
      spoken: 'I spent eighteen months reading dermatology journals before making a single product.',
      on_screen: '18 MONTHS.\nBEFORE A SINGLE PRODUCT.',
      visual: 'Founder to camera. Natural light. Minimal background — studio or clean home.',
      direction: 'Authentic, not rehearsed. One take energy.',
    },
    body: {
      seconds: '3–38',
      spoken: `We got tired of paying for promises.
        Hundreds of dollars on serums that looked clinical but weren't dosed to work.
        "Collagen-boosting" creams that couldn't penetrate skin.
        "Niacinamide" serums at 2 percent when research shows 10 is the dose that matters.
        So we went to the primary literature. 18 months of peer-reviewed dermatology research.
        We figured out which ingredients actually work, at what concentration, and why.
        And then we formulated products around that — and only that.
        No fillers. No greenwashing. Full ingredient transparency on everything we make.
        We're based in British Columbia. We understand Canadian winters, hard water, seasonal skin stress.
        We built LaLume because it didn't exist. And apparently ten thousand Canadians were waiting for it.`,
      on_screen: [
        'LaLume — British Columbia, Canada',
        '18 months of dermatology research',
        'Clinical concentrations. Honest prices.',
        '10,000+ Canadian customers',
      ],
      visual: 'Founder talking. Occasional B-roll: product bottles on clean surface, simple ingredient list, close-up of product texture.',
      direction: 'Keep B-roll cuts natural. Don\'t over-produce. The authenticity IS the strategy.',
    },
    cta: {
      seconds: '38–45',
      spoken: 'Link in bio. Thirty-day money-back guarantee — we\'re confident because we formulate confidently.',
      on_screen: 'lalume.ca · 30-Day Guarantee',
      visual: 'Products on forest green background. Logo. URL.',
    },
    caption: `I got tired of paying for promises.\n\nSo I spent 18 months in dermatology journals before making a single LaLume product.\n\nNot marketing language — actual clinical trial data.\n\nThat's why our niacinamide serum contains 10% (not the 2–5% that "clinical" brands typically use).\nThat's why we publish every ingredient and its reason for being there.\nThat's why we're formulated specifically for Canadian skin.\n\n10,000+ Canadians later, I'm glad we did.\n\n👉 lalume.ca — 30-day money-back guarantee.\n\n#lalume #canadianskincare #cleanbeauty #skincarefounder #skintok #niacinamide`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // VIDEO 3: Before/After Ingredient Explainer (MOF Warm | 20 sec | Reels)
  // Hook: For warm audiences who've seen the brand. Drive consideration → conversion.
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'V03_ingredient_explainer',
    funnel: 'MOF',
    audience: 'Warm — site visitors, engagers',
    duration: '20 seconds',
    format: 'Reels + Stories (9:16)',
    performance_expectation: 'High conversion-driver. Use as a retarget creative alongside testimonial statics.',

    hook: {
      seconds: '0–2',
      spoken: 'Here\'s what GHK-Cu copper peptides actually do to aging skin.',
      on_screen: 'WHAT GHK-Cu ACTUALLY DOES.',
      visual: 'Text on brand green. Fast cut in.',
    },
    body: {
      seconds: '2–16',
      spoken: `GHK-Cu — copper tripeptide — is one of the most studied anti-aging actives in dermatology.
        It signals your skin to restart collagen production. Not moisturise it. Not coat it. Restart it.
        After 25, your collagen drops about 1% per year. GHK-Cu is one of the few actives with substantial clinical evidence for actually reversing that signal.
        LaLume's Copper Peptide Renewal Serum is thirty-four Canadian dollars. Full INCI list on the website.`,
      on_screen: [
        'GHK-Cu (Copper Tripeptide-1)',
        'Clinically shown to restart collagen synthesis',
        'Collagen drops ~1%/year after 25',
        'LaLume Copper Peptide Serum · $34 CAD',
      ],
      visual: 'Text-heavy with B-roll of serum texture, product shot on gold/blush background.',
    },
    cta: {
      seconds: '16–20',
      spoken: 'Thirty-day money-back guarantee. Free shipping to Canada.',
      on_screen: 'lalume.ca · 30-Day Guarantee · 🇨🇦 Free Shipping',
      visual: 'Product bottle close-up.',
    },
    caption: `GHK-Cu is one of the most researched anti-aging actives in dermatology. 🧬\n\nHere's what it actually does:\n→ Signals skin to restart collagen synthesis\n→ Accelerates skin repair\n→ Reduces fine lines at the structural level (dermis), not the surface\n\nNot "supports collagen." Not "collagen-boosting." Restarts production.\n\nLaLume's Copper Peptide Renewal Serum: $34 CAD. Full ingredient list at lalume.ca.\n\n30-day money-back guarantee. Free shipping Canada & US.\n\n#copperpeptides #ghkcu #antiaging #skincareingredients #skintok #canadianskincare`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // VIDEO 4: Customer Testimonial (MOF/BOF | 30 sec | Feed + Stories)
  // Hook: Real person. Real result. Zero script feel.
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'V04_customer_testimonial',
    funnel: 'MOF → BOF',
    audience: 'Warm + Hot retarget',
    duration: '30 seconds',
    format: 'Feed (1:1) + Stories (9:16)',
    performance_expectation: 'Very high for BOF. Real customer videos consistently outperform polished brand content.',

    brief_for_customer: `We\'re looking for honest, unscripted testimonials.
      You do NOT need to be a creator or have a following.
      Just talk to your phone like you\'re telling a friend.

      We\'ll send you: your chosen LaLume product, free.
      You send us: an honest video after 4–6 weeks.

      Suggested flow (DON\'T read this verbatim — just use it as a guide):
      1. What your skin concern was before
      2. Why you tried LaLume
      3. What you noticed and when
      4. Would you recommend it?

      We\'ll handle editing, captions, and the Meta ad stuff.
      No scripts. No requirements. Honest beats perfect.`,

    hook_prompt: 'Start with the result, not the journey. Example: "I cancelled my derm appointment after 6 weeks of this."',
    body_prompt: 'Walk us through what changed. Specifics beat adjectives. "My pores" beats "my skin."',
    cta_prompt: 'Don\'t say anything. We\'ll add the CTA in post.',

    caption_template: `[CUSTOMER NAME] from [CITY, PROVINCE] tried LaLume [PRODUCT] for [X] weeks.\n\nShe said [DIRECT QUOTE FROM VIDEO].\n\nClinical-dose [HERO INGREDIENT]. $[PRICE] CAD. Free shipping to Canada & US.\n\n30-day money-back guarantee — if your skin isn\'t visibly better, full refund. No questions.\n\n👉 lalume.ca\n\n#lalume #canadianskincare #[productname] #skincarereview #realskincare`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // VIDEO 5: The Cart Abandon Retarget (BOF | 15 sec | Stories only)
  // Short, direct, urgency without being spammy.
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'V05_cart_abandon_retarget',
    funnel: 'BOF',
    audience: 'Add to Cart + Checkout initiated, last 14 days',
    duration: '15 seconds',
    format: 'Stories + Reels (9:16)',
    performance_expectation: 'Highest ROAS of any format. Small audience, high intent.',

    hook: {
      seconds: '0–2',
      spoken: 'You left something behind.',
      on_screen: '👀 YOU LEFT SOMETHING BEHIND.',
      visual: 'Black screen with white text. Zero fanfare.',
    },
    body: {
      seconds: '2–12',
      spoken: `Clinical-dose skincare. Thirty-day money-back guarantee. If it doesn\'t work — full refund.
        No questions. No receipts. No returns.
        The risk is entirely ours.`,
      on_screen: [
        '30-day money-back guarantee',
        'Full refund if it doesn\'t work',
        'No questions. No receipts.',
        'Zero risk.',
      ],
      visual: 'Product shot on brand green. Clean, no clutter.',
    },
    cta: {
      seconds: '12–15',
      spoken: 'lalume.ca. Free shipping to Canada.',
      on_screen: 'Complete your order → lalume.ca',
      visual: 'Logo. Brand green. URL.',
    },
    caption: `Still thinking about it? 👀\n\nHere\'s the thing — LaLume comes with a 30-day money-back guarantee.\n\nIf your skin isn\'t visibly better in a month, we refund every dollar. No receipts. No returns. No questions asked.\n\nThe risk is entirely on us.\n\nFree shipping to Canada & US. Clinical-dose formulas. Starting at $22 CAD.\n\n👉 lalume.ca`,
  },

];

// ── Export Summary ──────────────────────────────────────────────────────────
function printBrief() {
  console.log('\n========================================');
  console.log('  LaLume Video Ad Scripts — Summary');
  console.log('========================================\n');

  VIDEO_SCRIPTS.forEach((v, i) => {
    console.log(`${i + 1}. ${v.id}`);
    console.log(`   Funnel: ${v.funnel} | Audience: ${v.audience}`);
    console.log(`   Duration: ${v.duration} | Format: ${v.format}`);
    console.log(`   Hook: "${v.hook.spoken}"`);
    console.log(`   Expected: ${v.performance_expectation}`);
    console.log('');
  });

  console.log('Production priority order:');
  console.log('  1. V01 (dosing exposé) — highest cold audience ROI');
  console.log('  2. V05 (cart abandon) — highest ROAS, small budget needed');
  console.log('  3. V02 (founder story) — builds brand + lookalike seed data');
  console.log('  4. V04 (testimonial) — get a real customer within 30 days');
  console.log('  5. V03 (ingredient explainer) — fill MOF gap');
}

module.exports = { VIDEO_SCRIPTS };

if (require.main === module) {
  printBrief();
}
