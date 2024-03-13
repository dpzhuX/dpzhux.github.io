---
title: Ansys shear wall seismic calculation
date: 2018-01-01 20:52:12
categories:
- Explorations
tags:
- Ansys
---

![ANSYS](/uploads/images/0000/ANSYS.jpg)
Shear wall is a common structural member adopted to resist lateral forces. It is generally used to resist the wind or seismic loads. This post analyzes a typical shear wall structure under seismic loading condition. This post will not focus on the model creation since such structure can be easily created by APDL loops. I just want to put more details on applying seismic loading to the structure.

<!-- more -->
The shear wall model is shown in the following figure. The structure has 12 stories. The height for the first story is 6 m while the height for other storys is 3 m. The bottom of the structure is fixed,

![Ansys shear wall](/uploads/images/2018/AnsysShearWallSeismic1.png)

In this model, we only consider the elastic behavior of the material. Thus, we set the elastic modulus of 3E10 and Poisson's ratio of 0.2. For dynamic analysis, the density should be provided. For concrete, the density is 2500 kg/m^3 here. To import the acceleration time history, we can use VREAD to read the data from file directly,

```
NPS=150
*DIM,TIME,,NPS
*VREAD,TIME,TIME,TXT,,IJK,NPS
(F10.3)
```

It should be noted that the above commands can only be imported into Ansys rather than copy paste into the command window directly. Thereafter, we need to set the analysis type,

```
ANTYPE,TRANS
```

The model can be solved by for loop in Ansys directly, as shown below,

![Ansys shear wall](/uploads/images/2018/AnsysShearWallSeismic2.png)

During running the solver, we can find that the acceleration direction is shown at the bottom of the structure, as indicated by the red arrow in the above figure. The stress distribution is shown in the following figure,

![Ansys shear wall](/uploads/images/2018/AnsysShearWallSeismic3.png)

We can also plot the reaction forces at the bottom node of the structure. The reaction force of the X direction is shown below,

![Ansys shear wall](/uploads/images/2018/AnsysShearWallSeismic4.png)

The reaction force of the Y direction is shown below,

![Ansys shear wall](/uploads/images/2018/AnsysShearWallSeismic5.png)

For the structural displacement, we can plot a joint displacement with X axis representing the X direction and Y axis representing the Y direction. The following figure shows the top node displacement of the structure, we should ignore the axis labels in this figure,

![Ansys shear wall](/uploads/images/2018/AnsysShearWallSeismic6.png)

By setting the animation, we can also obtain full structural responses under the provided seismic wave,

![Ansys shear wall](/uploads/images/2018/AnsysShearWallSeismic7.gif)

The animation clearly shows the multi-modal response of the shear wall structure under seismic wave. The rotation of the structure comes mainly from the asymmetric arrangement of the shear walls.

> The model is a test model, and the APDL code is available upon request.
