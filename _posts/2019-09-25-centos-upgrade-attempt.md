---
title: "CentOS 7.7 to 8 upgrade attempt"
categories:
  - CentOS
tags:
  - centos
---

紀錄一下我純手動升級 CentOS 8 的過程

拿來升級的環境有兩個 都是 CentOS 7.7 的 lxc

從 lxc 的 image 下載下來一陣子默默一直升到 7.7

其中一個基本上只額外裝了 gitlab-runner 和 docker

另一個是有 gitlab-ee, nodejs, pgsql, supervisord, vim

RHEL 用的 leapp CentOS 沒包, 而且看 code 只有看到 RHEL 的處理部份, 雖然應該大同小異但還是怕拿來用會有很多東西要修

lxc 在當時也還沒有 8 的 image

所以就憑我的想法實驗了一下

一切開始前先備份 這很重要

首先我嘗試直接改 repo url 去升級, yum 會報錯, 印象中是新的套件用了新 feature 沒辦法直接用舊的 yum, rpm stack 去裝

印象中長的像 `unsupported version 'if'` 之類的

所以我先從 lxc 外裝 yum 蓋過去, 基本上就是 wiki 上從現有系統 bootstrap 的那招, 但只有到裝 yum 的部份

大致流程就是外面裝好 yum, rpm 指定 root 到目標系統裝一下新的 centos-release, 解一下 rpmnew 讓新的 repo 資訊都到位

然後 yum 指定 installroot 和 releasever 去裝 yum

但這樣下去裡面執行 yum 還是會卡一個 dependency 的報錯, 不過 dnf 卻是好的可以用

再來我的作法是先 disable 所有非官方的 repo (我用的都還沒有 el8, 避免 url 有參考到 releasever 和其他其實不太要緊的 dependency 問題先停用)

到裡面下 `dnf upgrade --releasever=8 --allowerasing`, 這一次 releasever 還會抓到 7 所以要覆寫, 裝好後就不用了, allowerasing 是因為他 dependency solving 時會一度說要 remove systemd (我看最後 prompt 的變更倒是沒有)

跑 change test 的時候會報出一些衝突錯, 大多是套件改名造成新舊並存會衝突

改名衝突的我大多先 remove 舊的, 如果 remove 舊的會串到一堆 dependency 我再嘗試先用 rpm 強制裝新的下去, /etc 下的 config 如果衝到印象中我把他移開就能解決

注意追蹤實際上動了哪些套件

折騰完之後 `dnf list installed | grep el7` 之類的來個大掃除 剩下的大多是之前 dependency 的 leftover 刪掉不會牽到什麼

但有些是 7.7 到 8 反而版本號上是降版的所以沒更到 例如 tzdata (2019b vs 2019a), 我撞到的還有 elfutils-\* 系列

這些我也是 rpm 強制降版下去

大掃除完 el7 的套件就差不多了, 把真正需要的第三方 repo 開回來, 把被消失的東西裝回來 (有些可能用了 8 包的新版就不需要其他 repo 了, 例如我的 nodejs 就是從 nodesource 改用 CentOS 8 官方 AppStream repo 內的) (注意有很多東西都還是只有包 el7, 但說不定能拿來用, 例如 gitlab, gitlab-runner, docker)

docker 我撞到了一些 el7 後期的 containerd.io 有標 conflict 到自己 provide 的 containerd, 我用 dnf 看起來新的 rpm 不能這樣搞, 導致 docker-ce 和 containerd.io 都被裝到 2018 年的, 也是用 rpm 手動 --nodeps 下去解決

gitlab-ee 撞到了一個 policycoreutils 相關的 python (2?) 的 dependency 找不到, 我直接 rpm --nodeps 下去目前跑起來看似沒問題, 還撞到了一個 pages 的內部 http server 自動 start 起來時會沒有 listen on ipv6, 造成 pages 的 nginx reverse proxy 吃不到他, 目前我是手動 gitlab-ctl restart 解決

pgsql 從 9 升到了 10, 現有的 db 要轉一下 (`postgresql-setup --upgrade`, 撞編碼或 locale 的話調 `PGSETUP_INITDB_OPTIONS='-E <encoding> --locale=<locale>'`), 我的 authencation 會跑掉

supervisord 貌似沒包了, 所以我用 pip 去裝然後寫 systemd service

sendmail 移除不包了, 改用 postfix

yum-cron 沒了, 改用 dnf-automatic, config 大致上長一樣只是多了些其他吐 log 的方法

dhclient 改成 dhcp-client, 指令還是叫 dhclient, 我忘了先前 lxc 是怎麼讓他自動 start 的就寫了個 systemd service

python 我兩次都沒有直接到位, 要 `alternatives --config python` 一下

這樣搞下來目前看跑起來是沒什麼問題
