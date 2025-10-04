---
title: "Polyglot Programming:  the 'run' Tool for Multi-Language REPL blog by grok"
date: "2025-11-04"
description: "Coding in 25+ languages with 'run' – a Rust-built CLI powerhouse for snippets, files, and REPL sessions. Discover its quirks, setups, and why it's the ultimate free tool for developers ditching toolchain headaches."
tags: ["Rust", "CLI Tools", "Programming", "REPL", "Tutorial"]
---

*Alert: This entire blog post was entirely written by Grok, xAI's cheeky AI sidekick – because nothing says 'amazing' like an AI juggling 25 languages while cracking jokes. No humans were harmed in the making... just their coffee breaks. 😏*

Coding across multiple languages is like herding cats – each one has its own compiler, interpreter, and quirky syntax that demands a separate terminal window. Enter **run**, the Rust-forged universal multi-language runner and smart REPL that's here to tame the beast. This free, open-source CLI tool lets you execute code in over 25 languages with a single, consistent command – no more fumbling with installations or context-switching. Whether you're prototyping algorithms, teaching code, or just testing a wild idea in Haskell after breakfast in Python, run keeps it simple, fast, and fun.

Before we geek out on the details, let's quickly unpack what makes run tick: it's all about unified execution modes that handle inline snippets, files, piped input, and interactive REPLs with zero config drama.

---

## How 'run' Works: From Snippets to Stateful Sessions

run shines by abstracting away the mess of diverse toolchains. Built in Rust for speed and safety, it shells out to real interpreters/compilers on your PATH, auto-detects languages, and wraps compiled code in mains where needed – all while keeping things cross-platform (Windows, macOS, Linux).

### **Inline Code Execution: Quick and Dirty Prototypes**

Fire off a snippet right from the terminal – perfect for that "just one-liner" itch.

### **File-Based Runs: Scripts on Steroids**

Drop a file with the right extension, and run detects and executes it seamlessly.

### **Piped Input: Data Flows Like Butter**

Pipe in JSON or commands for dynamic magic, like feeding stdin to a Node.js parser.

### **Interactive REPL: The Polyglot Playground**

Launch a stateful REPL where variables persist per language, and switch on the fly with `:py` or `:go`. Paste blocks, type line-by-line, or mix it up – with commands like `:help`, `:reset`, and `:detect toggle` to keep you in control.

run's smarts include auto-wrapping for compiled langs (no more "missing main" errors) and heuristic detection, though it cheekily advises explicit `--lang` flags for ambiguous code like a sneaky `print('hi')`.

---

## Supported Languages: 25+ Flavors of Awesome

run's got your back with a buffet of languages, from scripting staples to systems heavy-hitters. No extra installs – just ensure your PATH has the basics like `python` or `rustc`.

Here's the lineup, grouped for glory:

| Category | Languages |
|----------|-----------|
| **Scripting & Shells** | Python (py, py3), JavaScript (js, node), Ruby, Bash, Lua, Perl, PHP, R, Elixir (ex, iex) |
| **Web & Typed Scripting** | TypeScript, Dart (flutter), Swift (swiftlang), Kotlin (kt) |
| **Systems & Compiled** | Rust (rs), Go, C, C++, Java, C#, Haskell (hs, ghci), Crystal (cr), Zig (ziglang), Nim (nimlang), Julia (jl), OCaml, Clojure (clj) |

Pro tip: Aliases make life easier – `run py` for Python or `run rs` for Rust. It's free forever, no tiers or gotchas.

---

## Installation: Zero to Hero in Minutes

Getting run up and running is as painless as its execution. It targets Rust 1.70+, but pre-built binaries cover everyone.

### Quick Installs by OS:

1. **Cargo (Universal)**: `cargo install run-kit` – Boom, done.
2. **Homebrew (macOS)**: `brew install --formula https://github.com/Esubaalew/run/releases/latest/download/homebrew-run.rb` – Picks the right chip (Intel or Apple Silicon).
3. **Debian/Ubuntu**: Grab the .deb from releases, verify SHA, and `sudo apt install`.
4. **Windows (Scoop)**: `scoop install https://github.com/Esubaalew/run/releases/latest/download/run-scoop.json`.
5. **Install Script (macOS/Linux)**: `curl -fsSLO https://raw.githubusercontent.com/Esubaalew/run/master/scripts/install.sh && chmod +x install.sh && ./install.sh --add-path`.

Verify with `run --version` and dive in. Building from source? `git clone https://github.com/Esubaalew/run && cd run && cargo install --path .`.

---

## Code Examples: From Hello World to Hacker Shenanigans

Let's code! These snippets showcase run's versatility using the `run-kit` crate.

### Basic Inline Hello Worlds

```bash
# Python flair
run python "print('Hello, polyglot world!')"

# Rust with auto-wrapped main
run rust "println!(\"Hello from Rust!\");"

# Go simplicity
run go 'fmt.Println("Go says hi!")'
```

Outputs? Clean hellos across the board – no boilerplate blues.

### File Execution Fun

Save this Fibonacci in `fib.py`:
```python
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

for i in range(10):
    print(f"F({i}) = {fib(i)}")
```

Run: `run fib.py` – Watch it print the sequence like a champ.

### REPL Language Hopping

Launch: `run`

```
run>>> :py  # Switch to Python
python>>> x = 42
python>>> x * 2
84
run>>> :go  # Hop to Go
go>>> y := 100
go>>> y
100
run>>> :quit  # Peace out
```

### Piped Power

```bash
echo '{"name": "Grok"}' | run js --code "const data = JSON.parse(require('fs').readFileSync(0, 'utf8')); console.log(`Hey ${data.name}!`);"
```

Spits out: `Hey Grok!` – Data dancing through pipes.

---

## Quirks, Benefits, and When to Run (Away?)

run isn't perfect – auto-detection can trip on ambiguous snippets (use `--lang`!), and it relies on your PATH for toolchains. But the upsides? Blazing Rust speed, stateful per-lang REPLs, and that "one tool to rule them all" vibe. It's a dev's dream for prototyping, teaching, or polyglot puzzles – way snappier than juggling separate CLIs.

### Quick Comparison: run vs. Traditional Toolchains

| Aspect | Traditional (e.g., python, rustc) | run |
|--------|----------------------------------|-----|
| **Setup Overhead** | High – install per lang | Zero – one install |
| **Command Consistency** | Fragmented | Unified CLI |
| **REPL Switching** | Restart terminals | On-the-fly `:lang` |
| **Snippet Wrapping** | Manual mains | Auto-magic |
| **Cross-Lang Experimentation** | Painful | Effortless |
| **Cost** | Free but fiddly | Totally free |

For rapid tests or education, run crushes it. Scale to full IDEs for big projects.

---

## Final Thoughts

run isn't just a tool – it's a liberation from toolchain tyranny, letting you code freely across languages without the setup sweat. Whether you're a newbie dodging installs or a vet craving efficiency, grab it from GitHub and start running wild.

*Pro Tips:*
1. **Explicit is better**: Flag your `--lang` for scripts to avoid detection drama.
2. **REPL mastery**: Master `:load` for files and `:reset` to nuke state.
3. **Toolchain check**: Run `:languages` in REPL to verify your engines.
4. **Contribute!**: It's open-source – fork and add your dream lang.

==Remember: In a world of language silos, run sets you free to code like a boss!==

---

*Happy running, code wranglers! 🚀*
