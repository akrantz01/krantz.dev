+++
title = "Hackathon Manager"
date = "2021-02-19"
tags = ['ruby']
+++

Hackathon Manager is a web app to help hackathons manage registrations, participants, and logistics.
It allows communicating with all the participants, admission and RSVP tracking, statistics and visualizations about admissions, and OAuth login support.

Unlike many of my other projects, this is simply a modified version of the original [Hackathon Manager built by CodeRIT](https://github.com/codeRIT/hackathon-manager).
The modifications were put in place to allow us to customize and add features to a greater degree.
The following changes were made:
- switch to PostgreSQL for the database
- added login with Discord
- added outgoing webhooks

This was built for the [WaffleHacks](https://wafflehacks.tech) hackathon which is occurring from August 27th to 29th, 2021.

{{< project GitHub="https://github.com/WaffleHacks/hackathon-manager" >}}
