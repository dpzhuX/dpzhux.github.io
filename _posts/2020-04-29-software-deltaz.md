---
title: Software DeltaZ
date: 2020-04-29 15:17:24
categories:
- Projects
tags:
- Projects
---

DeltaZ is a software to edit the arbitrary waveform on RIGOL DG800/900 series. I write some scripts to control my RIGOL DG812. Finally, I decided to pack the scripts and wrote a user interface to control the device. That is DeltaZ. Click the "DOWNLOAD" button to download the software.

<!-- more -->

[**DOWNLOAD**](https://drive.google.com/open?id=1fDOUm-WPANBxhBmnHLgFACJIeN2Kiirp)


### NI-VISA installation

The software needs NI-VISA runtime to communicate with RIGOL arbitrary waveform generator. Before the installation, please make sure the system has been licensed with the NI-VISA. If the LabView has been installed, NI-VISA should already be installed. Here are the steps to install NI-VISA runtime.

1. Google [NI-VISA runtime](https://www.ni.com/en-us/support/downloads/drivers/download.ni-visa.html) and download the installer,


![DeltaZ](/uploads/images/2020/SoftwareDeltaZ1.png)

2. Install the NI Package Manager and open the manager. The NI-VISA runtime is needed for DeltaZ, so click "Deselect All" since we do not need the additional items. Then, click "Next",

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ2.png)

3. Accept the license agreements,

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ3.png)

4. Review the installed module. "NI-VISA Runtime" is needed here,

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ4.png)

5. Finish the installation.

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ5.png)

---

### DeltaZ

After installing the NI-VISA, Open the DeltaZ and connect it to the RIGOL 800/900 series with the "Device" tab. Click the "Refresh" button to refresh the devices. Click the "Connect" button to connect the device. If everything is correct, the "Connect" button should turn to Green.

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ6.png)

The "Basic" tab provides the basic waveform, such as Sine, Square, Ramp, Pulse, Noise, and DC. The corresponding options are available based on the waveform type. Then, select the channel and click the "Download" button to download the waveform. Click the "Start" button to open the channel and output the waveform.

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ7.png)

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ8.png)

The second tab and third tab are used to define custom waveform. The "EasyEdit" tab is similar to the easy edit in ArbExpress. Drag the left cursor and right cursor with horizontal sliders to select the edit region. Click the "⯅" button and "⯆" button to change the amplitude of the selected region based on "VStep" value. The left cursor and right cursor can be adjusted by clicking the "⯇"  button and "⯈" button. Use "L Cursor" and "R Cursor" to select the controlled cursor. "Manual Control" can be used to input a specific cursor position. Here is an example.

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ9.png)

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ10.png)

The "Cut", "Copy" and "Paste" button can be used to edit the waveform *between the two cursors*. Here is an example.

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ11.png)

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ12.png)

The last "Advance" tab can be used to generate the waveform with math expression. The math expression supports all [JavaScript math functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math). Do not include the "Math" prefix before math function and each math function should end with parentheses, such as "random()". Here is an example.

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ13.png)

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ14.png)

---

### Disclaimer

![DeltaZ](/uploads/images/2020/SoftwareDeltaZ15.png)


> I have put efforts into ensuring that the software works properly. Unfortunately, a full check of the software code cannot be ensured, despite my efforts, the function included in software could be functional. Therefore, the user should check the compatibility for software with the proper system, as the developer does not accept liability for <em>any damage</em> by using this software.