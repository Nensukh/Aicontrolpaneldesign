import { useState } from 'react';
import { 
  Plus, 
  Code, 
  Search,
  Folder,
  ExternalLink,
  Trash2,
  Edit2,
  BookOpen,
  FileCode
} from 'lucide-react';
import { SkillsEditor } from './knowledge/SkillsEditor';

interface Skill {
  id: string;
  title: string;
  content: string;
  description?: string;
  version: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  addedDate: Date;
}

interface Process {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
}

interface Domain {
  id: string;
  name: string;
  description: string;
  processes: Process[];
}

interface SkillsProps {
  theme: 'dark' | 'light';
}

// Mock initial data with skills moved from Knowledge Base
const initialDomains: Domain[] = [
  {
    id: 'securities',
    name: 'Securities Settlements',
    description: 'Skills for securities settlement operations',
    processes: [
      {
        id: 'dvp-settlement',
        name: 'DVP Settlement Process',
        description: 'Delivery versus Payment settlement workflows',
        skills: []
      },
      {
        id: 'fails-management',
        name: 'Fails Management',
        description: 'Managing settlement failures and exceptions',
        skills: []
      }
    ]
  },
  {
    id: 'corporate-actions',
    name: 'Corporate Actions',
    description: 'Skills for corporate action processing',
    processes: [
      {
        id: 'dividend-processing',
        name: 'Dividend Processing',
        description: 'Cash and stock dividend workflows',
        skills: [
          {
            id: '5',
            title: 'Dividend Announcement Processing',
            content: `# Dividend Announcement Processing

## Skill Information
- **Skill Name**: dividend_announcement_processing
- **Version**: 1.0.0
- **Category**: Corporate Actions
- **Complexity**: Intermediate

## Description
This skill enables AI agents to process dividend announcements from issuers, validate the information, and prepare entitlement calculations for shareholders.

## Prerequisites
- Access to issuer announcement systems
- Understanding of dividend types (cash, stock, special)
- Knowledge of record date, ex-date, and payment date concepts
- Familiarity with CUSIP/ISIN identifiers

## Inputs
- Issuer announcement document (PDF, XML, or structured data)
- Security identifier (CUSIP/ISIN)
- Announcement date
- Dividend type

## Outputs
- Validated dividend details
- Record date, ex-date, payment date
- Dividend rate per share
- Entitlement calculation ready for processing

## Step-by-Step Instructions

### 1. Receive and Parse Announcement
Extract key information from the issuer's dividend announcement:
- Company name and security identifier
- Dividend type (cash, stock, special)
- Dividend amount or rate
- Currency (for cash dividends)
- Important dates (declaration, record, ex, payment)

### 2. Validate Announcement Data
Verify the completeness and accuracy of the announcement:
- Confirm security identifier matches issuer
- Validate dividend rate is reasonable (compare to historical)
- Ensure all required dates are present and logical
- Check currency code is valid (ISO 4217)

### 3. Calculate Ex-Date
If ex-date is not provided, calculate using T+2 settlement:
- Ex-date = Record date - 2 business days
- Account for market holidays
- Verify against market calendar

### 4. Determine Shareholder Eligibility
Identify shareholders eligible for the dividend:
- Shareholders holding positions as of record date
- Exclude shares acquired on or after ex-date
- Consider beneficial vs registered ownership

### 5. Calculate Entitlements
Compute dividend entitlements per shareholder:
- Cash dividend: Shares owned × dividend per share
- Stock dividend: Shares owned × stock dividend ratio
- Apply tax withholding rules if applicable

### 6. Generate Entitlement File
Create output file for downstream processing:
- Shareholder ID
- Security identifier
- Number of shares
- Dividend amount
- Payment currency
- Tax withholding amount

## Error Handling
- **Missing data**: Flag announcement as incomplete, request clarification from issuer
- **Invalid dates**: Alert operations team, hold processing until resolved
- **Mismatched security**: Verify CUSIP/ISIN, contact issuer if discrepancy exists
- **Calculation errors**: Log error, trigger manual review

## Best Practices
- Always cross-reference with previous dividend announcements for the same issuer
- Maintain audit trail of all data transformations
- Flag unusual dividend rates (>10% variance from historical average)
- Coordinate with tax team for withholding requirements

## Example Usage
\`\`\`
Input: AAPL dividend announcement
- Security: CUSIP 037833100 (Apple Inc.)
- Type: Cash dividend
- Rate: $0.24 per share
- Record Date: 2024-05-13
- Payment Date: 2024-05-16

Processing:
1. Validate CUSIP matches Apple Inc. ✓
2. Calculate ex-date: 2024-05-09 (2 business days before record)
3. Identify eligible shareholders (positions as of 2024-05-13)
4. Calculate: 1,000 shares × $0.24 = $240.00
5. Generate entitlement record

Output: Entitlement file ready for payment processing
\`\`\`

## Related Skills
- dividend_payment_processing
- stock_dividend_allocation
- tax_withholding_calculation

## References
- DTCC Corporate Actions Guidelines
- ISO 15022 Corporate Actions Standards
- Internal SOP: CA-DIV-001`,
            description: 'Comprehensive skill for processing dividend announcements following agentskills.io specification',
            version: '1.0.0',
            complexity: 'Intermediate',
            category: 'Corporate Actions',
            addedDate: new Date('2024-02-15')
          },
          {
            id: '6',
            title: 'Merger & Acquisition Event Processing',
            content: `# Merger & Acquisition Event Processing

## Skill Information
- **Skill Name**: merger_acquisition_processing
- **Version**: 1.0.0
- **Category**: Corporate Actions
- **Complexity**: Advanced

## Description
This skill enables AI agents to process merger and acquisition corporate actions, including tender offers, cash mergers, stock-for-stock exchanges, and spin-offs. Handles complex reorganization scenarios with multiple securities.

## Prerequisites
- Understanding of M&A transaction structures
- Knowledge of CUSIP/ISIN allocation process
- Familiarity with exchange ratios and tender offer mechanics
- Access to regulatory filing systems (SEC, etc.)

## Inputs
- M&A announcement or regulatory filing
- Acquiring company identifier
- Target company identifier
- Transaction type (cash, stock, mixed)
- Exchange ratio or offer price
- Effective date

## Outputs
- Processed corporate action event
- Security position adjustments
- Cash and stock entitlements
- New security allocations
- Fractional share handling instructions

## Step-by-Step Instructions

### 1. Classify Transaction Type
Determine the specific M&A structure:
- **Cash Merger**: Target shareholders receive cash consideration
- **Stock-for-Stock**: Exchange target shares for acquirer shares
- **Mixed Consideration**: Combination of cash and stock
- **Tender Offer**: Voluntary exchange with acceptance period
- **Spin-off**: Distribution of subsidiary shares to parent shareholders

### 2. Extract Transaction Terms
Parse the announcement for key details:
- Exchange ratio (e.g., 0.5 shares of acquirer for each target share)
- Cash consideration per share
- Election options (cash vs stock choice)
- Proration rules if oversubscribed
- Treatment of fractional shares

### 3. Validate Effective Date
Confirm the merger effective date and related timelines:
- Announcement date
- Shareholder vote date (if applicable)
- Effective/closing date
- Settlement date for new securities
- Deadline for elections (if applicable)

### 4. Process Shareholder Elections
If shareholders have choice of consideration:
- Capture shareholder elections (cash vs stock preference)
- Apply proration if elections exceed available pool
- Default non-responders to standard terms
- Generate election summary report

### 5. Calculate Entitlements
Determine what each shareholder receives:
- **Stock component**: Target shares × exchange ratio = New acquirer shares
- **Cash component**: Target shares × cash per share = Cash payment
- **Fractional shares**: Apply rounding rules or cash-in-lieu
- **Mixed**: Apply election percentages and proration

### 6. Execute Security Movements
Process the actual position changes:
- Debit target company shares from accounts
- Credit new acquirer shares (if applicable)
- Process cash payments
- Handle fractional share payments
- Update CUSIP/ISIN in system

### 7. Reconcile Positions
Verify all movements balance:
- Total target shares in = Total consideration out
- Cash payments match calculations
- New shares issued match exchange ratio
- No orphaned positions remain

### 8. Generate Reporting
Create comprehensive transaction report:
- Shareholder-level detail of exchanges
- Aggregate cash and stock movements
- Tax reporting information (Form 1099-B data)
- Audit trail of all calculations

## Error Handling
- **Missing exchange ratio**: Halt processing, request clarification from corporate actions team
- **CUSIP not allocated**: Coordinate with CUSIP Service Bureau, hold until new CUSIP assigned
- **Fractional share errors**: Flag for manual review, ensure cash-in-lieu calculated correctly
- **Unbalanced positions**: Generate exception report, investigate discrepancy

## Complex Scenarios

### Scenario: Stock-for-Stock with Cash Election
XYZ Corp acquires ABC Corp:
- Terms: 0.75 shares of XYZ per ABC share OR $50 cash per ABC share
- Maximum cash pool: $100 million
- Proration: If cash elections exceed pool, prorate to available amount

Processing:
1. Collect elections from shareholders
2. Calculate total cash elected: 2.5M shares × $50 = $125M
3. Apply proration: ($100M / $125M) = 80% cash, 20% stock
4. Shareholder with 100 ABC shares who elected cash receives:
   - Cash: 100 × $50 × 80% = $4,000
   - Stock: 100 × 0.75 × 20% = 15 XYZ shares

### Scenario: Three-Way Merger with Spin-off
More complex structure requiring careful tracking of multiple security movements.

## Best Practices
- Maintain detailed audit log of all position changes
- Cross-reference with regulatory filings (Form S-4, prospectus)
- Coordinate with tax team early for 1099-B reporting
- Test calculations with small sample before bulk processing
- Communicate timeline and impacts to client services team

## Example Usage
\`\`\`
Input: Microsoft (MSFT) acquires LinkedIn (LNKD)
- Transaction: All-cash tender offer
- Offer Price: $196.00 per LNKD share
- Effective Date: 2024-06-15
- Target shares: 1,000 LNKD

Processing:
1. Classify: Cash merger
2. Validate: Effective date confirmed
3. Calculate: 1,000 shares × $196.00 = $196,000 cash
4. Execute: 
   - Debit 1,000 LNKD shares
   - Credit $196,000 cash to account
5. Reconcile: Positions balanced ✓
6. Report: Generate tax statement for $196,000 proceeds

Output: Account updated, cash deposited, tax reporting complete
\`\`\`

## Related Skills
- tender_offer_processing
- spin_off_distribution
- rights_offering_processing
- reverse_stock_split

## References
- SEC M&A Disclosure Requirements
- DTCC Voluntary Corporate Actions Guidelines
- ISO 15022 MT564/MT566 Message Standards
- Internal SOP: CA-MA-001`,
            description: 'Advanced skill for handling complex merger and acquisition corporate actions following agentskills.io specification',
            version: '1.0.0',
            complexity: 'Advanced',
            category: 'Corporate Actions',
            addedDate: new Date('2024-02-18')
          }
        ]
      }
    ]
  },
  {
    id: 'fx',
    name: 'Foreign Exchange (FX)',
    description: 'Skills for FX operations',
    processes: [
      {
        id: 'fx-settlement',
        name: 'FX Settlement',
        description: 'Foreign exchange trade settlement',
        skills: []
      }
    ]
  }
];

export function Skills({ theme }: SkillsProps) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(domains[1]); // Default to Corporate Actions
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(domains[1].processes[0]); // Default to Dividend Processing
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingSkill, setViewingSkill] = useState<Skill | null>(null);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner':
        return theme === 'dark' ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100';
      case 'Intermediate':
        return theme === 'dark' ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-600 bg-yellow-100';
      case 'Advanced':
        return theme === 'dark' ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-100';
      default:
        return theme === 'dark' ? 'text-gray-400 bg-gray-900/30' : 'text-gray-600 bg-gray-100';
    }
  };

  const handleSkillClick = (skill: Skill) => {
    setViewingSkill(skill);
  };

  const handleAddProcess = (processName: string, description: string) => {
    if (!selectedDomain) return;

    const newProcess: Process = {
      id: `process-${Date.now()}`,
      name: processName,
      description,
      skills: []
    };

    setDomains(domains.map(domain => 
      domain.id === selectedDomain.id
        ? { ...domain, processes: [...domain.processes, newProcess] }
        : domain
    ));

    setShowAddProcessModal(false);
  };

  const handleAddSkill = (skillData: Omit<Skill, 'id' | 'addedDate'>) => {
    if (!selectedProcess || !selectedDomain) return;

    const newSkill: Skill = {
      ...skillData,
      id: `skill-${Date.now()}`,
      addedDate: new Date()
    };

    setDomains(domains.map(domain =>
      domain.id === selectedDomain.id
        ? {
            ...domain,
            processes: domain.processes.map(process =>
              process.id === selectedProcess.id
                ? { ...process, skills: [...process.skills, newSkill] }
                : process
            )
          }
        : domain
    ));

    setShowAddSkillModal(false);
  };

  const handleSaveSkill = (skillId: string, newContent: string) => {
    if (!selectedProcess || !selectedDomain) return;

    setDomains(domains.map(domain =>
      domain.id === selectedDomain.id
        ? {
            ...domain,
            processes: domain.processes.map(process =>
              process.id === selectedProcess.id
                ? {
                    ...process,
                    skills: process.skills.map(skill =>
                      skill.id === skillId
                        ? { ...skill, content: newContent }
                        : skill
                    )
                  }
                : process
            )
          }
        : domain
    ));
  };

  return (
    <div className={`min-h-screen p-6 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-50'
    }`}>
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Skills
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Curate and manage agent skills following agentskills.io specification
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Domains */}
          <div className={`col-span-3 rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Domains
              </h3>
            </div>

            <div className="space-y-2">
              {domains.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => {
                    setSelectedDomain(domain);
                    setSelectedProcess(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDomain?.id === domain.id
                      ? theme === 'dark'
                        ? 'bg-cyan-900/30 border-cyan-600 border'
                        : 'bg-cyan-50 border-cyan-500 border'
                      : theme === 'dark'
                      ? 'hover:bg-gray-800 border border-transparent'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Folder className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      selectedDomain?.id === domain.id
                        ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm mb-1 ${
                        selectedDomain?.id === domain.id
                          ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                          : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {domain.name}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {domain.processes.length} processes
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle Column - Processes */}
          <div className={`col-span-4 rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedDomain ? `${selectedDomain.name} - Processes` : 'Processes'}
              </h3>
              {selectedDomain && (
                <button
                  onClick={() => setShowAddProcessModal(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  }`}
                  title="Add Process"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedDomain ? (
              <div className="space-y-2">
                {selectedDomain.processes.map(process => (
                  <button
                    key={process.id}
                    onClick={() => setSelectedProcess(process)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedProcess?.id === process.id
                        ? theme === 'dark'
                          ? 'bg-cyan-900/30 border-cyan-600 border'
                          : 'bg-cyan-50 border-cyan-500 border'
                        : theme === 'dark'
                        ? 'hover:bg-gray-800 border border-transparent'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        selectedProcess?.id === process.id
                          ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm mb-1 ${
                          selectedProcess?.id === process.id
                            ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                            : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {process.name}
                        </div>
                        <div className={`text-xs mb-2 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {process.description}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                          {process.skills.length} skills
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Select a domain to view processes
              </div>
            )}
          </div>

          {/* Right Column - Skills */}
          <div className={`col-span-5 rounded-lg p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {selectedProcess ? `${selectedProcess.name} - Skills` : 'Skills'}
              </h3>
              {selectedProcess && (
                <button
                  onClick={() => setShowAddSkillModal(true)}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                    theme === 'dark'
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              )}
            </div>

            {selectedProcess ? (
              selectedProcess.skills.length > 0 ? (
                <div className="space-y-3">
                  {selectedProcess.skills.map(skill => (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        theme === 'dark'
                          ? 'border-gray-800 hover:border-gray-700 hover:bg-gray-800'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleSkillClick(skill)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          theme === 'dark' ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-600 bg-yellow-100'
                        }`}>
                          <Code className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className={`font-medium text-sm mb-1 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {skill.title}
                              </div>
                              <div className={`text-xs mb-2 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                {skill.description}
                              </div>
                            </div>
                            <ExternalLink className={`w-4 h-4 flex-shrink-0 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${
                            theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                          }`}>
                            <span className={`px-2 py-0.5 rounded ${getComplexityColor(skill.complexity)}`}>
                              {skill.complexity}
                            </span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                              v{skill.version}
                            </span>
                            <span>•</span>
                            <span>Added {skill.addedDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-12 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <FileCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No skills added yet</p>
                  <p className="text-xs mt-1">Click "Add Skill" to get started</p>
                </div>
              )
            ) : (
              <div className={`text-center py-12 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                Select a process to view skills
              </div>
            )}
          </div>
        </div>

        {/* Add Skill Modal */}
        {showAddSkillModal && (
          <AddSkillModal
            theme={theme}
            onClose={() => setShowAddSkillModal(false)}
            onAdd={handleAddSkill}
          />
        )}

        {/* Add Process Modal */}
        {showAddProcessModal && (
          <AddProcessModal
            theme={theme}
            onClose={() => setShowAddProcessModal(false)}
            onAdd={handleAddProcess}
          />
        )}

        {/* View/Edit Skill Modal */}
        {viewingSkill && (
          <SkillsEditor
            theme={theme}
            onClose={() => setViewingSkill(null)}
            skillTitle={viewingSkill.title}
            skillContent={viewingSkill.content}
            onSave={(newContent: string) => {
              handleSaveSkill(viewingSkill.id, newContent);
              setViewingSkill(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Add Skill Modal Component
function AddSkillModal({ 
  theme, 
  onClose, 
  onAdd 
}: { 
  theme: 'dark' | 'light'; 
  onClose: () => void; 
  onAdd: (skill: Omit<Skill, 'id' | 'addedDate'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [complexity, setComplexity] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content && category) {
      onAdd({ title, content, description, version, complexity, category });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Add Skill
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Skill Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter skill title"
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          {/* Complexity and Version */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Complexity *
              </label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Version *
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                required
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Category *
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Corporate Actions"
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          {/* Content */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Skill Content (Markdown) *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter skill documentation in markdown format following agentskills.io specification"
              required
              rows={10}
              className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the skill"
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Process Modal Component
function AddProcessModal({ 
  theme, 
  onClose, 
  onAdd 
}: { 
  theme: 'dark' | 'light'; 
  onClose: () => void; 
  onAdd: (name: string, description: string) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onAdd(name, description);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg max-w-lg w-full ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Add Process
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Process Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter process name"
              required
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this process"
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              Add Process
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
