---
title: Snippet: matrix with Euler angles
date: 2018-03-05 16:47:02
categories:
- Snippet
tags:
- Snippet
---

This snippet posts an Excel to calculate the matrix with Euler angles. To describe the rotation of a crystal frame, commonly, we use three angles: $ \alpha$, $ \beta$, and $ \gamma$. They are also known as Bunge angles.

The matrix to rotate the crystal frame in reference frame is described by Euler angles as below:

$$ \displaystyle \mathbf{B}=\begin{bmatrix}
\begin{matrix}
\cos(\alpha)\cos(\gamma) \\
- \sin(\alpha)\sin(\gamma)\cos(\beta)
\end{matrix}&
\begin{matrix}
\sin(\alpha)\cos(\gamma) \\
+\cos(\alpha)\sin(\gamma)\cos(\beta)
\end{matrix}&
\sin(\gamma)\sin(\beta)\\
\begin{matrix}
-\cos(\alpha)\sin(\gamma) \\
- \sin(\alpha)\cos(\gamma)\cos(\beta)
\end{matrix}&
\begin{matrix}
-\sin(\alpha)\sin(\gamma) \\
+ \cos(\alpha)\cos(\gamma)\cos(\beta)
\end{matrix}& \cos(\gamma)\sin(\beta)\\
\sin(\alpha)\sin(\beta) & -\cos(\alpha)\sin(\beta) & \cos(\beta)
\end{bmatrix} $$

In this Excel ([MatrixEuler1.xlsx](/uploads/files/2018/MatrixEuler1.zip)), you just need to input three Euler angles and the vector in reference frame. It will give the matrix and the inverse matrix with these three Euler angles. Also, it will give the vector in crystal frame.

![Excel results](/uploads/images/2018/MatrixEuler1.png)

This snippet is very useful for debugging the code with the rotation of Euler angles.