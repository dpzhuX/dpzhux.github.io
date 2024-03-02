---
title: Abaqus UMAT Subroutine to OBJ File
date: 2015-09-19 13:07:23
categories:
- Explorations
tags:
- Abaqus
---

In Abaqus, the default UMAT subroutines are written in Fortran, with a .for file extension, and are compiled and linked into the simulation during running model. However, if there exists a need to compile the subroutine ahead of time or to protect the source code, the .for file can be compiled into an .obj binary file.

<!-- more -->

To compile into an .obj file, we first need to have a Fortran compiler installed and have your .for file ready. Then, open the Abaqus Command,

![Command line](/uploads/images/2015/AbaqusUmatToObj1.png)

Navigate to the directory containing your program. The specific commands can follow the batch commands used in CMD. Then, enter the following command,

```
abaqus make library=SEUFIBER.for object_type=fortran
```

Replace SEUFIBER.for with the name of your UMAT subroutine. Once the compilation process is completed and you see the output indicating success, the OBJ file will be generated,

![Generate obj](/uploads/images/2015/AbaqusUmatToObj2.png)

Here is the generated OBJ file,

![Final obj file](/uploads/images/2015/AbaqusUmatToObj3.png)
