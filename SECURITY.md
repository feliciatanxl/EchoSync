# Security Policy

## Supported Versions

EchoSync is an academic prototype under active development. Security updates are applied to the latest version available on the `main` branch.

| Version | Supported |
|---|---|
| Latest `main` branch | ✅ |
| Older commits or archived releases | ❌ |

## Reporting a Vulnerability

Please do **not** disclose security vulnerabilities through a public GitHub issue, discussion, or pull request.

To report a vulnerability privately:

1. Open the repository's **Security** tab.
2. Select **Advisories**.
3. Choose **Report a vulnerability**.
4. Provide a clear description of the issue and the steps required to reproduce it.

Please include, where possible:

- The affected file, component, page, or endpoint
- Steps to reproduce the vulnerability
- The expected and actual behaviour
- The possible security impact
- Screenshots, logs, or proof-of-concept details
- A suggested fix, if available

Reports will be reviewed as soon as reasonably possible. Please allow time for the issue to be investigated and resolved before publicly disclosing it.

## Security Measures

EchoSync uses the following measures to improve application security:

- GitHub CodeQL analysis for supported languages
- Dependency and vulnerability scanning
- Secret scanning
- Environment variables for sensitive configuration
- Input validation and error handling
- Authentication and access-control checks where applicable
- Regular dependency updates

## Sensitive Information

Do not commit any of the following information to the repository:

- API keys
- Access tokens
- Passwords
- Private keys
- Database credentials
- Cloud-service credentials
- Personal or confidential user data

Sensitive values should be stored in environment variables or GitHub repository secrets. Example environment files such as `.env.example` may contain placeholder values only.

## Scope

The following components are within the scope of this policy:

- EchoSync web applications
- Backend APIs
- Python services
- JavaScript and TypeScript source code
- Hardware integration and communication code
- Deployment and GitHub Actions configuration

Third-party services, libraries, hardware, and platforms are governed by their respective security policies.

## Responsible Disclosure

Anyone reporting a vulnerability is expected to:

- Avoid accessing, modifying, or deleting data that does not belong to them
- Avoid disrupting the availability of the project or its services
- Avoid social engineering, phishing, or physical attacks
- Report findings privately and in good faith
- Give the project maintainers reasonable time to investigate and fix the issue

Thank you for helping to keep EchoSync secure.
