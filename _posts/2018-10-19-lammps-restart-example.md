---
title: LAMMPS restart example
date: 2020-04-20 13:13:22
categories:
- Explorations
tags:
- LAMMPS
---

![LAMMPS](/uploads/images/0000/LAMMPS.jpg)
LAMMPS has the capability to restart the job from the binary file. According to the description from the official website, the command restart can write out a binary restart file with the current state of the simulation every certain timestep. This command has two modes: write the binary file or the data file. If you wish to use the data file, then a convert command is needed in this scenario. Here we do not consider the data file.

<!-- more -->

This LAMMPS script is a simple stretch of an iron nanowire. The orientation of the iron nanowire is `[100](001)`. Due to the simple orientation, this nanowire is constructed in the LAMMPS script file. The dimension of the nanowire is 20c in the x-direction, 10c in the y-direction and 10c in the z-direction, c is the lattice constant which is set to 2.856 in the script. Note that this lattice constant is just copied from [Wikipedia](https://en.wikipedia.org/wiki/Lattice_constant). If you want more accurate data of the lattice constant, you can find on this [website](http://periodictable.com/Properties/A/LatticeConstants.html). The pair potential is the EAM potential from the LAMMPS internal potential library.

First, the entire system is needed to minimize the energy to get the equilibrium and rescale to 300K use the random velocity distribution. Then, a uniform strain is applied to the nanowire in the x-direction. The strain rate is maintained at 1E12 to save simulation time. Before running the simulation, the command restart 200 tmp.restart is inserted into the script, that means every 200 steps, a restart file will be written to the filesystem. Thus, we can restart this simulation with this restart binary file.

```
# Deforming a Si Nanowire.

# ------------------------ INITIALIZATION ----------------------------
units        metal
boundary     p s s
atom_style   atomic
neighbor 2.0 bin 
neigh_modify delay 5 every 1 

#------------ use LAMMPS to create Iron nanowire (for test) ------------ 
lattice bcc 2.856
region whole block -10 10 -5 5 -5 5 units lattice
create_box 1 whole
region LLF block -10 10 -5 5 -5 5 units lattice
lattice bcc 2.856 orient x 1 0 0 orient y 0 1 0 orient z 0 0 1
create_atoms 1 region LLF
mass 1 55.845
atom_modify sort 0 0.0

#----------------------- assign potential ----------------------------
pair_style eam/alloy 
pair_coeff * * Fe_mm.eam.fs Fe

# ------------------------- SETTINGS ---------------------------------
thermo 100 
velocity all create 300.0 12345
thermo_style custom step temp etotal press pxx pyy pzz lx ly lz vol

minimize 1.0e-4 1.0e-6 100 1000

#--------------------------- nve ensemble ----------------------------
reset_timestep 0 
timestep 0.001
fix 1 all nve
fix 2 all temp/rescale 1 300 300 1 0.1

variable timestep equal "step" 
variable temperature equal "temp" 
variable total_energy equal "etotal" 

dump 1 all custom 1000 equilibrate.lammpstrj id type x y z 

run 3000
unfix 1
unfix 2
undump 1

#------------Deform------------------------------
variable srate equal 1.0e11
variable srate1 equal "v_srate / 1.0e12"
fix 1 all deform 1 x erate ${srate1} remap x
fix 2 all nve
fix 3 all temp/rescale 1 300 300 1 0.1

variable tmp equal "lx"
variable L0 equal ${tmp}
variable p1 equal "(lx - v_L0)/v_L0"
variable p2 equal "-pxx/10000"
variable p3 equal "-pyy/10000"
variable p4 equal "-pzz/10000"
variable p5 equal "lx"
variable p6 equal "ly"
variable p7 equal "lz"
variable p8 equal "temp"
compute 1 all pe
compute 2 all ke

fix 4 all ave/time 1 20 100 v_p1 v_p2 c_1 c_2 file tension.dat
dump 1 all custom 100 tension.lammpstrj id type x y z 

restart  200 tmp.restart
run 2000 
```

After the simulation, get the restart file "tmp.restart.5000" and use the command `read_restart` in the restart script.

> Note that the following commands do not need to be repeated because their settings are included in the restart file: units, atom_style, special_bonds, pair_style, bond_style. However these commands do need to be used since their settings are not in the restart file: neighbor, fix, timestep.

Actually, the `pair_style` and `pair_coeff` commands are still needed in the restart file, otherwise, LAMMPS will report `<Error: Atom sorting has bin size = 0.0>`. Here is the example of the restart file.

```
read_restart    tmp.restart.5000


neighbor 2.0 bin 
neigh_modify delay 5 every 1 

pair_style eam/alloy 
pair_coeff * * Fe_mm.eam.fs Fe

thermo 100 
thermo_style custom step temp etotal press pxx pyy pzz lx ly lz vol

timestep 0.001
variable srate equal 1.0e11
variable srate1 equal "v_srate / 1.0e12"
fix 1 all deform 1 x erate ${srate1} remap x
fix 2 all nve
fix 3 all temp/rescale 1 300 300 1 0.1

variable tmp equal "lx"
variable L0 equal ${tmp}
variable p1 equal "(lx - v_L0)/v_L0"
variable p2 equal "-pxx/10000"
variable p3 equal "-pyy/10000"
variable p4 equal "-pzz/10000"
variable p5 equal "lx"
variable p6 equal "ly"
variable p7 equal "lz"
variable p8 equal "temp"
compute 1 all pe
compute 2 all ke

fix 4 all ave/time 1 20 100 v_p1 v_p2 c_1 c_2 file tension.dat
dump 1 all custom 100 tension_restart.lammpstrj id type x y z 

run 2000
```

> All source code is available upon request.