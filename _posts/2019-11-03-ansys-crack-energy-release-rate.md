---
title: Ansys central crack energy release rate
date: 2019-11-03 08:29:55
categories:
- Explorations
tags:
- Ansys
---

![ANSYS](/uploads/images/0000/ANSYS.jpg)
I previously analyzed the stress intensity factor for an edge crack of a plate. Now, I want to extend the previous example to calculate the crack energy release rate. The energy release rate calculation is quite straightforward since Ansys CINT supports the VCCT method to obtain the energy release rate. In this example, I move the crack to the plate center and set different material properties for the left and right side of the plate.

<!-- more -->
The following figure shows the basic dimension of the plate with a central crack. The width and height of the plate are W = 1.0 m and H = 1.0 m. The central crack has a length of 2a = 0.2 m. The left edge is fixed while the stress applied on the right edge is 5E6 MPa.

![Ansys energy release rate](/uploads/images/2019/AnsysCrackEnergyReleaseRate1.svg)

When we try to create the model, it should be noted that the left and right area should not share the same edge at at the central crack, as shown in the following figure,

![Ansys energy release rate](/uploads/images/2019/AnsysCrackEnergyReleaseRate2.png)

In the current model, two crack tips exist. Thus, we should use KSCON command twice or the following dialog to create the concentration keypoints for the crack tips. Here, I set the radius of the first row of elements to be 0.01. The number of elements around circumference is 15. To crate the singularity at the crack top, we should move the midside nodes on the sides connected to the crack tip to the 1/4 point nearest the crack tip,

![Ansys energy release rate](/uploads/images/2019/AnsysCrackEnergyReleaseRate3.png)

After meshing, we should carefully check the elements around the crack tips, 

![Ansys energy release rate](/uploads/images/2019/AnsysCrackEnergyReleaseRate4.png)

As indicated in the previous post, each crack tip should be associated with a local coordinate system. Here, I create two cylindrical coordinate system. The X direction is pointed to the crack propagation direction while the Y direction is pointed to the crack normal direction, as shown in the following figure,

![Ansys energy release rate](/uploads/images/2019/AnsysCrackEnergyReleaseRate5.png)

To get the energy release rate, we create a new CINT type of VCCT, thus we can get the energy release rate by VCCT method,

```
CINT,NEW,1
CINT,TYPE,VCCT
```

Running the model, we can check the stress distribution first, as shown below,

![Ansys energy release rate](/uploads/images/2019/AnsysCrackEnergyReleaseRate6.png)

For the above results, we can find the stress difference between the left and right area. Since we set different material properties and boundary conditions, we expect to get asymmetrical results here. The energy release rate can be obtained by PRCINT command directly,

![Ansys energy release rate](/uploads/images/2019/AnsysCrackEnergyReleaseRate7.png)

> The model is a test model, and the APDL code is available upon request.
