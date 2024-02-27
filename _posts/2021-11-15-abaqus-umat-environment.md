---
title: Abaqus UMAT environment troubleshooting
date: 2021-10-05 15:05:05
categories:
- Explorations
tags:
- Abaqus
---

During the subroutine environment setup, a lot of problems need to be solved. A typical problem is shown as following,

> The job input file "Job-1.inp" has been submitted for analysis. Job Job-1: Analysis Input File Processor aborted due to errors. Error in job Job-1: Analysis Input File Processor exited with an error.

Such a problem can be figured out by checking the log file in the working directory. Here is the example of the "Job-1.log" in the working directory. The log file shows the "ifort" command cannot be recognized as an internal or external command. It means this command cannot be found in the system path. Actually, "ifort" is the command used to compile the Fortran file.

![UMAT issue](/uploads/images/2021/AbaqusUmatEnvironment1.png)

To solve the problem, we need to add the command path to the system path. First, I use the tool "[Everything](https://www.voidtools.com/)" to locate the file path.

![Everything](/uploads/images/2021/AbaqusUmatEnvironment2.png)

Four results can be found in this tool. The second "ifort.exe" is located in an x64 folder which is the same as my Win 10. Then, copy the path of this folder and paste to the system path. Right-click "This PC" and select the "Properties",

![Properties](/uploads/images/2021/AbaqusUmatEnvironment3.png)

Select "Advanced system settings",

![Advanced settings](/uploads/images/2021/AbaqusUmatEnvironment4.png)

Select "Environment Variables...",

![Environment variables](/uploads/images/2021/AbaqusUmatEnvironment5.png)

Find the "Path" in "System variables",

![System variables](/uploads/images/2021/AbaqusUmatEnvironment6.png)

New an environment variable and paste the "ifort.exe" folder path into it,

![New environment variable](/uploads/images/2021/AbaqusUmatEnvironment7.png)

Remember to RESTART the Abaqus after adding a new environment variable. In my Abaqus version (2018), the software cannot find the "ifort.exe" until I restart the software. Then, this problem is solved. But another problem occurs after I click the "submit" button.

![Still error](/uploads/images/2021/AbaqusUmatEnvironment8.png)

When I check the "Job-1.dat" file, it shows the model is overconstrained. After I remove the constraint, the model can be compiled and run successfully.

![Successful](/uploads/images/2021/AbaqusUmatEnvironment9.png)
