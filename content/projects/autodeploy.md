+++
title = "AutoDeploy"
date = "2021-04-16"
tags = ['rust']
+++

Automatically deploy GitHub repos using webhooks.
Can be configured to deploy every push or every release.
By default, it automatically deploys every repository's webhook it receives, but it can be configured to blacklist or whitelist certain repositories.

When a webhook is received, it automatically pulls the repository from the remote repository at the specified commit or tag.
Then it reads a file named `autodeploy.toml` for the actions to run while deploying the service.
There are currently two possible actions that can be run: executing a command and copying a file/directory.

This was built for the [WaffleHacks](https://wafflehacks.tech) hackathon which is occurring from August 27th to 29th, 2021.

{{< project GitHub="https://github.com/WaffleHacks/autodeploy" >}}
