---
title: BookPi
date: 2019-11-07
tags: ['project', 'go', 'js', 'python']
---

Turn an old book into a covert server with a Raspberry Pi Zero and a battery for approximately $80 (USD).
In its most basic form, it is just a Raspberry Pi Zero, a 6600 mAh LiIon battery, and a USB LiIon charger.
However, it can be extended to include whatever bells and whistles you want, like a display or an external HDD/SSD.

It consists of 3 distinct parts: the backend, frontend, and display.
The backend is written in Golang and enables all of the online functionality such as messaging, file storage/sharing, and user accounts.
The frontend is pure JavaScript with Bootstrap 4 as styling to make it look nice.
Finally, the display is an optional OLED 80x128px display that is driven using Python.

<p><a href="https://github.com/akrantz01/bookpi" target="_blank">GitHub</a></p> 
