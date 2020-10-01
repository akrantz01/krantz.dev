---
title: Link Shortener
date: 2020-09-25
tags: ['project', 'rust', 'js', 'html']
---

A custom URL shortener implementation for my own website that is written in Rust.
The site is built using the [warp](https://github.com/seanmonstar/warp) framework, with the links stored in a PostgreSQL database and accessed using the [Diesel ORM](https://github.com/diesel-rs/diesel).
There is also a simple administrative UI written in HTML, CSS, and JavaScript for creating, updating, and deleting short links that uses the server's API.
To style the management interface, I used the [Halfmoon UI](https://github.com/halfmoonui/halfmoon) framework.

My motivation for building this was to replace an older service that I had wrote based on [Firebase](https://firebase.google.com) to make the response times faster and make managing the links easier.

<p><a href="https://github.com/akrantz01/link-shortener" target="_blank">GitHub</a></p>
