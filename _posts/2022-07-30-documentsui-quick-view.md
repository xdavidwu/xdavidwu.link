---
title: '"Quick View" in DocumentsUI'
categories:
  - Android
tags:
  - android
  - privacy
  - en
---

I have been a Pixel user for a long time, mostly for joining Android Beta to test my apps. Pixels, however, bug me with a strongly opinionated behavior. Out-of-the-box, everything (except APKs, strictly speaking) you open in DocumentsUI will go through Google Drive (the app). This may be avoided by disabling Google Drive app package. Today, I found out the mechanism behind this behavoir.

In AOSP, DocumentsUI has a string config `trusted_quick_viewer_package`. This predefined package name is used for preview (or "quick view", as the source also suggests) the file. DocumentsUI contains two ways of opening a file (in `AbstractActionHandler`), preview (via that package) and regular (via a normal view intent). The code supports setting a primary method and fallback. When opening a file by clicking it from the UI, the primary is preview, and will fallback to regular. Disabling the quick viewer package (in this case, Google Drive) makes the preview intent fail and fallback to regular.

There is also another way around it. DocumentsUI contains a debug mode that can be triggered even on a build of type `user`. In that mode, various debugging commands are available (some of which are especially useful for developing a DocumentsProvider, by the way), including overriding the quick viewer package name. I don't want to ruin the fun of reading source code, but here's a hint: `CommandInterceptor`.

A quick search on AOSPXRef (and AndroidXRef) shows that `trusted_quick_viewer_package` is availble at lease since Nougat (`7.0.0_r1`).

Note that this "quick view" mechanism is available in AOSP. Even if a ROM looks very AOSP-ish and have source code published, an overlay in the device part may set this to something evil that transparently build a regular view intent for you, making you unaware of its existence, but also do shady things with your files.
