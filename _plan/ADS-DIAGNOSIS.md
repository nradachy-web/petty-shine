# Why Judson's calls fell off

He texted on 2026-08-17: "seems like calls have fallen off the last 2 weeks."
He is right, and it is not random. Pulled live from CID 668-110-4182 on 2026-08-17.

## What actually happened: impressions fell 45% at the same spend

| Week | Spend | Impressions | Clicks | Avg CPC |
|---|---|---|---|---|
| 2026-05-04 | $391 | 1,110 | 58 | |
| 2026-05-11 | $430 | 1,233 | 48 | |
| 2026-05-25 | $421 | 1,267 | 76 | |
| 2026-07-06 | $435 | **702** | 54 | $8.05 |
| 2026-07-13 | $429 | **696** | 51 | $8.40 |
| 2026-07-27 | $366 | **669** | 44 | $8.32 |

Same money, roughly half the impressions. He is not being seen as often as he was in May.

## The three causes, in order of size

**1. The bidder is being fed noise, not calls.** Every conversion action on the account is a
Google-hosted engagement signal, and all of them are marked primary for goal:

| Action | Type | Last 8 weeks |
|---|---|---|
| Local actions, other engagements | Google hosted | 148 |
| Local actions, directions | Google hosted | 39 |
| Local actions, website visits | Google hosted | 28 |
| **Calls from ads** | **AD_CALL, the only real one** | **19** |
| Clicks to call | Google hosted | 8 |

In the week of 2026-08-10 the account booked 48 "other engagements" and **1** call. Smart Bidding is
chasing the 48. That is why real calls swing between 0 and 5 a week with no pattern. There is no
website form conversion and no website call-click conversion at all, so every lead the site produces
is invisible to the bidder.

**2. He is budget-capped about 40% of the time.** Lost impression share to budget has run 37% to 44%
in seven of the last eight weeks, while search impression share sits around 40%. He is simply off
the air for a large part of each day.

**3. CPCs rose.** Average CPC moved from roughly $7 to $8.40 over the same period, so a flat budget
buys fewer clicks and far fewer impressions.

Net: about $176 in spend per call from ads over the last eight weeks.

## Also worth knowing

Spend is running about $430/week, roughly $1,860/month, against a **$1,200/mo budget on file**. That
is about 55% over the contracted number. Either the record is stale or the budget drifted. Worth
reconciling before the next invoice conversation.

## The fix order

1. **Ship the new site with real conversion tracking.** A website form conversion and a website
   call-click conversion, both fed to the account. This is the root fix and it is the reason the
   rebuild matters commercially, not just visually.
2. **Demote the Google-hosted engagement actions** out of primary for goal, and promote calls plus
   the new website conversions. Do this the moment the site is live and the tag is firing, not
   before, or the bidder loses its only signal.
3. **Then** decide budget. Raising spend while the bidder optimizes toward "someone got directions"
   just buys more of the wrong thing.

Related: the portfolio-wide finding from the 2026-08-13 sweep is that this is not unique to Judson.
Site lead tracking is dark in 13 of 18 accounts, and no account books real conversion values.
