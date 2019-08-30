---
title: "docker in lxc"
categories:
  - Misc
tags:
  - docker
  - lxc
  - ubuntu
---

在 ubuntu 上的 lxc 裡再跑一層 docker (或還是一層lxc之類的)

主要會碰到的難關有兩個 _apparmor 和 cgroup_

apparmor 很好解決 ubuntu lxc 的 config template 就有提到

只要把以下的 config 取消註解 (或增加) 即可

```
lxc.include = /usr/share/lxc/config/nesting.conf
```

觀察這個 config 就只是切換成另一個 apparmor profile 和解決 proc 及 sysfs 的問題

```
# Use a profile which allows nesting
lxc.apparmor.profile = lxc-container-default-with-nesting

# Add uncovered mounts of proc and sys, else unprivileged users
# cannot remount those

lxc.mount.entry = proc dev/.lxc/proc proc create=dir,optional 0 0
lxc.mount.entry = sys dev/.lxc/sys sysfs create=dir,optional 0 0
```

再來是 cgroup

如果需要存取某些 devices 但是被擋

加入例如

```
lxc.cgroup.devices.allow = c 10:200 rwm
```

指定允許

這裡是以 tuntap 10:200 為例
