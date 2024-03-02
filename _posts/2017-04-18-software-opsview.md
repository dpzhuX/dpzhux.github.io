---
title: Software OPSView - OpenSees visualization tool
date: 2017-04-18 13:02:20
categories:
- Software
tags:
- Software
---

![OPSView](/uploads/images/0000/OPSView.jpg)
I had previously developed a tool for displaying OpenSees models, but due to time limitation, it was somewhat rudimentary. Moreover, in its post-processing stage, it could only display structural deformations, not stress contour maps, which didn't fully align with the software intended purpose for visualization. Recently, I took some time to explore VTK and, integrating it with Qt, I rewrote the software. The initial plan was to display all output information from the models. However, due to the lack of inconsistency in input and output styles among elements developed by different authors, it is challenging to unify the results for processing. Currently, the software can only display colors for single elements. Another issue is that displaying element or node numbers in large models will be laggy, which is related to VTK's operation mechanism. After trying several approaches, I finally settled on a compromise solution that allows for control without affecting the display.

<!-- more -->

### Download and Installation

The software is compatible with Windows (x32, x64) platforms: [DOWNLOAD](https://drive.google.com/file/d/13tLU8WBE5Zgwatg5FEq5xxWHzeSfzfL_)

### Basic Operation

The following two animations show the basic functionalities of this software,

#### Show stress contour

![Usage](/uploads/images/2017/SoftwareOpsview1.gif)

#### Show real-time deformation

![Usage](/uploads/images/2017/SoftwareOpsview2.gif)

> Real-time model deformation display initiates the network module to listen to OpenSees output, which may trigger alerts from Windows or other security software. Please authorize these alerts.
