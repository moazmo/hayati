# Contributing to حياتي - Hayati

First of all, thank you for considering contributing to Hayati! 🙏

This project aims to serve the Muslim community with a quality life management application that respects Islamic values while embracing modern technology.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Getting Help](#getting-help)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to Islamic values and community respect. By participating, you are expected to uphold these values:

- **Respect**: Treat all community members with respect and kindness
- **Inclusion**: Welcome contributors regardless of their background
- **Islamic Values**: Ensure all contributions align with Islamic principles
- **Constructive Feedback**: Provide helpful and constructive feedback
- **Collaboration**: Work together for the benefit of the Muslim community

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

When you create a bug report, please include:

- **Clear title**: Describe the issue briefly
- **Steps to reproduce**: List the exact steps to reproduce the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, Node.js version, app version
- **Screenshots**: If applicable

### 💡 Suggesting Features

We welcome feature suggestions that can benefit the Muslim community. Please:

- Check existing feature requests first
- Explain the feature clearly
- Describe the use case and benefits
- Consider Islamic context and cultural sensitivity
- Provide mockups or examples if possible

### 🌍 Translation and Localization

Help us make Hayati accessible to more Muslims worldwide:

- **Arabic improvements**: Enhance existing Arabic translations
- **New languages**: Add support for other languages spoken by Muslims
- **Cultural adaptation**: Ensure UI/UX respects local customs
- **RTL improvements**: Enhance right-to-left language support

### 💻 Code Contributions

We appreciate code contributions! See the development process below.

## Development Process

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/hayati.git
cd hayati
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bug fix branch
git checkout -b fix/bug-description
```

### 4. Make Changes

- Follow our coding standards (see below)
- Write meaningful commit messages
- Test your changes thoroughly
- Ensure Arabic/RTL support is maintained

### 5. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests (when available)
npm run test

# Build the application
npm run build
```

## Coding Standards

### TypeScript Guidelines

- Use TypeScript strict mode
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### React Guidelines

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### Styling Guidelines

- Use styled-components for styling
- Follow the existing design system
- Ensure proper RTL support for Arabic
- Use semantic color names
- Maintain consistency with existing UI

### Arabic/RTL Guidelines

- Always test Arabic text rendering
- Ensure proper RTL layout
- Use appropriate fonts (Cairo family)
- Respect Arabic typography rules
- Test with different text lengths

### Islamic Content Guidelines

- Verify prayer time calculations are accurate
- Respect Islamic calendar and holidays
- Use appropriate Islamic terminology
- Ensure content is culturally sensitive
- Follow Islamic design principles

## Commit Guidelines

We follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(tasks): add recurring task support
fix(prayers): correct Fajr time calculation
docs(readme): update installation instructions
style(components): fix Arabic text alignment
```

## Pull Request Process

### 1. Before Creating PR

- Ensure your branch is up to date with main
- Test your changes thoroughly
- Update documentation if needed
- Follow commit message guidelines

### 2. Create Pull Request

- Use a clear, descriptive title
- Fill out the PR template completely
- Link related issues
- Add screenshots for UI changes
- Mark as draft if still work in progress

### 3. PR Review Process

- Address reviewer feedback promptly
- Keep discussions constructive
- Update your branch if requested
- Ensure CI checks pass

### 4. After Merge

- Delete your feature branch
- Update your local main branch
- Consider contributing to documentation

## Islamic Considerations

When contributing to Hayati, please keep in mind:

### Content Guidelines

- **Prayer Times**: Ensure accuracy according to recognized Islamic methods
- **Islamic Calendar**: Respect Hijri calendar calculations
- **Terminology**: Use correct Islamic terms (Arabic when appropriate)
- **Cultural Sensitivity**: Consider diverse Muslim cultures and practices

### Design Guidelines

- **Colors**: Avoid inappropriate color combinations
- **Images**: No images of living beings in Islamic contexts
- **Typography**: Respect Arabic calligraphy principles
- **Layout**: Consider Islamic aesthetic principles

### Feature Guidelines

- **Halal Compliance**: Ensure all features comply with Islamic principles
- **Prayer Integration**: Respect prayer time importance
- **Islamic Holidays**: Properly handle Islamic holidays and events
- **Community Focus**: Consider family and community aspects

## Getting Help

### Documentation

- Check the [README](README.md) for basic information
- Visit our [Wiki](https://github.com/hayati-app/hayati/wiki) for detailed docs
- Review existing [Issues](https://github.com/hayati-app/hayati/issues) and [Discussions](https://github.com/hayati-app/hayati/discussions)

### Community Support

- **GitHub Discussions**: For general questions and community chat
- **Issues**: For bug reports and feature requests
- **Email**: contact@hayati-app.com for private matters

### Development Help

- **Code Review**: Don't hesitate to ask for code review
- **Technical Questions**: Use GitHub Discussions for technical help
- **Mentorship**: Experienced contributors are happy to help newcomers

## Recognition

Contributors will be recognized in:

- **README**: Contributors section
- **Release Notes**: Major contributions mentioned
- **About Page**: In-app contributor recognition
- **Community**: Social media acknowledgments

## Final Notes

Remember that Hayati is developed as **Sadaqah Jariyah** (continuing charity) for the Muslim community. Your contributions are not just code improvements but acts of service to fellow Muslims worldwide.

May Allah reward your efforts and make this project beneficial for the Ummah. 🤲

---

جزاكم الله خيراً | May Allah reward you with good
