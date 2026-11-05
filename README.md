# pm-stack

Claude Code skills for product managers. Each one runs inside a repo you already have and ends in a written decision, not a pile of code.

## Install

```
/plugin marketplace add mvwi/pm-stack
/plugin install pm-stack@pm-stack
```

## Skills

### prototype-wall

Ask for several versions of a screen or component and get them all at once, live, on one board you can pan and zoom. Hide the weak ones, pin comments on the exact element you mean, and paste your notes back. Claude knows which variant, file, window size and element each note is about.

Run it from a project whose dev server you can start, and say what to explore:

```
/pm-stack:prototype-wall the empty state for the projects page
/pm-stack:prototype-wall checkout summary card x8
```

Claude builds the variants on a throwaway route, opens the board at `/wall/wall.html`, and waits for your review. When you pick one, it writes down what was kept, what was dropped and why, then deletes everything it added.

## Repo layout

- `plugin/`: the only part that installs. Each skill lives in `plugin/skills/<name>/`.
- `dev/`: test projects for working on the skills. Installs leave these out. See [dev/prototype-wall](dev/prototype-wall/README.md).

## License

MIT
