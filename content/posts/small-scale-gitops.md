---
title: Small Scale GitOps
description: Implementing GitOps principles for a small organization
date: 2021-09-11
---

While working on a bunch of tools for WaffleHacks, a hackathon I helped organize that recently finished, I kept running 
into issues deciding when to deploy something onto our server. No matter whether it was a small or large change, I would
still need to go through the same arduous process of:

- SSHing into the server
- pulling the changes from GitHub for each service
- restarting the service(s)
- waiting for the application to start, and hoping it worked

Depending on how long I waited between deployments, this could take anywhere from 5 minutes to an hour. Time I could be
spending being more productive, like working on new features or maybe doing homework.

This same process continued for around 2 months when I decided to attempt to automate this workflow. I began working on
a quick and dirty tool I sensibly named [AutoDeploy][]. Using webhooks from GitHub and a [configuration file][] located 
at the root of the repository, it would pull and run a set of predefined commands on every push. It worked well enough 
for a while, but it was very brittle. If any dependencies changed or a new application needed to be added, AutoDeploy 
would blindly run through its commands and the deployment would most likely fail. Not to mention that there was no way 
to know whether the deployment was successful because AutoDeploy never reported its status anywhere.

Shortly after setting up AutoDeploy, I stopped making and deploying as many changes since it was becoming more of a
burden to deploy than before. I quickly realized I needed a new solution.


## Enter GitOps

> A system development/management pattern where
> - git is the **SINGLE** source of truth for a system
> - git is the **SINGLE** place where we operate **ALL** environments
> - **ALL** changes are observable _and_ verifiable

###### Credit: [@victorsilva][]

Using something like [ArgoCD][] or [Flux][] seemed like the perfect solution to my deployments problem. Just 
containerize all the applications and use a single repository to store all the Kubernetes manifests.

All done, right? Unfortunately not.

Everything seemed great until I took a look at the cost of running this. At the _minimum_ it would cost double, maybe
even triple what we were paying for our server, granted that was only $20/month. However, for a bunch of broke college
students trying to run a hackthon with, at the time, no sponsors, this was a no-go. So I went searching for a smaller
solution that could be used on a single server, or could scale down to a single server.

After searching for about a week, I couldn't find anything. Either I was using the wrong terms, nothing like it exists,
or they are all environment specific solutions that are not public. So, Like any overly enthusiastic programmer, I
decided to write one myself.

Around 3 months later, after weeks of on-off work interspersed throughout my internship, [WaffleMaker][] was born. Why
the name? One of my inspirations for the tool was [Beekeeper][] made by [HackGT][], so WaffleMaker seemed fitting given
the hackathon's name was WaffleHacks.


## About WaffleMaker

Similarly to Flux and ArgoCD, WaffleMaker allows using a single git repository as the single source of truth for
deployments. However, since it does not run on Kuberentes, it can't benefit from having a pre-defined manifest format
for any resources, or a nice API to hook into for deploying them. As such, WaffleMaker is what you get when you smash
Kubernetes, ArgoCD, and [Vault][] together into one application. It does some light container monitoring to prevent an application from being inaccessible, receives webhook events
whenever a push is received on the source repository, and injects secrets into containers from Vault.

I wrote a custom manifest format to define each service ([example manifest][]). It allows specifying the base image,
any configuration through environment variables, secrets to pull from Vault, and the image to deploy from. The benefit of
using Vault for secret management, is that you can generate credentials for things on the fly. In the case of WaffleMaker,
I use it to generate credentials for AWS and a PostgreSQL database. This means less credential management, and it still
stays secure.

In addition to WaffleMaker, we are using GitHub Actions at WaffleHacks to automatically build container images on each
push to any branch. This allows us to automatically update the running container ensuring the latest version is deployed.
Our tagging scheme is such that each image is tagged with the commit hash and the branch it was pushed to. When
configuring the service, we can specify which tags are allowed to be updated from, preventing development versions from
accidentally being deployed.


## The future

Currently, WaffleMaker is deployed and being used ([our source of truth][]). Looking ahead, there are a handful of
changes and process improvements I would like to make:

- make the subdomain name not based on the file path
- allow explicit communication between containers
- utilize container health checks for restarting a service

That's all for this post, thanks for reading! If you know of any existing solutions or see anywhere WaffleMaker could be
improved, feel free to comment below.


[AutoDeploy]: https://github.com/WaffleHacks/autodeploy
[configuration file]: https://github.com/WaffleHacks/autodeploy/tree/master/autodeploy.example.toml
[@victorsilva]: https://twitter.com/vitorsilva/status/999978906903080961
[ArgoCD]: https://argoproj.github.io/argo-cd/
[Flux]: https://fluxcd.io/
[WaffleMaker]: https://github.com/WaffleHacks/wafflemaker
[Beekeeper]: https://github.com/HackGT/beekeeper
[HackGT]: https://hack.gt
[Vault]: https://www.vaultproject.io
[example manifest]: https://github.com/WaffleHacks/wafflemaker/blob/master/example-service.toml
[our source of truth]: https://github.com/WaffleHacks/waffles
