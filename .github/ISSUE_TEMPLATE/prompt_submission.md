---
name: Prompt submission
about: Submit a new prompt-injection example for the gallery
labels: prompt
---

## CSV Format

Our dataset uses `prompt-injection.csv` with these columns:
- `categories` - short category label
- `prompt_text` - the prompt content (will be CSV-escaped)
- `url` - optional source/reference link

## Category

Choose from these existing categories:
- **Benign** - Safe, educational prompts
- **Override** - Attempts to override system instructions
- **Jailbreak** - Attempts to bypass safety restrictions
- **Exfiltration** - Attempts to extract system information
- **MaliciousContent** - Prompts requesting harmful content generation
- **Obfuscation** - Encoded or hidden instruction attempts
- **RoleHijack** - Attempts to change AI's role/behavior
- **Multistep** - Multi-stage attack sequences
- **HiddenPayload** - Instructions hidden in markdown/code blocks
- **CrossPrompt** - Instructions disguised as user input/emails

## Prompt text

Paste the full prompt text. We'll handle CSV escaping (quotes, commas).

## Source URL (optional)

Link to a paper, dataset, or blog post.

## Notes

Anything else we should know.

