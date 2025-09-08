# Contribution Guidelines - Prompt Injection Collective

Before contributing to the **Prompt Injection Collective**, please ensure you are adhering to the
following guidelines. This repository focuses on documenting prompt injection techniques for
educational and security research purposes. All contributions should emphasize responsible
disclosure and ethical security research practices.

## General Guidelines

The following guidelines should be followed when making contributions to the Collective:

- [ ] Contributions should be made via a pull request to the main repository
      from a personal fork.
- [ ] Pull requests should be accompanied by a descriptive title and detailed
      explanation.
- [ ] Submit all pull requests to the repository's main branch.
- [ ] Before submitting a pull request, ensure additions/edits are aligned with
      the overall repo organization.
- [ ] Be sure changes are compatible with the repository's license.
- [ ] In case of conflicts, provide helpful explanations regarding your proposed
      changes so that they can be approved by repo owners.

## New Prompt Guidelines

To add a new prompt to this repository, a contributor should take the following
steps (in their personal fork):

1. Create and test the new prompt.
   - See the
## Security Research Guidelines

When contributing prompt injection techniques, please follow these additional guidelines:

- [ ] **Responsible Disclosure**: Only submit techniques that don't cause harm to systems or users
- [ ] **Educational Focus**: Include explanations of why the technique works and potential defenses
- [ ] **Ethical Research**: Ensure your research follows responsible AI security practices
- [ ] **Documentation**: Provide clear context about the vulnerability type and impact level

## Prompt Injection Specific Guidelines

When submitting new prompt injection examples:

1. **Research Quality**:
   - Verify the technique works across multiple AI models when possible
   - Document which models/platforms the technique affects
   - Include information about potential mitigations or defenses
   
2. **Add to Documentation** using this template:

   `## Technique Title`

   `Contributed by: [@github_username](https://github.com/github_profile)`
   
   `Vulnerability Type: [e.g., Context Hijacking, Role Confusion, etc.]`
   
   `Affected Models: [e.g., GPT-4, Claude, etc.]`

   `> prompt injection content`

   `**Explanation**: Brief description of how/why this works`
   
   `**Potential Defenses**: Suggested countermeasures`

   - <b>Note:</b> If your technique was discovered using AI assistance, append
     `<mark>Discovered with AI Assistance</mark>` to the "Contributed by" line.
     
3. **Add to CSV**: Include the technique in `prompts.csv` with:
   - Technique name in the `act` column
   - Full injection prompt in the `prompt` column
   
4. **Pull Request Requirements**:
   - Document your testing methodology and results
   - Include responsible disclosure statement if applicable
   - Provide detailed title and description focusing on security research value

### Security Research Checklist:

- [ ] I've confirmed this technique works for educational/research purposes
- [ ] I've verified this doesn't violate platform terms of service
- [ ] I've included vulnerability classification and affected models
- [ ] I've documented potential defenses or mitigations
- [ ] I've added attribution: `Contributed by: [@yourusername](https://github.com/yourusername)`
- [ ] I've added to the README.md with proper security context
- [ ] I've added to the `prompts.csv`
  - [ ] Escaped quotes by double-quoting them
  - [ ] No spaces after commas after double quotes. e.g. `"act","prompt"` not
        `"act", "prompt"`
  - [ ] Used descriptive technique name (not just "Act as")

Please ensure these requirements are met and that your contribution advances responsible AI security research.
