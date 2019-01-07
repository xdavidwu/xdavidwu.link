---
title: "TensorFlow C++ installation"
categories:
  - TensorFlow
tags:
  - linux
---

這部份根本 undocumented 很煩

我最後竟然是跑去參考 Gentoo Linux 的 ebuild

需要的 Bazel targets:

* //tensorflow:install_headers
* //tensorflow:libtensorflow_cc.so

headers 的部份比較麻煩

install_headers target build 完後

```
sudo cp bazel-genfiles/tensorflow/include/. /usr/local/include/ -r
```

不過有些命名很菜市場可能會搞的一團糟

八成還會有 absl 和 protobuf 的路徑要修

```
sudo ln /usr/local/include/external/com_google_absl/absl /usr/local/include/absl -s
sudo ln /usr/local/include/external/protobuf_archive/src/google /usr/local/include/google -s
```

libraries 的部份:

```
sudo cp bazel-bin/tensorflow/libtensorflow_cc.so /usr/local/lib/
sudo cp bazel-bin/tensorflow/libtensorflow_framework.so /usr/local/lib/
```

編譯:

```
g++ foo.cpp -ltensorflow_framework -ltensorflow_cc
```

absl 的 header 貌似在 C++17 下會把 absl::string_view 用 std::basic_string_view 實做

可能會造成 link 時有用字串當參數的函式找不到 例如 Conv2D 的 constructor