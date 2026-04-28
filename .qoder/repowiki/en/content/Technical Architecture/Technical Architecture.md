# Technical Architecture

<cite>
**Referenced Files in This Document**
- [src/App.jsx](file://src/App.jsx)
- [src/main.jsx](file://src/main.jsx)
- [src/api/bridge.js](file://src/api/bridge.js)
- [src/utils/validation.js](file://src/utils/validation.js)
- [src/App.css](file://src/App.css)
- [index.html](file://index.html)
- [package.json](file://package.json)
- [vite.config.js](file://vite.config.js)
- [netlify.toml](file://netlify.toml)
</cite>

## Update Summary
**Changes Made**
- Updated to reflect modern Vite build system integration
- Enhanced component architecture documentation with ErrorBoundary pattern
- Added comprehensive hook-driven state management analysis
- Documented professional development practices and SPA routing
- Updated build configuration and deployment pipeline documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document describes the technical architecture of Bridge Fixer, a modern React-based single-page application designed to help users recover bridged deposits through a ChainDefuser service. The system follows a clean separation of concerns with professional development practices:

- **Modern Build System**: Vite-powered development server with React Fast Refresh and production builds
- **Component-Based Architecture**: React functional components with hook-driven state management
- **Professional Error Handling**: ErrorBoundary pattern for graceful error recovery
- **API Layer Pattern**: Factory-style RPC communication with ChainDefuser service
- **Validation Utilities**: Comprehensive multi-chain address format validation
- **SPA Routing**: Netlify-based deployment with client-side routing support

The application implements observable patterns for real-time polling, factory-like API functions for RPC calls, and follows React best practices with proper state management and lifecycle handling.

## Project Structure
The project is organized into a modern, scalable architecture with clear separation of concerns:

```mermaid
graph TB
Browser["Browser Runtime"] --> HTML["index.html"]
HTML --> RootDiv["#root element"]
RootDiv --> MainJS["src/main.jsx"]
MainJS --> ErrorBoundary["ErrorBoundary Component"]
ErrorBoundary --> App["src/App.jsx"]
App --> API["src/api/bridge.js"]
App --> Utils["src/utils/validation.js"]
App --> CSS["src/App.css"]
API --> RPC["ChainDefuser RPC Endpoint"]
```

**Diagram sources**
- [index.html:1-14](file://index.html#L1-L14)
- [src/main.jsx:1-13](file://src/main.jsx#L1-L13)
- [src/App.jsx:458-489](file://src/App.jsx#L458-L489)
- [src/App.jsx:97-456](file://src/App.jsx#L97-L456)
- [src/api/bridge.js:1-86](file://src/api/bridge.js#L1-L86)
- [src/utils/validation.js:1-49](file://src/utils/validation.js#L1-L49)
- [src/App.css:1-309](file://src/App.css#L1-L309)

**Section sources**
- [index.html:1-14](file://index.html#L1-L14)
- [src/main.jsx:1-13](file://src/main.jsx#L1-L13)
- [src/App.jsx:97-456](file://src/App.jsx#L97-L456)
- [src/api/bridge.js:1-86](file://src/api/bridge.js#L1-L86)
- [src/utils/validation.js:1-49](file://src/utils/validation.js#L1-L49)
- [src/App.css:1-309](file://src/App.css#L1-L309)
- [package.json:1-21](file://package.json#L1-L21)
- [vite.config.js:1-7](file://vite.config.js#L1-L7)
- [netlify.toml:1-16](file://netlify.toml#L1-L16)

## Core Components

### Application Architecture
- **App Component**: Central orchestrator managing form state, loading states, error/success messaging, and real-time polling. Renders child components for status badges and deposit rows, exposing action handlers for fetching addresses, checking deposits, and fixing deposits.
- **ErrorBoundary**: Professional error handling component that catches runtime errors and provides graceful degradation
- **API Module**: Factory-style RPC client providing named functions for supported tokens, deposit address, recent deposits, deposit notifications, and withdrawal status
- **Validation Utilities**: Chain-aware address validation, account ID validation, transaction hash validation, and predicates for determining fix eligibility
- **UI Components**: Presentational components for status badges and individual deposit rows with comprehensive styling

### Key Architectural Characteristics
- **Hook-Driven State Management**: Extensive use of useState, useEffect, useRef, and useCallback for local state, lifecycle management, timers, and memoization
- **Single-Page Application**: SPA routing handled by Netlify's redirect rules to serve index.html for all routes
- **Modern Build Pipeline**: Vite-based development server with React Fast Refresh and optimized production builds
- **Professional Dependencies**: React 18.3.1 with concurrent features, React DOM for rendering, and minimal external dependencies

**Section sources**
- [src/App.jsx:97-456](file://src/App.jsx#L97-L456)
- [src/App.jsx:458-489](file://src/App.jsx#L458-L489)
- [src/api/bridge.js:6-86](file://src/api/bridge.js#L6-L86)
- [src/utils/validation.js:1-49](file://src/utils/validation.js#L1-L49)

## Architecture Overview
The system follows a layered architecture with modern React patterns and professional development practices:

```mermaid
graph TB
subgraph "Presentation Layer"
AppComp["App.jsx<br/>Main Application Component"]
ErrorBound["ErrorBoundary<br/>Error Handling"]
StatusBadge["App.jsx<br/>StatusBadge Component"]
DepositRow["App.jsx<br/>DepositRow Component"]
end
subgraph "Domain Orchestration"
AppHooks["App.jsx<br/>useState/useEffect/useRef/useCallback"]
Polling["App.jsx<br/>Real-time Polling Mechanism"]
ErrorHandling["App.jsx<br/>Error State Management"]
end
subgraph "API Layer"
RPCClient["src/api/bridge.js<br/>bridgeRpc() Factory"]
APISupport["src/api/bridge.js<br/>fetchSupportedTokens()"]
APIAddr["src/api/bridge.js<br/>fetchDepositAddress()"]
APIDeposits["src/api/bridge.js<br/>fetchRecentDeposits()"]
APINotify["src/api/bridge.js<br/>notifyDeposit()"]
APIWithdraw["src/api/bridge.js<br/>fetchWithdrawalStatus()"]
end
subgraph "Validation Layer"
ValAddr["src/utils/validation.js<br/>validateAddress()"]
ValAcc["src/utils/validation.js<br/>validateAccountId()"]
ValTx["src/utils/validation.js<br/>validateTxHash()"]
CanFix["src/utils/validation.js<br/>canFixDeposit()"]
end
subgraph "Build & Deployment"
ViteDev["vite.config.js<br/>Development Server"]
ViteProd["Vite Build<br/>Production Optimization"]
Netlify["netlify.toml<br/>SPA Routing"]
end
AppComp --> AppHooks
AppComp --> ErrorBound
AppComp --> StatusBadge
AppComp --> DepositRow
AppComp --> Polling
AppComp --> ErrorHandling
AppComp --> APISupport
AppComp --> APIAddr
AppComp --> APIDeposits
AppComp --> APINotify
AppComp --> ValAddr
AppComp --> ValAcc
AppComp --> ValTx
AppComp --> CanFix
APISupport --> RPCClient
APIAddr --> RPCClient
APIDeposits --> RPCClient
APINotify --> RPCClient
APIWithdraw --> RPCClient
ViteDev --> AppComp
ViteProd --> AppComp
Netlify --> ViteProd
```

**Diagram sources**
- [src/App.jsx:97-456](file://src/App.jsx#L97-L456)
- [src/App.jsx:458-489](file://src/App.jsx#L458-L489)
- [src/api/bridge.js:6-86](file://src/api/bridge.js#L6-L86)
- [src/utils/validation.js:1-49](file://src/utils/validation.js#L1-L49)
- [vite.config.js:1-7](file://vite.config.js#L1-L7)
- [netlify.toml:12-16](file://netlify.toml#L12-L16)

## Detailed Component Analysis

### Modern React Application Architecture
The App component serves as a comprehensive React functional component that demonstrates modern React patterns:

- **State Management**: Multiple state variables for different UI contexts (chains, deposits, loading states, errors)
- **Lifecycle Management**: useEffect for initialization and cleanup, useCallback for stable function references
- **Error Boundary Integration**: Professional error handling with graceful fallback UI
- **Form Handling**: Controlled components with validation and conditional rendering
- **Conditional Logic**: Dynamic form fields based on chain selection (NEAR sender account, Stellar memo)

```mermaid
sequenceDiagram
participant U as "User Interface"
participant EB as "ErrorBoundary"
participant A as "App Component"
participant V as "Validation Layer"
participant API as "API Module"
participant S as "ChainDefuser RPC"
U->>EB : "Render Application"
EB->>A : "Pass children"
A->>A : "Load supported chains"
A->>API : "fetchSupportedTokens()"
API->>S : "RPC supported_tokens"
S-->>API : "Chain data"
API-->>A : "Chain list"
A->>A : "Initialize state"
U->>A : "User Action"
A->>V : "Input validation"
V-->>A : "Validation results"
A->>API : "API call with parameters"
API->>S : "RPC request"
S-->>API : "Response data"
API-->>A : "Processed result"
A->>A : "Update state and UI"
```

**Diagram sources**
- [src/App.jsx:124-151](file://src/App.jsx#L124-L151)
- [src/App.jsx:198-273](file://src/App.jsx#L198-L273)
- [src/api/bridge.js:40-85](file://src/api/bridge.js#L40-L85)
- [src/utils/validation.js:1-49](file://src/utils/validation.js#L1-L49)

**Section sources**
- [src/App.jsx:97-151](file://src/App.jsx#L97-L151)
- [src/App.jsx:153-196](file://src/App.jsx#L153-L196)
- [src/App.jsx:198-273](file://src/App.jsx#L198-L273)

### Advanced Error Handling Pattern
The ErrorBoundary component implements professional error handling:

- **Class Component Pattern**: Traditional React class component with lifecycle methods
- **Error Detection**: Static method to detect errors in child component trees
- **Graceful Degradation**: User-friendly error message with reload functionality
- **Integration**: Wrapped around the main App component for comprehensive coverage

```mermaid
flowchart TD
Start(["Component Mount"]) --> Normal["Normal Operation"]
Normal --> ChildError{"Child Error Occurs?"}
ChildError --> |Yes| ErrorState["Set hasError=true"]
ErrorState --> Fallback["Render Error UI"]
Fallback --> Reload["User Clicks Reload"]
Reload --> Reset["Reset State"]
Reset --> Normal
ChildError --> |No| Normal
```

**Diagram sources**
- [src/App.jsx:458-489](file://src/App.jsx#L458-L489)

**Section sources**
- [src/App.jsx:458-489](file://src/App.jsx#L458-L489)

### API Layer Pattern (Factory-Style RPC Communication)
The API module implements a sophisticated factory-style RPC client:

- **Shared RPC Client**: bridgeRpc() function handles JSON-RPC envelopes, request IDs, and error propagation
- **Timeout Management**: Built-in request timeout with AbortController for network reliability
- **Method-Specific Wrappers**: Named functions with parameter shaping for different RPC endpoints
- **Error Handling**: Comprehensive error handling for HTTP and RPC errors

```mermaid
flowchart TD
Start(["API Function Call"]) --> BuildParams["Build Method and Parameters"]
BuildParams --> CreateController["Create AbortController"]
CreateController --> SetTimeout["Set Request Timeout"]
SetTimeout --> SendRequest["POST to RPC Endpoint"]
SendRequest --> ResponseOK{"HTTP Response OK?"}
ResponseOK --> |No| ThrowHTTP["Throw HTTP Error"]
ResponseOK --> |Yes| ParseJSON["Parse JSON Response"]
ParseJSON --> HasError{"RPC Error Present?"}
HasError --> |Yes| ThrowRPC["Throw RPC Error"]
HasError --> |No| ReturnResult["Return Result"]
ThrowHTTP --> End(["End"])
ThrowRPC --> End
ReturnResult --> End
```

**Diagram sources**
- [src/api/bridge.js:6-38](file://src/api/bridge.js#L6-L38)

**Section sources**
- [src/api/bridge.js:6-86](file://src/api/bridge.js#L6-L86)

### Validation Utilities (Multi-chain Address Formats)
The validation module provides comprehensive input validation:

- **Chain-Aware Validation**: Different validation rules for EVM, TRON, and BTC addresses
- **Input Sanitization**: Trim and validation of user inputs
- **Predicate Functions**: canFixDeposit() determines eligibility for deposit fixing
- **Comprehensive Coverage**: Validates account IDs, transaction hashes, and chain-specific addresses

```mermaid
flowchart TD
Start(["validateAddress(address, chain)"]) --> CheckEmpty{"Address Empty?"}
CheckEmpty --> |Yes| ReturnRequired["Return 'required' error"]
CheckEmpty --> |No| CheckChain{"Chain Family"}
CheckChain --> |EVM| CheckEVM["0x prefix + 42 chars"]
CheckChain --> |TRON| CheckTRON["Starts with T"]
CheckChain --> |BTC| CheckBTC["Starts with 1/3/bc1"]
CheckEVM --> EVMValid{"Valid EVM?"}
CheckTRON --> TRONValid{"Valid TRON?"}
CheckBTC --> BTCValid{"Valid BTC?"}
EVMValid --> |No| ReturnEVM["Return EVM error"]
EVMValid --> |Yes| ReturnNull["Return null"]
TRONValid --> |No| ReturnTRON["Return TRON error"]
TRONValid --> |Yes| ReturnNull
BTCValid --> |No| ReturnBTC["Return BTC error"]
BTCValid --> |Yes| ReturnNull
ReturnRequired --> End(["End"])
ReturnEVM --> End
ReturnTRON --> End
ReturnBTC --> End
ReturnNull --> End
```

**Diagram sources**
- [src/utils/validation.js:1-30](file://src/utils/validation.js#L1-L30)

**Section sources**
- [src/utils/validation.js:1-49](file://src/utils/validation.js#L1-L49)

### Component Relationships and Data Flow
The application demonstrates sophisticated component relationships and data flow patterns:

```mermaid
graph LR
App["App.jsx<br/>Main Component"] --> EB["ErrorBoundary<br/>Error Handling"]
App --> SB["StatusBadge<br/>Presentational"]
App --> DR["DepositRow<br/>Presentational"]
App --> VA["validateAddress()<br/>Validation"]
App --> VACC["validateAccountId()<br/>Validation"]
App --> VT["validateTxHash()<br/>Validation"]
App --> CF["canFixDeposit()<br/>Validation"]
App --> API["API Functions<br/>Factory Pattern"]
API --> RPC["bridgeRpc()<br/>RPC Client"]
App --> CSS["App.css<br/>Styling"]
App --> Hooks["React Hooks<br/>State Management"]
```

**Diagram sources**
- [src/App.jsx:60-95](file://src/App.jsx#L60-L95)
- [src/App.jsx:97-456](file://src/App.jsx#L97-L456)
- [src/api/bridge.js:6-86](file://src/api/bridge.js#L6-L86)
- [src/utils/validation.js:1-49](file://src/utils/validation.js#L1-L49)
- [src/App.css:140-236](file://src/App.css#L140-L236)

**Section sources**
- [src/App.jsx:60-95](file://src/App.jsx#L60-L95)
- [src/App.jsx:97-456](file://src/App.jsx#L97-L456)
- [src/App.css:140-236](file://src/App.css#L140-L236)

## Dependency Analysis
The project follows modern dependency management practices:

### Runtime Dependencies
- **React 18.3.1**: Latest React with concurrent features and improved performance
- **React DOM 18.3.1**: DOM rendering capabilities for React applications
- **ES Modules**: Native ES module support for modern JavaScript features

### Development Dependencies  
- **Vite 6.0.0**: Next-generation frontend tooling with fast dev server and optimized builds
- **@vitejs/plugin-react 4.3.4**: Official React plugin for Vite with automatic JSX transform
- **Fast Refresh**: Hot module replacement for instant feedback during development

### Build and Deployment Pipeline
- **SPA Routing**: Netlify redirects all routes to index.html for client-side routing
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, and Referrer-Policy headers
- **Production Optimization**: Vite's production build with tree-shaking and minification

```mermaid
graph TB
Pkg["package.json<br/>Dependency Management"] --> React["react@^18.3.1"]
Pkg --> ReactDOM["react-dom@^18.3.1"]
Pkg --> Vite["vite@^6.0.0"]
Pkg --> VitePlugin["@vitejs/plugin-react@^4.3.4"]
ViteCfg["vite.config.js<br/>Build Configuration"] --> Plugin["@vitejs/plugin-react"]
ViteCfg --> DevServer["Development Server"]
ViteCfg --> ProdBuild["Production Build"]
Netlify["netlify.toml<br/>Deployment Config"] --> BuildCmd["npm run build"]
Netlify --> SPA["SPA Redirects"]
Netlify --> Security["Security Headers"]
```

**Diagram sources**
- [package.json:11-19](file://package.json#L11-L19)
- [vite.config.js:1-7](file://vite.config.js#L1-L7)
- [netlify.toml:1-16](file://netlify.toml#L1-L16)

**Section sources**
- [package.json:1-21](file://package.json#L1-L21)
- [vite.config.js:1-7](file://vite.config.js#L1-L7)
- [netlify.toml:1-16](file://netlify.toml#L1-L16)

## Performance Considerations

### Modern Build System Benefits
- **Vite Development Server**: Lightning-fast hot module replacement and instant server start
- **Tree Shaking**: Automatic dead code elimination in production builds
- **Code Splitting**: Optimized bundle splitting for better loading performance
- **ES Module Support**: Native ES modules for better optimization

### Application-Level Optimizations
- **Polling Management**: Configurable intervals with timeout protection to prevent resource exhaustion
- **Memoization**: useCallback for stable function references in event handlers
- **Conditional Rendering**: Dynamic component rendering based on chain selection reduces unnecessary DOM nodes
- **State Optimization**: Separate state variables prevent unnecessary re-renders across different UI sections

### Network Performance
- **Request Timeouts**: 30-second timeout prevents hanging requests
- **AbortController**: Proper cancellation of network requests on component unmount
- **Error Boundaries**: Prevent cascading failures and improve user experience

## Troubleshooting Guide

### Common Issues and Solutions

#### Build and Development Issues
- **Vite Dev Server Problems**: Ensure Node.js version compatibility and check port availability
- **Hot Reload Not Working**: Verify @vitejs/plugin-react installation and check browser console for errors
- **Import Errors**: Ensure ES module syntax and proper file extensions (.jsx)

#### Runtime Application Issues
- **RPC Errors**: The bridgeRpc() function throws on HTTP or RPC errors; implement proper error handling in calling components
- **Validation Failures**: Address, account ID, and transaction hash validations return specific errors; display user-friendly messages
- **Polling Timeouts**: If polling exceeds 60 seconds, automatically stops and shows error message; users can retry manually
- **SPA Routing Issues**: Ensure Netlify redirects are configured correctly so deep links render index.html

#### Error Boundary Behavior
- **Application Crashes**: ErrorBoundary component catches errors and displays friendly error message with reload option
- **State Reset**: On reload, application state is reset to initial values

**Section sources**
- [src/api/bridge.js:27-38](file://src/api/bridge.js#L27-L38)
- [src/App.jsx:172-196](file://src/App.jsx#L172-L196)
- [src/App.jsx:116-118](file://src/App.jsx#L116-L118)
- [netlify.toml:12-16](file://netlify.toml#L12-L16)
- [src/App.jsx:458-489](file://src/App.jsx#L458-L489)

## Conclusion
Bridge Fixer exemplifies modern React application architecture with professional development practices:

### Technical Excellence
- **Modern Build System**: Vite provides fast development experience with optimized production builds
- **Clean Architecture**: Clear separation of concerns between presentation, domain, API, and validation layers
- **Professional Error Handling**: ErrorBoundary pattern ensures graceful error recovery
- **Hook-Driven State Management**: Comprehensive use of React hooks for optimal state management
- **SPA Best Practices**: Proper routing configuration with Netlify for seamless navigation

### Scalability and Maintainability
- **Component Modularity**: Well-defined components with single responsibilities
- **API Abstraction**: Factory pattern for RPC communication simplifies API usage
- **Validation Layer**: Comprehensive input validation ensures data integrity
- **Performance Optimization**: Modern build tools and React best practices for optimal performance

### Developer Experience
- **Fast Development**: Vite's hot module replacement provides instant feedback
- **Type Safety**: ES modules and modern JavaScript features improve code quality
- **Professional Standards**: Error boundaries, proper error handling, and security headers demonstrate enterprise-grade development practices

This architecture enables maintainability, testability, and scalability while providing a responsive, user-friendly interface for deposit recovery operations.