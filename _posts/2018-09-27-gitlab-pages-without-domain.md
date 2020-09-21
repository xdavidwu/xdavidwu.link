---
title: "在不需要 domain 的情況下使用 GitLab Pages"
categories:
  - nginx
tags:
  - nginx
  - gitlab
---

在我的 case 中 GitLab 外面正好有一層 nginx 的 reverse proxy 可以利用

想法:

```
傳來 /pages/<user>/... 的 request
reverse proxy 內部將 uri 的 /pages/<user> 刪除
加上 Hosts: <user>.gitlab.domain 的 header
傳到 GitLab 取得原本該在 <user>.gitlab.domain/... 的網頁
```

實作 nginx config:

```nginx
location ~ /pages/(?<user>[^/]+)/ {
    rewrite ^/pages/([^/]+)/(.*)    /$2 break;
    proxy_pass  http://<gitlab ip>;
    proxy_set_header        Host    $user.gitlab.domain;
    proxy_redirect  //$user.gitlab.domain/  https://gitlab.domain/pages/$user/;
}
```

最後的 `proxy_redirect` 後面的 url 改一下就能達到連 GitLab 本身都不需要 domain

缺 domain, wildcard domain, wildcard tls 中任一項都能這樣硬上 GitLab Pages

不過美中不足的是 GitLab 設定裡的連結還是 &lt;user&gt;.gitlab.domain 的格式

要直接放在 /pages/&lt;user&gt; 而非 /pages/&lt;user&gt;/&lt;repo&gt; 的 repo 還是得命名成 &lt;user&gt;.gitlab.domain
