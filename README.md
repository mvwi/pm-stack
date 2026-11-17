# pm-stack

Agent skills for product managers. Each one runs inside a repo you already have and ends in a written decision, not a pile of code. They use the open Agent Skills format, so they work in Claude Code, Codex, Cursor, Gemini CLI and other agents that read `SKILL.md`.

## Install

Any agent:

```
npx skills add mvwi/pm-stack
```

Claude Code, as a plugin:

```
/plugin marketplace add mvwi/pm-stack
/plugin install pm-stack@pm-stack
```

## Skills

### wall

Ask for several versions of a screen or component and get them all at once, live, on one board you can pan and zoom. Hide the weak ones, pin comments on the exact element you mean, and paste your notes back. Your agent knows which variant, file, window size and element each note is about.

Run it from a project whose dev server you can start, and say what to explore. In Claude Code:

```
/pm-stack:wall the empty state for the projects page
/pm-stack:wall checkout summary card x8
```

In other agents, ask for the wall skill with the same brief. The agent builds the variants on a throwaway route, opens the board at `/wall/wall.html`, and waits for your review. When you pick one, it writes down what was kept, what was dropped and why, then deletes everything it added.

### rubber-duck

Pitch an idea and a skeptical PM picks it apart. It asks a few hard questions at a time, starting with who actually has the problem, and never answers them for you. It ends by naming the holes and writing your bet down: what you expect to happen, which number shows it, and when to check.

```
/pm-stack:rubber-duck let admins export audit logs as CSV
```

### preflight

Run a go/no-go before a release. It asks who the release is for (staff, beta, everyone, enterprise admins, API users, app store, pricing), checks first that you can undo it, then asks only the checks that audience needs. It looks in your project before asking, wants an owner and evidence for every answer, and ends with a GO, GO IF or NO-GO card.

```
/pm-stack:preflight saved filters to all customers Tuesday
```

### chief-of-staff

Hand over a goal instead of a task. Your agent splits it into briefs for sub-agents, has each one send back a plan before starting, checks every claim they return against real proof, and only interrupts you for decisions that are yours. You get a status view to glance at and one hand-over at the end that says what was and wasn't checked.

```
/pm-stack:chief-of-staff ship the CSV export and the help article
```

### subtract

Point it at a busy screen and get a numbered list of what can go: text that repeats, copy that explains the system instead of helping the user, a button repeated on every row, badges nobody reads. You approve line by line. It never removes something a user can do; it moves it somewhere quieter.

```
/pm-stack:subtract the add project modal
```

### scenario-walk

Test a structure (orgs and projects, roles, sharing, who owns what) by walking named people through it: the person in two orgs, the private project that must stay private, the owner who leaves. Each step is marked works, breaks or undefined, and it ends with a numbered list of decisions, each with a recommendation.

```
/pm-stack:scenario-walk docs/org-sharing.md
```

## Repo layout

- `plugin/`: the only part that installs. Each skill lives in `plugin/skills/<name>/`.
- `dev/`: test projects for working on the skills. Installs leave these out. See [dev/wall](dev/wall/README.md).

## License

MIT
