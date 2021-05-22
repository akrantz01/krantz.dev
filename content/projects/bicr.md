+++
title = "BiCR"
date = "2020-08-20"
tags = ['rust']
+++

BiCR, or binary container runtime, is a custom container abstraction built on top of [Podman](https://podman.io) that supports creating containers from a single binary over gRPC.
There is a base filesystem that all containers are based on that is stored on a [Btrfs](https://wiki.debian.org/Btrfs) partition for copy-on-write support.

It was initially designed for [Servlio](/projects/servlio/), but was never actually used since it would have required too much extra overhead for not enough tangible benefit over existing solutions.
Despite this, it still served as a good learning oppertunity, and I now believe that I have a **much** better understanding of how containers work under the hood.

This project started off as a completely custom container runtime operating right next to the OS, but eventually transition up the abstraction layers.
The first transition was to [runC](https://github.com/opencontainers/runc) which is the basis for many of the popular container tools as it made managing and sandboxing processes far easier.
However, networking and logging soon became a problem, which led me to switch to Podman as the final abstraction, since it supports all the necessary features with an easy to use API.

{{< project Gitea="https://code.krantz.dev/servlio/bicr" >}}
