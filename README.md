<div align="center">
  <h1>🚨 Prompt Injection v3</h1>
  <p><strong>The Open Benchmark for AI Security, Red-Teaming & Guardrail Evaluation</strong></p>
  
  <p>
    <a href="https://promptinjection.github.io" target="_blank"><b>🌐 Live Benchmark Platform</b></a>
    ·
    <a href="https://promptinjection.github.io/#ai-kill-chain" target="_blank"><b>⚡ AI Kill Chain Matrix</b></a>
    ·
    <a href="https://huggingface.co/datasets/AIDataFdn/promptinjection" target="_blank"><b>🤗 Hugging Face Dataset</b></a>
    ·
    <a href="https://github.com/promptinjection/promptinjection.github.io/issues" target="_blank">🐛 Report Novel Attack</a>
    ·
    <a href="https://github.com/promptinjection/promptinjection.github.io/stargazers" target="_blank">⭐ Star on GitHub</a>
  </p>
  
  <p>
    <a href="https://huggingface.co/datasets/AIDataFdn/promptinjection"><img src="https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-AIDataFdn%2Fpromptinjection-ffbe3b?style=for-the-badge" alt="Hugging Face"></a>
    <img src="https://img.shields.io/badge/Dataset%20Size-731%2C908%20Prompts-10b981?style=for-the-badge" alt="Dataset Size">
    <img src="https://img.shields.io/badge/Taxonomy-13%20Categories-3b82f6?style=for-the-badge" alt="Taxonomy">
    <img src="https://img.shields.io/badge/Framework-10--Stage%20AI%20Kill%20Chain-8b5cf6?style=for-the-badge" alt="AI Kill Chain">
    <img src="https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge" alt="License">
  </p>

  <p>
    <a href="https://github.com/promptinjection/promptinjection.github.io/stargazers"><img src="https://img.shields.io/github/stars/promptinjection/promptinjection.github.io?style=social" alt="GitHub stars"></a>
    <a href="https://github.com/promptinjection/promptinjection.github.io/network/members"><img src="https://img.shields.io/github/forks/promptinjection/promptinjection.github.io?style=social" alt="GitHub forks"></a>
    <a href="https://github.com/promptinjection/promptinjection.github.io/issues"><img src="https://img.shields.io/github/issues/promptinjection/promptinjection.github.io" alt="GitHub issues"></a>
  </p>
</div>

---

## 🎯 Overview

**Prompt Injection v3** is the world's largest open-source security benchmark engineered specifically for testing LLM vulnerabilities, guardrail robustness, agent security, and red-teaming defenses.

Reviewed with **Cleanlab curation**, this v3 release scales the corpus to **731,908 total prompts**, featuring **107,156 adversarial attack payloads** mapped across **13 standardized attack categories** and the **10-stage AI Kill Chain™ framework**.

### 📊 Dataset Scale & Metrics

| Metric | Details |
| :--- | :--- |
| **Total Prompts** | **731,908** verified prompts |
| **Adversarial Injections** | **107,156** active jailbreaks & attack payloads |
| **Benign Baselines** | **624,752** clean conversational and safety control prompts |
| **Taxonomy Categories** | **13** standardized vulnerability classes |
| **System Framework** | **10** sequential attack stages · **58** granular techniques |
| **Format** | Apache Parquet / Arrow on Hugging Face Hub + Interactive Web Explorer |
| **License** | Open Source (MIT) |

---

## 🚀 Quick Start with Python (Hugging Face)

Stream or load all 731,908 prompts directly in Python with one line of code using the `datasets` library:

```bash
pip install datasets pandas
```

```python
from datasets import load_dataset

# 1. Load the full Prompt Injection v3 dataset
dataset = load_dataset("AIDataFdn/promptinjection")
print(f"Total samples: {len(dataset['train'])}")

# 2. Inspect a sample attack payload
sample = dataset["train"][0]
print("Prompt:", sample["prompt"])
print("Category:", sample["category"])

# 3. Stream on-the-fly without downloading the full dataset locally
streamed = load_dataset("AIDataFdn/promptinjection", streaming=True)
for item in streamed["train"]:
    if item["category"] == "Jailbreak":
        print("Adversarial Payload:", item["prompt"][:100])
        break
```

---

## 🛡️ The AI Kill Chain™ 10-Stage Security Matrix

Modeled after the enterprise AI governance framework, Prompt Injection v3 organizes threats into a sequential **10-Stage Matrix across 58 techniques**:

```
[01 Recon] ➔ [02 Trust & Manipulation] ➔ [03 Weaponization] ➔ [04 Reasoning Execution] ➔ [05 Tool Interaction]
                                                                                               │
[10 Actions on Objectives]  [09 AI C&C]  [08 Persistence]  [07 Lateral Movement]  [06 Privilege Escalation]
```

| Stage | Focus Area | Techniques Included |
| :--- | :--- | :--- |
| **01 AI Recon** | Model surface discovery & boundary mapping | Prompt Probing, Tool Surface Discovery, Boundary Mapping, Context Pressure, RAG Inference, State Detection |
| **02 Trust & Manipulation** | Social engineering & safety erosion | Authority Impersonation, Alignment Erosion, Persona Rebinding, Urgency Shaping, Policy Shadowing |
| **03 Instruction & Weaponization** | Payload injection & evasion | Direct Prompt Injection, Indirect RAG Injection, Instruction Smuggling, Tool Argument Poisoning |
| **04 Reasoning Time Execution** | Thinking process hijacking | Goal Substitution, Instruction Flooding, Recursive Task Expansion, False-Premise Anchoring |
| **05 Tool & Environment** | Autonomous action exploitation | Unauthorized Tool Invocation, Over-Privileged Chaining, Workflow Abuse, Tool Result Poisoning |
| **06 Privilege Escalation** | Scope expansion & credential theft | Tool Scope Escalation, Agent Delegation Abuse, Credential Overreach, Accumulated Privilege |
| **07 Lateral Movement** | Multi-agent infiltration | Inter-Agent Prompt Injection, Shared Memory Poisoning, Agent Impersonation, Context Leakage |
| **08 Persistence** | Long-term memory compromise | Memory Poisoning, RAG Knowledge Poisoning, Feedback Loop Exploitation, Cached Context Abuse |
| **09 AI C&C** | Covert control & orchestration | Human-in-the-Loop C&C, Scheduled Control, Encoded Output Signaling, Context Rehydration |
| **10 Actions on Objectives** | High-impact adversarial goals | Data Exfiltration via AI, Autonomous Fraud, Supply-Chain Propagation, Operational Disruption |

> 💡 **Explore the Full Matrix**: Visit [promptinjection.github.io/#ai-kill-chain](https://promptinjection.github.io/#ai-kill-chain) for the interactive 10-column chart with 1-click payload testing.

---

## 🏷️ Standardized Attack Taxonomy (13 Categories)

Every prompt in the dataset is labeled under our standardized 13-category taxonomy:

| Category | Description | Primary Threat Vector |
| :--- | :--- | :--- |
| `Jailbreak` | Refusal boundary bypasses (DAN, hypothetical framing, fictional personas) | Safety guardrail bypass |
| `Override` | Direct instructions overriding developer system directives | Command hijacking |
| `RoleHijack` | Forcing models into unconstrained personas or authority roles | Trust manipulation |
| `Indirect / CrossPrompt` | Payloads ingested via external documents, emails, and RAG vector stores | Supply-chain & RAG poisoning |
| `Obfuscation` | Base64, hex encoding, ciphers, markdown tricks, and unicode smuggling | Filter evasion |
| `Exfiltration` | Techniques coercing models into leaking private system prompts or keys | Confidentiality breach |
| `MaliciousContent` | Generation of exploit payloads, malware logic, or harmful instructions | Abuse generation |
| `Multistep` | Incremental alignment erosion across multi-turn dialogues | Complex attack chains |
| `SystemPromptContext` | Extraction of developer instructions, hidden guardrails, and environment variables | Reconnaissance |
| `HiddenPayload` | Steganography and hidden token sequences inside benign text | Covert execution |
| `PhishingEmail` | AI-generated social engineering, spear-phishing, and credential harvesting | Social engineering |
| `PhishingURL` | Generating deceptive URLs, redirects, and spoofed authentication links | Infrastructure abuse |
| `Benign` | High-quality conversational baselines for false-positive evaluation | Baseline control |

---

## 💻 Local Development

### 1. Prerequisites
- Python 3.8+
- (Optional) Ruby 3.2+ with Bundler if building with Jekyll directly

### 2. Clone & Run Local Preview
```bash
# Clone the repository
git clone https://github.com/promptinjection/promptinjection.github.io.git
cd promptinjection.github.io

# Build the complete site & sync all datasets
python3 scripts/build_site.py

# Start local preview server on port 4000
python3 -m http.server 4000 --directory _site
```

Open your browser at `http://localhost:4000`.

### 3. Alternative: Run with Jekyll
```bash
bundle install
bundle exec jekyll serve --future
```

---

## 📁 Repository Structure

```
promptinjection.github.io/
├── index.md                     # Main research portal & landing page
├── manage.md                    # Dedicated AI Kill Chain matrix page
├── style.css                    # Modern design system, dark mode & full-screen matrix
├── script.js                    # Search engine, category filters & Kill Chain interactive logic
├── data/                        # Live JSON datasets for client-side search
│   ├── manifest.json            # 731,908 prompt index & metadata
│   ├── ai-kill-chain.json       # 10 stages & 58 techniques specification
│   └── categories/*.json        # Filtered category chunks
├── scripts/                     # Automation & build pipelines
│   ├── build_site.py            # Static compiler & route synchronizer
│   └── process_dataset.exs      # Elixir dataset processor & CSV parser
├── _layouts/                    # Jekyll template layouts
│   └── default.html             # Base shell, header nav & modals
├── _posts/                      # Security research & comparison blog articles
├── .github/workflows/           # Automated CI/CD
│   └── jekyll.yml               # Automated GitHub Pages build & deployment
└── README.md                    # Project documentation
```

---

## 📚 Citation & Academic Use

If you use this benchmark or the AI Kill Chain matrix in your academic research, papers, or security audits, please cite:

```bibtex
@dataset{promptinjection2026,
  title={Prompt Injection v3: Open Benchmark for AI Security, Red-Teaming, and LLM Guardrails},
  author={AI Data Foundation and Contributors},
  year={2026},
  publisher={GitHub and Hugging Face},
  howpublished={\url{https://promptinjection.github.io}},
  note={Hugging Face Dataset: AIDataFdn/promptinjection}
}
```

---

## 🤝 Community & Contributions

We welcome contributions from researchers, red-teams, and AI developers:

- **Submit Novel Attacks**: Open a Pull Request or [File an Issue](https://github.com/promptinjection/promptinjection.github.io/issues) with real-world failure cases.
- **Improve Defenses**: Suggest defensive heuristics, regex patterns, or classifier rules.
- **Community Star**: Give this repo a ⭐ to help advance open-source AI defense research!

---

<div align="center">
  <p>
    <strong>Built with ❤️ for the Global AI Safety & Security Community</strong><br>
    <em>Advancing safe, trustworthy, and robust artificial intelligence.</em>
  </p>
  <p>
    <a href="https://promptinjection.github.io">🌐 Live Site</a> · 
    <a href="https://huggingface.co/datasets/AIDataFdn/promptinjection">🤗 Hugging Face</a> · 
    <a href="https://github.com/promptinjection/promptinjection.github.io">⭐ Star on GitHub</a>
  </p>
</div>
