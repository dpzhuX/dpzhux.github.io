---
title: GDB Cheat Sheet
categories:
 - Notes
tags:
 - Notes
description: The command for GDB debug
---

```bash
# Start GDB with a core file
gdb program corefile

# Show backtrace
bt

# Check local variables
info locals

# Check arguments
info args

# Navigate through stack frames
frame 1

# List the souce code
list

# Inspect memory
x/8x 0x12345678

# Step over
n

# Step into
s

# Step out
finish

# Quit
q
```
