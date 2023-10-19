---
title: "Creating an OS image with Kaniko"
categories:
  - Containers
tags:
  - kaniko
  - linux
  - en
---

It is common to create an OS image with a Containerfile like following:

```Dockerfile
FROM scratch
ADD rootfs.tar /
```

However, with Kaniko, `/etc/mtab` would be missing from the image.

In Kaniko, some predefined paths, including `/etc/mtab`, are in a [ignorelist][1]. If a path is in that list, it will be [ignored when taking a snapshot][2]. Currently only `/var/run` is able to be [configured][3] as excluded from ignoring.

On most systems, `/etc/mtab` is a symlink to `../proc/self/mounts`.

A workaround is using a minimal image with such symlink as base instead of building from scratch. We can build that image with a Containerfile like following:

```Dockerfile
FROM scratch
ADD busybox /
RUN ["/busybox", "ash", "-c", "/busybox ln -s ../proc/self/mounts /etc/mtab && /busybox rm /busybox"]
```

As there are no instruction to create a symlink, we use busybox for `ln`. Add busybox in the image, use busybox to create the symlink and delete itself. There is no shell at `/bin/sh`, so the `RUN` need to be in "exec form".

[1]: https://github.com/GoogleContainerTools/kaniko/blob/ece215c18113020f9151fb25e69fc4ecc157c395/pkg/util/fs_util.go#L58
[2]: https://github.com/GoogleContainerTools/kaniko/blob/ece215c18113020f9151fb25e69fc4ecc157c395/docs/designdoc.md#snapshotting-snapshotting
[3]: https://github.com/GoogleContainerTools/kaniko/blob/ece215c18113020f9151fb25e69fc4ecc157c395/cmd/executor/cmd/root.go#L177
