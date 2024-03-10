---
title: Ansys 3D crack stress intensity factor
date: 2019-06-02 11:02:52
categories:
- Explorations
tags:
- Ansys
---

![ANSYS](/uploads/images/0000/ANSYS.jpg)
Previously, I analyzed the crack stress intensity factor for a 2D plate. An edge crack is created at the bottom of the plate and the SIF is obtained at the crack tip. When I try to create a 3D model, I found there are some difference for defining parameters associated with the crack tip. So, I create another example to determine the SIF in a 3D model.

<!-- more -->
Here is the basic dimensions of the model. The model length and width are set to 0.5 m while the width is set to 5 mm. Thus, we general consider this plate under plane stress condition. There exists a vertical crack at the center with the length of 2a = 0.02 m. The typical material parameters are set here: elastic modulus is 2.1E11 and Poisson's ratio is 0.3,
![Ansys 3D edge crack SIF](/uploads/images/2019/Ansys3dCrackSif1.svg)

First, we should create a 2D model, as shown in the following figure. It should be noted that the central crack should not share the same edge,
![Ansys 3D edge crack SIF](/uploads/images/2019/Ansys3dCrackSif2.png)

To control the crack mesh size, I use KSCON command directly. Here is the mesh detail around the crack tip,

![Ansys 3D edge crack SIF](/uploads/images/2019/Ansys3dCrackSif3.png)

The 3D model can be extruded by VDRAG command. It should be noted that the EXTOPT should be set. We also fix the left edge while apply 5 MPa stress to the right edge,

![Ansys 3D edge crack SIF](/uploads/images/2019/Ansys3dCrackSif4.png)

Similar to 2D plate crack model, we need to create the local coordinate system. As shown in the following figure, the X direction should be pointed to the crack propagation direction while Y direction should be pointed to the crack normal direction,

![Ansys 3D edge crack SIF](/uploads/images/2019/Ansys3dCrackSif5.png)

When we create CINT type, we still use SIFS to obtain the crack stress intensity factor. However, unlike 2D crack model, we need to specify the CTNC with the second and the third parameters,

```
CINT,NEW,1
CINT,TYPE,SIFS
CINT,CTNC,CK,16218
```

The second parameter denotes the crack-extension direction calculation-assist node. It can be any node on the open side of the crack. After running the solver, we can obtain the crack tip stress distribution,

![Ansys 3D edge crack SIF](/uploads/images/2019/Ansys3dCrackSif6.png)

Here are the results for the crack tip SIFs. These results can be obtained by PRCINT command directly,

![Ansys 3D edge crack SIF](/uploads/images/2019/Ansys3dCrackSif7.png)

> The model is a test model, and the APDL code is available upon request.
