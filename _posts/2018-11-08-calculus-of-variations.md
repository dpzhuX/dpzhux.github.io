---
title: Calculus of variations I
date: 2018-11-08 15:02:23
categories:
- Notes
tags:
- Notes 
---

![Notes](/uploads/images/0000/Notes.jpg)
Here is my notes about the calculus of variations that deals with optimizing functionals, which are mappings from a set of functions to the real numbers. It involves finding a function that minimizes or maximizes a given functional, often subject to certain constraints. This field has applications in various areas, including physics, engineering, and economics, by providing a systematic way to deal with optimization problems where the quantity to be optimized is dependent on a function.

<!-- more -->

### Vector space

A vector space is a collection of objects $\left( \mathbb{M,}+,\cdot \right) $ together with two operations that satisfy the eight axioms:

1. Commutativity of addition: $\boldsymbol{a}+\boldsymbol{b}=\boldsymbol{b}+\boldsymbol{a}$,
2. Associativity of addition: $\boldsymbol{a}\left( \boldsymbol{bc} \right) =\left( \boldsymbol{ab} \right) \boldsymbol{c}$,
3. Neutral element of addition: $\boldsymbol{0}+\boldsymbol{a}=\boldsymbol{a}$,
4. Inverse element of addition: $\boldsymbol{a}+\left( -\boldsymbol{a} \right) =\boldsymbol{0}$,
5. Associativity of scalar multiplication: $\alpha \left( \beta \boldsymbol{a} \right) =\left( \alpha \beta \right) \boldsymbol{a}$,
6. Distributivity w.r.t vector addition: $\alpha \left( \boldsymbol{a}+\boldsymbol{b} \right) =\alpha \boldsymbol{a}+\alpha \boldsymbol{b}$,
7. Distributivity w.r.t scalar addition: $\left( \alpha +\beta \right) \boldsymbol{a}=\alpha \boldsymbol{a}+\beta \boldsymbol{a}$,
8. Identity element of scalar multiplication: $1\boldsymbol{a}=\boldsymbol{a}$,

where $\boldsymbol{a},\boldsymbol{b} , \boldsymbol{c}  \in \mathbb M$ and $\alpha, \beta  \in \mathbb R$.

### Taylor's theorem

#### One variable:

$$f\left( x \right) =f\left( x_0 \right) +f'\left( x_0 \right) \left( x-x_0 \right) +\frac{f^{\left( n \right)}\left( x_0 \right)}{n!}\left( x-x_0 \right) ^n+R_{n+1}$$

where the remainder,

$$R_{n+1}=\frac{f^{\left( n+1 \right)}\left( \xi \right)}{\left( n+1 \right) !}\left( x-x_0 \right) ^{n+1}$$

where $\xi \in \left( x, x_0 \right)$.

#### Two variables:

$$
f\left( {x,y} \right) = f\left( {x_0},{y_0} \right) + \left( {\frac{\partial }{\partial x}\left( {x - {x_0}} \right) + \frac{\partial }{\partial y}\left( {y - {y_0}} \right)} \right)f\left( {x_0},{y_0} \right) \\
+ \frac{1}{n!}{\left( {\frac{\partial }{\partial x}\left( {x - {x_0}} \right) + \frac{\partial }{\partial y}\left( {y - {y_0}} \right)} \right)^n}f\left( {x_0},{y_0} \right) + {R_{n+1}} $$

where the remainder,

$${R_{n+1}} = \frac{1}{\left( {n + 1} \right)!}{\left( {\frac{\partial }{\partial x}\left( {x - {x_0}} \right) + \frac{\partial }{\partial y}\left( {y - {y_0}} \right)} \right)^{n + 1}}f\left( {\xi ,\zeta } \right)$$

And

$${\left( {\frac{\partial }{\partial x}\left( {x - {x_0}} \right) + \frac{\partial }{\partial y}\left( {y - {y_0}} \right)} \right)^n} = \sum\limits_{r = 0}^k {C_k^r\frac{\partial }{\partial {x^r}\partial {y^{k - r}}}{\left( {x - {x_0}} \right)^r}{\left( {y - {y_0}} \right)^{k - r}}} $$

where $\xi \in \left( x, x_0 \right), \zeta \in \left( y, y_0 \right)$.

Thus, Taylor's expansion for multiple variables,

$$f\left( {x_1},{x_2}, \cdots {x_m} \right) = \sum\limits_{k = 0}^n {1 \over {n!}{\left( {\sum\limits_{i = 1}^m {\partial \over {\partial x}\left( {x_i} - x_i^0 \right)} } \right)^k}f\left( {x_1^0,x_2^0, \cdots x_m^0} \right)} + {R_{n + 1}}$$

---

### Gradient and Divergence

#### Gradient :

Denote $\varphi = \varphi \left( {x,y,z} \right)$ as a scalar field and the gradient is,

$$\text{grad} \varphi = \nabla \varphi = \left( {\partial \over \partial x},{\partial \over \partial y},{\partial \over \partial z} \right)\varphi$$

$$\left| {\text{grad}\varphi } \right|=\left| {\nabla \varphi } \right| = \sqrt {\left( {\partial \varphi  \over \partial x} \right)^2 + \left( {\partial \varphi \over \partial y} \right)^2 + {\left( {\partial \varphi \over \partial z} \right)^2}}$$

Thus, the directional derivative in direction $\boldsymbol L$,

$${\nabla _{\boldsymbol L}}\varphi = \nabla \varphi \cdot {\boldsymbol L^u} = {\partial \varphi \over \partial x}L_x^u + {\partial \varphi \over \partial y}L_y^u + {\partial \varphi \over \partial z}L_z^u$$

where $\boldsymbol L^u$ is the unit vector in direction $\boldsymbol L$.

Hence,

$${\nabla _{\boldsymbol n}}\varphi = \left| {\nabla \varphi } \right|$$

where $\boldsymbol n$ is the unit normal vector of the contour line.

#### Divergence:

Denote $\boldsymbol a$ as a vector field and the divergence is,

$${\rm{div}}\boldsymbol a = \nabla \cdot \boldsymbol a = \left( {\partial \over {\partial x}},{\partial \over {\partial y}},{\partial \over {\partial z}} \right) \cdot \left( {a_x},{a_y},{a_z} \right) = {\partial {a_x} \over {\partial x}} + {\partial {a_y} \over {\partial y}} + {\partial {a_z} \over {\partial z}}$$

where $\left( {a_x},{a_y},{a_z} \right)$ are the cartesian coordinates at the desired point.

Thus, the properties,

$$\nabla \cdot \left( {\boldsymbol a + \boldsymbol b} \right) = \nabla \cdot \boldsymbol a + \nabla \cdot \boldsymbol b \qquad (1)$$

$$\nabla \cdot \left( {\varphi \boldsymbol a} \right) = \varphi \nabla \cdot \boldsymbol a + \boldsymbol a \cdot\nabla  \varphi \qquad (2)$$

The proof for the equation $(2)$ is very simple,

$$\nabla \cdot \left( {\varphi \boldsymbol a} \right) = {\left( {\varphi {a_i}} \right)_{,i}} = \varphi {a_{i,i}} + {a_i}{\varphi _{,i}} = \varphi \nabla \cdot \boldsymbol a + \boldsymbol a \cdot \nabla \varphi $$

#### Divergence theorem:

$$\int_V {\nabla \cdot \boldsymbol adV} = \int_{\partial V} {\boldsymbol a \cdot d\boldsymbol s} = \int_{\partial V} {\boldsymbol a \cdot \boldsymbol n ds} $$

where ${\partial V}$ is the boundary of the region $V$ in space.

Then, if $D$ denotes a region on the plane, and ${\partial D}$ is the boundary,

$$\int_D {\nabla \cdot \boldsymbol adD} = \int_{\partial D} {\boldsymbol a \cdot d \boldsymbol \Gamma } = \int_{\partial D} {a \cdot \boldsymbol nd\Gamma } $$

#### Green theorem:

$$\int_V {\nabla \cdot \left( {\varphi \nabla \psi } \right)dV} = \int_{\partial V} {\varphi \cdot {\partial \psi  \over {\partial n}}ds} = \int_{\partial V} {\varphi \cdot \left| {\nabla \psi } \right|ds} $$

$$\int_V {\left( {\varphi \Delta \psi - \psi \Delta \varphi } \right)dV} = \int_{\partial V} {\left( {\varphi \cdot {\partial \psi  \over {\partial n}} - \psi \cdot {\partial \varphi  \over {\partial n}}} \right)ds} $$

$$\int_V {\left( {\varphi \Delta \varphi - {\left( {\nabla \varphi } \right)^2}} \right)dV} = \int_{\partial V} {\left( {\varphi {\partial \varphi  \over {\partial n}}} \right)ds} $$

where $\varphi$ and $\psi$ are two scalar function, ${\partial V}$ is the boundary of the region $V$ in space and $\Delta $ is the Laplace operator.

---

### Lemma for variation

#### Lemma 1:

If $f\left( x \right)$ is continuous in interval $\left[ {a,b} \right]$. For any continuous function $h\left( x \right)$, it satisfies,

$$h\left( a \right) = h\left( b \right) = 0$$

And the following integration is always satisfied,

$$\int_a^b {f\left( x \right)h\left( x \right)dx} = 0$$

Then,

$$f\left( x \right) \equiv 0$$

#### Lemma 2:

If $f\left( x \right)$ is continuous in interval $\left[ {a,b} \right]$. For any continuous function $h\left( x \right)$, it has nth order continuous derivative and satisfies,

$${h^{\left( k \right)}}\left( a \right) = {h^{\left( k \right)}}\left( b \right) = 0,k = 1,2, \cdots n.$$

And the following integration is always satisfied,

$$\int_a^b {f\left( x \right)h\left( x \right)dx} = 0$$

Then,

$$f\left( x \right) \equiv 0$$

#### Lemma 3:

If $f\left( x \right)$ is continuous in interval $\left[ {a,b} \right]$. For any continuous function $h\left( x \right)$, it has first continuous derivative and satisfies,

$${h}\left( a \right) = {h}\left( b \right) = 0$$

And the following integration is always satisfied,

$$\int_a^b {f\left( x \right)h^{\prime}\left( x \right)dx} = 0$$

Then,

$$f\left( x \right) \equiv \text{Constant}$$

#### Lemma 4:

If $f\left( x \right)$ is continuous in interval $\left[ {a,b} \right]$. For any continuous function $h\left( x \right)$, it has (n-1)th order continuous derivative and satisfies,

$${h^{\left( k \right)}}\left( a \right) = {h^{\left( k \right)}}\left( b \right) = 0,k = 1,2, \cdots n-1.$$

And the following integration is always satisfied,

$$\int_a^b {f\left( x \right)h^{(n)}\left( x \right)dx} = 0$$

Then,

$$f\left( x \right) \equiv \text{nth degree polynomial function}$$