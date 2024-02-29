---
title: Ansys Drucker-Prager (DP) material model
date: 2015-11-10 10:52:50
categories:
- Explorations
tags:
- Ansys
---

The Drucker-Prager (DP) material model in Ansys is a non-metallic material model that can consider volume expansion caused by yielding. Thus, it is suitable for simulating granular materials with friction, concrete, rocks, etc. Unlike metallic materials, the DP material model can use both associated and non-associated flow rules. However, the DP material does not have a hardening rule and its yield surface expands with an increase in hydrostatic pressure, exhibiting ideally elastic-plastic behavior. The equivalent stress for the DP model is defined by the following equation,

<!-- more -->

$${\sigma _e} = 3\beta {\sigma _m} + {\left[ {\frac{1}{2}{\left\{ s \right\}^T}\left[ M \right]\left\{ s \right\}} \right]^{\frac{1}{2}}}
$$

In the formula: ${\sigma _e}$ represents the modified equivalent stress; ${\sigma _m}$ is the hydrostatic pressure; $β$ is a material constant; in the principal stress space, the yield surface is conical, which is a smooth version of the Mohr–Coulomb yield surface.

The DP material's yield criterion can be rewritten as follows,

$$F = 3\beta {\sigma _m} + {\left[ {\frac{1}{2}{\left\{ s \right\}^T}\left[ M \right]\left\{ s \right\}} \right]^{\frac{1}{2}}} – {\sigma _y}$$

Where $β$ and $\sigma_y$ are defined by,

$$\beta  = \frac{2\sin \phi }{\sqrt 3 (3 – \sin\phi )}$$

$${\sigma _y} = \frac{6c\cos \phi }{\sqrt 3 (3 – \sin\phi )}$$

Here, $\phi$ is the internal friction angle; $c$ is the cohesion. If there are uniaxial tensile ${\sigma _t}$ and compressive ${\sigma _c}$ as yield stresses from raw data, they can be converted as follows,

$$\begin{array}{cc} 
{\phi  = {\sin }^{ – 1}\left( {\frac{3\sqrt 3 \beta }{2 + \sqrt 3 \beta }} \right)}\\ 
{c = \frac{\sigma_y \sqrt 3 (3 – \sin\phi )}{6\cos \phi }} 
\end{array} \to \begin{array}{cc} 
{\beta  = \frac{\sigma_c – {\sigma _t}}{\sqrt 3 \left( {\sigma_c + {\sigma _t}} \right)}}\\ 
{\sigma_y = \frac{2{\sigma _c}{\sigma _t}}{\sqrt 3 \left( {\sigma_c + {\sigma _t}} \right)}} 
\end{array}$$

The DP model requires three parameters: the cohesion (shear yield stress) $c$, in units of stress; the internal friction angle $\phi$, in degrees; and the dilation angle $\phi f$, which controls volume expansion. If $\phi f = 0$, there is no volume expansion. If $\phi f = \phi$, more severe volume expansion occurs. If $\phi f < \phi$, there is minor volume expansion.

For parameters, all parameters must be specified, cohesion cannot be zero, and the material's elastic parameters must also be entered. The DP material does not consider temperature dependence, so temperature parameters are not required. Additionally, as a rate-independent material, it is treated similarly to other rate-independent materials for solving, requiring specification of nonlinear effects and appropriate sub-steps to capture the response.

In post-processing, if the material yields, the material's equivalent plastic strain is non-zero (NL,EPEQ), and the equivalent stress parameter SPL (NL,SEPL) is the von Mises equivalent stress at the current hydrostatic stress level. It is important to note that for equivalent strain (EPPL,EQV), ANSYS assumes incompressible inelastic strain ($\nu=0.5$). However, if $\phi f \neq 0$, volume expansion can occur, which may not be realistic.
