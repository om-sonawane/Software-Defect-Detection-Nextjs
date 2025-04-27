# Software Defect Detection System - User Manual

## Overview
The Software Defect Detection System is a web application that uses machine learning to predict potential defects in software based on code metrics. This tool helps developers identify problematic code before it causes issues in production.

## Getting Started

### Registration
1. Visit the landing page and click on "Register"
2. Complete the 3-step registration process:
   - Step 1: Enter your personal information
   - Step 2: Enter your contact information
   - Step 3: Create a secure password
3. After successful registration, you'll be redirected to the login page

### Login
1. Enter your username and password
2. Click "Login" to access the system

## Main Features

### Defect Detection
1. From the home page, click on "Start Detection"
2. Enter the software metrics for your code:
   - Lines of Code (LOC)
   - Cyclomatic Complexity (v(g))
   - Essential Complexity (ev(g))
   - Design Complexity (iv(g))
   - Halstead metrics (n, v, l, d, i, e, t)
   - Code structure metrics (lines of code, comments, etc.)
   - Operator and operand metrics
   - Branch count
3. Click "Detect Defects" to analyze your code
4. View the results and download the detailed report

### Model Training Data
1. From the home page, click on "View Training Data"
2. Explore the model's performance metrics:
   - Accuracy, precision, recall, and F1 score
   - Confusion matrix
   - Feature importance
   - Defect distribution in training data

## Understanding Results

### Defect Detection Results
- **Defect Detected**: The system has identified potential issues in your code based on the provided metrics
- **No Defect Detected**: The system did not find any significant issues based on the provided metrics

### Performance Metrics
- **Accuracy**: The percentage of correct predictions (both defective and non-defective)
- **Precision**: The percentage of correctly identified defects among all predicted defects
- **Recall**: The percentage of actual defects that were correctly identified
- **F1 Score**: The harmonic mean of precision and recall

## Tips for Best Results
1. Provide accurate metrics for your code
2. Use the system regularly as part of your development process
3. Pay attention to metrics with high feature importance
4. Use the detailed reports to understand specific areas for improvement

## Troubleshooting
- If you encounter login issues, ensure your username and password are correct
- If the system is slow to respond, try refreshing the page
- For any persistent issues, contact system support

## Privacy and Data Security
- All user data and code metrics are stored securely
- Individual code metrics are not shared with other users
- Aggregated, anonymized data may be used to improve the model's performance
