---
title: Abaqus user subroutines handling
date: 2015-10-25 22:55:33
categories:
- Explorations
tags:
- Abaqus
---

After reviewing numerous posts on Abaqus subroutines, I found the information online to be disorganized. Here, I put a post to summarize some fundamental approaches for future reference.

1. **Compatibility between Abaqus, Intel Visual Fortran (IVF), and Visual Studio (VS)** can be given through the following compatibility tables:

Abaqus and Intel Fortran/Visual Studio Compatibility

| Abaqus version 	|     Intel Fortran version     	| Visual Studio version 	|
|:--------------:	|:-----------------------------:	|:---------------------:	|
|       6.8      	|  v9.1, v10.0, v10.1 and above 	|          2005         	|
|       6.9      	|  v9.1, v10.0, v10.1 and above 	|       2005, 2008      	|
|      6.10      	| v10.1, v11.0, v11.1 and above 	|       2008, 2010      	|
|      6.11      	| v10.1, v11.0, v11.1 and above 	|       2008, 2010      	|
|      6.12      	| v10.1, v11.0, v11.1 and above 	|       2008, 2010      	|

Fortran and Visual Studio Compatibility

| Intel Fortran version 	| Visual Studio version 	|
|:---------------------:	|:---------------------:	|
|         v10.0         	|       2003, 2005      	|
| v10.1(10.1.019 later) 	|    2003, 2005, 2008   	|
|      v11.0, v11.1     	|    2003, 2005, 2008   	|
| v12.0, v12.1 (XE2011) 	|    2005, 2008, 2010   	|
|     v13.0 (XE2013)    	|    2008, 2010, 2012   	|

2. **Using Subroutines on a System Without Abaqus Installed**:

   If you're working with a subroutine code file named `usersub.for` and a model file `abc.inp`:

   - On a system without Intel Fortran installed, run: `abaqus make library=usersub`
   
   - For the Standard module, `standardU.dll` will be generated; for the Explicit module, `ExplicitU.dll` and `ExplicitU-D.dll` will be generated.
   
   - Store the library files in any directory, e.g., `D:\abc1\abc2\abc3\abc4`.
   
   - Open the Abaqus environment variable file `abaqus_v6.env`, and append the following line:

      ```
      usub_lib_dir="D:\\abc1\\abc2\\abc3\\abc4"
      ```

      (Note: Replace `\` with `\\`; if you're unable to modify `abaqus_v6.env` in the Abaqus installation directory, save the modified environment variable file in the same directory as the `.inp` file).

   - Run the calculation with `abaqus job=abc.inp`.

3. **After Installing Abaqus and Compatible Intel Fortran and Visual Studio**:

   You can check if the components are recognized by running `Abaqus info=system`. Sometimes, due to incorrect system environment variable settings, it is necessary to manually import batch files for setting Visual Studio and Intel Fortran environment variables. Typically, these are `vsvars32.bat` and `ifortvars.bat` for 32-bit systems, or `vsvarsamd64.bat` and `ifortvars.bat` for 64-bit systems. These files are located in the installation folders of Visual Studio and Intel Fortran, respectively.

   To automate this, consider creating a batch file to replace manual operations. Here's an example from my experience,

```
@echo off
call “C:\Program Files (x86)\Intel\Compiler\Fortran\10.1.021\em64t\bin\ifortvars.bat”
call “C:\Program Files (x86)\Microsoft Visual Studio 9.0\VC\bin\amd64\vcvarsamd64.bat”
abaqus info=system
```
