---
title: Build VTK 8.1.0 with Qt on a Mac
date: 2018-09-24 17:50:33
categories:
- Snippet
tags:
- Snippet
---

This snippet demonstrates the polt format that I often used in Wolfram Mathematica.

<!-- more -->

{% raw %}
Plot[Sin[x], {x, -Pi, Pi}, 
     Mesh->None, PlotRange->{{-Pi, Pi}, {-2, 2}}, 
     AspectRatio->9/16, PlotTheme->"Scientific", FrameStyle->Black, 
     TicksStyle->Directive[FontSize->20], ImageSize->Large, 
     AxesLabel->Automatic, LabelStyle->Directive[FontSize->20, 
     FontFamily->"Times New Roman"], Epilog->{Text[Style[ 
        ToExpression[ "y = 12 \\frac{\\partial^2 f(x)}{\\partial x^2}", 
        TeXForm, HoldForm], FontFamily->"Times New Roman", FontSize->20, 
        Bold, Black], Scaled[{.25, .80}]]}]
{% endraw %}

Here is the diagram,

![Wolfram](/uploads/images/2018/WolframPlotFormat1.png)

Here is the Wolfram notebook ([WolframPlotFormat1.nb](/uploads/files/2018/WolframPlotFormat1.zip)) used in this post.