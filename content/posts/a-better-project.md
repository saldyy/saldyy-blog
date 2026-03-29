+++
date = '2025-05-25T21:18:07+07:00'
draft = false
title = 'A Better Project'
+++

This blog has recently undergone a transformation. I've moved it from a custom setup using
**Golang** and **HTMX** to [Hugo](https://gohugo.io/), a static site generator.

During this migration, I'm genuinely amazed by how fast and efficient **Hugo** is. It provides
everything that I need, including a variety of plugins and themes. Reflecting on my previous version, 
I realize that I was basically making an attempt to reinvent the wheel. That experience make me question:
with the vast ecosystem of libraries, frameworks and even AI tools, is it still worth it to build
our own projects from scratch? 

That said, I don't think that my investment on my old project is a total waste of time (by the way, you
can find the source code in [here](https://github.com/saldyy/a-blog-by-saldyy), please excuse for
that mess of the code 😅). The main reason I chose to build it was to explore the capabilities of **HTMX**
for implementing a normal website. Interestingly, my approach is quite similar with **Hugo**,
we both use Front matter for metadata and markdown for rendering HTML.

Throughout the process of making things to works, I learnt a great deal about **HTMX**, how it redirected
and partial rendering. I even used the same markdown parser [goldmark](https://github.com/yuin/goldmark)
which **Hugo** also relies on. It's incredibly powerful, I highly recommend it. I was on the right track to
build my own version of **Hugo**, but I can never achieve that level due to the shortage of time and man power.

One of the biggest drawbacks from my old project was hosting. The project was packaged into a
**Docker** image and I couldn't find any good platform with free tier to host it. I tried
[Railway](https://railway.com/), and while it worked great, the experience ended when the free trial
expired. 

In the end, it all comes down to choose the right tools for the right job. After explore everything
that I wanted to try with **HTMX**, I reached to a point where I simple need a platform that allow
me to write and host content - ideally without any cost. And that's where **Hugo** shines. It's
powerful, easy to use and support a wide range of hosting options. I'm also planning to set up a
Homelab of my own, which might become a long term solution for hosting. I will share about that
soon.

The key takeaway for me is this: always feel free to build and experiment, even if it means reinventing the wheel.
The challenges you face are also the same problem that the other people have already encountered. Through that process,
you'll gain valuable experience to add it to your personal toolkit. No effort is meaningless.



