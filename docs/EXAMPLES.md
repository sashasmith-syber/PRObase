# Usage Examples

This document provides practical examples of using AIT PROfessor's different modes effectively.

## Table of Contents

- [Professor Mode Examples](#professor-mode-examples)
- [Coder Mode Examples](#coder-mode-examples)
- [Troubleshooter Mode Examples](#troubleshooter-mode-examples)
- [Security Analyst Examples](#security-analyst-examples)
- [ATCG Examples](#atcg-examples)
- [SDCP Examples](#sdcp-examples)
- [CLFT Examples](#clft-examples)
- [AISV Examples](#aisv-examples)
- [CDKBG Examples](#cdkbg-examples)
- [PPRA Examples](#ppra-examples)
- [GUUP Examples](#guup-examples)
- [SEE Examples](#see-examples)

---

## Professor Mode Examples

### Example 1: Learning New Concepts

**User:**
```
Explain how RESTful APIs work. I'm familiar with basic HTTP but new to API design.
```

**Expected Response Type:**
- Historical context of REST
- Core principles explained clearly
- HTTP methods mapped to CRUD operations
- Examples with analogies
- Best practices for beginners

### Example 2: Understanding Complex Topics

**User:**
```
What's the difference between SQL and NoSQL databases? When should I use each?
```

**Expected Response:**
- Clear comparison table
- Use case scenarios
- Historical development
- Pros/cons of each
- Decision-making framework

### Example 3: Step-by-Step Learning

**User:**
```
I want to learn Docker. Can you create a learning path for me?
```

**Expected Response:**
- Structured learning roadmap
- Prerequisite knowledge
- Ordered topics with explanations
- Practice exercises suggested
- Resource recommendations

---

## Coder Mode Examples

### Example 1: Writing New Code

**User:**
```
Create a React custom hook for debouncing user input with TypeScript support.
```

**Expected Response:**
```typescript
import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage example:
// const debouncedSearch = useDebounce(searchTerm, 500);
```

### Example 2: Code Review

**User:**
```
Review this function for potential improvements:

function getUserData(id) {
  var user = database.find(id);
  if (user) {
    return user;
  } else {
    return null;
  }
}
```

**Expected Response:**
- Modern JavaScript suggestions (const/let)
- Ternary operator simplification
- Error handling recommendations
- TypeScript type annotations
- Async/await if database call is async
- Documentation suggestions

### Example 3: Algorithm Implementation

**User:**
```
Implement binary search in Python with proper edge case handling.
```

**Expected Response:**
```python
def binary_search(arr: list[int], target: int) -> int:
    """
    Performs binary search on a sorted array.
    
    Args:
        arr: Sorted list of integers
        target: Value to search for
        
    Returns:
        Index of target if found, -1 otherwise
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Prevents overflow
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

---

## Troubleshooter Mode Examples

### Example 1: Error Diagnosis

**User:**
```
I'm getting "CORS policy: No 'Access-Control-Allow-Origin' header" when calling my API from localhost:3000
```

**Expected Response:**
- Explanation of CORS error
- Common causes identified
- Step-by-step solution:
  1. Backend CORS configuration
  2. Development proxy setup
  3. Header configuration
- Testing procedures
- Prevention tips

### Example 2: Performance Issue

**User:**
```
My React app is slow. Component re-renders constantly. Here's my code: [code attached]
```

**Expected Response:**
- Analyze code for re-render causes
- Identify missing dependencies
- Suggest React.memo usage
- Recommend useMemo/useCallback
- Provide optimized version
- Explain why changes help

### Example 3: Configuration Problem

**User:**
```
Docker container exits immediately after starting. Logs show: "Connection to database failed"
```

**Expected Response:**
- Verify container networking
- Check environment variables
- Database connection string format
- Container start order
- docker-compose configuration
- Step-by-step debugging process

---

## Security Analyst Examples

### Example 1: Security Audit

**User:**
```
Review this authentication endpoint for security issues:

app.post('/login', (req, res) => {
  const user = db.users.find(u => u.username === req.body.username);
  if (user && user.password === req.body.password) {
    res.json({ token: user.id });
  }
});
```

**Expected Response:**
- Identify plaintext password storage
- Recommend bcrypt/argon2
- Suggest rate limiting
- JWT implementation guidance
- SQL injection prevention
- Input validation needs
- HTTPS requirement

### Example 2: Vulnerability Assessment

**User:**
```
What security measures should I implement for a user upload feature?
```

**Expected Response:**
- File type validation
- File size limits
- Virus scanning
- Storage location security
- Filename sanitization
- Access control
- Content-Type verification

### Example 3: Secure Design

**User:**
```
How do I securely store API keys in a web application?
```

**Expected Response:**
- Never in client-side code
- Environment variables
- Backend proxy pattern
- Key rotation strategies
- Secrets management tools
- Production best practices

---

## ATCG Examples

### Example 1: Test Cases from User Story

**User:**
```
Generate test cases for this user story:
"As a user, I want to reset my password using my email address"
```

**Expected Response:**

| ID | Description | Steps | Expected Result | Type |
|----|-------------|-------|----------------|------|
| TC-001 | Valid email reset | Enter valid email and click reset | Reset link sent | Positive |
| TC-002 | Invalid email format | Enter invalid email and click reset | Error message shown | Negative |
| TC-003 | Non-existent email | Enter unregistered email and click reset | Generic success message | Security |
| TC-004 | Empty email field | Leave email blank and click reset | Validation error | Boundary |

### Example 2: Test Code Generation

**User:**
```
Generate Jest tests for this function:

function calculateDiscount(price, percentage) {
  return price * (1 - percentage / 100);
}
```

**Expected Response:**
```javascript
describe('calculateDiscount', () => {
  test('calculates 10% discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  test('calculates 50% discount correctly', () => {
    expect(calculateDiscount(200, 50)).toBe(100);
  });

  test('handles 0% discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  test('handles 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  test('handles decimal prices', () => {
    expect(calculateDiscount(99.99, 15)).toBeCloseTo(84.99, 2);
  });
});
```

---

## SDCP Examples

### Example 1: Logic Bug

**User:**
```
This function should return true if array has duplicates, but fails:

function hasDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
```

**Expected Response:**
- **Root Cause:** Inner loop starts at `i` instead of `i + 1`
- **Issue:** Element compares with itself, always returning true
- **Fixed Code:**
```javascript
function hasDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) { // Start at i + 1
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
```
- **Explanation:** Why original failed and why fix works
- **Alternative:** Using Set for O(n) solution

---

## CLFT Examples

### Example 1: JavaScript to Python

**User:**
```
Translate this JavaScript to Python:

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
];

const adults = users
  .filter(u => u.age >= 18)
  .map(u => u.name);
```

**Expected Response:**
```python
users = [
    {'name': 'Alice', 'age': 30},
    {'name': 'Bob', 'age': 25}
]

adults = [u['name'] for u in users if u['age'] >= 18]

# Alternative using map and filter:
adults = list(map(lambda u: u['name'], 
                  filter(lambda u: u['age'] >= 18, users)))
```

**Key Differences:**
- Python uses list comprehension (more Pythonic)
- Dictionary syntax differs
- Lambda syntax differs
- No const/let/var in Python

---

## AISV Examples

### Example 1: Generate API Client

**User:**
```
Create a TypeScript client for this API:
POST /api/users
Body: { "name": string, "email": string }
Response: { "id": number, "name": string, "email": string }
```

**Expected Response:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

class UserAPIClient {
  constructor(private baseURL: string) {}

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await fetch(`${this.baseURL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }
}
```

---

## CDKBG Examples

### Example 1: Generate README

**User:**
```
Create a README for a Node.js weather API that uses OpenWeather API
```

**Expected Response:**
Complete README with:
- Project description
- Features list
- Installation instructions
- Environment setup
- API endpoints documentation
- Usage examples
- Configuration options
- Contributing guidelines
- License information

---

## PPRA Examples

### Example 1: Performance Analysis

**User:**
```
Analyze performance of this function:

function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}
```

**Expected Response:**
### Performance Analysis
- **Time Complexity:** O(n³) - nested loops + includes()
- **Space Complexity:** O(n)
- **Bottleneck:** Triple iteration

### Optimization Recommendation
```javascript
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}
```
- **New Complexity:** O(n)
- **Performance Gain:** ~99% faster for large arrays

---

## GUUP Examples

### Example 1: Component Design

**User:**
```
Design a loading button component with three states: idle, loading, success
```

**Expected Response:**
```tsx
import React, { useState } from 'react';

type ButtonState = 'idle' | 'loading' | 'success';

interface LoadingButtonProps {
  onClick: () => Promise<void>;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({ 
  onClick, 
  children 
}) => {
  const [state, setState] = useState<ButtonState>('idle');

  const handleClick = async () => {
    setState('loading');
    try {
      await onClick();
      setState('success');
      setTimeout(() => setState('idle'), 2000);
    } catch (error) {
      setState('idle');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading'}
      className={`
        px-6 py-3 rounded-lg font-semibold transition-all
        ${state === 'idle' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        ${state === 'loading' ? 'bg-gray-400 cursor-not-allowed' : ''}
        ${state === 'success' ? 'bg-green-600' : ''}
        text-white
      `}
    >
      {state === 'loading' && '⏳ Loading...'}
      {state === 'success' && '✓ Success!'}
      {state === 'idle' && children}
    </button>
  );
};
```

---

## SEE Examples

### Example 1: Load Testing Simulation

**User:**
```
Simulate API performance under 1000 concurrent users over 60 seconds
```

**Expected Response:**
### Scenario Overview
- Users: 1000 concurrent
- Duration: 60 seconds
- Ramp-up: 10 seconds

### Simulation Results
| Metric | Value |
|--------|-------|
| Total Requests | 60,000 |
| Successful | 58,500 (97.5%) |
| Failed | 1,500 (2.5%) |
| Avg Response Time | 145ms |
| P95 Response Time | 320ms |
| Peak Load | 1000 req/s |

### Analysis
- System handles load well up to 800 concurrent users
- Performance degrades at 900+ users
- Recommend scaling at 750 concurrent users

### Python Simulation Code
```python
import simpy
# ... simulation implementation
```

---

## Multi-Mode Workflow Example

### Complete Feature Development

**1. Learning (Professor):**
```
Explain OAuth 2.0 flow for a web application
```

**2. Implementation (Coder):**
```
Implement OAuth 2.0 authentication with Google in Express.js
```

**3. Testing (ATCG):**
```
Generate test cases for the OAuth implementation
```

**4. Debugging (SDCP):**
```
My OAuth callback fails with "invalid_grant" error
```

**5. Security (Security Analyst):**
```
Review my OAuth implementation for security issues
```

**6. Documentation (CDKBG):**
```
Document the OAuth setup for the README
```

This workflow showcases how different modes complement each other throughout development!
