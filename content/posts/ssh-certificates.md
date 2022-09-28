---
title: Securing servers with SSH certificates
description: Learn how to SSH certificates instead of public keys using SmallStep 
category: Write-up
date: 2020-11-13
---

First off, hello to anyone reading this.
Welcome to my personal website/blog where I'll be posting every-so-often about stuff I've been working on or find interesting.
If you're curious about me, head over to my [about page](/about/).

> Before I start this, I should say that I am by no means endorsed by Smallstep.
> I am simply a big fan of their SSH certificates tool.

For the past 3ish years, I've been renting a few VPSes from various providers to host services for myself and, at one time, this site.
I have a tendency to run with a particular system for a while and then completely wipe it to start from scratch when I've found a better way to do something.
Everytime I've provisioned a new server, I always have to go through the same, tedious process of: assigning the root public key, creating a new user, adding a public key to that user, and giving the user sudo privileges.
This process appears to be unavoidable, unless you only want to use root (which you ABSOLUTELY SHOULD NOT BE DOING!).

At the start of the lockdown in March, I had a desire to completely redo my server setup since my mail server was being a pain.
In my research to find the services I wanted to run and how to best do it, I came across [this blog post][] about SSH certificates.
**TLDR**: SSH certificates allow you to have a single certificate authority that signs all your public keys allowing you to use any private key you approve of, and you should be using them.
After reading that, I sought to implement it for my own servers.

Now, I should note that I am by no means running anything at scale.
I was planning on using 5 servers with 3 in a Docker Swarm cluster, 1 dedicated for mail, and the other for general testing (I have since cut back to 3 standalone servers due to changes in pricing).
I chose to use SSH certificates mainly out of curiosity about the technology.
Rather than using Smallstep's solution that they were pushing in [that blog post][], I chose to almost roll my own version of it.
Don't worry, I didn't try to roll my own crypto and create a fully custom implementation of it.
I instead used [Hashicorp Vault][], a general purpose secret store, and [a tool I wrote][] to sign the public keys.

This worked, but it was a bit clunky.
Vault is really intended for more than just signing SSH certificates so that was a bit overkill.
And the tool I wrote required me to login to Vault's web UI about once a month to reset the authentication token since it had a 30-day TTL, and I didn't really want to figure out how to implement auto-renewal.
It was mostly just a slap-dash implementation to get this whole system working.
Adding on top of this pile, if the server running Vault ever went down, I would essentially be locked out of all my servers.

As I mentioned before, I reduced my server count from 5 to 3 in an effort to save a good chunk of change.
This resulted in me changing my hosting provider (since my previous one, Scaleway, raised their prices) to DigitalOcean.
I decided to do away with that old system and switch to Smallstep's all-in-one solution.
Unfortunately, they only allow you to use external providers on their platform if you pay $10/host which is WAY too expensive for me.
As such, I'm hosting it myself which unfortunately means that I have to find some authentication source to use.

I've been following the development of [ORY][] for a while now, their Hydra product in particular since it provides a light-weight OAuth/OIDC server.
However, it still seems a bit too new to me, and I'm honestly not entirely sure how to add users to it.
Then there's also [Keycloak][] that provides similar features, but is a bit of a memory hog which I'd rather not have since I'm in a memory-constrained environment.
I couldn't find any other services that seemed like they fit my needs, so I opted to use [Auth0][] instead.
My goal is to host most of my own services, so I'll probably be switching out Auth0 for ORY Hydra at some point. 
In the meantime, Auth0 works very well and is free for up to 7000 users.

The Smallstep [CLI][] and [CA][] are quite easy to setup.
I was mostly following [this guide][] and made a few modifications, especially since I'm not on AWS.
Using Smallstep is especially nice since I am able to just use SSH as I normally would, and it automatically hooks into the step CLI to issue certificates when needed.

```shell:Terminal
# Before
vssh profiles connect krantz.dev/mail

# After
ssh mailserver.domain
```

This is especially nice since I don't need to use two different tools for connecting to any servers.
It also is semi-redundant if the CA server is down since an offline copy of the database is stored locally, meaning I can still access my servers so long as my certificate hasn't expired.

It's been about a week now of using this setup, and I'm very happy with it.
This whole process of setting up the CA, getting my servers connected to it for verifying the certificates, and getting my desktop and laptop setup to request certificates took about a week.
While that may sound like a while, keep in mind that I'm a student and don't have too much time on my hands.
You could probably get it done in a weekend if you had a bunch of free time.
Just make sure to always leave an SSH connection open or have some way of accessing your server, so you can still access it in case you mess something up.

Anyway, I'd highly recommend anyone who has at least 2 servers they own/rent to use SSH certificates.
Bye for now!


[this blog post]: https://smallstep.com/blog/use-ssh-certificates/
[that blog post]: https://smallstep.com/blog/use-ssh-certificates/
[Hashicorp Vault]: https://vaultproject.io
[a tool I wrote]: https://github.com/akrantz01/vssh
[ORY]: https://ory.sh
[Keycloak]: https://www.keycloak.org
[Auth0]: https://auth0.com
[CLI]: https://github.com/smallstep/cli
[CA]: https://github.com/smallstep/certificates
[this guide]: https://smallstep.com/blog/diy-single-sign-on-for-ssh/
