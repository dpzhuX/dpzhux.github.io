---
title: MSC.Marc 2015 user subroutine configuration
date: 2016-10-22 15:07:21
categories:
- Tutorials
tags:
- Tutorials
---

![MSCMARC](/uploads/images/0000/MSCMARC.jpg)
Recently, I restarted my research project, which requires the use of finite element analysis. After some consideration, I decided to install MSC.Marc. A search on Google revealed that Marc 2015 is available now. I installed Marc 2015 and configured the development environment for user subrountine.

<!-- more -->

### Configuration checklist

- MSC.MARC 2015, including documentation
- Intel Visual Fortran (IVF) 2013
- Visual Studio (VS) 2012

The specific development environment should be installed following the instructions for the specific version. If object-oriented programming (OOP) development is required, a higher version of IVF is necessary, as lower versions might not find certain entry points for the Fortran program.

In Marc 2015, detailed version information is available on page 52 of the Release Guide. This tableis essential for installing the correct development environment, which varies by version,

![Marc user subroutine](/uploads/images/2016/MarcUserSubroutineConfig1.png)

### Installation process

The installation of Marc is straightforward. After installation, running a demo can confirm the success of the process. Surprisingly, the interface was in Chinese,

![Marc user subroutine](/uploads/images/2016/MarcUserSubroutineConfig2.png)

Upon closer examination, the translation quality was mediocre. For example, the "Add" command for geometric modeling was translated as "to add" (mathematical operation perspective), which was confusing. Since the comprehensive help documentation and step-by-step examples are in English, switching the interface back to English was necessary. This was done by renaming or deleting the mentat_zh_CN.qm file in the mentat lang directory, then restarting Marc to revert to the English interface,

![Marc user subroutine](/uploads/images/2016/MarcUserSubroutineConfig3.png)

Next, VS2012 and IVF2013 can be installed. It should be noted that VS2012 can be installed anywhere, but IVF2013 must be installed in its default location. I installed VS2012 on the D drive to save space, ensuring IVF2013 was installed **after** VS2012 to avoid any issues. Changing IVF2013 installation path can lead to complications when compiling with the ifort command, even if the system's PATH environment variable is updated. For instance, the following command can lead to an error that the file cannot be found,

```
ifort /fpp
```

### Environment variable configuration

To ensure Marc can compile and link user subrountine with IVF2013, system environment variables and libraries need to be set up. This involves adding specific paths to the system's PATH environment variable,

![Marc user subroutine](/uploads/images/2016/MarcUserSubroutineConfig4.png)

Add the following paths to the PATH variable,

```
C:\Program Files (x86)\Intel\Composer XE\bin\intel64\;
D:\Program Files (x86)\Microsoft Visual Studio 11.0\VC\bin\amd64\;
```

- The first path enables the ifort compile command from IVF2013.
- The second path is for the LINK command used in linking.

Additionally, library files are required here,

![Marc user subroutine](/uploads/images/2016/MarcUserSubroutineConfig5.png)

The LIB environment variable, which might need to be created if it does not exist, should include paths specific to the following paths,

```
C:\Program Files (x86)\Intel\Composer XE\compiler\lib\intel64\;
C:\Program Files (x86)\Windows Kits\8.0\Lib\win8\um\x64\;
D:\Program Files (x86)\Microsoft Visual Studio 11.0\VC\lib\amd64\;
```

### User subroutine testing

Copy e2x26.dat and u2x26.f files into the test directory, set the current directory to this test directory in Marc, then load the dat file, click run and select the user subroutine file u2x26.f,

![Marc user subroutine](/uploads/images/2016/MarcUserSubroutineConfig6.png)

Due to the model simplicity, a 3004 exit code indicating the calculation is quickly completed. The model log file reveals two large commands,

![Marc user subroutine](/uploads/images/2016/MarcUserSubroutineConfig7.png)

All configuration steps aim to enable these two commands, which should execute successfully in a CMD window. The first command generates an obj file, and the second produces an exe file, which Marc then calls for computation.

### Conclusion

Although the above steps seem straightforward, identifying and locating the necessary files took considerable time, consuming an afternoon. I also reinstall IVF2013 several times. The preparatory work before installing the development environment involved more effort, including uninstalling QT dependent on VS2015, uninstalling VS2015, reinstalling VS2012, and then IVF2013. After successfully configuring the environment, QT was reinstalled with the MinGW compiler, moving away from the VS compiler which requires a separate installation of the CDB debugger.
