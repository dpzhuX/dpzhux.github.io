---
title: Perform3D V6.0.0 Installation and Use
date: 2017-01-07 15:55:21
categories:
- Tutorials
tags:
- Tutorials
---

![Perform3D](/uploads/images/0000/Perform3DV6.jpg)
Recently, I was wondering about CSI potentially abandoning Perform3D, especially SPA2000 V19 incorporated some features from Perform3D, and Perform3D hadn't been updated for many years. Surprisingly, last December, CSI quietly released Perform3D V6.0.0. Based on the version number, it seemed to have significant upgrades. However, upon installation and usage, I found the interface remained as unappealing as ever. Let's delve into the installation and exploration of Perform3D V6.0.0, a product that CSI has purportedly spent "years" developing.

<!-- more -->

The installation interface was large, with a screenshot nearly 2MB in size,

![Perform3D](/uploads/images/2017/Perform3DInstallAndUse1.jpg)

I compressed the image above, and despite its cool appearance, it still featured the pixel misaligned building. The installation process was straightforward, just a series of "next" clicks,

![Perform3D](/uploads/images/2017/Perform3DInstallAndUse2.jpg)

Due to issues installing Perform3D V5 on drives other than C, and despite having SAP2000 and ETABS on the D drive, I recommend installing Perform3D V6.0.0 on the C drive, sticking to the default path,

![Perform3D](/uploads/images/2017/Perform3DInstallAndUse3.jpg)

The installation should proceed smoothly. However, the license check upon opening the program is lengthy and may become unresponsive, requiring patience. Once inside, the classic Perform3D interface is shown as below, even opening a classic example that seemed to have been edited on the day of the release,

![Perform3D](/uploads/images/2017/Perform3DInstallAndUse4.jpg)

The familiar interface had minimal changes, and the model manipulation performance remained poor,

![Perform3D](/uploads/images/2017/Perform3DInstallAndUse5.jpg)

In the analysis interface, however, there was the addition of advertised feature in Perform3D V6.0.0 of calculating multiple Series simultaneously,

![Perform3D](/uploads/images/2017/Perform3DInstallAndUse6.jpg)

The introduction of parallel computing is crucial for analyzing large models,

![Perform3D](/uploads/images/2017/Perform3DInstallAndUse7.jpg)

Another new feature in Perform3D V6.0.0 is the Series import functionality, allowing for the import of concurrently calculated Series,

![Perform3D](/uploads/images/2017/Perform3DInstallAndUse8.jpg)

From the dialog box icons, it appears that Perform3D is written in VB, which isn't surprising since SAP2000 is also VB-based. However, Perform3D didn't even bother to change the default VB project icon before release.

According to the official upgrade documentation, Perform3D V6.0.0 includes several key updates:

- Time history analysis files can now exceed 2GB.
- Up to four Series can be calculated in parallel.
- Support for importing Series calculated on other machines.
- "Perform3D Binary Results Files" have been updated so that results such as energy can be extracted.
- Improved plotting speed.
- Windows XP is no longer supported.

In summary, compared to version 5.0, the upgrades in V6.0.0, particularly for time history analysis file sizes and parallel computing, are significant. However, the interface still doesn't match the level of CSI's other products like SAP2000 and ETABS.
