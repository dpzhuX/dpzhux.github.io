---
title: Mathematica grid line overflow
date: 2016-08-22 17:11:25
categories:
- Explorations
tags:
- Mathematica
---

![Mathematica](/uploads/images/0000/Mathematica.jpg)
During my previous usage of Mathematica commands to create a low-poly image with triangle patterns, I found an issue where the generated image consistently had white borders. But attempting to precisely control the image size with the crop command is useless, I have to process the image using highlight and binarization techniques. However, the issue of white borders remained unresolved. So, while I plot function graphs in Mathematica and set up grid lines, I found that the edges of the grid would often exceed the intended boundary. This resulted in the grid appearing as if it were laid over the function graph. So, I dedicated some time to search a solution and put my findings here.

<!-- more -->

### Default Grid Lines

Upon opening a Mathematica notebook and plotting a colorful sine function curve with the command,

```
Plot[Sin[x], {x, 0, 2 Pi}, GridLines -> Automatic, GridLinesStyle -> Directive[RGBColor[0.5, 0.8, 0.2]], ColorFunction -> "BlueGreenYellow", ImageSize -> 600]
```

The following image is obtained:

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow1.png)

Examining the y-axis of the image shows that the grid extends beyond the intended boundary. This issue primarily arises from using the GridLines command where. Although the grid is confined within the PlotRange, Mathematica inadvertently adds extra padding around the image, causing the grid to fill beyond the coordinate lines.

### Solution One

The simplest solution is to use the PlotRangePadding command to restrict Mathematica automatic extension of the padding area. According to the Mathematica help files, an additional 2% padding is added in each direction during plotting. The following command effectively limits this padding:

```
Plot[Sin[x], {x, 0, 2 Pi}, GridLines -> Automatic, GridLinesStyle -> Directive[RGBColor[0.5, 0.8, 0.2]], ColorFunction -> "BlueGreenYellow", ImageSize -> 600, PlotRangePadding -> 0]
```

By constraining the padding, Mathematica now only shows the figure within the specified PlotRange,

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow2.png)

This approach is also used for generating Graphics images. Without PlotRangePadding, images tend to have white borders:

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow3.png)

However, these images are unsuitable for creating masks without adding PlotRangePadding->0. This produces the following result:

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow4.png)

This adjustment significantly simplifies the process of mask application. Of course, if perfectionism isn't a concern, adjusting the coordinate range slightly to accommodate the automatic 2% padding can also be a useful workaround:

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow5.png)

### Solution Two

Alternatively, using a Frame to contain the image can effectively prevent any overflow beyond its boundaries. We can plot with the following command,

```
Plot[Sin[x], {x, 0, 2 Pi}, GridLines -> Automatic, GridLinesStyle -> Directive[RGBColor[0.5, 0.8, 0.2]], ColorFunction -> "BlueGreenYellow", Frame -> True, ImageSize -> 600]
```

Generate the following figure,

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow6.png)

A closer inspection shows that the automatic padding issue persists within the Frame interior. This allows the image to appear more complete. This can also be addressed by setting PlotRangePadding->0 for a fuller image display,

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow7.png)

Moreover, adjusting the Frame visibility can mimic the appearance of a standard coordinate axis,

{% raw %}
```
Plot[Sin[x], {x, 0, 2 Pi}, GridLines -> Automatic, GridLinesStyle -> Directive[RGBColor[0.5, 0.8, 0.2]], ColorFunction -> "BlueGreenYellow", Frame -> {{True, False}, {True, False}}, FrameTicks -> {{Automatic, None}, {Automatic, None}}, PlotRangePadding -> 0, ImageSize -> 600]
```
{% endraw %}

Resulting in the following graphic:

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow8.png)

Adding AxesStyle -> Opacity[0] can completely hide the mid line in the figure,

This creates a visually appealing result:

![Mathematica grid line overflow](/uploads/images/2016/MmaGridLineOverflow9.png)

### Conclusion

It took me considerable effort to resolve this issue, primarily because the Graphics documentation did not explain how to eliminate white borders. Consequently, the idea of creating graphical masks remained unfulfilled until today's discovery with Plot that grid lines exceeded their boundaries. This indicated that PlotRangePadding could provide a solution, and indeed, it proved effective.

The full script can be downloaded here: [DOWNLOAD](/uploads/files/2016/MmaGridLineOverflow.zip)
