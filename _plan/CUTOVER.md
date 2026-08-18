# Petty Shine, the cutover runbook

Everything needed to take this build from the GitHub Pages preview to
www.pettyshine.com, in the order it has to happen.

---

## READ THIS FIRST: the domain expires 2026-09-06

`whois pettyshine.com` on 2026-08-17 returned **Registry Expiry Date 2026-09-06**.
Registrar is **Tucows**. That is inside three weeks of this document being written.

If that registration lapses, three things go dark at the same moment: the website, the
Google Ads account (its final URLs stop resolving and the account gets disapproved), and
any email on the domain. Losing the domain also loses the SEO history that this whole
redirect layer exists to protect.

**Before anything else in this file, Judson confirms auto renew is on at Tucows, and
confirms the card on file has not expired.** If he cannot get into the Tucows account,
renew it manually for the longest term he will accept. Do not start the DNS work until
the expiry date has moved.

This is the single item in this runbook that has a deadline set by someone else.

---

## 1. The two repository variables that flip preview to production

`.github/workflows/deploy.yml` reads both from **repository variables**, not secrets, so
the flip needs no code change and no new commit.

GitHub > the repo > Settings > Secrets and variables > Actions > **Variables** tab.

| Variable | Preview (today) | Production (cutover) | What it does |
|---|---|---|---|
| `NEXT_PUBLIC_BASE_PATH` | `/petty-shine` | **delete it, or set it empty** | Non empty means the site is served from a GitHub Pages project subpath. It sets Next's `basePath`, and it also sets `IS_PREVIEW` in `src/lib/asset.ts`, which is what makes `robots.ts` emit `Disallow: /` and what puts `noindex` in the root layout. Clearing it turns the whole site indexable in one move. |
| `CUSTOM_DOMAIN` | unset | `www.pettyshine.com` | Non empty makes the workflow write `out/CNAME`, which is what tells GitHub Pages to serve the custom domain. Leave it unset and Pages will keep serving the `github.io` URL and ignore the DNS. |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | unset | the real key | See section 6. |

Both flips happen in the same sitting. Setting `CUSTOM_DOMAIN` without clearing
`NEXT_PUBLIC_BASE_PATH` publishes a site whose assets all live under `/petty-shine/` and
whose every page is `noindex`. Clearing `NEXT_PUBLIC_BASE_PATH` without setting
`CUSTOM_DOMAIN` publishes an indexable site at a `github.io` address that competes with
the real domain.

After changing the variables, re run the workflow: Actions > Deploy to GitHub Pages >
Run workflow. Variables are read at build time, so an old successful run is not enough.

**The repo has no git remote configured locally.** Before any of this, confirm which
GitHub account and repository the Pages site actually lives in. The workflow's own header
comment names `https://nradachy-web.github.io/petty-shine/`, so that is the working
assumption, but confirm it rather than inherit it.

---

## 2. Pre-flight, all of it before DNS moves

Run these against the production build, not the preview.

```bash
npm run build                       # must exit 0
npx tsc --noEmit                    # must be clean
npm run audit                       # forbidden claims, reads out/
grep -rl "REBUILD ME" src/app       # must return nothing
```

Then check by hand:

- [ ] **No page in `out/` carries `noindex` that should be indexed.** Every finished page
      loses its `robots: { index: false }` in the same commit that deletes its REBUILD ME
      comment.
- [ ] **`src/app/sitemap.ts` and reality agree.** Every finished page is uncommented in
      the `PENDING` array, and nothing still carrying a `noindex` is listed. A noindex URL
      inside a sitemap is reported as an error in Search Console.
- [ ] **Every redirect stub's destination returns a real page.** All eleven resolved on
      2026-08-18, including the five under `/areas/[city]/`, which landed late. Re run this
      check anyway on the day: five of the eleven stubs depend on a route that was still
      being built while they were written, and a stub that redirects into a 404 is worse
      than no stub at all.

      ```bash
      for p in window-tinting wheel-repair pricing \
               areas/randleman-nc areas/greensboro-nc areas/high-point-nc \
               areas/asheboro-nc areas/archdale-nc; do
        test -f "out/$p/index.html" && echo "ok   /$p/" || echo "MISS /$p/"
      done
      ```

- [ ] **The sixteen `/window-tinting/<city>/` pages.** Sixteen pages that differ by a town
      name is the doorway page pattern Google acts on. As of 2026-08-18 they no longer
      carry `noindex` and they are still absent from the sitemap, so today they are
      crawlable through internal links but unadvertised, which is the worst of both. Pick
      one: give each page something real that applies only to that town and list them, or
      delete the directory. Do not leave them in this state at launch.
- [ ] **The quote form posts.** Submit a real test from `/quote/` on the preview and
      confirm it arrives. A form that silently drops leads is worse than no form.
- [ ] **The phone number.** See section 8, item 1. This is the most expensive thing on
      the list to get wrong.

---

## 3. DNS

**Nameservers are at Squarespace** (`NS01.SQUARESPACEDNS.COM` plus NSONE), even though the
site itself is built on Duda and the registrar is Tucows. So the records get edited in the
**Squarespace DNS panel**, not at Tucows and not in Duda. Judson needs that Squarespace
login. Get it before the day, not on the day.

The site is canonical at **www**, because `CUSTOM_DOMAIN` is `www.pettyshine.com` and
`BRAND.siteUrl` in `src/lib/constants.ts` is `https://www.pettyshine.com`. Every page on the
build already carries a canonical tag pointing there.

**Record 1, the required one.**

| Type | Host | Value |
|---|---|---|
| CNAME | `www` | `<owner>.github.io.` |

`<owner>` is the GitHub account that owns the Pages site, not the repository name. Confirm
it in section 1 before typing it.

**Record 2, so the bare domain works too.** Point the apex at GitHub's Pages addresses so
`pettyshine.com` redirects to `www.pettyshine.com`. Four A records and four AAAA records.
**Take the current addresses from GitHub's own Pages documentation on the day.** They have
changed before and a runbook is exactly the wrong place to trust a hardcoded IP.

Delete the old Duda A records and any Duda `www` record at the same time. Leave everything
else alone: MX, TXT, SPF, DKIM, DMARC and any Google site verification record all stay
exactly as they are. Removing an MX record here silently kills his email.

Then, in the repo, Settings > Pages:

- [ ] Custom domain reads `www.pettyshine.com` and shows the DNS check as passed.
- [ ] **Enforce HTTPS** is ticked. It only becomes tickable once GitHub has issued the
      certificate, which happens after DNS resolves and can take up to an hour. Do not
      walk away before this is on. An unticked box serves his paid traffic over plain
      HTTP.

**Do not cancel the Duda subscription on cutover day.** Leave it running for at least a
week. It is the only rollback that costs nothing, and canceling it while DNS is still
propagating hands some visitors a dead site.

---

## 4. The redirect layer, what it is and what it is not

GitHub Pages serves static files and cannot issue a 301. So every old Duda URL that
changed has a real page at its old path, and that page moves the visitor four ways: an
inline script, a zero second `<meta http-equiv="refresh">`, a `<link rel="canonical">` at
the new URL, and a visible sentence with a real link for anyone who has both disabled.

**Only the script carries the query string forward.** That is not a detail. Paid clicks
arrive with a `gclid` attached, and a `gclid` that does not survive the hop is a
conversion Google Ads never gets to attribute. The meta refresh cannot carry it. So the
stubs are a safety net, not the plan. **Update the ad final URLs in section 5.**

Eleven stubs, shipped:

| Old path, live today | Goes to | Why |
|---|---|---|
| `/auto-window-tinting` | `/window-tinting/` | slug change |
| `/curbed-wheel-repair` | `/wheel-repair/` | slug change |
| `/detailing-package` | `/pricing/` | `/detailing-packages/` does not exist on this build. His published detail tiers live on `/pricing/`. |
| `/randleman-nc` | `/areas/randleman-nc/` | town pages folded under `/areas/` |
| `/paint-protection-greensboro-nc` | `/areas/greensboro-nc/` | |
| `/paint-protection-high-point-nc` | `/areas/high-point-nc/` | |
| `/paint-protection-asheboro-nc` | `/areas/asheboro-nc/` | |
| `/paint-protection-archdale-nc` | `/areas/archdale-nc/` | |
| `/blog` | `/` | one stub post, nothing to preserve |
| `/my-post` | `/` | Duda placeholder |
| `/35468` | `/` | unnamed Duda stub, currently indexable |

Seven old paths keep their address and need no stub: `/auto-detailing`,
`/ceramic-coating`, `/paint-protection-film`, `/paintless-dent-repair`,
`/interior-detailing`, `/marine-detailing`, `/contact`.

Source of truth for the copy and the mapping: `src/app/(legacy)/_moved/specs.ts`.
The stub itself: `src/app/(legacy)/_moved/Moved.tsx`.

Each stub is `noindex, follow` with its canonical on the destination. That pairing is a
deliberate trade and worth knowing about: Google calls `noindex` plus a cross page
canonical a conflicting signal, and may decline to consolidate. The stub is the page we
are willing to lose. What actually carries the visitor is the script, the refresh, and the
visible link, and none of those depend on a crawler's decision.

Once the four ad groups point at the new URLs and Search Console shows the old paths
dropping out of the index, these stubs can be deleted. Not before, and not on cutover day.
Give it a full quarter.

---

## 5. Google Ads, account 668-110-4182

Do this in the same sitting as the DNS change. Not the day before, because the new URLs do
not resolve yet. Not the week after, because every click in between takes a redirect hop
that Google Ads penalises on landing page experience.

**Final URLs, per ad group:**

| Ad group | Current final URL | Change to |
|---|---|---|
| Paint Protection Film | `https://www.pettyshine.com/paint-protection-film` | `https://www.pettyshine.com/paint-protection-film/` |
| Ceramic Coating | `https://www.pettyshine.com/ceramic-coating` | `https://www.pettyshine.com/ceramic-coating/` |
| Dent Repair | `https://www.pettyshine.com/paintless-dent-repair` | `https://www.pettyshine.com/paintless-dent-repair/` |
| Paint Correction | `https://www.pettyshine.com/auto-detailing` | `https://www.pettyshine.com/paint-correction/` |

The first three gain a trailing slash, which matters because the build is
`trailingSlash: true` and the slashless form costs a redirect. The fourth is a real
change: the Paint Correction ad group has been sending buffing and correction traffic to
the detailing page. It now has a page of its own.

Then, in the same account:

- [ ] Sitelink, callout and structured snippet extensions: check every one for an old URL.
      They are edited separately from ad group final URLs and they are where stale links
      survive longest.
- [ ] Ad final URLs and mobile final URLs at the ad level, not just the ad group level.
- [ ] The call extension number, if section 8 item 1 changes the phone.
- [ ] Auto tagging is on, so `gclid` arrives on every paid click.
- [ ] The campaign is named "Modern Apex Strategies - Dynamic Search Ads" but has no DSA
      webpage targets and runs on real keywords in four ad groups. If DSA is ever turned
      on for real, exclude `/quote/`, `/thank-you/`, and every path in section 4.

---

## 6. Web3Forms

`src/lib/constants.ts` exports:

```ts
export const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "REPLACE_WITH_WEB3FORMS_KEY";
```

The literal string `REPLACE_WITH_WEB3FORMS_KEY` is caught by `scripts/audit-forbidden.mjs`
under the `placeholder-left-in` rule, so a build that reaches production without the key
fails its own audit. That is intentional. Do not work around it.

- [ ] Create the access key at web3forms.com against an inbox **Judson actually reads**.
      Not a shared agency inbox that nobody opens on a Saturday.
- [ ] Add it as repository variable `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (the workflow reads
      `vars.`, so a repository *variable*, not a secret). It is a public key by design and
      ships in the client bundle either way.
- [ ] Re run the deploy.
- [ ] Send a real test submission from the live site and confirm it lands in the inbox and
      is not in spam. Then send a second one from a phone.

---

## 7. The Google tag and the two conversion labels

This is the highest value change the new site makes to the ad account, and it is
independent of the DNS work. It can be done before cutover on the preview.

Today account 668-110-4182 has **no website conversion action at all**. Every conversion
it counts is a Google hosted engagement signal: map views, direction requests, other
engagements, plus `AD_CALL`. Smart Bidding has been optimising toward "someone looked at
the map" while $1,684 a month went out the door.

Four values in `GADS` in `src/lib/constants.ts` turn tracking on. Until they are filled in
the site loads no Google script at all and every tracking function no-ops, silently and on
purpose.

```ts
export const GADS = {
  googleTagId: "",        // AW-XXXXXXXXXX   master switch
  ga4Id: "",              // G-XXXXXXXXXX    optional
  labels: {
    quoteForm: "",        // conversion action: goal "Submit lead form", Website, count Once
    phoneClick: "",       // conversion action: goal "Contact",          Website, count Once
  },
} as const;
```

- [ ] Google Ads > Tools > Data manager > Google tag. Copy the `AW-` id into
      `googleTagId`.
- [ ] Create the **quote form** conversion action. Google shows a snippet containing
      `send_to: 'AW-1234567890/AbC-D_efGh12ijkLmn'`. Paste the part after the slash into
      `labels.quoteForm`. Pasting the whole string also works, `src/lib/gtag.ts` handles
      both.
- [ ] Create the **phone click** conversion action the same way, into `labels.phoneClick`.
- [ ] Commit, deploy, then test on the live site: submit the form and click a `tel:` link,
      and confirm both land in Google Ads. Conversions can take a few hours to appear.
- [ ] Once real conversions are flowing, review the Google hosted engagement actions. As
      long as map views count as conversions they keep contaminating the bidding signal.
- [ ] Note the double count guard. `PhoneLink` wires each `tel:` link, and
      `CtaClickTracking` is a delegated listener behind every `tel:` link on the site. A
      1.5 second repeat guard in `src/lib/gtag.ts` is what makes running both safe. Do not
      remove either one.

---

## 8. Open questions that must be answered before launch

From `_plan/RECON.md`. Every one of these is a thing the site currently either defaults on
or stays silent about. None of them may be guessed.

**1. Which number rings the shop.** This is the launch blocker.
`336-653-9199` is what `constants.ts` publishes today, and the evidence behind it is
lopsided: it is on the banner hanging in his own shop, on Yelp, Nextdoor, YellowPages,
Yahoo Local and BBB, and in both STEK's and Gtechniq's installer directories, which he
registered himself. `336-799-4326` appears only on the current Duda site and on two
scraper directories that almost certainly copied it from there. A number that exists only
on the site his outside web company built is very likely **their** call tracking number,
which would stop working the day he leaves them, and until then routes his calls through a
vendor he is leaving. Confirm with Judson, and if he confirms 653-9199, the same number
goes on the Google Ads call extension and the Google Business Profile.

**2. PPF: which film, and what warranty.** STEK's own installer directory lists him, at the
**Authorized** tier. His current site brands everything STEK and then promises an "XPEL 10
year warranty" in a bullet. Both the XPEL claim and any lifetime warranty claim are hard
blocked by `scripts/audit-forbidden.mjs`, so neither can ship by accident. What is still
missing is the real answer: which film line he installs, what the term actually is, and
who backs it. Until he answers, the PPF page publishes no warranty term.

**3. Window tint: which film line, and what warranty.** His old tint page promises
"lifetime warranties on both laminate and ceramic window films" and never names a
manufacturer. An unnamed lifetime warranty is unenforceable and is blocked by the audit.
The new page says nothing until he names the line.

**4. PPF and tint pricing: publish or stay quote only.** These are the two highest intent
services he pays the most to advertise and the only two with no published price. Every
other service on the site has real numbers. Publishing a starting price for these two is
the biggest single conversion lever left.

**5. Engine bay at $500.** Listed separately on his old site with no indication of which
service it attaches to. Confirm before it appears anywhere as an add on.

**6. Interior repair and vinyl wraps.** His own Google Business Profile description names
both, and his website nav names neither. "chrome delete near me" already shows up as a
paid search term in his account, which means demand exists. Ask whether he still offers
them before building pages for them.

**7. Review count, on publish day.** "4.9 from 47 Google reviews" was verified on
2026-08-17 and counts move. Recheck the day the site goes live. No `aggregateRating`
markup either way: a rating a business marks up about itself is ineligible.

**8. Squarespace DNS access.** Section 3 does not start until Judson can log in.

---

## 9. After the switch

- [ ] Walk the site on his phone, on cellular, not on shop wifi. Every page. That is how
      he will look at it.
- [ ] Confirm `https://www.pettyshine.com/robots.txt` no longer says `Disallow: /`. If it
      does, `NEXT_PUBLIC_BASE_PATH` is still set.
- [ ] Confirm `https://www.pettyshine.com/sitemap.xml` lists only finished, indexable
      pages.
- [ ] Click every one of the eleven old URLs in section 4 and confirm each lands on its
      new page. Then click one of them with `?gclid=test` appended and confirm the query
      string survives the hop.
- [ ] Google Search Console: add `https://www.pettyshine.com` as a property, verify by DNS
      TXT while the DNS panel is already open, submit the sitemap, and use "Remove
      outdated content" on `/35468` and `/my-post`.
- [ ] Google Business Profile: update the website link, and check the phone matches
      section 8 item 1.
- [ ] Facebook and Instagram: update the link in both bios.
- [ ] Watch Search Console coverage for two weeks. The eleven old paths should fall out of
      the index and their destinations should appear.
- [ ] Watch the Google Ads landing page report for the first week. A spike in "page not
      found" or a drop in landing page experience means a final URL was missed.

---

## 10. Rollback

If the site is wrong in a way that cannot be fixed inside an hour:

1. In Squarespace DNS, put the old Duda records back. This is why the Duda subscription
   stays paid for a week and why the old records get written down before they are deleted.
   **Write them down before deleting them.** A screenshot of the DNS panel takes ten
   seconds and is the whole rollback plan.
2. DNS propagation is not instant in either direction, so some visitors see the new site
   and some see the old one for a while. That is survivable. A dead domain is not.
3. Pausing the ad campaign is faster than fixing a landing page under pressure and costs
   nothing but a few hours of impressions.

The rollback that does not exist is the domain. See the top of this file.
