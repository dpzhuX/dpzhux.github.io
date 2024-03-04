---
title: OpenSees recorder data via TCP
date: 2016-11-20 20:42:33
categories:
- Tutorials
tags:
- Tutorials
---

![TCP](/uploads/images/0000/TCP.jpg)
In the process of analyzing structures with OpenSees, the recorder command is essential. It records the displacements of critical nodes and elements in the structure, as well as the base reactions. Then we can use the data to plot the hysteresis curves of the structure. However, when OpenSees is adding data to a file using the recorder command, the file is locked, and it is not possible to access the recorded displacements in real-time during the model computation. To address this, the recorder provides an alternative method -- sending data via TCP. By checking the recorder command,

<!-- more -->
```
recorder Node <-file $fileName> <-xml $fileName> <-binary $fileName> 
              <-tcp $inetAddress $port> <-precision $nSD> <-timeSeries $tsTag>
              <-time> <-dT $deltaT> <-closeOnWrite> <-node $node1 $node2 ...> 
              <-nodeRange $startNode $endNode> <-region $regionTag> 
              -dof ($dof1 $dof2 ...) $respType'
```

There exists an option for -tcp, which according to the documentation,

```
inetAddr     ip address, "xx.xx.xx.xx", of remote machine to which data is sent
$port        port on remote machine awaiting tcp
```

It requires an IP address and a port number. We can use Python to listen on a TCP port and thus acquire the analysis data. By using Python socket module to listen on a port, I've chosen port 8099 since it is less commonly used by other applications,

```python
# -*- coding: utf-8 -*-
"""
Created on Sun Nov 20 19:55:39 2016

@author: Orycho
"""

import socket

HOST = '127.0.0.1'
PORT = 8099

tcpSerSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcpSerSock.bind((HOST, PORT))

tcpSerSock.listen(5)
(tcpCliSock, address) = tcpSerSock.accept()
datarecv = tcpCliSock.recv(20)
print(datarecv)
```

First, I receive 20 bytes of data to see its content. Before listening, it is necessary to insert the following recorder code into the OpenSees script for the time-history analysis,

```
recorder Node -tcp 127.0.0.1 8099 -time -node 504 -dof 1 2 3 disp
```

Here, I record the displacements of three degrees of freedom for node 504 in the model. The node number is defined based on individual needs.

Running the Python code to listen data via TCP and the TCL code for time-history analysis directly, we can get the printed data: b'\x00\x00\x00\x00\x00\x00\x10@'. It is important to note that OpenSees sends data as a byte stream, so we need to decode the received data. In Python, byte streams can be decoded using the str.decode() method, but a more convenient method involves the Struct module:

> This module performs conversions between Python values and C structs represented as Python bytes objects. This can be used in handling binary data stored in files or from network connections, among other sources. It uses Format Strings as compact descriptions of the layout of the C structs and the intended conversion to/from Python values.

Simply import struct module and use the unpack() function for decoding,

```python
# -*- coding: utf-8 -*-
"""
Created on Sun Nov 20 19:55:39 2016

@author: Orycho
"""

import socket
from struct import Struct


HOST = '127.0.0.1'
PORT = 8099

tcpSerSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcpSerSock.bind((HOST, PORT))

tcpSerSock.listen(5)
unpacker = Struct('d')
(tcpCliSock, address) = tcpSerSock.accept()

datarecv = tcpCliSock.recv(unpacker.size)
print(unpacker.unpack(datarecv))
```

When we construct a Struct object, we should use the structured code 'd' to denote the data as a 64-bit floating point. Struct supports many types of byte stream decoding,

![OpenSees recorder via TCP](/uploads/images/2016/OpenseesRecorderTcp1.png)

The Selection can be based on actual transmission requirement. Thus, we get the first piece of data: (4.0,), which actually indicates the size of the subsequent data. For a clearer understanding of the data transmission method, a loop can be used to fetch the data,

```python
i = 0
while i<10:
    datarecv = tcpCliSock.recv(unpacker.size)
    print(unpacker.unpack(datarecv))
    i+=1
```

We can get the following data,

```bash
>>>runfile('C:/Users/Orycho/Orycho.py', wdir='C:/Users/Orycho')
(4.0,)
(4.0,)
(0.001,)
(0.02662836286939649,)
(0.16768533007884542,)
(0.0011595104392798314,)
(4.0,)
(0.002,)
(0.02663361813387128,)
(0.16768534734794735,)
(0.001159510437405491,)
(4.0,)
(0.003,)
(0.026644128120415136,)
(0.16768538434738964,)
(0.0011595104332500982,)
(4.0,)
(0.004,)
(0.02665989196147036,)
(0.1676854414368055,)
```

Clearly, the selected output information includes the current time and note displacements for the three degrees of freedom. Thus, the data can be interpreted as follows: the first segment of data represents the length of the data, and from the second segment, the data length, time, and displacements in the three degrees of freedom are sequentially output. Based on this rule, a simple loop is used to store all the data,

```python
# -*- coding: utf-8 -*-
"""
Created on Sun Nov 20 19:55:39 2016

@author: Orycho
"""

import socket
from struct import Struct


HOST = '127.0.0.1'
PORT = 8099

tcpSerSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcpSerSock.bind((HOST, PORT))

tcpSerSock.listen(5)
unpacker = Struct('d')
(tcpCliSock, address) = tcpSerSock.accept()
datarecv = tcpCliSock.recv(unpacker.size)
DataSize = unpacker.unpack(datarecv)[0]

data = []
i=0
while i<100:
    datarecv = tcpCliSock.recv(unpacker.size)
    if len(datarecv) != unpacker.size:
        continue
    if unpacker.unpack(datarecv)[0] ==DataSize :
        if data != []:
            print(data)
            data= []
    else:
        data.append(unpacker.unpack(datarecv)[0])
    i+=1
```

Thus, we can get the following data now,

```bash
>>>runfile('C:/Users/Orycho/Orycho.py', wdir='C:/Users/Orycho')
[0.001, 0.02662836286939649, 0.16768533007884542, 0.0011595104392798314]
[0.002, 0.02663361813387128, 0.16768534734794735, 0.001159510437405491]
[0.003, 0.026644128120415136, 0.16768538434738964, 0.0011595104332500982]
[0.004, 0.02665989196147036, 0.1676854414368055, 0.0011595104267354218]
[0.005, 0.026680908754954664, 0.16768551849102625, 0.001159510417892269]
[0.006, 0.026707177623336277, 0.1676856156783133, 0.0011595104066926946]
[0.007, 0.026738697682774034, 0.16768573301740494, 0.0011595103931363285]
[0.008, 0.02677546805855007, 0.16768587062885457, 0.0011595103772075665]
[0.009000000000000001, 0.026817487877874878, 0.16768602859199622, 0.0011595103588957188]
[0.010000000000000002, 0.026864756272776964, 0.1676862070259561, 0.0011595103381862616]
[0.011000000000000003, 0.0269172723793958, 0.16768640604339596, 0.0011595103150641997]
[0.012000000000000004, 0.026975035337699335, 0.16768662577665835, 0.0011595102895130339]
[0.013000000000000005, 0.027038044292212134, 0.16768686636266025, 0.001159510261515003]
[0.014000000000000005, 0.027106298391222153, 0.16768712795137092, 0.0011595102310509792]
[0.015000000000000006, 0.027179796787572715, 0.1676874107007538, 0.001159510198100731]
[0.016000000000000007, 0.02725853863801898, 0.16768771477951422, 0.0011595101626424838]
[0.017000000000000008, 0.027342523103821525, 0.1676880403653035, 0.0011595101246535124]
[0.01800000000000001, 0.027431749350301772, 0.16768838764559219, 0.0011595100841094957]
[0.01900000000000001, 0.027526216547265208, 0.16768875681695575, 0.00115951004098519]
```

This method successfully retrieves the TCP data transmitted by the recorder. Since TCP communication is more direct than file-based data retrieval and better suited for remote operations and distributed computing, this approach is more efficient from my perspective. Following this logic, a loop to listen on port 8099 can be created. The code below, modified from one found on the OpenSees forum, continually fetches data. We can use Python to start a subprocess to listen on port 8099 continuously. Once data is received, the main thread can proceed with subsequent tasks,

```python
# -*- coding: utf-8 -*-
"""
Created on Fri Nov 20 21:49:08 2016

@author: orycho
"""
import socket
from struct import Struct


HOST = '127.0.0.1'
PORT = 8099

tcpSerSock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcpSerSock.bind((HOST, PORT))

tcpSerSock.listen(5)
unpacker = Struct('d')
while True:
    print('waiting for connection...')
    (tcpCliSock, address) = tcpSerSock.accept()
    print('Connected from:',address)
    

    datarecv = tcpCliSock.recv(unpacker.size)
    DataSize = unpacker.unpack(datarecv)[0]
    
    print('Data Size == {0}'.format(DataSize))
    

    SizeReceived = 0
    Data = []
    while True:
        try:
            datarecv = tcpCliSock.recv(unpacker.size)
        

            if SizeReceived > 0:	
                Data.append(unpacker.unpack(datarecv)[0])

            if SizeReceived == DataSize:
                SizeReceived = 0
                print(Data)
                Data = []
            else:
                SizeReceived += 1
        except:
            print('disconnect from:', address)
            tcpCliSock.close()
            break
    
tcpSerSock.close()
```

It should be noted that this code works well in local testing, but during online testing, when the number of recorded nodes is large (hundreds of degrees of freedom), packet loss can occur. This can lead to decoding errors with Struct, resulting in abnormally large or small data, such as 5.8e+312 or 1.4e-217. Therefore, when using TCP to transmit data between multiple computers, we should write a Python script on the machine with OpenSees installed to receive data locally and transmit it to another machine using an appropriate data flow, this can ensures a reliable transmission.

> All source code is available upon request.
