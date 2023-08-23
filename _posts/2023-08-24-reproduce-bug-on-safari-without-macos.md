---
title: 不使用 macOS 重現網頁在 Safari 下的 bug
categories:
  - Web
tags:
  - web
  - webkit
  - flatpak
  - containers
  - x11
---

工作遇到有人在 Safari 撞到前端 bug

以此為契機挖出了一連串各種奇妙知識

首先因為工作性質的關係，跟使用者溝通以郵件為主，所以作法上選擇減少溝通成本盡量自行調查，
不過其實這次在仔細調查前對方也先回報換個瀏覽器就沒事了

## 各種版號們與 WebKitGTK

在 access log 中找到了事發的 UA

`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15`

第一眼看起來應該就是 Safari，不過也有人測過最新的 Safari 沒問題。
因為這次事件先順勢帶出了缺乏公用 Safari 測試環境的議題，去補充了一下 Safari 的知識，
對 [Safari, macOS, WebKit 版本對應](https://en.wikipedia.org/wiki/Safari_version_history) 有初步的印象，
發現不對勁，WebKit 605.1.15 相對於 macOS 10.15.7, Safari 15.3 也太老了，對應表上的 WebKit 版本實際上是 612.4.9。
到 WebKit GitHub 上搜尋 605.1.15，確實找到在各平台上產 UA strings 都把這個版號寫死，
找到相關的 [tracker item](https://bugs.webkit.org/show_bug.cgi?id=180365)，
為了防更多看 UA 特判產生的歪風所以乾脆把版號 freeze 了。
對於實際 Safari 與 WebKit 的版本對應，MDN [有更齊全的表](https://github.com/mdn/browser-compat-data/blob/main/browsers/safari.json)，
不過沒有 macOS 版本資訊

對於重現，因為沒有夠新的公用蘋果硬體，加上 macOS EULA 對於 VM 據說也只允許跑在蘋果硬體上，
所以打算放棄 macOS 的環境，採用 WebKitGTK 盡力重現。WebKitGTK 雖然跟 WebKit 活在同一個 repo 下，
版號跟 release cycle 也都是獨立的，勢必要想辦法在找出 WebKitGTK 與 WebKit 間的版本對應。
WebKitGTK 每個 minor 都是從 WebKit 本人再 branch 出去維護，
可以在 [GitHub Wiki](https://github.com/WebKit/WebKit/wiki/GLib-Stable-Branches) 找到整理，
老一些的版本（轉 GitHub 前？）則是整理在 [trac](https://trac.webkit.org/wiki/WebKitGTK/StableRelease#Listofreleases) 上，
在 GitHub 上可以看到 branch 點的 commit 包含在哪些 tags 裡，找最小就可以大略對應到 WebKit 版本

## Take 1: Flatpak

有了以上這些資訊，對於在非 macOS 下重現環境就只差要怎麼獲取與使用特定版本的 WebKitGTK。
使用上我選最知名的 client -- GNOME Web / Epiphany，對於獲取，第一個想法就是 Flatpak，
找到了 Flatpak [安裝特定版本 app 的方法](https://github.com/flatpak/flatpak/wiki/Tips-&-Tricks#downgrading)：

```sh
flatpak remote-info --log flathub org.gnome.Epiphany
flatpak update --commit=<desired commit from above> org.gnome.Epiphany
```

再來需要的就是 Epiphany Flatpak package 跟 WebKitGTK 版本對應，
找到了 Flathub 上 [Epiphany 的 manifest](https://github.com/flathub/org.gnome.Epiphany/blob/72326ed920af098fcb45f235ee54de170f06a92f/org.gnome.Epiphany.json)，
但上面沒有 WebKitGTK 的影子，往上追發現做在 `org.gnome.Platform`。
[GNOME platform](https://gitlab.gnome.org/GNOME/gnome-build-meta) 的作法比較複雜，
用了 [BuildStream](https://buildstream.build/)，WebKitGTK 的引入在 `elements/sdk/webkitgtk.inc`，
在對於各個 GNOME major 的 branch 上看 history 就可以知道哪個 GNOME major 對到哪個 WebKitGTK minor，
Epiphany 的 release 是 follow GNOME 的，所以就是直接找同個 major

對應版號後發現我需要的 WebKitGTK 大概落在 2.32 與 2.34，2.34 再對到 Epiphany Flatpak package 在 40.x，
結果 `flatpak remote-info --log` 一下，發現 Flathub 上已經沒有存這麼久以前的版本了，這次沒那麼簡單

## Take 2: OCI containers

換個傳統一點的想法就是從 stable distribution 去抓套件，但老東西抓 binary 丟上新系統 ABI 大概會接不上死一片，
裝個 VM 又有點累，於是用了 container:

```sh
podman run -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY --privileged -it alpine:3.15
```

用 X11 而不是 Wayland 是因為 GTK 不知為何貌似在 Wayland 下會先需要連 DBus，但 DBus 比較難搞定，
socket 丟進去 address 設好後還有 protocol 上的 auth 要處理，所以偷懶用 XWayland / X11。
privileged 則是因為 WebKitGTK 用 Bubblewrap 做 sandboxing，貌似需要些權限去開 namespaces，
但也懶得挖需要哪些 capabilities 了就乾脆丟個 privileged

```sh
apk add epiphany font-noto-cjk mesa-dri-gallium
epiphany
```

跑起來就能測了

有了這些功夫，遇到 Safari 使用者回報問題，大致上也都能用開放的系統重現個大概了

Off-topic 的後記：

這次撞到的是舊版 WebKit JS Date parsing 不吃 `YYYY-MM-DD HH:mm`，
其實在 ECMAScript 下用空格分隔不怎麼標準，不過因為其他 JS 實做有做，
後來[還是做了](https://bugs.webkit.org/show_bug.cgi?id=235468)
