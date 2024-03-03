---
title: Qt C++ integrate Tcl interpreter
date: 2016-12-09 14:06:32
categories:
- Tutorials
tags:
- Tutorials
---

![CppTcl](/uploads/images/0000/CppTcl.jpg)
Tcl, as a versatile scripting language, has found widespread applications in various fields, including prominent examples like ANSYS in civil engineering. Also, OpenSees, developed by UCB, also utilizes Tcl. However, recent OpenSees source code updates have introduced support for Python. Although official documentation for Python usage has not been released, it's expected that constructing OpenSees models with Python will soon be feasible. 

<!-- more -->

Since that OpenSees is written in C++, implementing a language similar to ANSYS APDL would significantly increase the workload. In OpenSees, utilizing the Tcl interpreter to parse Tcl scripts is necessary when modeling with Tcl, which is why installing Tcl/Tk is required for OpenSees.

If we installed a Python distribution like Anaconda or WinPython, we might notice that OpenSees runs without needing to install Tcl/Tk separately. My own system, without the Tcl/TK installation from the OpenSees website, can directly run 64-bit OpenSees due to the 64-bit tcl86.dll included with Anaconda. To implement Tcl interpreter within C++, I first installed 32-bit ActiveTCL, which doesn't affect running 64-bit OpenSees since it uses Anaconda tcl86.dll.

For integration, I downloaded 32-bit ActiveTcl for better compatibility with my 32-bit GCC compiler. The ActiveTcl download can be found on its official website; here's a link for ActiveTcl 8.5: [Download](http://downloads.activestate.com/ActiveTcl/releases/8.5.18.0/ActiveTcl8.5.18.0.298892-win32-ix86-threaded.exe).

After downloading, install ActiveTcl directly to `C:\Program Files\Tcl`. Then, open Qt Creator and create a new Project,

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter1.png)

Select Qt Console Application for a simple test program, naming and locating the project accordingly,

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter2.png)

Next, copy the include and lib directories from the Tcl installation to your project directory `E:\QT\tcltest\tcltest`, renaming them to `tcltkinclude` and `tcltklib`,

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter3.png)
![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter4.png)

Back in Qt Creator, right-click the project folder and select "Add Library...",

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter5.png)

Choose "External Library", 

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter6.png)

In the settings, select `tcl85.lib` from `tcktklib`, opting for dynamic linking and deselecting the "Add 'd' suffix for debug version",

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter7.png)

This automatically adds the Tcl library to your .pro file, but you'll also need to add `INCLUDEPATH += $$PWD/tcltkinclude` to include the header files, making your .pro file look like this,

```
QT += core
QT -= gui

CONFIG += c++11

TARGET = tcltest
CONFIG += console
CONFIG -= app_bundle

TEMPLATE = app

SOURCES += main.cpp

INCLUDEPATH += $$PWD/tcltkinclude

unix|win32: LIBS += -L$$PWD/tcltklib/ -ltcl85

INCLUDEPATH += $$PWD/tcltklib
DEPENDPATH += $$PWD/tcltklib
```

Now, running the main.cpp with Ctrl+R should display a console window. Add `#include "tcl.h"` to main.cpp, and typing `Tcl_` should trigger Qt Creator autocomplete, indicating a successful environment setup,

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter8.png)

Next, we create a test.tcl file in the project directory `E:\QT\tcltest\tcltest\test.tcl`,

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter9.png)

Then, write the following statements in main.cpp,

```cpp
#include <QCoreApplication>
#include <iostream>
#include "tcl.h"
using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);
    Tcl_Interp *interp = Tcl_CreateInterp();
    int Res;
    const char *detail;
    Res = Tcl_EvalFile(interp, "E:/QT/tcltest/tcltest/test.tcl");
    detail = Tcl_GetStringResult(interp);
    if (Res != TCL_OK)
    {
        cout<<"Failed!"<<endl;
        cout<<detail<<endl;
    }
    else
    {
        cout<<"Success!"<<endl;
    }
    Tcl_DeleteInterp(interp);
    return a.exec();
}
```

To elaborate, `Tcl_CreateInterp()` creates and returns a pointer `Tcl_Interp *` to a Tcl interpreter instance. The functions `Tcl_EvalFile()` and `Tcl_GetStringResult()` are then used. The Tcl document for C interface can be found on the [website](https://www.tcl.tk/man/tcl8.6/TclLib/contents.htm).

`Tcl_EvalFile()` requires the interpreter pointer and the file path, with forward slashes `/` replacing Windows' backslashes `\` to avoid errors. It returns an integer indicating the running result:

- 0 (TCL_OK)
- 1 (TCL_ERROR)
- 2 (TCL_RETURN)
- 3 (TCL_BREAK)
- 4 (TCL_CONTINUE)

`Tcl_GetStringResult()` retrieves information from the interpreter, useful for debugging Tcl script running errors.

This successfully interprets a TCL file with the C++ TCL interpreter.

Instead of using `qDebug()`, I output the results to the console with cout. Running with Ctrl+R should display "orycho" and "Success!" in the console, indicating a successful Tcl interpreter integration.

![QtCppTclInterpreter](/uploads/images/2016/QtCppTclInterpreter10.png)
