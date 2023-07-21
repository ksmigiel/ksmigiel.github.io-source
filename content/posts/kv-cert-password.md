---
date: 2023-07-21
description: "What happens when do you want to export password protected certificate from Key Vault?"
title: "Key Vault and certificate password"
---

Have you ever had the feeling of something super unknowable being so easy? I have. And it is very frustrating. 

Recently I was working with Azure Key Vault and it's ability to store certificates. The case was to get a certificate stored there and put it in another place to be consumed by another service. We've got accesses, resource links and PFX password. Nothing worked.

When we re-imported the certificate exported from Key Vault, we were not able to re-import it either in Azure or on our local machines. Password didn't match.

By now, most of you probably know the answer. But at the time, it was not so obvious (because it really is!).

I opened the [documentation](https://learn.microsoft.com/en-us/azure/key-vault/certificates/tutorial-import-certificate?tabs=azure-portal#import-a-certificate-to-your-key-vault) and it all became clear to me.

![cert](/images/kv-cert-password/cert.png)

**Importing** a **password-protected PFX** into Key Vault **removes** the password! Then, when you want to **export** it, you have a **passwordless** PFX certificate! So you can do the import just the right way, without any password. Surprise me!