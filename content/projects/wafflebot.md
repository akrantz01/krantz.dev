+++
title = "WaffleBot"
date = "2021-03-06"
tags = ['python', 'js']
+++

WaffleBot is a general purpose Discord bot with a web interface for the WaffleHacks hackathon.
It supports various features such as support tickets, pre-made responses, and moderation tools.

Support tickets are handled in Discord where a new channel is created per ticket, allowing sufficient privacy between the opener and organizers/mentors.
While the channels are eventually deleted as there is an upper limit for the number of channels per server, ticket logs are viewable via a web UI connected to the bot.
The pre-made responses allow for easy answers to commonly asked questions or simply information about various topics accessibly via command.
Similarly to the ticket logs, the pre-made responses are configured through the web UI.

WaffleBot is built on top of [discord.py](https://github.com/Rapptz/discord.py) for the bot, and [FastAPI](https://fastapi.tiangolo.com/) and [Svelte](https://svelte.dev/) for the web UI.
This was built for the [WaffleHacks](https://wafflehacks.tech) hackathon which is occurring from July 9th to 11th, 2021.

{{< project GitHub="https://github.com/WaffleHacks/wafflebot" >}}
