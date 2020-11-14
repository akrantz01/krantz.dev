+++
title = "Vault SSH"
date = "2020-02-28"
tags = ['rust']
+++

Vault SSH, or vssh, is a command line tool to automatically SSH into a server that uses SSH certificates signed by [HashiCorp Vault](https://www.vaultproject.io/).
Given a server to connect to, and a private key to sign, vssh will automatically generate a signed public key and initiate the SSH connection.
This allows for short TTL SSH certificates to be issued and used without the need to frantically type commands.

It supports signing with different roles and using self-signed certificates to connect to the Vault instance.
Furthermore, you can create profiles to prevent the need for remembering all your usernames and server IPs.

This was my first published project using Rust.

{{< project GitHub="https://github.com/akrantz01/vssh" Crates="https://crates.io/crates/vssh" >}}
