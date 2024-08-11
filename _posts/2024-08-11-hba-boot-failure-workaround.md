---
title: Working around HBA option ROM boot failure
categories:
  - Misc
tags:
  - en
  - linux
  - bios
  - boot
---

One of my servers rebooted due to unexpected power failure, and after the power came back up, it tried to boot, but looped in HBA option ROM. A disk failed before that and I did not manage to take it out. I guessed that was the reason, but my server was at remote and I did not have physical access. I preferred to work around it remotely.

The server did have virtual CD-ROM and KVM feature (although it requires ancient version of Java on browsers, which is painful), and by that, I booted an ISO to get a working temporary Linux environment for inspecting the situation. To boot with virtual CD-ROM, I needed to skip the HBA option ROM loop via `CTRL+C` before that to make it not to try booting and go to its settings utility instead. With the temporary Linux environment, I checked that all the previously working disks are fine, and should be able to boot it if I loaded the kernel and initrd from something that did not go through the HBA.

Initially, I thought using an external GRUB from an ISO to load kernel from disk may work, and experimented with `grub-mkrescue`. GRUB did not seem to recognize any disks, which made sense without a dedicated driver for the HBA. I then tried to pack kernel and initrd into the ISO, but booting them got me a `452: out of range pointer`.

Then I tried [ISOLINUX](https://wiki.syslinux.org/wiki/index.php?title=ISOLINUX). Creating a kernel-loading ISO with it was easy and straightforward. Booting with it worked perfectly. This workaround works except that I might need to wire up the virtual CD-ROM again if it needs to boot another time.
