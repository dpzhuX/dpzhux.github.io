---
title: Qt C++ custom Tcl commands
date: 2016-12-29 16:57:12
categories:
- Tutorials
tags:
- Tutorials
---

![CppTcl](/uploads/images/0000/CppTcl.jpg)
After successfully integrating a Tcl interpreter with C++ in QT, my next goal was to add some custom commands to the Tcl interpreter to enhance user interactivity. Specifically, I aimed to create a custom command named `length` to calculate the distance between two points on a plane, with inputs in the format: `length x1 y1 x2 y2`. Upon receiving the `length` command, the Tcl interpreter would invoke a C++ program to compute the distance between the points (x1, y1) and (x2, y2). Let's begin with a simple Tcl test program:

<!-- more -->
```
for {set i 0} {$i < 3} {incr i 1} {
	length $i [expr 2*$i] 3 4
}
```

The above code will calcuate the distance between several points and point (3,4). However, the code won't run directly on the Tcl interpreter since it would flag `length` as an unknown keyword. Therefore, we need to add a "wrapper" to the Tcl interpreter, as shown below,

```cpp
#include <QCoreApplication>
#include <iostream>
#include <QDebug>
#include "tcl.h"
using namespace std;

int length(ClientData clientData, Tcl_Interp *interp, int argc, Tcl_Obj* const *argv);

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);
    Tcl_Interp *interp = Tcl_CreateInterp();
    Tcl_CreateObjCommand(interp, "length", &length,
              (ClientData)NULL, (Tcl_CmdDeleteProc*)NULL);
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

int length(ClientData clientData, Tcl_Interp *interp, int argc, Tcl_Obj *const *argv)
{
    double x_1 = QString(Tcl_GetString(argv[1])).toDouble();
    double y_1 = QString(Tcl_GetString(argv[2])).toDouble();
    double x_2 = QString(Tcl_GetString(argv[3])).toDouble();
    double y_2 = QString(Tcl_GetString(argv[4])).toDouble();
    cout<<"Point_1 Coord: "<<x_1<<"  "<<y_1<<endl;
    cout<<"Point_2 Coord: "<<x_2<<"  "<<y_2<<endl;
    double res = sqrt(pow((x_1-x_2),2)+pow((y_1-y_2),2));
    cout<<"Length: "<< res <<endl;
    cout<<"=============================="<<endl;
    return TCL_OK;
}
```

For configuring the Tcl interpreter, refer to my previous post on calling the TCL interpreter with C++ in Qt. Here, I'll highlight a few commands here,

`Tcl_CreateObjCommand` is used to add a custom command to the Tcl interpreter. This command specifies an interpreter to add the command to, the name of the command, and the function to handle the command invocation. Defining the `length` command means that when the Tcl interpreter encounters the `length` command, it will call the corresponding C++ length function, allowing us to "intercept" our custom command.

Here's a brief overview of the `Tcl_CreateObjCommand` parameters based on the official API:

- Tcl_Interp *interp (in): The interpreter pointer;
- char *cmdName (in): The command name;
- Tcl_ObjCmdProc *proc (in): The function called when cmdName is invoked;
- ClientData clientData (in): Parameters passed to proc or deleteProc;
- Tcl_CmdDeleteProc *deleteProc (in): Before deleting cmdName, the interpreter calls deleteProc for custom operations.

The format for the created `length` function is as follows,

```
int length(ClientData clientData, Tcl_Interp *interp, int argc, Tcl_Obj *const *argv)
```

`clientData` and `interp` are passed by the `Tcl_CreateObjCommand` command, `argc` indicates the number of command arguments, and `argv` is an array of `Tcl_Obj` pointers. Though these components may seem complex, they are quite straightforward to use. For our length command,

```
length $i [expr 2*$i] 3 4
```

`argc` being 5 means there are five parameters, including length itself, with argv[1] to argv[4] representing these parameters as `Tcl_Obj`. The `Tcl_GetString()` function can convert `Tcl_Obj` to a char type pointer for further processing, as shown in the complete program code.

Running the above command yields the following results,

![QtCppCustomTclCmd](/uploads/images/2016/QtCppCustomTclCmd1.png)

Thus, we successfully calculate the length between two points with the custom `length` command. This method mirrors how OpenSees internally handles custom commands, such as node, element, EqualDof, etc. When users load OpenSees Tcl scripts, OpenSees internally retrieves node coordinates and element types through this method, storing this information in memory to compute structural responses.

> PS: This post was written some time ago, but due to unstable network connections between lab's "high-speed internet" and my server, which led to over 50% packet loss, updating the site has been challenging.
