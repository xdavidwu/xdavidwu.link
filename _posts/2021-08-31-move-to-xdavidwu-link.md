---
title: "網站又搬家嘍"
categories:
  - Misc
tags:
  - site
---

之前用了一年的 eglo.ga 是 freenom 提供的免費網域, 在到期一年的時候, 沒有任何事先通知, 直接改解析為他們的廣告, 這個網域也直接被他們歸類成需付費的網域

以這段期間的使用經驗, freenom 提供的 nameserver 功能偏少, 不能添加 wildcard record, 能加入的 record type 偏少, 並且不太可靠, 偶爾會 SRVFAIL

評估之後, 終究是得付費的, 所以找了別家買了個 xdavidwu.link, 不過我的 infrastructure 是與別人共用的, 這個網域還是可能會幫忙架些我信任的朋友的服務

注意我的 Matrix 和 ActivityPub 也一律轉移了, 最近上線的 Matrix 留言區也是

Random thoughts:

在選擇域名時, 如果不想很認真的去檢查歷史, 盡量選擇較獨特的命名會比較安全

獨特的命名比較不會有上個擁有者使用期間還很近, 還握有著有效的 TLS 憑證的疑慮

另外, 對於網域和 TLS 憑證間這種可能產生擁有者可以暫時不符的問題, 如果 DANE 或類似的系統被大量採用, 可以很根本的解決這個問題, 但推行 DNSSEC 的使用和驗證應該還有很長一段路要走
