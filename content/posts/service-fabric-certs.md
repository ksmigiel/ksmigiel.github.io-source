---
date: 2023-08-30
description: "What happens when do you want to export password protected certificate from Key Vault?"
title: "Service Fabric and mysterious certificates swap"
---

Lately I have been working with microservices deployed in Service Fabric. As [officially][1] states:

> Azure Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and containers. Service Fabric also addresses the significant challenges in developing and managing cloud native applications.

Maybe in the future I will create post about differences and commons between Kubernetes and Service Fabric, but today I wanted to focus on simple operational task which is **certificates swap**.

Node-to-node security helps secure communication between the VMs or computers in a cluster. This security scenario ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster. Service Fabric uses X.509 server certificates that you specify as part of the node-type configuration when you create a cluster.

When primary certificate is about to expire, then it will use configured secondary certificate. But you need to provide secondary certificate in safe way in time, don't you?
And you will probably find problem with looking for some little piece of official documentation how to do that!

Fortunately, there is some not updated for years [documentation][2] that will guide you how to provide secondary certificate in case it was not configured before. Tried that in every possible way - did not work either. It was just one day before the catastrophic failure of the cluster, and we are not able to replace the certificates - great!

After hours of troubleshooting, I found out that during the `Update certificate` stage in Service Fabric Explorer, there is little information in the `Details` tab that the update is **timed out**. Below this box, there was some information about an event from the application (not a healthy one). And then - tada!

The **not healthy** application stopped the cluster from updating certificates! There was literally no mention of this at all anywhere. After removal of the application, the certificates were successfully updated. What a week that was.

<br>

---

<br>

1. https://learn.microsoft.com/en-us/azure/service-fabric/service-fabric-overview
2. https://github.com/Azure/Service-Fabric-Troubleshooting-Guides/blob/master/Security/Swap%20Reverse%20Proxy%20certificate.md

[1]: https://learn.microsoft.com/en-us/azure/service-fabric/service-fabric-overview
[2]: https://github.com/Azure/Service-Fabric-Troubleshooting-Guides/blob/master/Security/Swap%20Reverse%20Proxy%20certificate.md