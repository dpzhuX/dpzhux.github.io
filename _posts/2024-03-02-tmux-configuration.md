---
title: Snippet Tmux configuration
date: 2024-03-02 17:41:00
categories:
- Snippets
tags:
- Snippets
---

![Snippet](/uploads/images/0000/Snippet.jpg)
The configuration for tmux

<!-- more -->

```bash
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
setw -g mode-keys vi
set -sg escape-time 0

### use C-w to replace C-b
# bind <prefix> to C-w
# unbind C-b
# set-option -g prefix C-w
# bind-key C-w send-prefix

### use <prefix> s for horizontal split
bind s split-window -v

### use <prefix> v for vertical split
bind v split-window -h
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

### resize panes more easily
bind < resize-pane -L 10
bind > resize-pane -R 10
bind - resize-pane -D 10
bind + resize-pane -U 10

### force tmux to use 256 color
set -g default-terminal "screen-256color"
```
