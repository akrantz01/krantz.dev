---
title: Securing servers with SSH certificates
date: 2020-11-13
tags: ['post', 'ssh', 'servers']
---

First off, hello to anyone reading this.
Welcome to my personal website/blog where I'll be posting every-so-often about stuff I've been working on or find interesting.
Here's a little about me (at the time of writing): 
- I'm a freshman at the University of British Columbia planning on majoring in computer engineering
- I love skiing and mountain biking
- I have a (probably unhealthy) obsession with computer science and system administration.

For the past 3ish years, I've been renting a few VPSes from various providers to host services for myself and, at one time, this site.
I have a tendency to run with a particular system for a while and then completely wipe it to start from scratch when I've found a better way to do something.
Everytime I've provisioned a new server, I always have to go through the same, tedious process of: assigning the root public key, creating a new user, adding a public key to that user, and giving the user sudo privileges.
This process appears to be unavoidable, unless you only want to use root (which you ABSOLUTELY SHOULD NOT BE DOING!).

At the start of the lockdown in March, I had a desire to completely redo my server setup since my mail server was being a pain.
In my research to find the services I wanted to run and how to best do it, I came across <a href="https://smallstep.com/blog/use-ssh-certificates/" target="_blank">this blog post</a> about SSH certificates.
**TLDR**: SSH certificates allow you to have a single certificate authority that signs all your public keys allowing you to use any private key you approve of, and you should be using them.
After reading that, I sought to implement it for my own servers.

Now, I should note that I am by no means running anything at scale.
I was planning on using 5 servers with 3 in a Docker Swarm cluster, 1 dedicated for mail, and the other for general testing (I have since cut back to 3 standalone servers due to changes in pricing).
I chose to use SSH certificates mainly out of curiosity about the technology.
Rather than using Smallstep's solution that they were pushing in <a href="https://smallstep.com/blog/use-ssh-certificates/" target="_blank">that blog post</a>, I chose to almost roll my own version of it.
Don't worry, I didn't try to roll my own crypto and create a fully custom implementation of it.
I instead used <a href="https://vaultproject.io" target="_blank">Hashicorp Vault</a>, a general purpose secret store, and <a href="https://github.com/akrantz01/vssh" target="_blank">a tool I wrote</a> to sign the public keys.

This worked, but it was a bit clunky.
Vault is really intended for more than just signing SSH certificates so that was a bit overkill.
And the tool I wrote required me to login to Vault's web UI about once a month to reset the authentication token since it had a 30 day TTL, and I didn't really want to figure out how to implement auto-renewal.
Adding on top of this pile, if the server running Vault ever went down, I would essentially be locked out of all my servers.

As I mentioned before, I reduced my server count from 5 to 3 in an effort to save a good chunk of change.
This resulted in me changing my hosting provider (since my previous one, Scaleway, raised their prices) to DigitalOcean.
I decided to do away with that old system and switch to Smallstep's all-in-one solution.
Unfortunately, they only allow you to use external providers on their platform if you pay $10/host which is WAY too expensive for me.
As such, I'm hosting it myself which unfortunately means that I have to find some authentication source to use.

I've been following the development of <a href="https://ory.sh" target="_blank">ORY</a> for a while now, their Hydra server in particular since it provides a light-weight OAuth/OIDC server.
However, it still seems a bit too new to me, and I'm honestly not entirely sure how to add users to it.
Then there's also <a href="https://www.keycloak.org" target="_blank">Keycloak</a> that provides similar features, but is a bit of a memory hog.
I couldn't find any other services that seemed like they fit my needs, so I opted to use <a href="https://auth0.com" target="_blank">Auth0</a> instead.
My goal is to host most of my own services, so I'll probably be switching out Auth0 for ORY Hydra at some point. 
In the meantime, Auth0 works very well and is free for up to 7000 users.

The Smallstep <a href="https://github.com/smallstep/cli" target="_blank">CLI</a> and <a href="https://github.com/smallstep/certificates" target="_blank">CA</a> are quite easy to setup.
I was mostly following <a href="https://smallstep.com/blog/diy-single-sign-on-for-ssh/" target="_blank">this guide</a> and made a few modifications, especially since I'm not on AWS.
Using Smallstep is especially nice since I am able to just use SSH as I normally would, and it automatically hooks into the step CLI to issue certificates when needed.
Instead of running `vssh profiles connect krantz.dev/mail`, I can now just run `ssh mailserver.domain` and it will automatically issue a certificate for my user, and prompt me to login if my authentication has expired.
This is especially nice since I don't need to use two different tools for connecting to any servers.
It also is semi-redundant if the CA server is down since an offline copy of the database is stored locally, meaning I can still access my servers so long as my certificate hasn't expired.

It's been about a week now of using this setup, and I'm very happy with it.
This whole process of setting up the CA, getting my servers connected to it for verifying the certificates, and getting my desktop and laptop setup to request certificates took about a week.
While that may sound like a while, keep in mind that I'm a student and don't have too much time on my hands.
You could probably get it done in a weekend if you had a bunch of free time.
Just make sure to always leave an SSH connection open or have some way of accessing your server, so you can still access it in case you mess something up.

Anyway, I'd highly recommend anyone who has at least 2 servers they own/rent to use SSH certificates.
Bye for now!
