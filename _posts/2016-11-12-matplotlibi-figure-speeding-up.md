---
title: Matplotlib figure speeding up
date: 2016-11-15 10:16:33
categories:
- Tutorials
tags:
- Tutorials
---

![Matplotlib](/uploads/images/0000/matplotlib.jpg)
Let's start with something important: for Python 3.5 with Anaconda, install OpenCV using the command:
```
conda install -c menpo opencv3
```
And to install Mayavi on Python 3.5 with Anaconda, use the command:
```
conda install -c menpo mayavi=4.5.0
```

<!-- more -->

These commands are tested and put here to avoid forgetting. Of course, if you're not using Anaconda, you can ignore this.

Now, back to the main topic. When using Matplotlib for plotting, plotting simple figure usually does not have any problem. However, when an image contains many lines,despite Matplotlib ability to render the image smoothly,  we might notice that panning and zooming can become very laggy. Let's consider the following plotting code as an example,

```python
# -*- coding: utf-8 -*-
"""
Created on Sat Nov 12 16:54:26 2016
@author: Orycho
"""

import matplotlib.pyplot as plt
import random

N = 1000
segs = []
fig = plt.figure(figsize=(8, 6), dpi=80, facecolor='w', edgecolor='k')
ax = fig.add_subplot(1, 1, 1)
ax.set_xlim(0, 800)    
ax.set_ylim(0, 600)
for i in range(N):
    x1 = random.random()*800
    y1 = random.random()*600
    x2 = random.random()*800
    y2 = random.random()*600
    plt.plot((x1,x2), (y1,y2),color = 'k')
fig.tight_layout()
plt.draw()
```

This would directly render the following figure,

![Matplotlib figure](/uploads/images/2016/MatplotlibFigureSpeedingUp1.png)

If you try to pan or zoom with this figure, it would display very sluggishly. Therefore, it is necessary to speed up Matplotlib figures. matplotlib.collections is a class designed specifically to speed up the rendering of a large number of shapes,

> **matplotlib.collections**

> Classes for the efficient drawing of large collections of objects that share most properties, e.g., a large number of line segments or polygons.

> The classes are not meant to be as flexible as their single element counterparts (e.g., you may not be able to select all line styles) but they are meant to be fast for common use cases (e.g., a large set of solid line segemnts)

Thus, when plotting, first we can categorize all lines, and then use the add_collection() method to draw all line collections at once. This can significantly improve the refresh capability of Matplotlib figures. The experimental code is as follows,

```python
# -*- coding: utf-8 -*-
"""
Created on Sat Nov 12 16:54:26 2016
@author: Orycho
"""

import matplotlib.pyplot as plt
import matplotlib
import random

N = 1000
segs = []
for i in range(N):
    x1 = random.random()*800
    y1 = random.random()*600
    x2 = random.random()*800
    y2 = random.random()*600
    segs.append(((x1, y1), (x2, y2)))
ln_coll = matplotlib.collections.LineCollection(segs, colors='k')
fig = plt.figure(figsize=(8, 6), dpi=80, facecolor='w', edgecolor='k')
ax = fig.add_subplot(1, 1, 1)
ax.add_collection(ln_coll)
ax.set_xlim(0, 800)    
ax.set_ylim(0, 600)
fig.tight_layout()
plt.draw()
```

The figure produced using the above code demonstrates excellent responsiveness during panning and zooming. Due to the complexity of the image data, a GIF is not provided. Also, for 3D images, mplot3D provides corresponding collections, with Line3DCollection and Patch3DCollection, which are the most commonly used methods for speeding up rendering.
