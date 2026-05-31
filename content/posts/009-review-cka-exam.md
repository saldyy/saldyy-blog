+++
date = '2026-05-31T13:44:55+07:00'
draft = false
title = 'Review CKA Exam'
slug = 'review-cka-exam'
+++

The CKA is probably one of the most in-demand certifications in the Cloud industry. However, studying Kubernetes as a newcomer is a real pain due to the massive scope of its domain. I recently passed the exam and wanted to share my journey to achieving it.

![CKA Certification](/images/article-009/cka-certification.png)

### Preparation

The main resource I used to study was the [KodeKloud course on Udemy](https://www.udemy.com/share/101Xtg3@vaJuWJmoOyyfUNdnGt0PM0cw0qW11pA2M9FtCOijaOvdQzl5g66GR4e0l6hTRLwP/). The hands-on labs in this course are extremely helpful and follow the actual exam curriculum quite closely. 
Additionally, when you register, you get access to two mock scenarios on [KillerShell](https://killer.sh/). The questions are quite similar to what you practice in the KodeKloud labs, but they provide a realistic environment for practice.

But to be honest, just doing these exercises is the bare minimum. They will help you pass the test, but for real-world engineering? Probably not. In my case, I set up a local cluster to replicate those exam questions in my own environment. For this exercise, I used two tools: [minikube](https://minikube.sigs.k8s.io/docs/) and [k3d](https://k3d.io/stable/) just to explore different approaches to local setups. Along with that, I deployed some of my personal workloads to genuinely familiarize myself with Kubernetes. This extra hands-on practice made it much easier to internalize everything I did in the guided labs.

### The real exam day

You have to prepare a room that meets all of their strict requirements. First, your device must have a supported version of Windows or Ubuntu installed. This is quite annoying, to be fair, but it's required by the client's anti-cheating software. The proctor chats with you via the PSI secure browser, and once everything is verified, your exam begins.

In my case, the PSI client crashed during the last 10 minutes, which was absolutely frustrating. I actually rage-quit during that window since I couldn't do anything in the client. Luckily, I had done enough to pass anyway!

My strategy was to finish all of the straightforward tasks first to secure the points, then circle back to the more complex issues. There are some tasks I don't entirely agree with testing in this format, such as installing a CNI from scratch. It's tough because, in a real job, you would read the documentation for specific instructions and customizations. While you can access certain resources during the exam—like the Kubernetes docs, Helm docs, and Gateway API—you practically have to memorize the routine setup steps from your practice sessions to finish the task in time.

### Outcome

I'm glad I passed. Does it automatically help me excel in the current job market? That's controversial. I've already landed a new role dedicated to DevOps, but I doubt my Cloud Native skills will be fully utilized here initially because the stack leans heavily toward AWS and Public Cloud. 

DevOps is a vast and often confusing field. The skills you cultivate in Public Cloud environments sometimes seem ignored by recruiters when talking about Private Cloud infrastructures (at least during CV screening and interviews), even though the underlying fundamentals are identical. Maybe the market is just broken right now. In my situation, despite studying as much as possible for DevOps, I still found myself caught in the middle of the Private and Public Cloud divide. I'm just going to try my best on this new journey and figure it out as I go.
