---
layout: post
title: "Why AI Agents Need Roles, Boundaries, and Review Loops"
description: "AI agents become more useful when they are treated less like magic tools and more like bounded contributors in a workflow with roles, constraints, evidence, and human accountability."
date: 2026-05-26
permalink: /posts/ai-agents-roles-boundaries-review-loops
canonical_url: "https://handcrafted.software/posts/ai-agents-roles-boundaries-review-loops"
categories:
  - AI
tags:
  - AI
  - Agents
  - Product
  - Workflow
---

The problem with AI agents is often not that they are too weak.

It is that we put them into workflows where success is hard to inspect.

AI agents are often described as tools for making people faster. That is true, but it is not the most useful framing.

AI agents can become participants in the production process when the workflow gives them structure. They can draft, inspect, refactor, summarize, compare, test, and suggest. But if they are dropped into a messy workflow without clear roles or boundaries, they usually make the mess faster.

In my own product work, the useful question has become less "what can AI generate?" and more "how do I make the work reviewable?"

I now think of agents less as smart assistants and more as bounded contributors inside a workflow.

Not because they are people. They are not.

But because useful work still needs responsibility, context, review, and proof.

## A task for an agent is not the same as a task for a person

A vague human task might be survivable:

> Make the export better.

A human can ask follow-up questions, infer context, remember past decisions, or notice that the request is too broad.

An agent can also ask questions, but it may just as easily produce a confident-looking answer to the wrong task.

Agent-ready tasks need more structure:

- context;
- constraints;
- expected output;
- what not to change;
- acceptance criteria;
- evidence required;
- privacy or security boundaries.

For example:

> Improve the CSV export for the reports module. Do not change the database schema. Reuse the existing permission check. The file should include columns X, Y, and Z. Add or update tests. Do not touch the UI.

This is not bureaucracy. It is the interface.

The task description becomes part of the control system.

## Roles reduce duplicated work

When multiple agents participate in the same decision, they should not all behave like the same general assistant.

One agent can think about strategy. One can check evidence. One can look for privacy risk. One can think about implementation. One can improve the public explanation.

The value of roles is not that five agents produce five opinions. It is that each opinion is accountable to a different concern.

The point is not to create theater with many voices. The point is to create useful tension.

Good agent roles should define:

- what the agent owns;
- what inputs it should use;
- what output it should produce;
- what risks it should catch;
- when it should object;
- when it should defer.

Without roles, agents tend to repeat each other. With roles, they can disagree in useful ways.

## Boundaries matter more than autonomy

It is tempting to ask: "How autonomous can this agent be?"

I think the better question is:

> What is this agent allowed to change, and what must remain under human control?

Some work is safe to automate locally:

- drafting copy;
- summarizing notes;
- proposing tests;
- finding inconsistencies;
- preparing a pull request;
- checking whether a page contains required text.

Some work should require explicit human approval:

- publishing;
- changing payment or auth logic;
- sending messages to real people;
- making public claims;
- exposing private data;
- deleting information;
- deploying to production.

Autonomy without boundaries does not create trust. It creates cleanup work.

## Review should check intent, not only output

AI-generated work can look polished while still solving the wrong problem.

That makes review different.

It is not enough to ask:

> Is this output well-written?

or:

> Does this code run?

The stronger review questions are:

- Did the agent understand the task?
- Did it stay inside the requested scope?
- Did it invent unsupported claims?
- Did it change behavior outside the assignment?
- Did it expose anything private?
- Is the result maintainable?
- What evidence proves that it worked?

A useful review loop might also ask the agent to return:

- what changed;
- which files or artifacts were touched;
- which tests or checks were run;
- which assumptions were made;
- which risks were noticed;
- which decisions still require a human.

The most dangerous failures are often not ugly. They are plausible.

## Evidence makes agent work manageable

For agent-assisted work, evidence is not a formality.

It is how the work becomes inspectable.

Evidence can be simple:

- test results;
- screenshots;
- before/after copy;
- links to changed pages;
- a short explanation of what changed;
- a note about what was intentionally not changed.

The point is to avoid a workflow where the agent says "done" and everyone has to guess what that means.

Done should mean:

> Here is what changed, here is why, here is how it was checked, and here is what still needs a human decision.

## Privacy is part of the workflow design

If AI agents are part of the work process, privacy cannot be an afterthought.

Every workflow needs boundaries around:

- what context an agent can see;
- what private information stays local;
- what can be used in public output;
- what requires review before publishing;
- which screenshots or examples are safe.

I like the rule:

> Prompt inheritance is not memory inheritance.

An agent can inherit company values or working rules without getting access to every private file.

That distinction matters.

## Humans remain accountable

An agent can produce work.

It cannot be accountable for the decision to use that work.

The person who accepts, publishes, merges, or sends the result is responsible for it.

That is why roles, boundaries, review loops, and evidence are not just operational details. They are how human accountability stays visible in an AI-assisted workflow.

## The practical shift

The practical shift is not only from manual work to AI-assisted work.

It is from doing tasks to designing the system that produces tasks, context, drafts, reviews, and evidence.

AI agents make weak processes faster.

They make strong processes more scalable.

That is why I am interested less in prompts as isolated instructions and more in workflows:

- clear roles;
- explicit boundaries;
- small tasks;
- reviewable outputs;
- privacy gates;
- human decisions;
- evidence of what changed.

Agents do not remove the need for process.

They make the quality of the process visible.
