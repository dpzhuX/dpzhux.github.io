---
title: Thread pool
date: 2020-02-20 12:30:00
categories:
- Notes
tags:
- Notes
description: This post archives the learning on thread pool
---

```
Task queue
-----------------------
[X] [X] [X] [X] [X] [X] -----> [X]
-----------------------         |
                                |
               Thread pool      V
               [T] [T] [T] [T] [T] [T] [T]
                                |
                                |
                                V
                               [Y]
                          Completed task
```


Thread pool structure:
* Task queue
* Threads
* Thread management


