---
title: "Setting terminal to launch .desktop with GIO"
categories:
  - GTK
tags:
  - gtk
  - linux
  - en
---

When learning about Gemini today, I clicked on a `gemini://` link, set my Firefox open-with preference to a command line client and opened, but nothing happened.

Searching for a way to launch a `.desktop` by command line, hoping for better debugging experience, I got `gtk-launch <.desktop name>`. With that name I assumed there was a GTK or GLib or G-something way to launch `.desktop` and Firefox was likely also using it. Using that command, again, no new terminal was launched but at least there was a line by shell spawned by gtk-launch complaining xterm not found.

A quick search about how to set terminal to use with gtk-launch returned nothing but old and unanswered StackOverflow threads. Time to read the source. I've looked into GTK and GLib a little bit before, quite readable, so it should not be hard for me.

In `gtk/gtk-launch.c` I found this:
```c
  if (!g_app_info_launch (info, l, launch_context, &error))
```
A G-something way, as I guessed.

Searching for `g_app_info_launch` brought me to GIO, a part of GLib. Within that function I saw this:
```c
  return (* iface->launch) (appinfo, files, launch_context, error);
```
Looked like `GAppInfo` was an interface and I needed to dig into the used implementation.

Back to gtk-launch, looking at what `info` variable was:
```c
  info = G_APP_INFO (g_desktop_app_info_new (desktop_file_name));
```
GDesktopAppInfo it was.

In GDesktopAppInfo, digging into functions, I found out that it would use either `g_desktop_app_info_launch_uris_with_dbus` or `g_desktop_app_info_launch_uris_with_spawn`. The `*_with_spawn` one sounded simpler. Assuming those two ways would not differ to much in finding terminal emulators to use, I looked into that one and saw:

```c
      if (info->terminal && !prepend_terminal_to_vector (&argc, &argv))
```
`prepend_terminal_to_vector` was the routine for finding terminal emulators. It found within a few hard-coded names and fallback to `xterm` . There were `gnome-terminal`, `mate-terminal`, `xfce4-terminal`, `nxterm`, `color-xterm`, `rxvt`, `dtterm` and finally `xterm`. The one I used was not on the list.

As I will likely not install xterm on my machine, I created an xterm link to my terminal and problem solved. gtk-launch and Firefox now launch command line tools successfully.
