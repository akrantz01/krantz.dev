+++
title = "DNS"
date = "2019-05-07"
tags = ['go', 'js']
+++

This project is a custom DNS server that can be updated during runtime through a web UI. 
To persist the routes, a [Bolt](https://github.com/etcd-io/bbolt) database gets used for its simplicity and lack of external dependencies.
The project is written in [Golang](https://golang.org) for the backend and JavaScript for the frontend.

{{< project GitHub="https://github.com/akrantz01/dns" >}}
