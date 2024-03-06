---
title: .NET 3.5 offline installation
date: 2016-10-27 11:15:20
categories:
- Tutorials
tags:
- Tutorials
---

![DotNetFramework](/uploads/images/0000/DotNetFramework.jpg)
After updating my system, I wanted to use a PDF merging tool and discovered that many such tools are developed with .NET 3.5. Unfortunately, my system didn't have .NET 3.5 installed, and the system was only left with the default option of online installation.

<!-- more -->
![DotNetFramework offline install](/uploads/images/2016/DotNetInstallOffline1.png)

However, an odd issue occurred. When I chose "Download and install this feature," Windows just kept loading without completing the download. Therefore, I visited Microsoft's official website to search for the .NET 3.5 offline installation package and downloaded a file nearly 250MB in size. However, it still led me to the same interface as the online attempt. I had hoped it would bypass the download, but it seemed useless,


![DotNetFramework offline install](/uploads/images/2016/DotNetInstallOffline2.png)

Further online research suggested the problem might be related to language packs. So, I downloaded the .NET 3.5 language pack and followed an online guide to extract the dotnetfx35.exe file, copied the language pack to the dotNetFx35 directory, and then initiated the installation,

![DotNetFramework offline install](/uploads/images/2016/DotNetInstallOffline3.png)

Unfortunately, that attempt also failed. Much of the advice online was untested. After various unsuccessful attempts and some time spent searching, I discovered a dedicated project for installing .NET 3.5 on SF (SourceForge): [Direct Link to Project](https://sourceforge.net/projects/netframework35offlineinstaller/).

This method requires an original Windows image file. Mount the image to your computer, open the software, and select the mounted image,

![DotNetFramework offline install](/uploads/images/2016/DotNetInstallOffline4.png)

Simply clicking "Install" will directly initiate the installation,

![DotNetFramework offline install](/uploads/images/2016/DotNetInstallOffline5.png)

This method is much more straightforward than downloading language packs and adding them to an extracted file, etc. In case the SF project becomes unavailable, I've retained a copy of the tool for future reference: [DOWNLOAD](/uploads/files/2016/DotNetInstallTool.zip).
