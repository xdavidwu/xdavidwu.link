---
title: Bring your own tools on debugging distroless containers
categories:
  - Containers
tags:
  - en
  - containers
  - kubernetes
  - linux
  - kernel
---

Distroless containers are common these days but they are hard to debug: they contains no executables other than the application itself, there are no shells, not even one Unix-like command. `kubectl exec` is then mostly useless, and `kubectl cp` does not work either, because of lack of `tar`.

But there are ways around it, without actually packing tools into the container or copying them into the working filesysystem.

If you know the internals, you may be familiar with `nsenter` command and `setns` syscall to poke around the namespaces. The goal here is to enter mount namespace of the containers, but not losing our debugging tools. Imagine if we have those tools already in memory, after those `setns` syscalls, instead of exec'ing a program from the target mount namespace, we just invoke the planted code?

Yes, this works, and I have patched busybox `nsenter` implementation to run `ash_main` instead of exec'ing to test it out. Combined with the "nofork" trick toggle in busybox that trys to avoid fork-and-exec but just run code for commands in the shell itself like shell builtins, this gives me a comfy debug experience without throwing any file into the container. But there is a much simpler way than this, even without involving any coding.

Quoting from `pid_namespaces(7)`,

> A /proc filesystem shows (in the /proc/pid directories) only processes
> visible in the PID namespace of the process that performed the mount,
> even if the /proc filesystem is viewed from processes in other
> namespaces.

and also considering the fact that `/proc/[pid]/exe` are not really symbolic links but representing kernel file handles, with PID namespace of the container also entered, `/proc/self/exe` may work as a way to slide an executable in.

Busybox also has a build-time toggle to prefer its applets when exec'ing, that is, it detects if the name is any of the command it implements, and execute `/proc/self/exe` instead. So all you need is just a statically-linked busybox with `nsenter`, `ash` applets and `CONFIG_FEATURE_PREFER_APPLETS`, then

```sh
busybox nsenter -t <container pid> -m -p ash
```

and you get a shell with all the applets you chose, inside the nearly-empty container.
