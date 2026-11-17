---
name: scenario-walk
description: "Test a proposal for structure, permissions, sharing, ownership or a data model by walking concrete people through it step by step: the person who belongs to two orgs, the private project that must stay private, the owner who leaves the company, the thing that gets shared and then unshared. Marks each step as works, breaks or undefined, and ends with a numbered list of decisions for the user. Use for org/workspace/project hierarchies, roles and permissions, sharing and visibility, inheritance, migrations between containers, and account or billing structures. Triggers on: scenario walk, walk me through the paths, edge cases, what happens when, who can see, permissions model, sharing model, data model, information architecture, IA, ownership, what if someone leaves, inheritance, what holes exist in this plan."
---

# Scenario Walk

You test a structural proposal by running real-seeming people through it. Abstract rules ("admins can share projects") hide holes that show up the moment a person with a name tries to do something: the agency with one client and two apps, the "layoff planning" project that must not leak, the engineer who leaves and owned the nightly job.

The user passes the proposal as the argument: a doc, a spec, a Linear project, a mock or a few sentences (in Claude Code: `/pm-stack:scenario-walk docs/org-sharing.md`). With no proposal, ask "What's the structure you want to test? Paste it or point me at it." and wait.

## Hard rules

- **Every person has a name, a job and numbers.** "Priya, account lead at a 12-person agency, client Northwind has a web app and a mobile app." Never "a user" or "an admin". Why: vague people take the happy path; specific ones hit the edges.
- **Never fill a gap during the walk.** When the proposal doesn't say what happens, mark the step `UNDEFINED` and keep walking. Answers come after, as decisions. Why: a gap you quietly filled looks like part of the design, and nobody decides it.
- **Check what exists before you assume.** If the proposal changes a live product, read the code or docs for current behavior. Mark each fact `verified` (with the file or link) or `assumed`. Why: a walk built on invented current behavior finds invented holes.
- **Walk the user's experience, not the database.** Each step is what the person clicks, sees or is told. Name tables and fields only in the Decisions section, if at all.

## Flow

```
Read the proposal. List:
  NOUNS     the things (org, project, connector, secret, memory, chat…)
  LINKS     how they nest or connect (org has projects; project inherits connectors)
  VERBS     what people do to them (create, share, unshare, move, leave, delete)
  ROLES     who can do what

Pick scenarios with THE PICKER. 4 minimum, 7 maximum.

For each scenario:
  Write the cast and setup in 1–2 lines.
  Walk 3–8 steps. Mark each step WORKS, BREAKS or UNDEFINED.
  BREAKS = the proposal gives an answer, and the answer hurts someone.

Build the decisions list. Show everything. Wait for answers.
Update the proposal with the answers, if the user asks.
Re-walk only the scenarios whose steps changed.
```

## The picker

Go down the list. Include a scenario when its condition is true. Always include the first one.

```
Always            → TYPICAL: the most common person doing the most
                    common task. If this breaks, stop and report only this.
People can belong to more than one container (org, team, workspace)
                  → MANY: one person in 2+ orgs; one client with 2+ projects
Anything can be private, restricted or shared
                  → SENSITIVE: a project that must not reach the wider org
                    ("layoff planning"). Trace every path it could leak:
                    search, activity feeds, memory, notifications, admin views
Things have an owner
                  → LEAVER: the owner leaves the company or loses access.
                    What happens to what they own, scheduled, shared or connected?
Visibility or scope can change
                  → REVERSAL: share, then unshare. Move between containers.
                    Which of these are one-way doors? Does the UI say so?
Data exists before the change (history, memory, settings, files)
                  → TRANSITION: private becomes shared, personal becomes
                    company, local becomes cloud. What happens to the data
                    created before the switch?
Lists of containers or members
                  → SCALE: 60 projects, 200 members, 40 inherited items.
                    Does each screen still work?
Signed-out, guest or brand-new accounts exist
                  → NEWCOMER: someone with nothing. What do they see,
                    and is anything empty or blocked without a reason given?
```

If more than 7 apply, keep TYPICAL, then the ones whose NOUNS the proposal changes most.

## Writing a step

```
3. Priya shares "Northwind web" with Sam (member, not admin).   WORKS
4. Sam opens the project. Inherited Slack connector posts as     UNDEFINED
   whom? Priya's name, Sam's, or the org's bot?
5. Priya leaves the agency. Her account is removed.              BREAKS
   The proposal says connectors belong to the person who added
   them, so Northwind's Slack connector stops for everyone.
```

One action per step. Put the mark at the end of the line so the user can scan down the right edge.

## Output

```
## Scenario walk: <proposal>

| Scenario  | Who                         | Result            |
|-----------|-----------------------------|-------------------|
| TYPICAL   | Priya, agency account lead  | works             |
| LEAVER    | Priya leaves                | 1 breaks          |
| SENSITIVE | Dana's "layoff planning"    | 2 undefined       |

<each walk, steps as above>

## Decisions

1. When a connector's owner leaves, who owns it?
   Breaks in: LEAVER step 5
   Options: a) move to an org admin  b) stop it and alert admins
   Recommend: a. A client's Slack going quiet is worse than a
   connector changing owners.
2. ...

Facts I assumed (not verified): <list, or "none">

Reply with numbers: "1a 2 your call 3 defer".
```

Order decisions by severity: BREAKS before UNDEFINED, then by how many scenarios each one touches. Always give a recommendation with a one-line reason. The user decides; a recommendation saves them from building the options themselves.
