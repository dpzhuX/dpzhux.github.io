---
title: Snippet GDB cheat sheet
date: 2024-02-17 09:30:15
categories:
- Snippets
tags:
- Snippets
---

![Snippet](/uploads/images/0000/Snippet.jpg)
The command for GDB debug

<!-- more -->

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
