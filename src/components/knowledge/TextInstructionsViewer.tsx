import { X, Copy, Check, FileText, Calendar, User } from 'lucide-react';
import { useState } from 'react';

interface TextInstructionsViewerProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  title: string;
  content: string;
  description?: string;
}

// Enhanced dividend processing instructions with more detail
const dividendProcessingInstructions = `# Dividend Processing - Complete Operating Procedures

## Overview
This document outlines the end-to-end process for handling cash and stock dividend corporate actions, from announcement receipt through final reconciliation and reporting.

## 1. Announcement Receipt & Validation

### 1.1 Receive Announcement from Issuer
- Monitor announcement channels (DTCC, Bloomberg, issuer websites)
- Log announcement receipt timestamp in the corporate actions system
- Assign unique corporate action ID (format: CA-YYYY-NNNNNN)

### 1.2 Validate Corporate Action Details
**Required Fields Verification:**
- CUSIP/ISIN of the security
- Ex-Dividend Date (critical for entitlement determination)
- Record Date (holder of record determination)
- Payment Date (cash distribution date)
- Dividend Rate (amount per share or percentage)
- Currency (for cash dividends)
- Payment Type (Cash/Stock/Choice)

**Data Quality Checks:**
- Verify dates are logical (Ex-Date < Record Date < Payment Date)
- Confirm dividend rate against historical patterns
- Cross-reference with alternative data sources
- Flag any discrepancies for manual review

### 1.3 Classification & Setup
- Classify dividend type (ordinary, special, qualified)
- Determine tax treatment categories
- Set up appropriate GL accounts
- Configure system parameters for processing

## 2. Position & Entitlement Calculation

### 2.1 Position Snapshot
**Timing:** As of Record Date close of business
- Extract position data from settlement system
- Include all accounts holding the security
- Apply pending settlements (T+2 considerations)
- Handle special situations:
  * Pledged securities
  * Securities on loan
  * Repo positions
  * Restricted stock

### 2.2 Calculate Entitlements
**Formula:** Entitlement = Position Quantity × Dividend Rate

**Account-Level Processing:**
- Calculate gross entitlement per account
- Apply withholding tax based on:
  * Account registration (individual, corporate, foreign)
  * Tax treaty status
  * W-8/W-9 form status
- Calculate net entitlement
- Generate entitlement report

### 2.3 Special Handling Cases
- **Fractional Shares:** Round per company policy (typically down)
- **Foreign Tax Credit:** Calculate and track for Form 1099
- **Choice Dividends:** Process elections, apply default for non-responders
- **Partial Calls:** Prorate dividend for called securities

## 3. Payment Processing

### 3.1 Pre-Payment Validation
**T-1 Day Activities:**
- Verify total cash requirement
- Confirm bank account funding
- Validate payment instructions for all accounts
- Run payment file validation checks
- Review exception reports

### 3.2 Execute Payment
**Payment Date Activities:**
- Generate payment files by payment method:
  * ACH (domestic accounts)
  * Wire transfer (large amounts)
  * Check (specific account requests)
  * DTC (broker-dealer accounts)
- Apply cut-off times per payment network
- Obtain payment approvals per authorization matrix
- Submit payment files to banks
- Retain payment confirmations

### 3.3 Account Updates
- Post dividend credits to account ledgers
- Update cash balances
- Record transactions in general ledger:
  * DR: Dividend Payable
  * CR: Cash/Bank Account
- Generate client statements
- Update tax reporting systems (1099 accumulation)

## 4. Reconciliation

### 4.1 Daily Reconciliation
**Key Reconciliation Points:**
- Total entitlements calculated vs. payments processed
- Cash movement vs. bank statements
- Position data vs. settlement system
- DTC records vs. internal records

### 4.2 Break Investigation
**For Any Discrepancies:**
- Document break with unique ID
- Research root cause (system, data, manual error)
- Determine financial impact
- Assign to appropriate resolver
- Track aging of unresolved breaks
- Escalate aged breaks (>3 days)

### 4.3 Month-End Procedures
- Complete all outstanding reconciliations
- Clear or document all breaks
- Prepare dividend processing metrics
- Generate management reporting
- Archive all supporting documentation

## 5. Reporting & Documentation

### 5.1 Internal Reports
- Daily processing summary
- Payment confirmation report
- Exception report (breaks, failures)
- Tax withholding summary
- Metrics dashboard (SLA compliance)

### 5.2 Regulatory Reporting
- IRS Form 1099-DIV preparation
- State tax reporting (varies by jurisdiction)
- Foreign tax authority reporting
- Audit trail documentation

### 5.3 Client Communication
- Payment notices (email/statement)
- Tax documentation (1099 distribution)
- Response to client inquiries
- Website updates (dividend calendar)

## 6. Controls & Governance

### 6.1 Authorization Matrix
- Announcement approval: Operations Manager
- Payment approval: Treasury Officer
- Break resolution: Operations Supervisor
- GL posting approval: Accounting Manager

### 6.2 Audit Trail
- All system actions logged with user ID and timestamp
- Email communications archived
- Decision documentation required for exceptions
- Annual audit of process controls

### 6.3 Quality Assurance
- Dual verification for high-value dividends (>$1M)
- Sample testing of calculations (5% of accounts)
- Quarterly process review
- Annual SOC 1 Type II examination

## 7. Escalation Procedures

### Level 1: Operational Issues
- Contact: Operations Supervisor
- Response Time: 2 hours
- Examples: Data discrepancies, minor breaks

### Level 2: Financial Impact
- Contact: Operations Manager + Treasury
- Response Time: 1 hour
- Examples: Payment failures, significant breaks

### Level 3: Critical Issues
- Contact: Head of Operations + CFO
- Response Time: 30 minutes
- Examples: Systemic failures, regulatory issues

## 8. Technology & Systems

### Primary Systems
- Corporate Actions System: CA-Pro 2.0
- Settlement System: SettleMax
- GL System: Oracle Financials
- Payment System: FedWire Gateway

### System Integration Points
- Real-time position feed from settlement
- Nightly GL posting batch
- Morning payment file generation
- EOD reconciliation processes

## Document Control
- Version: 3.2
- Last Updated: February 10, 2026
- Next Review: August 10, 2026
- Owner: Corporate Actions Department
- Approved By: Chief Operating Officer`;

export function TextInstructionsViewer({ 
  theme, 
  onClose, 
  title, 
  content,
  description 
}: TextInstructionsViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(dividendProcessingInstructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg w-full h-full max-w-6xl max-h-[95vh] flex flex-col ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <FileText className={`w-6 h-6 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <div>
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h3>
              {description && (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className={`px-6 py-3 border-b flex items-center gap-6 text-sm ${
          theme === 'dark' ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Last Updated: Feb 10, 2026
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className={`w-4 h-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Owner: Corporate Actions Department
            </span>
          </div>
          <div className={`ml-auto px-3 py-1 rounded text-xs font-medium ${
            theme === 'dark' 
              ? 'bg-green-900/30 text-green-400' 
              : 'bg-green-100 text-green-700'
          }`}>
            Version 3.2
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto p-8 ${
          theme === 'dark' ? 'bg-black' : 'bg-white'
        }`}>
          <div className={`prose max-w-none ${
            theme === 'dark' ? 'prose-invert' : ''
          }`}>
            <div className={`space-y-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {dividendProcessingInstructions.split('\n').map((line, idx) => {
                // Headers
                if (line.startsWith('# ')) {
                  return (
                    <h1 
                      key={idx} 
                      className={`text-3xl font-bold mt-8 mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {line.substring(2)}
                    </h1>
                  );
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 
                      key={idx} 
                      className={`text-2xl font-bold mt-6 mb-3 ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      }`}
                    >
                      {line.substring(3)}
                    </h2>
                  );
                }
                if (line.startsWith('### ')) {
                  return (
                    <h3 
                      key={idx} 
                      className={`text-xl font-semibold mt-4 mb-2 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`}
                    >
                      {line.substring(4)}
                    </h3>
                  );
                }
                
                // Bold text (markdown **text**)
                if (line.includes('**')) {
                  return (
                    <p key={idx} className={`mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {line.split('**').map((part, i) => 
                        i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>
                      )}
                    </p>
                  );
                }
                
                // List items
                if (line.startsWith('- ')) {
                  return (
                    <li 
                      key={idx} 
                      className={`ml-6 mb-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {line.substring(2)}
                    </li>
                  );
                }
                if (line.match(/^\s+\*/)) {
                  return (
                    <li 
                      key={idx} 
                      className={`ml-12 mb-1 list-disc ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {line.trim().substring(1).trim()}
                    </li>
                  );
                }
                
                // Empty lines
                if (line.trim() === '') {
                  return <div key={idx} className="h-2" />;
                }
                
                // Regular paragraphs
                return (
                  <p 
                    key={idx} 
                    className={`mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            This document is part of the Corporate Actions Knowledge Base
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
