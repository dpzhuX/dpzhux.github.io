---
title: Ansys contact analysis and configuration
date: 2015-11-20 13:41:48
categories:
- Explorations
tags:
- Ansys
---

![ANSYS](/uploads/images/0000/ANSYS.jpg)
In practical analyses, nonlinear contact between structures or components is frequently encountered. Contact problems, a type of nonlinear behavior, often require significant computational resources. To conduct a analysis, it is essential to establish an effective model. Setting up contact analyses in Ansys typically involves two main issues:

<!-- more -->

* Uncertainty in contact area size: Before solving the problem, it is uncertain whether a region will undergo contact or if self-contact scenarios will occur. Additionally, it is unclear whether model surfaces will be separated or in contact.
* Friction in contact: Since friction usually exists in contacts and is a nonlinear behavior, its presence can make convergence of contact problems challenging. Therefore, careful consideration is required in choosing the friction model and setting the friction coefficient.

Contact problems can be broadly categorized into two types based on the nature of the contact:

* Rigid-Flexible Contact: In this type of contact, one or more contacting surfaces are considered rigid. This is common in metal forming problems where the die can be considered rigid, and the metal being formed is flexible.
* Flexible-Flexible Contact: Here, the stiffness of the contacting bodies is similar, causing both to deform during analysis. This type of problem is typically more complex.

![Model](/uploads/images/2015/AnsysContactAnalysis1.jpg)

Contact methods in Ansys can be divided into three categories: point-to-point, point-to-surface, and surface-to-surface contacts. To establish an appropriate model, it is necessary to understand which parts of the model will come into contact and which method of contact to use.

* Point-to-Point Contact: This is mainly for simulating foundational interactions between points with a small contact range. It requires prior knowledge of the contact position, with minimal relative sliding between contact faces, typically corresponding one-to-one on both surfaces. Contact12 and Contact52 elements are used for point-to-point contact, they all use penalty functions to impose contact conditions.
* Point-to-Surface Contact: Defined by a set of nodes to simulate contact between surfaces, which can be rigid or flexible. This type does not require precise knowledge of contact positions, allowing for significant relative sliding and inconsistent meshing between contact surfaces. Contact48 and Contact49 elements are used for point-to-surface contact, with Contact48 offering improved modeling capabilities through pseudo-element algorithms, utilizing penalty functions or a combination of penalty functions and Lagrange multipliers for contact conditions.
* Surface-to-Surface Contact: This widely used contact method suits both rigid-flexible and flexible-flexible contacts. Ansys requires generating a "contact pair" composed of target and contact elements, identified by shared real constants. Target169 and Target170 simulate 2D and 3D surfaces, while Contact171, Contact172, Contact173 and Contact174 simulate the contact surfaces, applying contact conditions through enhanced Lagrange methods or optionally, penalty functions.

Surface-to-surface contact offers several advantages:

* Support friction, large deformations, and significant relative sliding.
* Calculate thickness changes in shells and beams.
* Compatible with both low and high-order elements.
* Semi-automatic contact stiffness calculation.
* No restrictions on rigid surface shapes.
* Provide normal pressure and friction stress results.
* Use control nodes for rigid surface control.
* Wizard-assisted generation.
* Support various contact behavoirs.
* Fewer contact elements are required.

![Model](/uploads/images/2015/AnsysContactAnalysis2.jpg)