---
title: Ansys prestressed bridge analysis
date: 2015-11-09 11:10:23
categories:
- Explorations
tags:
- Ansys
---

![ANSYS](/uploads/images/0000/ANSYS.jpg)
When conducting structural analysis in Ansys, modal analysis often does not consider the external loads applied to the model. Even when prestress is applied, Ansys usually does not consider the effect of prestress, which does not match the actual situation. Therefore, it is necessary to enable the prestress effects in the analysis to obtain more accurate results.

<!-- more -->

This post analyzes a prestressed bridge with the dimensions of the bridge as shown below,

![Dimension](/uploads/images/2015/AnsysPrestressedBridge1.svg)

![Dimension](/uploads/images/2015/AnsysPrestressedBridge2.svg)

The bridge model is created by Ansys APDL command based on the dimensions, as shown in the figure below,

![Model](/uploads/images/2015/AnsysPrestressedBridge3.png)

It should be noted that this bridge has a variable cross-section, and the upper and lower parts of the bridge's box section are equipped with prestressed tendons,

![Prestressed tendons](/uploads/images/2015/AnsysPrestressedBridge4.png)

For the application of prestress, the cooling method can be used. For convenience in analysis, the real constants of LINK8 elements are directly defined as follows,

```
R,4,0.02,-0.005
```

This indicates the application of an initial strain of -0.005, thus we can avoid the cooling method.

Before conducting modal analysis, a static analysis is performed first. During the static analysis, gravitational acceleration is applied, and the prestress effect is turned on. After the analysis is completed, the modal analysis starts, and the prestress effect must be turned on again. We set the number of modes to be extracted to 10. After the analysis, the first 10 modes are obtained, with the first mode deformation shown as follows,

![First mode](/uploads/images/2015/AnsysPrestressedBridge5.png)

The frequencies of the first 10 modes are as shown in the following figure,

![Frequencies with prestress](/uploads/images/2015/AnsysPrestressedBridge6.png)

If the prestress effect is turned off, the first 10 modes of the structure are as shown in the following figure,

![Frequencies no prestress](/uploads/images/2015/AnsysPrestressedBridge7.png)

Comparing the results, there are some differences, but for this model, the gap is not very significant mainly because the  prestress effect does not occupy a large proportion in the overall structure response.

> The model is a test model, and the APDL code is available upon request.