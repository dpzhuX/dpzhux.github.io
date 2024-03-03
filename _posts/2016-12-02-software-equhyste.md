---
title: Software Equhyste - Equivalent viscous damping
date: 2016-12-02 16:04:25
categories:
- Software
tags:
- Software
---

![Equhyste](/uploads/images/0000/Equhyste.jpg)
I created a handy tool to calculate the area of a hysteresis loop and its equivalent viscous damping. Though the calculation isn't particularly complex, repetitive tasks can become tedious sometimes. This software can compute the complete cycles of a hysteresis loop, the area of each cycle, and the equivalent viscous damping corresponding to each cycle. The equivalent viscous damping is calculated using the following formula:

<!-- more -->
$${h_{eq}} = \frac{\Delta A}{4\pi  \cdot A}$$

Where: $\Delta A$ is the area of the hysteresis loop, and $A$ is the area of the shaded triangle OAB.

![Equhyste](/uploads/images/2016/SoftwareEquhyste1.svg)

With the formula above, we can quickly calculate the equivalent viscous damping,

![Equhyste](/uploads/images/2016/SoftwareEquhyste2.gif)

### Download and Installation

The software is compatible with Windows (x32, x64) platforms: [**DOWNLOAD**](https://drive.google.com/file/d/1FMRmGsAW0AfqQuwpsEGV8y5MTAf41Pus)

### Basic Operation

The software accepts text files with two columns of data, separated by commas, tabs, spaces, carats (^), or slashes (/). The following separator styles are supported,

![Equhyste](/uploads/images/2016/SoftwareEquhyste3.png)

The graphical area supports both keyboard and mouse operations:

- "+": Zoom in
- "-": Zoom out
- "↑": Move up
- "↓": Move down
- "←": Move left
- "→": Move right
- Drag with the left mouse button to zoom in
- Right-click to zoom out
