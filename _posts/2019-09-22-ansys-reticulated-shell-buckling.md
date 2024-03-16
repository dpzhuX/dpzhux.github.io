---
title: Ansys reticulated shell buckling analysis
date: 2019-08-18 18:19:33
categories:
- Explorations
tags:
- Ansys
---

![ANSYS](/uploads/images/0000/ANSYS.jpg)
In structural analysis, the reticulated shell is one of the structure forms used for long span spatial structure design. There are several types for reticulaed shell structures. I am interested in creating such structure in Ansys. Hence, this post mainly focuses on the creation and buckling analysis for single-layer reticulated shell structure.

<!-- more -->
Based on the existing study (Elasto-plastic stability of single-layer reticulated shells), the commonly used single-layer reticulated shells have several types, including Kiewitt-8, Kiewitt-6, Geodesic, Schwedler Bidirectional, Schwedler Monoclonal, Sunflower, and Radial Rib. Here are the types from the study,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling1.png)

This post will create and analyze Schwedler Monoclonal reticulated shell structure. In this analysis, I use BEAM4 for creating model and buckling analysis since we can use real constants for section parameters rather than creating a real section. To build the model, we need to create a local spherical coordinate system. It should be noted that we need to specify locates the singularity for non-Cartesian local coordinate systems. First, we create the support nodes,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling2.png)

Since we are using spherical coordinate system, we can use NGEN to create circular nodes,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling3.png)

Then, we connect circular and radial nodes directly,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling4.png)

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling5.png)

In the last step, we use the same method to create the diagonal elements,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling6.png)

Before performing the buckling analysis, I do a modal analysis to see the the inherent dynamic characteristics in forms of natural frequencies. The support nodes are all fixed and the unit load is applied to all nodes in the shell,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling7.png)

The following command can be used for modal analysis，

```
MODOPT,LANB,6
MODOPT,LANB,6,0,0,,OFF
```

Here is the modal analysis results, and we can see the first-order mode shape,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling8.png)

The buckling analysis is straightforward, we should set do static analysis with PSTRES ON, then do the Eigen Buckling analysis. After setting all parameters, we can see the buckling results,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling9.png)

For buckling analysis, we can also consider the initial imperfection in the analysis. Here, I just use the results from the previous Eigen Buckling analysis. I set the scaling factor of 0.01 as the initial imperfection to the model. Now, we should go back the static analysis and perform the buckling analysis with Arc-length method. Meanwhile, the NLGEM should be enabled for nonlinear analysis,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling10.png)

Here is the buckling results with initial imperfection,

![Ansys reticulated shell buckling](/uploads/images/2019/AnsysReticulatedShellBuckling11.png)

> The model is a test model, and the APDL code is available upon request.
