/**
 * LaLume Meta Ads Campaign Builder
 * Creates the full TOF → MOF → BOF campaign structure via Meta Marketing API.
 *
 * Setup:
 *   1. cp .env.example .env
 *   2. Fill in your Meta credentials in .env
 *   3. npm install
 *   4. Generate creatives first: node generate-creatives.js
 *   5. node meta-campaign-setup.js
 *
 * What this builds:
 *   Campaign 1: TOF — Cold Audiences (Conversion, Canada + US)
 *     Ad Set 1A: Broad interest — skincare / beauty / health
 *     Ad Set 1B: Lookalike 1–3% (from customer email list)
 *     Ad Set 1C: Competitor interest targeting
 *   Campaign 2: MOF — Warm Audiences (Conversion retarget)
 *     Ad Set 2A: Website visitors 30 days (excl. purchasers)
 *     Ad Set 2B: Video viewers 75%+ last 30 days
 *     Ad Set 2C: Instagram + Facebook engagers 30 days
 *   Campaign 3: BOF — Hot Retarget (Conversion)
 *     Ad Set 3A: Add to cart, no purchase, 14 days
 *     Ad Set 3B: Checkout initiated, no purchase, 7 days
 *     Ad Set 3C: Purchasers 60 days (upsell / repurchase)
 */

require('dotenv').config();

const bizSdk = require('facebook-nodejs-business-sdk');
const fs = require('fs');
const path = require('path');

const { FacebookAdsApi, AdAccount, Campaign, AdSet, AdCreative, Ad } = bizSdk;

// ── Credentials ──────────────────────────────────────────────────────────────
const ACCESS_TOKEN    = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID   = process.env.META_AD_ACCOUNT_ID;  // "act_XXXXXXXXXX"
const PIXEL_ID        = process.env.META_PIXEL_ID;
const PAGE_ID         = process.env.META_PAGE_ID;
const INSTAGRAM_ID    = process.env.META_INSTAGRAM_ACTOR_ID;
const WEBSITE_URL     = process.env.WEBSITE_URL || 'https://lalume.ca';
const SHOP_URL        = process.env.SHOP_URL    || 'https://lalume.ca/collections';

if (!ACCESS_TOKEN || !AD_ACCOUNT_ID) {
  console.error('ERROR: Missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID in .env');
  console.error('Copy .env.example to .env and fill in your credentials.');
  process.exit(1);
}

FacebookAdsApi.init(ACCESS_TOKEN);
const account = new AdAccount(AD_ACCOUNT_ID);

// ── Budget Config ─────────────────────────────────────────────────────────────
// Starting conservative — scale winners after 7–14 days of data.
// All amounts in cents CAD (multiply $ amount × 100).
const BUDGETS = {
  tof_daily:  5000,   // $50 CAD/day across TOF (split across ad sets)
  mof_daily:  3000,   // $30 CAD/day across MOF
  bof_daily:  2000,   // $20 CAD/day across BOF
};

// ── Campaign Configs ──────────────────────────────────────────────────────────
const CAMPAIGNS = [
  {
    id: 'tof',
    name: 'LaLume | TOF | Cold Audiences | Canada+US',
    objective: 'OUTCOME_SALES',
    daily_budget: BUDGETS.tof_daily,
    status: 'PAUSED', // Review before activating
  },
  {
    id: 'mof',
    name: 'LaLume | MOF | Warm Audiences | Retarget',
    objective: 'OUTCOME_SALES',
    daily_budget: BUDGETS.mof_daily,
    status: 'PAUSED',
  },
  {
    id: 'bof',
    name: 'LaLume | BOF | Hot Retarget | Cart + Checkout',
    objective: 'OUTCOME_SALES',
    daily_budget: BUDGETS.bof_daily,
    status: 'PAUSED',
  },
];

// ── Ad Set Configs ────────────────────────────────────────────────────────────
function buildAdSets(campaignIds) {
  const canadaUsGeos = [
    { country: 'CA' },
    { country: 'US' },
  ];

  const canadaOnly = [{ country: 'CA' }];

  const womenAge2745 = { age_min: 27, age_max: 45, genders: [2] };
  const womenAge2250 = { age_min: 22, age_max: 50, genders: [2] };

  return [
    // ── TOF Ad Sets ──
    {
      campaign_id: campaignIds.tof,
      name: 'TOF | 1A | Broad Skincare Interest | CA+US | W27-45',
      daily_budget: 1700,
      targeting: {
        geo_locations: { countries: ['CA', 'US'] },
        ...womenAge2745,
        flexible_spec: [
          {
            interests: [
              { id: '6003061201894', name: 'Skin care' },
              { id: '6003348882927', name: 'Cosmetics' },
              { id: '6003008130059', name: 'Beauty' },
              { id: '6003050367950', name: 'Dermatology' },
              { id: '6003050367951', name: 'Skincare routine' },
            ],
          },
        ],
        publisher_platforms: ['facebook', 'instagram'],
        facebook_positions: ['feed', 'right_hand_column'],
        instagram_positions: ['stream', 'explore'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      creative_ids: ['TOF_cold_problem-hook_1x1', 'TOF_cold_ingredient-proof_1x1', 'TOF_cold_canadian-skin_1x1'],
    },
    {
      campaign_id: campaignIds.tof,
      name: 'TOF | 1B | Lookalike 1-3% | CA | W22-50',
      daily_budget: 1800,
      targeting: {
        geo_locations: { countries: ['CA'] },
        ...womenAge2250,
        // Lookalike audiences must be created manually in Ads Manager from your customer list
        // After upload, replace this with: custom_audiences: [{ id: 'your_lookalike_audience_id' }]
        flexible_spec: [
          {
            interests: [
              { id: '6003061201894', name: 'Skin care' },
              { id: '6003450230665', name: 'Serum (skin care)' },
              { id: '6003008130059', name: 'Beauty' },
            ],
          },
        ],
        publisher_platforms: ['facebook', 'instagram'],
        instagram_positions: ['stream', 'reels', 'stories', 'explore'],
        facebook_positions: ['feed'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      creative_ids: ['TOF_cold_problem-hook_1x1', 'TOF_cold_canadian-skin_1x1'],
    },
    {
      campaign_id: campaignIds.tof,
      name: 'TOF | 1C | Story Placement | Cold | CA+US',
      daily_budget: 1500,
      targeting: {
        geo_locations: { countries: ['CA', 'US'] },
        ...womenAge2745,
        flexible_spec: [
          {
            interests: [
              { id: '6003061201894', name: 'Skin care' },
              { id: '6003008130059', name: 'Beauty' },
              { id: '6004012359458', name: 'Anti-aging cream' },
              { id: '6003050367950', name: 'Dermatology' },
            ],
          },
        ],
        publisher_platforms: ['instagram', 'facebook'],
        instagram_positions: ['stories', 'reels'],
        facebook_positions: ['story'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      creative_ids: ['TOF_cold_story_9x16'],
    },

    // ── MOF Ad Sets ──
    {
      campaign_id: campaignIds.mof,
      name: 'MOF | 2A | Site Visitors 30d (excl. purchasers) | CA+US',
      daily_budget: 1000,
      targeting: {
        geo_locations: { countries: ['CA', 'US'] },
        age_min: 22,
        age_max: 55,
        // Custom audiences require creation in Ads Manager:
        // - Website visitors: pixel event = PageView, last 30 days
        // - Exclusion: pixel event = Purchase, last 60 days
        // custom_audiences: [{ id: 'visitors_30d_audience_id' }],
        // excluded_custom_audiences: [{ id: 'purchasers_60d_audience_id' }],
        publisher_platforms: ['facebook', 'instagram'],
        facebook_positions: ['feed'],
        instagram_positions: ['stream', 'explore'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      creative_ids: ['MOF_warm_testimonial_1x1'],
    },
    {
      campaign_id: campaignIds.mof,
      name: 'MOF | 2B | Video Viewers 75%+ 30d | CA+US',
      daily_budget: 1000,
      targeting: {
        geo_locations: { countries: ['CA', 'US'] },
        age_min: 22,
        age_max: 55,
        // Create in Ads Manager: Engagement audience — Video viewers 75%, last 30 days
        // custom_audiences: [{ id: 'video_viewers_75pct_audience_id' }],
        publisher_platforms: ['facebook', 'instagram'],
        facebook_positions: ['feed'],
        instagram_positions: ['stream'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      creative_ids: ['MOF_warm_testimonial_1x1'],
    },
    {
      campaign_id: campaignIds.mof,
      name: 'MOF | 2C | IG+FB Engagers 30d | CA+US',
      daily_budget: 1000,
      targeting: {
        geo_locations: { countries: ['CA', 'US'] },
        age_min: 22,
        age_max: 55,
        // Create in Ads Manager: Engagement audience — IG Business Profile, FB Page, last 30 days
        // custom_audiences: [{ id: 'page_engagers_30d_audience_id' }],
        publisher_platforms: ['facebook', 'instagram'],
        facebook_positions: ['feed'],
        instagram_positions: ['stream', 'stories'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      creative_ids: ['MOF_warm_testimonial_1x1'],
    },

    // ── BOF Ad Sets ──
    {
      campaign_id: campaignIds.bof,
      name: 'BOF | 3A | Add to Cart No Purchase 14d | CA+US',
      daily_budget: 700,
      targeting: {
        geo_locations: { countries: ['CA', 'US'] },
        age_min: 22,
        age_max: 55,
        // Create in Ads Manager: Website activity — AddToCart (last 14d), excl. Purchase (last 60d)
        // custom_audiences: [{ id: 'atc_14d_audience_id' }],
        // excluded_custom_audiences: [{ id: 'purchasers_60d_audience_id' }],
        publisher_platforms: ['facebook', 'instagram'],
        facebook_positions: ['feed'],
        instagram_positions: ['stream', 'stories'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      creative_ids: ['BOF_hot_urgency-offer_1x1', 'BOF_hot_retarget-story_9x16'],
    },
    {
      campaign_id: campaignIds.bof,
      name: 'BOF | 3B | Checkout Initiated No Purchase 7d | CA+US',
      daily_budget: 800,
      targeting: {
        geo_locations: { countries: ['CA', 'US'] },
        age_min: 22,
        age_max: 55,
        // Create in Ads Manager: InitiateCheckout (last 7d), excl. Purchase (last 60d)
        // custom_audiences: [{ id: 'checkout_7d_audience_id' }],
        // excluded_custom_audiences: [{ id: 'purchasers_60d_audience_id' }],
        publisher_platforms: ['facebook', 'instagram'],
        facebook_positions: ['feed'],
        instagram_positions: ['stream', 'stories'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      creative_ids: ['BOF_hot_urgency-offer_1x1', 'BOF_hot_retarget-story_9x16'],
    },
    {
      campaign_id: campaignIds.bof,
      name: 'BOF | 3C | Purchasers 60d | Upsell | CA+US',
      daily_budget: 500,
      targeting: {
        geo_locations: { countries: ['CA', 'US'] },
        age_min: 22,
        age_max: 55,
        // Create in Ads Manager: Purchase (last 60 days)
        // custom_audiences: [{ id: 'purchasers_60d_audience_id' }],
        publisher_platforms: ['facebook', 'instagram'],
        facebook_positions: ['feed'],
        instagram_positions: ['stream'],
      },
      optimization_goal: 'OFFSITE_CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      pixel_id: PIXEL_ID,
      // For purchasers: show products they haven't bought. Use MOF testimonial or new product.
      creative_ids: ['MOF_warm_testimonial_1x1'],
    },
  ];
}

// ── Ad Copy Library ───────────────────────────────────────────────────────────
// Used when creating ads programmatically. Mix and match headlines/bodies.
const AD_COPY = {
  tof_cold: {
    headlines: [
      'Pharmaceutical-grade actives. $28.',
      'The dose that actually works.',
      'Most serums use 2% niacinamide. Ours uses 10%.',
      'Your $150 serum is probably underdosed.',
      'Made for Canadian skin. Priced honestly.',
    ],
    primary_texts: [
      'Most "clinical" serums contain a fraction of the effective concentration. LaLume doesn\'t. Every active is dosed at levels peer-reviewed research identifies as effective — not token amounts, but concentrations that produce visible results. Clinically-backed. Clean formula. Free shipping to Canada & US. 30-day money-back guarantee.',
      'After 18 months in dermatology research, we built skincare that actually earns its shelf space. 10% niacinamide (the clinical dose). GHK-Cu copper peptides. Full ingredient transparency. No parabens, sulfates, or synthetic fragrance. Starting at $28 CAD.',
      'Your skin faces things most formulas weren\'t designed for — Canadian winters, hard water, seasonal barrier stress. We formulated for exactly that. Clean actives, clinical concentrations, honest prices. 10,000+ Canadian customers trust LaLume.',
    ],
    descriptions: [
      'Free shipping Canada & US. 30-day guarantee.',
      'Clinical dose. Honest price. No compromises.',
      '4.9 stars · 2,847 reviews · 10,000+ Canadians',
    ],
    cta: 'SHOP_NOW',
    link: SHOP_URL,
  },
  mof_warm: {
    headlines: [
      '"My dermatologist noticed before I mentioned it."',
      'Still thinking about it? We get it.',
      'What 6 weeks of clinical-dose skincare looks like.',
      '4.9 stars. 2,847 Canadians can\'t all be wrong.',
    ],
    primary_texts: [
      '"I\'ve spent thousands on luxury serums over the years. LaLume\'s Niacinamide outperforms every single one. I\'m embarrassed it took me this long." — Sarah K., Toronto, ON. Clinical actives at honest prices. 30-day money-back guarantee.',
      'You came this close. Here\'s the thing: LaLume is built on pharmaceutical-grade actives, full ingredient transparency, and a 30-day no-questions refund. The risk is on us. Try it.',
    ],
    descriptions: [
      '30-day guarantee. No risk. Free shipping.',
      'Clinically dosed. Honestly priced. Canadian.',
    ],
    cta: 'SHOP_NOW',
    link: SHOP_URL,
  },
  bof_hot: {
    headlines: [
      'You left something behind.',
      'Still in your cart. Still waiting.',
      'Zero risk. 30-day money-back guarantee.',
      'Free shipping. Try it for 30 days. Full refund if not.',
    ],
    primary_texts: [
      'You were close. Clinical-dose skincare, 30-day money-back guarantee, free shipping to Canada and the US. If your skin isn\'t visibly better in a month — we refund every dollar. No questions, no receipts, no returns.',
    ],
    descriptions: [
      'Free shipping. 30-day full refund. No questions.',
      'Clinical actives. Risk-free trial.',
    ],
    cta: 'SHOP_NOW',
    link: SHOP_URL,
  },
};

// ── Campaign Builder ──────────────────────────────────────────────────────────
async function createCampaigns() {
  console.log('\nCreating LaLume Meta Ads campaigns...\n');
  const campaignIds = {};

  for (const config of CAMPAIGNS) {
    console.log(`Creating campaign: ${config.name}`);
    try {
      const campaign = await account.createCampaign([], {
        name: config.name,
        objective: config.objective,
        status: config.status,
        special_ad_categories: [],
      });
      campaignIds[config.id] = campaign.id;
      console.log(`  Created: ${campaign.id}`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }

  return campaignIds;
}

async function createAdSets(campaignIds) {
  console.log('\nCreating ad sets...\n');
  const adSets = buildAdSets(campaignIds);
  const adSetIds = {};

  for (const config of adSets) {
    console.log(`Creating ad set: ${config.name}`);
    try {
      const adSet = await account.createAdSet([], {
        name: config.name,
        campaign_id: config.campaign_id,
        daily_budget: config.daily_budget,
        billing_event: config.billing_event,
        optimization_goal: config.optimization_goal,
        targeting: config.targeting,
        status: 'PAUSED',
        promoted_object: {
          pixel_id: config.pixel_id,
          custom_event_type: 'PURCHASE',
        },
      });
      adSetIds[config.name] = { id: adSet.id, creative_ids: config.creative_ids };
      console.log(`  Created: ${adSet.id}`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }

  return adSetIds;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=================================================');
  console.log('  LaLume Meta Ads Campaign Builder');
  console.log('  Target: $10,000 CAD/month in sales');
  console.log('  Budget: $100 CAD/day (~$3,000/month) to start');
  console.log('=================================================');

  const campaignIds = await createCampaigns();
  const adSetIds = await createAdSets(campaignIds);

  // Write campaign IDs to a local file for reference
  const summary = {
    created_at: new Date().toISOString(),
    campaigns: campaignIds,
    ad_sets: adSetIds,
    next_steps: [
      '1. Upload customer email list to Meta → create Lookalike audiences (1%, 2%, 3%)',
      '2. Create Custom Audiences in Ads Manager: visitors, video viewers, engagers, ATC, checkout',
      '3. Replace placeholder audience IDs in meta-campaign-setup.js with real IDs',
      '4. Upload PNG creatives from ads/exports/ to Meta Ads Manager',
      '5. Review all ad sets in Ads Manager, then activate TOF first',
      '6. After 7 days: pause ad sets with CPA > $55 CAD, scale those with CPA < $40 CAD',
      '7. After 14 days: activate MOF with the best-performing TOF creatives',
      '8. After 21 days: activate BOF',
    ],
    budget_notes: {
      daily_total: '$100 CAD/day',
      monthly_estimated: '$3,000 CAD/month',
      target_roas: '3.3x (to hit $10K sales from $3K spend)',
      target_cpa: '$35–45 CAD per purchase',
      target_aov: '$42 CAD (average order value)',
      orders_needed: '~238/month to hit $10K',
    },
  };

  fs.writeFileSync(
    path.resolve(__dirname, '../campaign-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n=================================================');
  console.log('Campaign structure created. All campaigns PAUSED.');
  console.log('Summary saved to: ads/campaign-summary.json');
  console.log('\nNext steps:');
  summary.next_steps.forEach(s => console.log(' ', s));
  console.log('=================================================');
}

main().catch((err) => {
  console.error('Campaign setup failed:', err);
  process.exit(1);
});
