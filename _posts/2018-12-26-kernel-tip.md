---
title: "Linux kernel building tips"
categories:
  - Linux
tags:
  - kernel
---

*  nconfig looks prettier than menuconfig
*  syncconfig replaces slientoldconfig
*  localmodconfig uses lsmod to update .config with currently loaded modules
*  localyesconfig is like localmodconfig, but built-in instead of modulize
*  LSMOD env variable to provide lsmod output from file
*  INSTALL_MOD_PATH overrides modules_install root