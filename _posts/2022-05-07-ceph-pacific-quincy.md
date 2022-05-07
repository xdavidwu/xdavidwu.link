---
title: "Ceph Pacific to Quincy upgrade notes"
categories:
  - Ceph
tags:
  - ceph
  - en
---

Some random notes from upgrading my Ceph cluster:

ceph-volume is packaged separately, and not depended by ceph-osd (for Ubuntu it is under Recommends). BlueStore OSDs created with `ceph-volume lvm create` needs it to start.

Here's how I understand how starting BlueStore OSDs work: systemd service `ceph-volume@lvm-{osd id}-{uuid}.service` (under multi-user.targets.want) runs `ceph-volume-systemd lvm-{osd id}-{uuid}`, which is a wrapper for `ceph-volume lvm trigger {osd id}-{uuid}`, which is currently equivalent to `ceph-volume lvm activate --auto-detect-objectstore {osd id} {uuid}`. It will find the LVM devices, mount tmpfs at `/var/lib/ceph/osd/{cluster}-{osd id}`, populate it, and start `ceph-osd@{osd id}.service` which runs the osd daemon.

If it fails, we can use `ceph-volume lvm activate --all` to start them manually.

When upgrading Ceph, restarting `ceph-{daemon}.target` will restart all those daemons, which is especially useful when upgrading OSDs.
