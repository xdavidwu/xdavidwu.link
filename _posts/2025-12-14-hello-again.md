---
title: Hello, *.xdavidwu.link... again?
categories:
  - Misc
tags:
  - en
  - site
---

As you may have noticed, the whole \*.xdavidwu.link infrastructure was down since August. It was caused by a non-technical problem and that is not going to be resolved in near future due to its complicated nature and the fact that I got a $DAYJOB.

\*.xdavidwu.link had been solely backed by my homelab-kind-of-thing, where I did interesting experiments and mostly just leave it there when it worked. The architecture was messy, tangled, overly reused for multiple unrelated purposes. Security was considered heavily, but availability was almost always ignored, excused by lack of redundancy at hardware level. The hardware was also aged, quirky and not really reliable.

I have been slowly refactoring \*.xdavidwu.link to make it more portable and resilient, actually since before the downtime. \*.xdavidwu.link was once constructed by foss (ignoring firmware, of course) and fully self-hosted, but now I am adding public resources into the mix, as long as it does not create much vendor lock-in and is still fairly easy to reimplement in foss. What you are seeing is a part of this effort: xdavidwu.link blog is now partially up via public static site hosting, sans the Matrix-powered commenting system and the Gemini protocol variant.
