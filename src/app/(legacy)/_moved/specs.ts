/**
 * THE OLD DUDA URLS.
 *
 * pettyshine.com is a Duda build today and every path below is live and
 * indexed right now. Four of them are the final URLs on funded Google Ads
 * ad groups, so on cutover day a visitor who clicks a paid ad, an organic
 * result, or a backlink still arrives at the old address.
 *
 * GitHub Pages serves static files and cannot issue a 301, so each of these
 * gets a real page at the old path that hands the visitor to the new one.
 * The full mapping is in _plan/IA.md under "Redirect map for the DNS cutover"
 * and the runbook is in _plan/CUTOVER.md.
 *
 * The seven old paths that keep their address are NOT here and need nothing:
 * /auto-detailing, /ceramic-coating, /paint-protection-film,
 * /paintless-dent-repair, /interior-detailing, /marine-detailing, /contact.
 */

export interface MovedSpec {
  /** The old Duda path, no trailing slash, exactly as Google has it. */
  from: string;
  /** The new path on this site. Always ends in a slash. */
  to: string;
  /** What the destination is called. Used in the crumb and on the button. */
  destination: string;
  /** <title>. Never indexed, but a real title, not a placeholder. */
  title: string;
  description: string;
  /** The one h1. */
  heading: string;
  /** One or two short sentences. This is all a reader ever sees. */
  lead: string;
  /** The label on the one solid cyan button. Written, never generated. */
  action: string;
  /**
   * Set when the old page is retired rather than moved, so the page says
   * "removed" instead of pretending the content went somewhere.
   */
  removed?: boolean;
}

export const LEGACY = {
  /* ---------------------------------------------------------------
     Slug changes. Real pages, shorter addresses.
     --------------------------------------------------------------- */

  "auto-window-tinting": {
    from: "/auto-window-tinting",
    to: "/window-tinting/",
    destination: "Window Tinting",
    title: "Window Tinting has a new address",
    description:
      "The Petty Shine window tinting page moved to /window-tinting/. Same service, shorter address.",
    heading: "Window tinting moved.",
    lead: "The tint page now sits at a shorter address. You should land on it in a moment.",
    action: "Go to Window Tinting",
  },

  "curbed-wheel-repair": {
    from: "/curbed-wheel-repair",
    to: "/wheel-repair/",
    destination: "Wheel Repair",
    title: "Wheel Repair has a new address",
    description:
      "The Petty Shine curbed wheel repair page moved to /wheel-repair/. Curb rash and caliper refinishing share one page now.",
    heading: "Wheel repair moved.",
    lead: "Curbed wheels and caliper refinishing share one page now. You should land on it in a moment.",
    action: "Go to Wheel Repair",
  },

  /**
   * NOTE: the old path is /detailing-package and the obvious new slug,
   * /detailing-packages/, does not exist on this build. His published
   * detailing tiers live on /pricing/, so that is where this goes. Do not
   * repoint it at a route that has to be invented to receive it.
   */
  "detailing-package": {
    from: "/detailing-package",
    to: "/pricing/",
    destination: "Pricing",
    title: "Detailing packages moved to Pricing",
    description:
      "The Petty Shine detailing packages moved to /pricing/, where every published price sits together.",
    heading: "Detailing packages moved.",
    lead: "The detail tiers sit on the pricing page now, next to every other price he publishes. You should land there in a moment.",
    action: "Go to Pricing",
  },

  /* ---------------------------------------------------------------
     Town pages. Five of them, all folded under /areas/.
     --------------------------------------------------------------- */

  "randleman-nc": {
    from: "/randleman-nc",
    to: "/areas/randleman-nc/",
    destination: "Randleman",
    title: "Randleman has a new address",
    description:
      "The Petty Shine Randleman page moved to /areas/randleman-nc/. The shop is at 357 Branson Mill Road in Randleman.",
    heading: "The Randleman page moved.",
    lead: "Randleman sits under Areas now. You should land on it in a moment.",
    action: "Go to the Randleman page",
  },

  "paint-protection-greensboro-nc": {
    from: "/paint-protection-greensboro-nc",
    to: "/areas/greensboro-nc/",
    destination: "Greensboro",
    title: "Greensboro has a new address",
    description:
      "The Petty Shine Greensboro page moved to /areas/greensboro-nc/, with the drive time and route from the shop.",
    heading: "The Greensboro page moved.",
    lead: "Greensboro sits under Areas now, with the road distance from the shop door. You should land on it in a moment.",
    action: "Go to the Greensboro page",
  },

  "paint-protection-high-point-nc": {
    from: "/paint-protection-high-point-nc",
    to: "/areas/high-point-nc/",
    destination: "High Point",
    title: "High Point has a new address",
    description:
      "The Petty Shine High Point page moved to /areas/high-point-nc/, with the drive time and route from the shop.",
    heading: "The High Point page moved.",
    lead: "High Point sits under Areas now, with the road distance from the shop door. You should land on it in a moment.",
    action: "Go to the High Point page",
  },

  "paint-protection-asheboro-nc": {
    from: "/paint-protection-asheboro-nc",
    to: "/areas/asheboro-nc/",
    destination: "Asheboro",
    title: "Asheboro has a new address",
    description:
      "The Petty Shine Asheboro page moved to /areas/asheboro-nc/, with the drive time and route from the shop.",
    heading: "The Asheboro page moved.",
    lead: "Asheboro sits under Areas now, with the road distance from the shop door. You should land on it in a moment.",
    action: "Go to the Asheboro page",
  },

  "paint-protection-archdale-nc": {
    from: "/paint-protection-archdale-nc",
    to: "/areas/archdale-nc/",
    destination: "Archdale",
    title: "Archdale has a new address",
    description:
      "The Petty Shine Archdale page moved to /areas/archdale-nc/, with the drive time and route from the shop.",
    heading: "The Archdale page moved.",
    lead: "Archdale sits under Areas now, with the road distance from the shop door. You should land on it in a moment.",
    action: "Go to the Archdale page",
  },

  /* ---------------------------------------------------------------
     Retired. Nothing on any of the three, all three were indexed.
     --------------------------------------------------------------- */

  blog: {
    from: "/blog",
    to: "/",
    destination: "Petty Shine",
    title: "The blog is gone",
    description:
      "The old Petty Shine blog held one stub post and has been retired. Start at the home page.",
    heading: "The blog is gone.",
    lead: "There was one stub post on it and nothing worth keeping. You should land on the home page in a moment.",
    action: "Go to the home page",
    removed: true,
  },

  "my-post": {
    from: "/my-post",
    to: "/",
    destination: "Petty Shine",
    title: "That page is gone",
    description:
      "This was an empty page left behind by the old website builder. Start at the home page instead.",
    heading: "That page is gone.",
    lead: "It was an empty page the old website builder left behind. You should land on the home page in a moment.",
    action: "Go to the home page",
    removed: true,
  },

  "35468": {
    from: "/35468",
    to: "/",
    destination: "Petty Shine",
    title: "That page is gone",
    description:
      "This was an unnamed stub left behind by the old website builder. Start at the home page instead.",
    heading: "That page is gone.",
    lead: "It was an unnamed stub the old website builder left behind and it never had anything on it. You should land on the home page in a moment.",
    action: "Go to the home page",
    removed: true,
  },
} as const satisfies Record<string, MovedSpec>;
