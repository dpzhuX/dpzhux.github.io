---
title: Ansys bolt creep analysis
date: 2015-12-05 11:24:12
categories:
- Explorations
tags:
- Ansys
---

![ANSYS](/uploads/images/0000/ANSYS.jpg)
Creep is a typical nonlinearity problem due to material. For such problem, it is necessary to understand the material properties and correctly setting the material related attributes. In Ansys, setting up creep behavior involves activating the material's Creep option and assigning it elastic properties. This post analyzes a bolt in operation, with a length of 200mm and a cross-sectional area of 150mm^2, continuously working at 800°C. The goal is to analyze the internal stress evolution/condition of the bolt, as shown in the model below,

<!-- more -->
![Model](/uploads/images/2015/AnsysBoltCreep1.svg)

The elastic modulus is 200GPa, and the creep strain rate is expressed by the following formula,

$$
d\varepsilon /dt = K{\sigma ^n}
$$

Where K is set to 7.35E-30/s and n=7, with an initial strain of 0.005 at the start.

Since this post pertains to a rod structure, we utilize LINK1 for simulation. Although recent versions of Ansys have removed LINK1, it can still be used through APDL with the command: `ET,1,LINK1`.

LINK1 can use real constant, which can define strain with the command: `R,1,150,0.005`. The finite element model can be created using the following command,

```
N,1
N,2,200
E,1,2
```

![FEM Model](/uploads/images/2015/AnsysBoltCreep2.png)

This model does not set the thermal expansion coefficient, only the creep parameters are set here,

![Material](/uploads/images/2015/AnsysBoltCreep3.png)

After setting up, we can enter into the solution module. Here, a uniform temperature field is required, which can be directly applied using BFUNIF or TUNIF. It is important to note that since the temperature exists throughout the analysis process, `KBC,1` should be used to instantaneously apply temperature at the start of the load step, then apply boundary conditions and proceed,

![Solve](/uploads/images/2015/AnsysBoltCreep4.png)

The solving process is relatively quickly. Since this problem is time-related, post26 post-processing is used for analysis here. The internal stress evoluation is shown as below,

![Stress evolution](/uploads/images/2015/AnsysBoltCreep5.png)

> The model is a test model, and the APDL code is available upon request.
