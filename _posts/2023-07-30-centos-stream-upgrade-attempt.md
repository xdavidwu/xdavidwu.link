---
title: "CentOS Stream 8 to 9 upgrade attempt"
categories:
  - CentOS
tags:
  - centos
---

事隔[四年](/centos/centos-upgrade-attempt/)又再來玩一次手動折騰（中間 8 升 Stream 8 偏 trivial 就沒紀錄了）

這次拿來升級的環境只有一個 CentOS Stream 8 的 lxc，用來架 GitLab

首先要蓋掉 dnf repos，手動抓 el9 的 centos-stream-release, centos-stream-repos, centos-gpg-keys，`rpm -U --force` 下去

這次很順 `dnf makecache` `dnf upgrade --allowerasing` 下去就差不多了

但接下來手動刪 el8 殘留物的時候就撞到了 `dnf remove` 不會動

Error message 看起來像 rpm 嘗試用 `sqlite` 這個 backend，但看到現有 repo db 的長相給改成了 `bdb_ro` （ro 猜是 readonly，看來 rpm 有換過格式）

查了一下確實 [rpm 從 Berkeley DB 轉成了 SQLite](https://fedoraproject.org/wiki/Changes/Sqlite_Rpmdb)，用 `rpmdb --rebuilddb` rebuild db in SQLite 就可以解決

再來 dnf modules 噴了一堆東西被自動搬到 `@modulefailsafe` 並且底下都炸 `platform(el:8)` 之類的 dependency 解不開

這個反而單純，因為我沒有在用那些 dnf modules，一次把它 disable 光光就解決了： `dnf module disable virt nodejs perl perl-IO-Socket-SSL perl-libwww-perl postgresql python27 python36`

再來將 gitlab-ce 轉到 el9 時撞到 package signature 驗證不過，爬了一下該有的 config， key 也都跟原本 el8 的一樣，但在驗 package 時有出現 warning `Signature not supported. Hash algorithm SHA1 not available.`

查了一下 [el9 把 SHA1 預設關了](https://www.redhat.com/en/blog/rhel-security-sha-1-package-signatures-distrusted-rhel-9)，可以用 `update-crypto-policies --set DEFAULT:SHA1` 先開回來解決，而 `update-crypto-policies` rpmfind 找出是在 `crypto-policies-scripts` 裡

除了這些之外沒遇到多少問題

另外注意到了 DBus implementation 換成了 dbus-broker

看來這次 el8 -> el9 比上次 el7 -> el8 小很多
