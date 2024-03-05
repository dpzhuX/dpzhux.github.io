---
title: OpenSee new cypress editor trial
date: 2016-11-15 10:16:33
categories:
- Tutorials
tags:
- Tutorials
---

![Cypress](/uploads/images/0000/Cypress.jpg)
The OpenSees official website recently posted a message about the launch of a new editor called Cypress Editor, which can be directly accessed from the [official website](http://cypress.hrshojaie.com/en-us/default.aspx). I immediately downloaded this software. The official webpage of this software is impressively designed. This make this editor seem decades ahead compared to the OpenSees official website.

<!-- more -->

The installation process is straightforward: download and install,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor1.png)

The loading page upon opening is quite fast, too,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor2.png)

After checking the installation folder, I found the presence of the WeifenLuo.WinFormsUI.Docking.dll layout library, indicating that the software is likely written in C#. This software is probably only available on Windows platforms and not on MacOS or Linux. Following the loading page, a registration page pops up unexpectedly,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor3.png)

Currently, one can directly apply for a registration code. After filling in the required information, a pop-up claims that the registration code will be sent to the email within 1-5 minutes. However, in reality, I applied in the afternoon and only found the registration code and app id in my email after dinner. Initially, I thought these were sent automatically, but now it seems there might have been a review process. Entering the software activation code and app id into two fields can directly activate it,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor4.png)

The interface of the software is modern, somewhat similar to previous versions of the Tcl editor. However, it seems unable to automatically refresh the Command Help content when different commands are clicked in the editing window. We must click on the commands in the left pane to view the corresponding Command Help. To successfully run OpenSees in the software, first, the path must be set,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor5.png)

The path to OpenSees can be set in Tools or by pressing the F9 key,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor6.png)

After setting up, opening a Demo,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor7.png)

The demo example can be seen in the editing box, and then run by simply clicking. Regarding the "Import SAP2000 Model" option shown above, it looks tempting, but the submenu options that pop up are all greyed out, and I couldn't use this feature after much effort. It seems this feature might still be under development,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor8.png)

For projects created by the user, the run results can be found in the project folder created by the user. The right side of the software displays a list similar to a project directory, showing all loaded files,

![Cypress editor](/uploads/images/2016/OpenseesCypressEditor9.png)

Overall, this software seems to be aimed to be a VS-stype editor, but the registration process is indeed a bit cumbersome. Since OpenSees itself is open-source and many editors already feature OpenSees code highlighting and autocomplete functions, and some can even run OpenSees directly within the software, I think commercializing this software might face certain challenges.
