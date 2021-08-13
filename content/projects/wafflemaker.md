+++
title = "WaffleMaker"
date = "2021-05-26"
tags = ['rust']
+++

WaffleMaker is the deployment abstraction layer built on [Docker](https://www.docker.com) and [Vault](https://vaultproject.io) for the WaffleHacks hackathon.
Docker is used to run the applications, and Vault is used for storing their secrets.
This effectively supersedes [autodeploy](/projects/autodeploy), fixing many of its pain points.

WaffleMaker allows you to develop as fast as possible by removing the need to manually deploy each change or set of changes.
By listening to webhooks from GitHub and Docker Hub, WaffleMaker is able to create a new service, and update or delete an existing one.
To know what services to deploy, a dedicated GitHub repository is used that stores all the configuration in [TOML](https://toml.io) format.
An example of this repository can be found [here](https://github.com/WaffleHacks/waffles).

This was built because, at WaffleHacks, we are running on a pretty tight budget, and we can't afford a full Kubernetes cluster with [Flux](https://fluxcd.io) or [ArgoCD](https://argoproj.github.io/argo-cd/) (the leading GitOps solutions).
However, we still wanted to be able to use GitOps as it makes development and deployments considerably easier.
As such, WaffleMaker was born.

This was built for the [WaffleHacks](https://wafflehacks.tech) hackathon which is occurring from August 27th to 29th, 2021.

{{< project GitHub="https://github.com/WaffleHacks/wafflemaker" >}}
