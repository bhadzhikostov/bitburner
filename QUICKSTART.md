# Quick Start Guide

Get up and running with your Bitburner scripts in minutes!

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build your scripts:**
   ```bash
   npm run build
   ```

3. **Start development mode:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── scripts/           # Your game scripts
│   ├── hacking-*.js  # Hacking automation
│   ├── money-*.js    # Money-making strategies
│   ├── growth-*.js   # Server management
│   └── utility-*.js  # Monitoring and utilities
├── utils/             # Helper functions
├── types/             # TypeScript definitions
└── config/            # Configuration files
```

## 🎯 Example Scripts

### Basic Hacking
```bash
# Run basic hacking script on n00dles
run hacking-basic-hack.js n00dles
```

### Stock Trading
```bash
# Start automated stock trading
run money-stock-trader.js
```

### Server Management
```bash
# Automatically buy and upgrade servers
run growth-server-manager.js
```

### System Monitor
```bash
# Monitor your system status
run utility-monitor.js

# With detailed stats
run utility-monitor.js --detailed

# With network map
run utility-monitor.js --network
```

## 🛠️ Development

### Adding New Scripts
1. Create your script in `src/scripts/`
2. Follow the naming convention: `category-script-name.js`
3. Build with `npm run build`
4. Deploy with `npm run deploy`

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality
```bash
# Lint your code
npm run lint

# Format your code
npm run format
```

## 🚀 Deployment

### Automatic Deployment
```bash
# Deploy to default location
npm run deploy

# Deploy to custom location
npm run deploy -- --game-dir ~/Documents/Bitburner/scripts
```

### Manual Deployment
1. Build your scripts: `npm run build`
2. Copy files from `dist/` to your game's scripts directory
3. Or use the deployment tool: `node tools/deploy.js`

## ⚙️ Configuration

Edit `src/config/settings.js` to customize:
- Hacking parameters
- Server management settings
- Stock trading thresholds
- Monitoring preferences

## 🔧 Troubleshooting

### Common Issues

**Scripts not working in game:**
- Make sure you've built the project (`npm run build`)
- Check that scripts are in the correct game directory
- Verify you have the required hacking level

**TypeScript errors:**
- Run `npm run build` to see compilation errors
- Check that all imports are correct
- Verify type definitions match your game version

**Tests failing:**
- Run `npm test` to see detailed error messages
- Check that mocks are properly set up
- Verify test data matches expected format

## 📚 Next Steps

1. **Explore the examples** in `src/scripts/`
2. **Customize configuration** in `src/config/settings.js`
3. **Add your own scripts** following the established patterns
4. **Join the community** for tips and advanced strategies

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the example scripts for implementation patterns
- Use the utility functions in `src/utils/helpers.ts`
- Test your code with the provided test framework

Happy hacking! 🎮💻
