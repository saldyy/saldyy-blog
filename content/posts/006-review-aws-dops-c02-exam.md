+++
date = '2025-01-12T15:44:55+07:00'
draft = false
title = 'Review Aws Dops C02 Exam'
slug = 'review-aws-dops-c02-exam'
+++

So 2024 had passed and there is one big thing that I did not finish. The AWS Devop and there is one big thing that I did not finish. The **AWS DevOps Engineer - Professional Certification** is something that I've aimed since I was a college student. I made a plan to finish it within last year but got side-tracked so many times since 2024 was a little wild for me. New year has come and I need to keep the promise to myself and get this overwith. And I did it. 

![aws-dops-result](/images/article-006/aws-dops-result.png)

I took me around 6 months to prepare for the exam. I think it would take me much less time if I'm one hundred percent locked-in. During these months, so many stuffs happened which got my concentration drift away. 

There are 3 main resources for me to study for this exam: 
- [AWS Skill builder prep course](https://explore.skillbuilder.aws/learn/public/learning_plan/view/2184/standard-exam-prep-plan-aws-certified-devops-engineer-professional-dop-c02)
- [Tutorial Dojo Practice exams](https://portal.tutorialsdojo.com/courses/aws-certified-devops-engineer-professional-practice-exams/)
- [Udemy Practice exams from Stephane Maarek](https://www.udemy.com/course/aws-certified-devops-engineer-professional-practice-exam-dop/)

The scope of the exam is well defined and skimmed through in the **AWS Skill Builder course**. You can skip these two AWS services: **AWS CodeCommit** and **AWS OpsWork**. **AWS CodeCommit** is [sunsetting](https://aws.amazon.com/blogs/devops/how-to-migrate-your-aws-codecommit-repository-to-another-git-provider/) at the time I'm writing this, it's no longer taking new customers. And **AWS OpsWork** is has reached its [end of life](https://docs.aws.amazon.com/opsworks/latest/userguide/stacks-eol-faqs.html) and disabled for all customers. Therefore, you won't need to worry about it since you won't face any questions in the exam.

My first strategy is that going through this course and doing the workshops, labs and projects for better understanding about AWS services. However, I found out that it's not working well for me because the scope is too wide, and the course also has some outdated pieces. So I change my strategy, I finished the practice exams first, found out which type of the questions and situations appear. As you might tell, my first attempts were not very successfull but that's the point (I only scored around 30-40 percent of the point). After that, I detect the area that's I'm weak at and which parts that I have least experience with then dive deep into those.

For me personally, I want to focus on how the questions in the exam look like so I only took the practice exams. For the practical knowledge, I browsed through AWS workshops and labs. This will help you a lots not only for the exam but also improving your skills.

There is one workshop that I personally recommend which is the [CloudFormation Workshop 101](https://catalog.workshops.aws/cfn101/en-US). This workshop covers everything you need to know about **AWS Cloudformation** like drift-detection, cross-stacks references, resources importing, etc...

![aws-cfn-workshop-101](/images/article-006/aws-cfn-workshop-101.png)

FYI, **CloudFormation** covers around 30 percent of the exam, so knowing it in dept is a must to pass the exam.


After doing the practice exams, you will find out that there will be a pattern to solve a certain problem. It can be interpreted differently but in the end, the requirements will be the same. For example, one pattern I found is that for automatically notified and remediate wrongly configured AWS services with **AWS Trusted Advisor**, we can use the combination of **AWS Config**, **AWS Cloudwatch Events** and **AWS SNS**.

I will let you explore the rest 😉. Best of luck to you!

After passing the exam, I feel great. Not only I settled all the debts with my self from 2024 but also showing that I'm progressing on my path of become a better developer. What's next? I will probably build some projects to enhance my skill in Clouds and the DevOps realm. I don't know what it will be yet but definitely will update frequently in this blog 😁.
