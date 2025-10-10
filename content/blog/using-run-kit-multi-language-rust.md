---
title: "Using Run-Kit to Seamlessly Mix Multiple Languages in a Single Rust Codebase"
date: "2025-10-11"
description: "Learn how to use Run-Kit to execute Python, R, JavaScript, and more—all from within a single Rust application. Build powerful polyglot pipelines without leaving your Rust project!"
tags: ["Rust", "Polyglot", "REPL", "Run-Kit", "Tutorial", "Programming"]
---


> Built in Rust, Run-Kit is designed for developers who work across multiple languages. It gives you a consistent CLI, persistent REPLs, and batteries-included examples for Python, Rust, Go, JS, R, Julia, and more.

---

## Why Run-Kit?

Traditionally, switching between languages meant juggling multiple CLIs, interpreters, and compilers. Run-Kit changes that paradigm:

- **One CLI to rule them all:** No more switching terminals or remembering multiple commands.
- **Persistent REPL:** Keep variables alive across commands and experiment without losing your state.
- **Polyglot friendly:** Supports 25+ languages including Python, Rust, Go, C#, R, Julia, Bash, JS, TS, and more.
- **Smart code execution:** Inline snippets, stdin streams, and even multi-line programs all work seamlessly.

---

## Our Example: Polyglot Customer Churn Analysis

Let’s walk through a practical example that demonstrates Run-Kit’s magic. We’ll combine **Python** for ML modeling and **R** for statistical analysis, then generate an **interactive HTML report**.

# Building a Real-World Polyglot Analytics Pipeline with Rust, Python, R, and JavaScript

In the modern data ecosystem, it's common to encounter projects that require multiple languages. Each language shines in its domain: Rust for speed and memory safety, Python for machine learning, R for robust statistics, and JavaScript for interactive web visualization. In this blog, we walk through building a **polyglot customer churn analysis pipeline** using `run-kit`.

## Overview

Our pipeline performs the following steps:

1. **Generate synthetic customer data in Rust.**
2. **Train a logistic regression model in Python using scikit-learn.**
3. **Run statistical modeling in R with robust standard errors.**
4. **Generate an interactive HTML report with JavaScript (Plotly).**

We will leverage the `run-kit` Rust crate to orchestrate cross-language execution seamlessly.

---

## Project Setup

Create a new Rust project:

```bash
cargo new kit --bin
cd kit
```

Add dependencies to `Cargo.toml`:

```toml
[dependencies]
run-kit = "0.2.1"
anyhow = "1.0"
clap = { version = "4.5", features = ["derive"] }
polars = { version = "0.40", features = ["lazy", "json", "csv", "temporal"] }
serde_json = "1.0"
rand = "0.8"
open = "5.0"
base64 = "0.21"
```

This includes:

* **run-kit**: Run and manage multiple languages.
* **polars**: Data manipulation in Rust.
* **anyhow**: Error handling.
* **clap**: Command-line argument parsing.
* **rand**: Random data generation.
* **open**: Open HTML reports in the default browser.
* **base64**: Encode images for embedding in HTML.

---

## Step 1: Generate Customer Data in Rust

Rust shines at efficiently generating large datasets. We'll simulate **10,000 customers** with these features:

* `customer_id` (unique integer)
* `age` (20-70)
* `monthly_spend` ($10-$200)
* `support_calls` (0-7)
* `churned` (0 or 1)
* `annual_value` (monthly_spend × 12)

```rust
fn generate_customer_data() -> Result<DataFrame> {
    println!(" Generating customer data in Rust...");
    let n = 10_000;

    let customer_id: Vec<u32> = (1..=n as u32).collect();
    let age: Vec<u32> = (0..n).map(|_| (rand::random::<u8>() % 50 + 20) as u32).collect();
    let monthly_spend: Vec<f64> = (0..n).map(|_| (10.0 + rand::random::<f64>() * 190.0).round()).collect();
    let support_calls: Vec<u32> = (0..n).map(|_| (rand::random::<u8>() % 8) as u32).collect();
    let churned: Vec<u32> = (0..n).map(|_| if rand::random::<bool>() { 1 } else { 0 }).collect();

    let mut df = df![
        "customer_id" => customer_id,
        "age" => age,
        "monthly_spend" => monthly_spend.clone(),
        "support_calls" => support_calls,
        "churned" => churned,
    ]?;

    let annual_value: Vec<f64> = monthly_spend.iter().map(|&x| x * 12.0).collect();
    df.with_column(Series::new("annual_value", &annual_value))?;

    fs::create_dir_all("data")?;
    let mut file = fs::File::create("data/customers.json")?;
    JsonWriter::new(&mut file).finish(&mut df.clone())?;

    let mut csv_file = fs::File::create("data/customers.csv")?;
    CsvWriter::new(&mut csv_file).include_header(true).finish(&mut df)?;

    println!(" Generated {} customers", df.height());
    Ok(df)
}
```

This generates both **CSV** and **JSON** files for downstream analysis.

---

## Step 2: Train a Python Model (scikit-learn)

Python is ideal for machine learning. We'll train a **logistic regression model** predicting churn:

```rust
fn train_python_model() -> Result<Value> {
    println!(" Training model in Python (scikit-learn)...");
    let py_code = r#"
import json, warnings
warnings.filterwarnings('ignore')
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

df = pd.read_csv('data/customers.csv')
X = df[['age', 'monthly_spend', 'support_calls']]
y = df['churned']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
model = LogisticRegression(max_iter=1000)
model.fit(X_scaled, y)

coefs = dict(zip(X.columns, model.coef_[0]))
print(json.dumps({
    'python_accuracy': round(model.score(X_scaled, y), 3),
    'python_coefs': coefs
}))
"#;

    let registry = LanguageRegistry::bootstrap();
    let out = run_snippet(&registry, "python", py_code)?;
    let v: Value = serde_json::from_str(out.trim())?;
    Ok(v)
}
```

We **scale features** before training to prevent numerical instability.

---

## Step 3: Statistical Modeling in R

R is excellent for statistical analysis. We'll fit a **GLM with robust standard errors**:

```rust
fn train_r_model() -> Result<String> {
    println!(" Running statistical model in R...");
    let r_code = r#"
suppressPackageStartupMessages({ library(jsonlite); library(sandwich); library(lmtest) })

df <- read.csv('data/customers.csv')
df$churned <- as.numeric(df$churned)

model <- glm(churned ~ age + monthly_spend + support_calls, data=df, family=binomial)
coefs <- coeftest(model, vcov = vcovHC(model, type='HC1'))
coef_df <- data.frame(term=rownames(coefs), estimate=coefs[,1], std_error=coefs[,2], p_value=coefs[,4])

dir.create('report_data', showWarning = FALSE)
png('report_data/r_residuals.png', width=600, height=400); plot(model, which=1); dev.off()
png('report_data/r_qq.png', width=600, height=400); plot(model, which=2); dev.off()

cat(toJSON(list(r_coefs=coef_df, r_aic=AIC(model)), auto_unbox=TRUE))
"#;

    let registry = LanguageRegistry::bootstrap();
    let out = run_snippet(&registry, "r", r_code)?;
    Ok(out.trim().to_string())
}
```

This produces **coefficient tables** and **diagnostic plots** (residuals and Q-Q).

---

## Step 4: Generate Interactive Report (JavaScript)

Finally, we visualize results in **HTML + Plotly**:

```rust
fn generate_report(python_result: &Value, r_output: &str) -> Result<()> {
    println!(" Generating interactive report...");
    let r_json: Value = serde_json::from_str(r_output)?;

    let r_residuals_b64 = base64::engine::general_purpose::STANDARD.encode(fs::read("report_data/r_residuals.png")?);
    let r_qq_b64 = base64::engine::general_purpose::STANDARD.encode(fs::read("report_data/r_qq.png")?);

    let py_terms: Vec<&str> = python_result["python_coefs"].as_object().unwrap().keys().map(|s| s.as_str()).collect();
    let py_vals: Vec<f64> = python_result["python_coefs"].as_object().unwrap().values().map(|v| v.as_f64().unwrap()).collect();

    let r_coefs = r_json["r_coefs"].as_array().unwrap();
    let r_terms: Vec<String> = r_coefs.iter().map(|row| row["term"].as_str().unwrap().to_string()).collect();
    let r_estimates: Vec<f64> = r_coefs.iter().map(|row| row["estimate"].as_f64().unwrap()).collect();
    let r_errors: Vec<f64> = r_coefs.iter().map(|row| row["std_error"].as_f64().unwrap()).collect();

    let html = format!(r#"<!DOCTYPE html><html><head><meta charset='UTF-8'><script src='https://cdn.plot.ly/plotly-2.24.1.min.js'></script></head><body>
<h1>Polyglot Customer Churn Analysis</h1>
<div id='py-coef'></div>
<div id='r-coef'></div>
<img src='data:image/png;base64,{}'>
<img src='data:image/png;base64,{}'>
<script>
Plotly.newPlot('py-coef', [{{x:{}, y:{}, type:'bar'}}]);
Plotly.newPlot('r-coef', [{{x:{}, y:{}, error_y:{{array:{}, type:'data'}}, type:'bar'}}]);
</script></body></html>"#, r_residuals_b64, r_qq_b64, serde_json::to_string(&py_terms)?, serde_json::to_string(&py_vals)?, serde_json::to_string(&r_terms)?, serde_json::to_string(&r_estimates)?, serde_json::to_string(&r_errors)?);

    fs::write("report.html", html)?;
    open::that("report.html")?;
    println!(" Report saved and opened in browser");
    Ok(())
}
```

We embed R diagnostic plots as **Base64 images** and visualize coefficients interactively using **Plotly**.

---

## Step 5: Run the Pipeline

```rust
fn main() -> Result<()> {
    prefer_local_env();
    fs::create_dir_all("report_data")?;

    let _df = generate_customer_data()?;
    let py_result = train_python_model()?;
    let r_output = train_r_model()?;
    generate_report(&py_result, &r_output)?;

    Ok(())
}
```

Run the full pipeline:

```bash
cargo run
```

You will see the interactive report in your default browser.

---

## Conclusion

With `run-kit`, we can **orchestrate multiple languages in one Rust application**, allowing us to:

* Generate data in Rust efficiently.
* Use Python's rich ML ecosystem.
* Apply R's statistical rigor.
* Produce modern, interactive web visualizations with JavaScript.

This approach is highly practical for real-world analytics pipelines where each language plays to its strengths.

This blog demonstrates a **polyglot workflow** that is fast, reproducible, and highly extensible.

---
# run-kit: Polyglot Execution & Analytics Pipeline

This guide explains **run-kit** and a full **Rust → Python → R → JavaScript** workflow with clear, step-by-step explanations and examples. It is designed for beginners and advanced users alike.

---

## Introduction

`run-kit` is a **universal multi-language runner** that lets you execute code in multiple programming languages (Python, R, Node.js/JavaScript, Rust, Go, C/C++, Java, and more) using a **single, unified CLI interface**. It supports **inline execution, file execution, and REPL mode** with variable persistence and language switching.

It is especially powerful for **polyglot analytics pipelines**, where different languages are better suited for specific tasks: Rust for performance/data generation, Python for ML, R for statistical modeling, and JavaScript for visualization.

---

## Installation

### Using Cargo

```bash
# Install from crates.io
cargo install run-kit

# Or build from source
git clone https://github.com/Esubaalew/run.git
cd run
cargo install --path .

# Verify installation
run --version
```

### Key Notes

* Requires **Rust 1.70+**
* No extra configuration needed for most languages

---

## Command-Line Flexibility

`run-kit` allows multiple ways to execute code. All are valid and convenient depending on your workflow:

### Full Syntax

```bash
run --lang python --code "print('hello from Python')"
```

### Shorthand Flags

```bash
run -l python -c "print('hello from Python')"
```

### Inline Execution Without --code

```bash
run --code "print('hello')"
```

### Just the Code

```bash
run "print('hello')"
```

### Language First, Then Code

```bash
run python "print('hello')"
```

** Tip:** Always use `--lang` for ambiguous syntax to ensure correct execution, e.g., `print('hello')` could be Python, Ruby, or Lua.

---

## REPL Mode

Start an interactive session for line-by-line coding:

```bash
run python   # Start Python REPL
run go       # Start Go REPL
run          # Start REPL with no language, switch later
```

### Features

* **Line-by-line execution**
* **Paste entire programs**
* **Variable persistence** per language session
* **Switch languages on-the-fly** with `:lang` or shortcuts `:py`, `:r`, `:js`, etc.

Example Python session:

```python
python>>> x = 10
python>>> y = 20
python>>> print(x + y)
30
```

Switching languages:

```text
go>>> :py
switched to python
python>>> print('Back in Python')
Back in Python
```

---

## Language Switching Commands

| Command       | Language        |
| ------------- | --------------- |
| :py / :python | Python          |
| :js / :node   | JavaScript/Node |
| :rust / :rs   | Rust            |
| :go / :golang | Go              |
| :c            | C               |
| :cpp / :c++   | C++             |
| :r            | R               |
| :java         | Java            |
| :rb / :ruby   | Ruby            |
| :bash / :sh   | Bash            |
| :ts           | TypeScript      |

---

## Example: Real-World Polyglot Pipeline

This Rust project demonstrates a **polyglot analytics workflow**:

* **Step 1:** Generate customer data in Rust
* **Step 2:** Train ML model in Python (scikit-learn)
* **Step 3:** Run statistical model in R
* **Step 4:** Generate interactive HTML report with JavaScript (Plotly)

### Project Dependencies

`Cargo.toml`:

```toml
[package]
name = "kit"
version = "0.1.0"
edition = "2024"

[dependencies]
run-kit = "0.2.1"
anyhow = "1.0"
clap = { version = "4.5", features = ["derive"] }
polars = { version = "0.40", features = ["lazy", "json", "csv", "temporal"] }
serde_json = "1.0"
rand = "0.8"
open = "5.0"
base64 = "0.21"
```

### Rust Code Overview

```rust
// Step 1: Generate customer data in Rust (DataFrame)
fn generate_customer_data() -> Result<DataFrame> { ... }

// Step 2: Train ML model in Python
fn train_python_model() -> Result<Value> { ... }

// Step 3: Run statistical model in R
fn train_r_model() -> Result<String> { ... }

// Step 4: Generate interactive HTML report (Plotly charts)
fn generate_report(python_result: &Value, r_output: &str) -> Result<()> { ... }

// Main execution
fn main() -> Result<()> {
    prefer_local_env();
    fs::create_dir_all("report_data")?;

    let _df = generate_customer_data()?;
    let py_result = train_python_model()?;
    let r_output = train_r_model()?;
    generate_report(&py_result, &r_output)?;

    open::that("report.html")?;
    Ok(())
}
```

**Key Features Explained:**

1. `prefer_local_env()` ensures Python `.venv` and Node `node_modules/.bin` are prioritized.
2. `run_snippet()` executes arbitrary code in Python, R, or Node.js from Rust.
3. Rust generates CSV/JSON data for ML/statistics.
4. Python scales features, trains `LogisticRegression`, outputs JSON.
5. R runs `glm()` with robust standard errors, outputs JSON + plots.
6. HTML report integrates Python & R results via **Plotly**.

### HTML Report Highlights

* Python coefficients: steelblue bar chart
* R coefficients with robust SE: tomato bar chart with error bars
* R residual plots as embedded PNGs

---

## Running the Project

```bash
cargo run
```

Output:

```
🦀 Generating customer data in Rust...
✅ Generated 10000 customers
🐍 Training model in Python...
📊 Running statistical model in R...
🌐 Generating interactive report...
✅ Report saved to report.html
✅ Opening polyglot report in browser...
```

This opens a fully interactive HTML report in your browser.

---

## Summary

* **run-kit** provides unmatched flexibility for polyglot execution.
* Supports **inline, file, piped input**, and **REPL**.
* Makes building **real-world analytics pipelines** in multiple languages straightforward.
* Variables persist per language; languages can be switched mid-session.
* Ideal for projects combining **Rust, Python, R, JavaScript, Go**, and more.

---

**Recommended Usage:**

```bash
# Quick Python snippet
run python "print(2+2)"

# Using shorthand
run py "print('Hello')"

# Inline Rust code
run rust "println!(\"Hello from Rust\");"

# REPL session
run
>>> :py
>>> print('Python REPL')
>>> :r
>>> summary(glm(churned ~ age, data=df, family='binomial'))
```

### Next Steps

* Integrate **PostgreSQL or DuckDB** for scalable storage.
* Add **user input forms** in the HTML report.
* Extend Python modeling to **XGBoost or neural networks**.
* Use Rust `rayon` for parallel data generation.


---

## Why This Matters

* **One CLI, multiple languages:** No more juggling terminals.
* **Interactive REPL:** Experiment freely with Python, R, Rust, Go, JS, and more.
* **Real-world polyglot workflows:** Combine ML, statistics, and visualization effortlessly.
* **Fully reproducible:** Run-Kit ensures code behaves the same across platforms.

---

## Links & Resources

* **Run-Kit GitHub:** [https://github.com/Esubaalew/run](https://github.com/Esubaalew/run)
* **Run-Kit-analytics GitHub:** [https://github.com/Esubaalew/run-kit-analytics](https://github.com/Esubaalew/run-kit-analytics)
* **Documentation:** [https://run.esubalew.et/docs/overview](https://run.esubalew.et/docs/overview)
* **Install via Cargo:** `cargo install run-kit`
* **Homebrew (macOS):** `brew install https://github.com/Esubaalew/run/releases/latest/download/homebrew-run.rb`

---

*Run-Kit is truly a revolution for polyglot developers, educators, and anyone who loves experimenting with multiple languages without friction.*

---

*Happy Coding with Run-Kit! 🚀*
