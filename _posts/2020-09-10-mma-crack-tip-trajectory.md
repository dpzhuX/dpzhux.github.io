---
title: Mathematica crack tip trajectory
date: 2020-05-02 17:34:05
categories:
- Explorations
tags:
- Mathematica
---

This post focuses on the crack tip tracking method. While I simulate several fatigue models, the crack tip trajectories are hard to track in the model. Previously, I just picked some points and decided on the crack length and rate in several images. This useful method is not very effective when I get several video clips in a crack place. Several image process tools such as Fiji can deal with the image fast and easily, but I still feel it is hard to realize my goal. So I try to write a simple tool to achieve the object. Since tracking the crack tip uses the technique of image processing, I use Mathematica for this purpose.

<!-- more -->

The main function used in Mathematica is the function called "ImageFeatureTrack". This function will track some feature points in a sequence of images, and return the coordinates of these points in each image. Thus, the idea is not very difficult, we import the video and transfer it into the image sequence, then we specify the tracking points with the coordinates in the image and use "ImageFeatureTrack" function to get the coordinates in each frame. The last step is to turn the image coordinates into the real model coordinates.

The first step is to import the file and turn it into a sequence of images. Additionally, the frame numbers are added to each frame to help inspect the image sequence,

```
(*Set up the path for a video file*)
fileInPath = NotebookDirectory[] <> "Crack.mov";
(*Import the file and get all frames*)
vIn = Import[fileInPath, {"Frames", All}];
(*Preview*)
vIn1 = Show[vIn[[#]], 
       Graphics[{Text[Style[#, FontSize -> 14], 
       Scaled[{.5, .8}]]}]] & /@
       Table[i, {i, Length[vIn]}];
ListAnimate[vIn1]
```

The last line uses the "ListAnimate" command to generate a generate animation in Mathematica,


![MMA](/uploads/images/2020/CrackTipTrajectory1.jpg)

Then, the tracking frame should be set according to the animation, in this example, the crack has a jump in 28th to 29th frame, so the frame number 29 should be used. At the end of the simulation, the crack becomes much more width,  so I select more frames here,

```
trackFrame = {1, 29, 38, 42};
vIn1[[#]] & /@ trackFrame
```

The 1st, 29th, 38th, 42nd are shown to select the feature points here. Right-click the image and select Get Coordinates tool in the menu and pick the feature points on the image. Then use "Edit"->"Copy" to copy the coordinates. Since we chose four frames for tracking, four crack-tip feature points should be chosen. The following figure shows the point that I chose in the 29th frame.

![MMA](/uploads/images/2020/CrackTipTrajectory2.jpg)

Paste the coordinates into the following code,

{% raw %}
```
trackCoord = {{335.9, 400.2}, {430.5, 406.1}, 
              {436.5, 410.6}, {444., 401.6}};
trackFrame1 = Append[trackFrame, Length[vIn] + 1];
trackFrame2 = Partition[trackFrame1, 2, 1];
trackFrame3 = ReplacePart[#, {-1} -> #[[-1]] - 1] & /@ trackFrame2;
rST = MapThread[
      ImageFeatureTrack[Take[vIn, #1], {#2}] &, {trackFrame3, 
      trackCoord}];
rST1 = Join @@ rST
```
{% endraw %}

The image coordinates of the crack tip will be stored in rST1,

![MMA](/uploads/images/2020/CrackTipTrajectory3.png)

Note that all these coordinates are just the image coordinates directly calculated from the image. Before we turn these coordinates into the real coordinates in the model, we should check the tracking quality. The method is very simple, I draw a small blue circle with the coordinates in "rST1" to each frame,

```
iMG1 = Table[ Show[vIn[[i]], 
       Graphics[{Blue, Thick, Circle[Flatten[rST1, 1][[i]], 5]}]], 
       {i, Length[vIn]}];
iMG2 = ImageResize[#, Scaled[1/1]] & /@ iMG1;

(*Add frame number to inspect the tracking results*)
iMG3 = Show[iMG2[[#]], 
       Graphics[{Text[Style[#, FontSize -> 14], Scaled[{.5, .8}]]}]] 
       & /@ Table[i, {i, Length[iMG2]}];
vOut = ListAnimate[iMG3]
```

Drag the slide bar to check the tracking quality. If Mathematica lost the tracking point, you should add more tracking frames in the previous code to correct the result. If the crack tip trajectory is tracked correctly, then the following code is used to transfer the image coordinates into the real coordinates in the model,

{% raw %}
```
realCoord = {{4.79849, 1.83042}, {356.478, 359.281}};
imgCoord = {{81.77, 75.45}, {720.1, 724.5}};

(*Get the scale factor and origin position*)
realDist = realCoord[[2]] - realCoord[[1]];
imgDist = imgCoord[[2]] - imgCoord[[1]];
xyFactor = realDist/imgDist;
xyOrigin = xyFactor*(imgDist/realDist*(-realCoord[[1]]) + imgCoord[[1]]);
rST2 = xyFactor*# - xyOrigin & /@ Flatten[rST1, 1]

(*Draw the image coordinates*)
ListLinePlot[Flatten[rST1, 1], Mesh -> All]
ListLinePlot[rST2, Mesh -> All]
```
{% endraw %}

To calculate the real coordinates, I use the coordinates of two points. "realCoord" stores the real coordinates in the model, and "imgCoord" stores the coordinates in the image at the same model position. The result will be saved in rST2. Two list plots will be drawn to compare the coordinates,

![MMA](/uploads/images/2020/CrackTipTrajectory4.png)

The first figure is about the image coordinates and the second figure is the real coordinates in the model. Then, we export the animation.

```
fileOutPath = NotebookDirectory[] <> "Out.avi";
Export[fileOutPath, iMG2]
```

Here is the result animation:

![MMA](/uploads/images/2020/CrackTipTrajectory5.gif)

![MMA](/uploads/images/2020/CrackTipTrajectory6.gif)


