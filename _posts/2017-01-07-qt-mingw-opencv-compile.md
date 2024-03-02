---
title: Compiling OpenCV for minGW with Qt 5.7
date: 2017-01-07 15:55:21
categories:
- Tutorials
tags:
- Tutorials
---

![QTOpenCV](/uploads/images/0000/QTOpenCV.jpg)
Previously, I utilized OpenCV with Python, but I found that OpenCV demonstrates its capability when integrated with C++. However, the Windows version of OpenCV only offers libraries for the Visual Studio compiler and does not provide libraries for minGW. Therefore, if we downloaded the minGW version of Qt, we need to manually compile OpenCV. After several hours, I successfully compiled OpenCV for minGW.

<!-- more -->

Before starting, we need to download OpenCV and CMake:

* OpenCV download: [OpenCV website](http://opencv.org/downloads.html)
* CMake download: [CMake website](https://cmake.org/download/)

> Note: With QT 5.7, we should download version 3.1 of OpenCV, as version 3.2 may fail to compile.

When installing CMake, ensure you choose to add CMake to the system PATH,

![QTOpenCV](/uploads/images/2017/QTOpenCV1.png)

Ensure there are no spaces or non-ASCII characters in the installation path,

![QTOpenCV](/uploads/images/2017/QTOpenCV2.png)

After installation, open Qt Creator, navigate to "Tools (T)" -> "Options (O)", and find CMake under "Build & Run". You should see something like this,

![QTOpenCV](/uploads/images/2017/QTOpenCV3.png)

This indicates that Qt has detected CMake. Extract the downloaded OpenCV Version 3.1 to the desired location, for example, `D:\opencv`, and in Qt, open the project by selecting `D:\opencv\sources\CMakeLists.txt`. Qt will automatically invoke CMake to parse CMakeLists.txt,

![QTOpenCV](/uploads/images/2017/QTOpenCV4.png)

After configuration, go to the "Projects" section under CMake, set CMAKE_INSTALL_PREFIX to `D:/opencv/install`, scroll the right slider to deselect `BUILD_opencv_python2` and `BUILD_opencv_python3`, and select `WITH_OPENGL` and `WITH_QT`,

![QTOpenCV](/uploads/images/2017/QTOpenCV5.png)

After making these changes, click "Apply Configuration Changes". In "Build Steps" details, ensure the `install` checkbox is ticked,

![QTOpenCV](/uploads/images/2017/QTOpenCV6.png)

Start the build with the shortcut "Ctrl+B". we can monitor the progress in the "Compile Output" window,

![QTOpenCV](/uploads/images/2017/QTOpenCV7.png)

Following a period of compilation, we will see the process exit normally,

![QTOpenCV](/uploads/images/2017/QTOpenCV8.png)

Navigate to `D:\opencv\install` to see the generated OpenCV components. Before using them, add `D:\opencv\install\x86\mingw\bin` to your system PATH,

![QTOpenCV](/uploads/images/2017/QTOpenCV9.png)

In Qt, create a new project and add the following to the project `.pro` file,

```
INCLUDEPATH += D:/opencv/install/include \
               D:/opencv/install/include/opencv \
               D:/opencv/install/include/opencv

LIBS += D:/opencv/install/x86/mingw/lib/libopencv_*
```

When you `#include <cv.h>` in your cpp file and type `cv::` inside the main function, you should see an autocomplete dialog,

![QTOpenCV](/uploads/images/2017/QTOpenCV10.png)

This completes the configuration of OpenCV with the minGW compiler in Qt 5.7.
