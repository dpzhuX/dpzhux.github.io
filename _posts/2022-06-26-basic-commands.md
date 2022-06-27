---
title: Basic Commands
date: 2020-06-26 18:30:00
categories:
- Notes
tags: 
- Linux 
- System
- Shell
description: This post archives the learning on linux commands
---

`tcpdump` prints out a description of the contents of packets on a network interface
```bash
tcpdump -nn -i eth0 port 22
```

`nc` is used for performing any operation in Linux related to TCP, UDP, or UNIX-domain sockets.
```bash
nc www.google.com 80
```

`netstat` generates displays that show network status and protocol statistics.
```bash
netstat -antp
```

`strace` is used to monitor and tamper with interactions between processes and the Linux kernel.
```bash
strace -ff -o out ./a.out
```