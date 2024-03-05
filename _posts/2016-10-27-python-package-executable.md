---
title: Python package into executable file
date: 2016-10-27 11:15:20
categories:
- Tutorials
tags:
- Tutorials
---

![Pyinstaller](/uploads/images/0000/Pyinstaller.jpg)
After writing a script in Python, I want to package it into an executable file. However, py2exe does not support Python 3+, So I have to find an alternative packaging tools like PyInstaller and cx_Freeze. After checking various sources, it appears that PyInstaller provides better packaging results, making it the preferred choice.

<!-- more -->

Installing PyInstaller is straightforward using pip,

```bash
pip install pyinstaller
pyinstaller --version
```

we can easily check PyInstaller's version,

![Pyinstaller](/uploads/images/2016/PythonPackageExe1.png)

To package a Python file, we can use one of the following two commands:

```
pyinstaller script.py
pyinstaller --onefile script.py
```

The first command generates a lot of DLLs and corresponding library files in the dist folder, while the second command produces a single large executable. Thus, the second command is generally preferred. After running the command, PyInstaller also creates a script.spec file in the same folder as the script.py. This spec file acts as a configuration file for packaging, similar to a makefile, and allows for various parameters to be set.

However, the process seems to be simple, but the generated executable might not run well. A common error looks like,

```
The 'six' package is required; normally this is bundled with this package so if you get this warning, consult the packager of your distribution.
```

This issue can be difficult, and despite trying various solutions found online, the problem still persists. Also it leads to additional errors stating that a certain XXX package is required. After some troubleshooting, here's a general solution,

- There's no need to downgrade setuptools. My setup includes Anaconda3 with Python 3.5, PyInstaller 3.2, and setuptools 28.6.1.
- Install any missing packages as needed. For instance, if the 'six' package is missing, install it using the following command:
```
pip install six
```
- Recompile the executable after installation. If there are no further complaints about missing packages, the issue is resolved.

For example, if the 'appdirs' package is missing, simply install it using pip, and then recompile the executable,

![Pyinstaller](/uploads/images/2016/PythonPackageExe2.png)

However, after installing 'appdirs', if the executable still doesn't run as expected, we may need to edit the script.spec file. Locate the `hiddenimports=[]` line and add 'appdirs' within the brackets. Make sure to include the single quotes. After some experimentation, my spec file configuration looked like this,

```python
# -*- mode: python -*-

block_cipher = None


a = Analysis(['play.py'],
             pathex=['E:\\PY'],
             binaries=None,
             datas=None,
             hiddenimports=['appdirs','packaging.requirements'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          name='play',
          debug=False,
          strip=False,
          upx=True,
          console=True )
```

In summary, the process for handling missing packages with PyInstaller involves,

![Pyinstaller](/uploads/images/2016/PythonPackageExe3.png)
