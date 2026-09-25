import type { RenderResult, TestimonialData, WidgetConfig } from "../types";
import * as proof from "./proof";
import * as st from "./standalone";
import * as proof2 from "./proof2";
import * as social from "./social";
import * as promo2 from "./promo2";
import * as media2 from "./media2";
import * as commerce from "./commerce";
import * as info from "./info";
import * as profiles from "./profiles";
import * as tools2 from "./tools2";
import * as layout2 from "./layout2";
import * as community2 from "./community2";
import * as utility2 from "./utility2";
import * as prettyWidgets from "./pretty-widgets";
import * as prettyTrackers from "./pretty-trackers";
import * as auroraWidgets from "./aurora-widgets";
import { SPECIAL_RENDERERS } from "./special-widgets";
import { featureTour } from "./feature-tour";
import { PLATFORM_RENDERERS } from "./platforms";
import { PLATFORM_CARD_RENDERERS } from "./platform-card";
import { IOSW_RENDERERS } from "./ios-weather";
import { MAC_RENDERERS } from "./mac-widgets";
import { MACOS_DOCK_RENDERERS } from "./macos-docks";
import { APPLE_RENDERERS } from "./apple-widgets";
import { themeCss } from "../theme";
import * as toolsMore from "./tools-more";
import * as healthTools from "./tools-health";
import * as convertTools from "./tools-convert";
import * as funTools from "./tools-fun";


export type Renderer = (
  c: WidgetConfig,
  items: TestimonialData[],
  extra?: Record<string, unknown>
) => RenderResult;

export const RENDERERS: Record<string, Renderer> = {

  /* ---- 2026 expansion: 100 more tools ---- */
  "vat-calculator": toolsMore.vatCalculator,
  "sales-tax-calculator": toolsMore.salesTaxCalculator,
  "discount-calculator": toolsMore.discountCalculator,
  "compound-interest-calculator": toolsMore.compoundInterestCalculator,
  "simple-interest-calculator": toolsMore.simpleInterestCalculator,
  "cagr-calculator": toolsMore.cagrCalculator,
  "roi-calculator": toolsMore.roiCalculator,
  "profit-margin-calculator": toolsMore.profitMarginCalculator,
  "markup-calculator": toolsMore.markupCalculator,
  "break-even-calculator": toolsMore.breakEvenCalculator,
  "hourly-to-salary": toolsMore.hourlyToSalary,
  "salary-to-hourly": toolsMore.salaryToHourly,
  "savings-goal-calculator": toolsMore.savingsGoalCalculator,
  "debt-payoff-calculator": toolsMore.debtPayoffCalculator,
  "inflation-calculator": toolsMore.inflationCalculator,
  "net-to-gross-calculator": toolsMore.netToGrossCalculator,
  "subscription-cost-calculator": toolsMore.subscriptionCostCalculator,
  "fuel-cost-calculator": toolsMore.fuelCostCalculator,
  "electricity-cost-calculator": toolsMore.electricityCostCalculator,
  "unit-price-calculator": toolsMore.unitPriceCalculator,
  "payment-split-calculator": toolsMore.paymentSplitCalculator,
  "apr-calculator": toolsMore.aprCalculator,
  "overtime-pay-calculator": toolsMore.overtimePayCalculator,
  "invoice-total-calculator": toolsMore.invoiceTotalCalculator,
  "future-value-calculator": toolsMore.futureValueCalculator,
  "bmr-calculator": healthTools.bmrCalculator,
  "daily-calorie-calculator": healthTools.dailyCalorieCalculator,
  "water-intake-calculator": healthTools.waterIntakeCalculator,
  "protein-intake-calculator": healthTools.proteinIntakeCalculator,
  "body-fat-calculator": healthTools.bodyFatCalculator,
  "ideal-weight-calculator": healthTools.idealWeightCalculator,
  "running-pace-calculator": healthTools.runningPaceCalculator,
  "race-time-calculator": healthTools.raceTimeCalculator,
  "one-rep-max-calculator": healthTools.oneRepMaxCalculator,
  "heart-rate-zones": healthTools.heartRateZonesCalculator,
  "steps-to-calories": healthTools.stepsToCaloriesCalculator,
  "sleep-cycle-calculator": healthTools.sleepCycleCalculator,
  "due-date-calculator": healthTools.dueDateCalculator,
  "calories-burned-calculator": healthTools.caloriesBurnedCalculator,
  "waist-to-height-calculator": healthTools.waistToHeightCalculator,
  "macros-calculator": healthTools.macrosCalculator,
  "protein-per-meal-calculator": healthTools.proteinPerMealCalculator,
  "caffeine-calculator": healthTools.caffeineCalculator,
  "calorie-deficit-calculator": healthTools.calorieDeficitCalculator,
  "walking-time-calculator": healthTools.walkingTimeCalculator,
  "cycling-speed-calculator": healthTools.cyclingSpeedCalculator,
  "height-predictor": healthTools.heightPredictor,
  "hydration-reminder": healthTools.hydrationReminder,
  "rest-timer": healthTools.restTimer,
  "kg-lb-converter": convertTools.kgLbConverter,
  "cm-inch-converter": convertTools.cmInchConverter,
  "celsius-fahrenheit-converter": convertTools.celsiusFahrenheitConverter,
  "km-miles-converter": convertTools.kmMilesConverter,
  "liter-gallon-converter": convertTools.literGallonConverter,
  "ml-oz-converter": convertTools.mlOzConverter,
  "sqm-sqft-converter": convertTools.sqmSqftConverter,
  "bytes-converter": convertTools.bytesConverter,
  "seconds-hms-converter": convertTools.secondsHmsConverter,
  "decimal-binary-converter": convertTools.decimalBinaryConverter,
  "decimal-hex-converter": convertTools.decimalHexConverter,
  "mpg-converter": convertTools.mpgConverter,
  "bar-psi-converter": convertTools.barPsiConverter,
  "knots-kmh-converter": convertTools.knotsKmhConverter,
  "radians-degrees-converter": convertTools.radiansDegreesConverter,
  "unix-timestamp-converter": convertTools.unixTimestampConverter,
  "number-to-words": convertTools.numberToWords,
  "roman-numeral-converter": convertTools.romanNumeralConverter,
  "base64-converter": convertTools.base64Converter,
  "url-encoder": convertTools.urlEncoder,
  "case-converter": convertTools.caseConverter,
  "word-counter": convertTools.wordCounter,
  "interval-timer": healthTools.intervalTimer,
  "ratio-calculator": convertTools.ratioCalculator,
  "week-number-calculator": funTools.weekNumberCalculator,
  "text-reverser": convertTools.textReverser,
  "slug-generator": convertTools.slugGenerator,
  "number-scale-converter": convertTools.numberScaleConverter,
  "dice-roller": funTools.diceRoller,
  "coin-flip": funTools.coinFlip,
  "random-number-generator": funTools.randomNumberGenerator,
  "lottery-number-generator": funTools.lotteryNumberGenerator,
  "random-picker": funTools.randomPicker,
  "team-randomizer": funTools.teamRandomizer,
  "pin-generator": funTools.pinGenerator,
  "random-color-generator": funTools.randomColorGenerator,
  "username-generator": funTools.usernameGenerator,
  "raffle-winner": funTools.raffleWinner,
  "pomodoro-timer": funTools.pomodoroTimer,
  "kitchen-timer": funTools.kitchenTimer,
  "metronome": funTools.metronome,
  "breathing-timer": funTools.breathingTimer,
  "reaction-test": funTools.reactionTest,
  "typing-speed-test": funTools.typingSpeedTest,
  "work-hours-calculator": funTools.workHoursCalculator,
  "bedtime-calculator": funTools.bedtimeCalculator,
  "countdown-to-date": funTools.countdownToDate,
  "stopwatch": funTools.stopwatch,
  "word-of-the-day": funTools.wordOfTheDay,
  "quote-of-the-day": funTools.quoteOfTheDay,
  "yes-no-decider": funTools.yesNoDecider,
  "wall-of-love": proof.wallOfLove,
  "testimonial-carousel": proof.testimonialCarousel,
  "testimonial-marquee": proof.testimonialMarquee,
  "testimonial-spotlight": proof.testimonialSpotlight,
  "rating-summary": proof.ratingSummary,
  "rating-badge": proof.ratingBadge,
  "video-testimonial-wall": proof.videoTestimonialWall,

  "countdown-timer": st.countdownTimer,
  "announcement-bar": st.announcementBar,
  "sticky-cta": st.stickyCta,
  "faq-accordion": st.faqAccordion,
  "logo-carousel": st.logoCarousel,
  "image-gallery": st.imageGallery,
  "before-after-slider": st.beforeAfterSlider,
  "pricing-table": st.pricingTable,
  "link-in-bio": st.linkInBio,
  "age-calculator": st.ageCalculator,
  "tip-calculator": st.tipCalculator,
  "split-bill-calculator": st.splitBillCalculator,
  "sale-price-calculator": st.salePriceCalculator,

  "tweet-wall": proof2.tweetWall,
  "google-reviews-wall": proof2.googleReviewsWall,
  "google-rating-badge": proof2.googleRatingBadge,
  "product-reviews-carousel": proof2.productReviewsCarousel,
  "case-study-card": proof2.caseStudyCard,
  "customer-story-spotlight": proof2.customerStorySpotlight,
  "testimonial-comparison-table": proof2.testimonialComparisonTable,
  "press-logos": proof2.pressLogos,
  "nps-score-card": proof2.npsScoreCard,
  "audio-testimonial-player": proof2.audioTestimonialPlayer,
  "ugc-photo-wall": proof2.ugcPhotoWall,
  "live-activity-feed": proof2.liveActivityFeed,
  "rating-highlights-card": proof2.ratingHighlightsCard,

  "instagram-grid": social.instagramGrid,
  "instagram-carousel": social.instagramCarousel,
  "tiktok-feed": social.tiktokFeed,
  "youtube-grid": social.youtubeGrid,
  "youtube-shorts-row": social.youtubeShortsRow,
  "x-profile-feed": social.xProfileFeed,
  "linkedin-wall": social.linkedinWall,
  "facebook-page-feed": social.facebookPageFeed,
  "pinterest-board": social.pinterestBoard,
  "threads-feed": social.threadsFeed,
  "reddit-posts": social.redditPosts,
  "bluesky-feed": social.blueskyFeed,
  "discord-server-card": social.discordServerCard,
  "twitch-status": social.twitchStatus,
  "spotify-playlist": social.spotifyPlaylist,

  "evergreen-countdown": promo2.evergreenCountdown,
  "email-capture-popup": promo2.emailCapturePopup,
  "exit-intent-popup": promo2.exitIntentPopup,
  "floating-whatsapp-button": promo2.floatingWhatsAppButton,
  "live-visitor-counter": promo2.liveVisitorCounter,
  "recent-sales-toasts": promo2.recentSalesToasts,
  "goal-progress-bar": promo2.goalProgressBar,
  "coupon-reveal": promo2.couponReveal,
  "spin-to-win": promo2.spinToWin,
  "banner-rotator": promo2.bannerRotator,
  "waitlist-counter": promo2.waitlistCounter,

  "lightbox-gallery": media2.lightboxGallery,
  "video-player-card": media2.videoPlayerCard,
  "podcast-player": media2.podcastPlayer,
  "audio-player": media2.audioPlayer,
  "pdf-viewer": media2.pdfViewer,
  "timeline": media2.timeline,
  "changelog-feed": media2.changelogFeed,
  "blog-posts-embed": media2.blogPostsEmbed,

  "product-showcase-card": commerce.productShowcaseCard,
  "payment-link-button": commerce.paymentLinkButton,
  "digital-product-card": commerce.digitalProductCard,
  "shopify-product-carousel": commerce.shopifyProductCarousel,
  "etsy-feed": commerce.etsyFeed,
  "gumroad-embed": commerce.gumroadEmbed,
  "donation-button": commerce.donationButton,
  "gift-card-widget": commerce.giftCardWidget,
  "stock-badge": commerce.stockBadge,
  "course-card": commerce.courseCard,

  "google-maps-card": info.googleMapsCard,
  "opening-hours": info.openingHours,
  "location-directions": info.locationDirections,
  "event-countdown": info.eventCountdown,
  "event-agenda": info.eventAgenda,
  "team-grid": info.teamGrid,
  "vcard-business-card": info.vcardBusinessCard,
  "qr-code-card": info.qrCodeCard,
  "wifi-share-card": info.wifiShareCard,
  "weather-card": info.weatherCard,
  "world-clock": info.worldClock,

  "github-repo-card": profiles.githubRepoCard,
  "github-contributions-graph": profiles.githubContributionsGraph,
  "product-hunt-card": profiles.productHuntCard,
  "app-store-rating-card": profiles.appStoreRatingCard,
  "chrome-extension-reviews-card": profiles.chromeExtensionReviewsCard,
  "steam-profile": profiles.steamProfile,
  "strava-activity": profiles.stravaActivity,
  "goodreads-shelf": profiles.goodreadsShelf,
  "letterboxd-films": profiles.letterboxdFilms,
  "chess-stats": profiles.chessStats,
  "duolingo-streak": profiles.duolingoStreak,
  "now-playing": social.nowPlaying,

  "percentage-calculator": tools2.percentageCalculator,
  "date-difference": tools2.dateDifference,
  "loan-calculator": tools2.loanCalculator,
  "bmi-calculator": tools2.bmiCalculator,
  "unit-converter": tools2.unitConverter,
  "currency-converter": tools2.currencyConverter,
  "password-generator": tools2.passwordGenerator,
  "qr-generator": tools2.qrGenerator,
  "color-palette-generator": tools2.colorPaletteGenerator,
  "json-formatter": tools2.jsonFormatter,
  "markdown-preview": tools2.markdownPreview,
  "invoice-generator": tools2.invoiceGenerator,

  "accordion": layout2.accordion,
  "tabs": layout2.tabs,
  "card-carousel": layout2.cardCarousel,
  "text-marquee": layout2.textMarquee,
  "sticky-footer-bar": layout2.stickyFooterBar,
  "floating-action-menu": layout2.floatingActionMenu,
  "email-signature-card": layout2.emailSignatureCard,
  "newsletter-archive-embed": layout2.newsletterArchiveEmbed,
  "awards-badges-row": layout2.awardsBadgesRow,
  "trust-badges": layout2.trustBadges,

  "instagram-story-reel": community2.instagramStoryReel,
  "user-video-reel-row": community2.userVideoReelRow,
  "review-request-link-card": community2.reviewRequestLinkCard,
  "top-reviewers-leaderboard": community2.topReviewersLeaderboard,
  "community-avatar-stack": community2.communityAvatarStack,
  "testimonial-qr-poster": community2.testimonialQrPoster,
  "celebration-kudoboard": community2.celebrationKudoboard,
  "guestbook-wall": community2.guestbookWall,

  "calorie-bmr-calculator": utility2.calorieBmrCalculator,
  "hours-worked-calculator": utility2.hoursWorkedCalculator,
  "timezone-meeting-planner": utility2.timezoneMeetingPlanner,
  "random-picker-wheel": utility2.randomPickerWheel,
  "reading-time-badge": utility2.readingTimeBadge,
  "link-preview-card": utility2.linkPreviewCard,
  "screenshot-placeholder-generator": utility2.screenshotPlaceholderGenerator,
  "favicon-preview-card": utility2.faviconPreviewCard,
  "uptime-badge": utility2.uptimeBadge,
  "status-page-embed": utility2.statusPageEmbed,

  "pretty-event": prettyWidgets.prettyEvent,
  "pretty-birthday": prettyWidgets.prettyBirthday,
  "pretty-launch": prettyWidgets.prettyLaunch,
  "pretty-deadline": prettyWidgets.prettyDeadline,
  "pretty-exam": prettyWidgets.prettyExam,
  "pretty-wedding": prettyWidgets.prettyWedding,
  "pretty-vacation": prettyWidgets.prettyVacation,
  "pretty-newyear": prettyWidgets.prettyNewYear,
  "pretty-payday": prettyWidgets.prettyPayday,
  "pretty-hours": prettyWidgets.prettyHours,
  "pretty-ring": prettyWidgets.prettyRing,
  "pretty-dots": prettyWidgets.prettyDots,
  "pretty-fill": prettyWidgets.prettyFill,
  "pretty-goal-bar": prettyWidgets.prettyGoalBar,
  "pretty-gauge": prettyWidgets.prettyGauge,
  "pretty-year": prettyWidgets.prettyYear,
  "pretty-month": prettyWidgets.prettyMonth,
  "pretty-week": prettyWidgets.prettyWeek,
  "pretty-day": prettyWidgets.prettyDay,
  "pretty-steps": prettyWidgets.prettySteps,
  "pretty-habit": prettyTrackers.prettyHabit,
  "pretty-water": prettyTrackers.prettyWater,
  "pretty-todo": prettyTrackers.prettyTodo,
  "pretty-timer": prettyTrackers.prettyTimer,
  "pretty-stopwatch": prettyTrackers.prettyStopwatch,
  "pretty-savings": prettyTrackers.prettySavings,
  "pretty-reading": prettyTrackers.prettyReading,
  "pretty-workout": prettyTrackers.prettyWorkout,
  "pretty-streak": prettyTrackers.prettyStreak,
  "pretty-mood": prettyTrackers.prettyMood,
  "pretty-budget": prettyTrackers.prettyBudget,
  "pretty-weight": prettyTrackers.prettyWeight,
  "pretty-fundraiser": prettyTrackers.prettyFundraiser,
  "pretty-life": prettyTrackers.prettyLife,
  "pretty-vote": prettyTrackers.prettyVote,

  "aurora-balance": auroraWidgets.auroraBalance,
  "aurora-pulse": auroraWidgets.auroraPulse,
  "aurora-uptime": auroraWidgets.auroraUptime,
  "aurora-energy": auroraWidgets.auroraEnergy,
  "aurora-ticker": auroraWidgets.auroraTicker,
  "aurora-sleep": auroraWidgets.auroraSleep,

  ...SPECIAL_RENDERERS,
  "special-feature-tour": featureTour,

  ...PLATFORM_RENDERERS,
  ...PLATFORM_CARD_RENDERERS,
  ...IOSW_RENDERERS,
  ...MAC_RENDERERS,
  ...MACOS_DOCK_RENDERERS,
  ...APPLE_RENDERERS,
};

/* Form widgets embed as iframes (camera access, their own document, their own
   multi-step flow) and render through the FormRouter on the form pages. */
export const IFRAME_WIDGETS = new Set([
  "testimonial-form",
  "star-comment-form",
  "video-recorder-standalone",
  "nps-survey",
  "side-feedback-tab",
  "contact-form",
  "newsletter-signup",
  "multi-question-survey",
  "poll",
  "quiz",
  "feature-request-board",
  "bug-report-widget",
  "rsvp-form",
  "booking-request-form",
  "multi-step-wizard-form",
]);

/* The iframe target any preview surface (gallery, editor) should use for
   form widgets. Config travels in the URL; the form pages run demo mode. */
export function isIframeWidget(type: string): boolean {
  return IFRAME_WIDGETS.has(type);
}

export function previewIframeSrc(type: string, config: WidgetConfig): string {
  return "/preview/form?type=" + type + "&cfg=" + encodeURIComponent(JSON.stringify(config));
}

export function renderWidget(
  id: string,
  config: WidgetConfig,
  items?: TestimonialData[],
  extra?: Record<string, unknown>
): RenderResult {
  const fn = RENDERERS[id];
  if (!fn) throw new Error("No renderer for widget: " + id);
  const out = fn(config, items ?? [], extra);
  const theme = themeCss(config);
  return theme ? { ...out, css: out.css + "\n" + theme } : out;
}
