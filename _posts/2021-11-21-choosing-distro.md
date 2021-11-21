---
title: "Chosing Linux distribution"
categories:
  - Linux
tags:
  - linux
  - en
---

I had been looking into using Alpine Linux as my daily driver for a long time, and just switched to it recently. Before the switch, I was using Arch Linux. I have multiple years of experience using different distributions of Linux as desktop OS. Let's talk about selection of Linux distributions. In my opinion, choosing among Linux distros is about thier package management, packaging convention, selection of software, and release pattern.

#### Package management

This is about what package management tool is used. What differs among them are usually under these three categories: packaging scripts, management features, and package format.

##### Packaging scripts

The scripts that are read by package building tools for building packages.

PKGBUILD in pacman/makepkg and APKBUILD in apk/abuild are two examples of easily understandable packaging scripts. Both of them are in shell scripts (bash and busybox ash) and thus very flexible. PKGBUILD supports checking out various version control repositories, and in combination of determining package version from a shell function, it provides an easy way to construct "VCS packages", that is, to build packages from a changing, bleeding edge source code (like a git branch, or svn trunk), without making changes in script, while still be able to distinguish exactly which built packages is newer by generated version strings.

APKBUILD looks like when PKGBUILD is written in busybox ash, but there are many differences. abuild supports automatic dependency discovery. In APKBUILD, typically you only need to specify build-time dependency in `makedepends`, and linked shared libraries will be detected and added to run-time dependencies. It also add provides of libraries and commands automatically. Package split also works differently in APKBUILD. In PKGBUILD, we have `pkgbase` for a name of that PKGBUILD, and `pkgname` array splits the package, packaging functions install files into `$pkgdir` of each package. In APKBUILD, `pkgname` is the name of a main package, and `subpackages` list is a list of subpackage names. The package function of main package is called first, where files are installed into `$pkgdir`, and then subpackage functions are called, where files are futher moved from `$pkgdir` to `$subpkgdir`, making package splits more natural and easier. abuild additionally provides common subpackage functions for things like development files and document, most package splits will work with just adding the names in `subpackages`.

##### Management features

This is about user-facing package manager features. Some package managers selects packages in repositories order then versions order, while some package managers consider versions order first. Some support repository pinning of packages. Some support creating dummy package with a single command. These differences and additional features may or may not make your life easier depending on how you use them.

##### Package format

A simple internal format for packages is easier to debug, and may makes things easier when fixing a broken installation. Packages of pacman (`*.pkg.tar(.*)`) and apk (`*.apk`) are just tarball archives of its content with additional metadata written in fixed paths of the archives. For temporary fixes of broken package management tools install, we can just extract them as tarballs to root directory, without actually involving package management tools, then reinstall the packages using normal workflow with now working tools.

#### Packaging convention

This is about a distribution's policy and convention on subjects like how packages should be splitted, how to name a package and how non-free software are handled. Distributions like Alpine and Debian split documentation and development files into subpackages, while Arch Linux usually package the software without splitting. Some distributions have naming convention like naming libraries packages in `lib*`, while some distributions just use the name of software. Some distributions isolates non-free packages into an optional repository, or provide packaging scripts only, while some distribution allow non-free software in their core repositories.

#### Selection of software

Distributions act differently on selecting alternative software, implementation or forks. For libc, some use glibc while some use musl. For init system, some use systemd while some uses OpenRC. For default privilege escalation tool, most distro use sudo while some are discussing about switching to OpenDoas.

#### Release pattern

Some distributions are rolling release, some are stable, and some provide stable releases on top of rolling releases. Depending on what you use the OS for, you may need rolling or stable.

Under specific use cases, there are also a few more things to consider, like availability of kernel live-patching, presence of specific software packages directly provided by upstream, and other features.

I had been using Arch Linux for desktop usage as daily driver for years, for its rolling release and simplicity on packaging scripts. Recently, I switched to Alpine Linux edge with systemd added on top of it by me. I will write about how I did it in another post. I choosed Alpine Linux for its simplicity on package management, fast rolling release (on edge), easier software packaging, and musl. I have also been using stable version of Alpine Linux for container usage, choosing the same distro for desktop leaves me fewer things to care about. I still rely on journald, networkd, resolved on host environment, and I like them, so I added systemd.
