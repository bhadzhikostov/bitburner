# Bitburner Game Scripts Project

A collection of scripts and tools for the Bitburner incremental game.

## Project Structure

```
├── src/                    # Source code directory
│   ├── scripts/           # Main game scripts
│   ├── utils/             # Utility functions and helpers
│   ├── types/             # TypeScript type definitions
│   └── config/            # Configuration files
├── dist/                  # Compiled/built scripts
├── tests/                 # Test files
├── docs/                  # Documentation
├── examples/              # Example scripts
└── tools/                 # Development tools and scripts
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev          # Watch mode for development
   npm run build        # Build all scripts
   npm run test         # Run tests
   ```

3. **Deploy to Bitburner**
   - Copy scripts from `dist/` to your Bitburner game
   - Or use the built-in deployment tools

## Script Categories

- **Hacking**: Automated hacking scripts
- **Money**: Money-making strategies
- **Growth**: Server growth and management
- **Combat**: Combat-related automation
- **Utility**: General utility scripts

## Contributing

1. Create scripts in the appropriate category folder
2. Follow the naming convention: `category-script-name.js`
3. Add proper documentation and comments
4. Test your scripts before committing

## License

MIT License - feel free to use and modify for your Bitburner gameplay!
