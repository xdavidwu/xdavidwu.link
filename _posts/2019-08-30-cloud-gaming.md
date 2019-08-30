---
title: "P106-100 Cloud Gamming on Linux"
categories:
  - Linux
tags:
  - linux
  - gpu
  - xorg
  - gaming
---

在 headless 的環境下用 P106-100 架出個人 Linux cloud gaming 平台

* 想法：透過 Steam in-home streaming + VPN 在 P106 上 gaming
	* NVIDIA 的 Linux OpenGL library 貌似沒有刻意封鎖或 debuff P106
* 需求：P106-100 + 任何有 NVENC 的卡
	* P106 沒有 NVENC
	* Kepler 的 NVENC 即可
	* Steam 目前(此文編寫時)還不支援 NVENC 以外的硬編
		* VA-API 他們目前只有拿來解碼
	* 沒有的話軟編很吃 CPU

首先當然是裝好 NVIDIA driver, Steam, Xorg, pulseaudio, 另外還會用到 x11vnc, xrandr

注意 NVIDIA driver 要有裝 32-bit 的部份(Steam 還在 32-bit)

架好一個 VPN 或 tunnel, 推薦用 WireGuard

如果是在 lxc 內, 記得把 P106 和 NVENC 卡的 cgroup 限制解除然後弄出 device node

設定 xorg.conf 類似如下

```
Section "Device"
    Identifier     "Device0"
    Driver         "nvidia"
    VendorName     "NVIDIA Corporation"
    BusID          "PCI:66:0:0"
EndSection

Section "Monitor"
    Identifier     "Monitor0"
    VendorName     "Unknown"
    ModelName      "Unknown"
    HorizSync       28.0 - 33.0
    VertRefresh     43.0 - 72.0
    Option         "DPMS"
EndSection

Section "Screen"
    Identifier     "Screen0"
    Device         "Device0"
    Monitor        "Monitor0"
    DefaultDepth    24
    Option         "AllowEmptyInitialConfiguration" "True"
    Option         "Coolbits" "31"
    SubSection     "Display"
        Depth       24
    EndSubSection
EndSection

Section "ServerLayout"
    Identifier     "Layout0"
    Screen      0  "Screen0" 0 0
EndSection
```

AllowEmptyInitialConfiguration 是用來允許沒有 output 的設定

Coolbits 只是順便解鎖一些設定例如超頻

BusID 是十進位的, lspci 是十六進位, 找到 P106 的 id 後記得轉換

開 Xorg 和 pulseaudio

用 xrandr 查看目前整個 screen 的大小, 用 --fb 改到目標大小

開 x11vnc + Steam + 一個 wm

開 Steam 時要加個環境變數 CUDA\_VISIBLE\_DEVICE 值是在 nvidia-smi 中 NVENC 卡的 index

NVENC 某些地方要經過 libcuda, 設定 CUDA\_VISIBLE\_DEVICE 可以限制 CUDA 可用的卡, 進而強制用特定卡做 NVENC (Steam 只會試第一張)

libcuda 現在在 NVIDIA driver 裡面就有, 不用額外裝整個 CUDA

這些可以寫進 xinitrc 之類的之後比較方便(x11vnc 可能之後不太需要)

用 vnc 進去登入設定 Steam, 幫遊戲寫個 .desktop 加進 Steam (如果不用加參數可以直接加 binary)

注意如果 .desktop 有變要在 Steam 裡重新加一次才會生效

可以順便用個 glxinfo 確認 OpenGL 是透過 NVIDIA 的 library 正常運作

設定好後 x11vnc 可以關掉避免影響效能

client 的部份記得在設定開 Display performance information 確認一下 encoder 是 NVENC

client 的硬解是用 libva1 的而非 libva2, 裝 backend driver 時不要裝錯

libva 是使用 DRI2, 而 XWayland 只支援 DRI3, Steam 有用 VAPutSurface 所以也不能直接改用 drm device, 所以如果要硬解基本上需要傳統 Xorg (libva 和 intel backend 有 DRI3 support pull request, 但我套用他在 Steam 會吃 BadWindow)
