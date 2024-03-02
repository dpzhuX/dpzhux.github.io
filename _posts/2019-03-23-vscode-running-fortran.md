---
title: Abaqus accelerating explicit analysis 
date: 2019-03-23 23:46:23
categories:
- Tutorials
tags:
- Tutorials
---

![VSCode](/uploads/images/0000/VSFortran.jpg)
Despite Fortran being an ancient language, its still comes with its own set of advantages. Recently, while debugging Abaqus subroutines, I have to repeatedly running code for testing. Although the integration with Abaqus is necessary for running the entire code, the individual modules can still be tested separately. The best method for testing modules is to run them as small, standalone programs. However, VS Code does not seem to support running Fortran code directly. A useful plugin for this purpose is [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner), but unfortunately, it doesn't support Fortran by default and requires some adjustments. First, let's start with a test code.

<!-- more -->
![Test code](/uploads/images/2019/VscodeRunningFortran1.png)

Next, go to the plugin page and open settings, then type "code runner" into the search box,

![Settings](/uploads/images/2019/VscodeRunningFortran2.png)

Set the default language in Code-runner "Default Language" setting to Fortran. Then, in Code-runner "Executor Map", add the following configuration. It defaults to using the gfortran compiler, which we need to download and install from the [official website](https://gcc.gnu.org/wiki/GFortran) if we haven't already,

```
{
    "workbench.colorTheme": "Default Light+",
    "fortran.gfortranExecutable": "/usr/local/bin/gfortran",
    "code-runner.executorMap": {
        "fortran": "cd \$dir && gfortran \$fileName -o \$fileNameWithoutExt && \$dir\$fileNameWithoutExt"
    },
    "code-runner.saveFileBeforeRun": true,
    "code-runner.defaultLanguage": "fortran"
}
```

![Settings](/uploads/images/2019/VscodeRunningFortran3.png)

After completing these steps, we can directly run the code by clicking the button in the upper right corner of the program interface,

![VScode](/uploads/images/2019/VscodeRunningFortran4.png)

If you're looking to configure Notepad++ to run Fortran code, you can refer to my previous post on running OpenSees with Notepad++. Simply modify the instructions for running OpenSees to running Fortran code. Replace the code segment with the following script,

```
npp_save
cd $(CURRENT_DIRECTORY)
gfortran "$(FULL_CURRENT_PATH)"
```
