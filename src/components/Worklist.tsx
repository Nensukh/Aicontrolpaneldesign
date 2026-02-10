import { useState, useEffect } from 'react';
import {
  Mail,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Filter,
  Send,
  Eye,
  Search,
  Tag,
  User,
  Bot,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  ChevronDown,
  ChevronUp,
  Inbox,
  Users,
  Building2,
  PanelRightClose,
  PanelRight,
  X,
  Activity,
  TrendingUp,
  UserCheck,
  Pause,
} from 'lucide-react';
import { QueueFilter } from './QueueFilter';

export interface WorkItem {
  id: string;
  type: 'email' | 'task' | 'exception';
  subject: string;
  from?: string;
  to?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'waiting-approval' | 'completed' | 'failed';
  assignedAgent?: string;
  keywords: string[];
  createdAt: string;
  businessFunction: string;
  team: string;
  queue: string;
  body?: string;
  attachments?: string[];
  agentSteps?: AgentStep[];
  awaitingInput?: boolean;
  inputRequest?: {
    question: string;
    type: 'approval' | 'input' | 'context';
  };
}

export interface AgentStep {
  id: string;
  agentName: string;
  action: string;
  input: string;
  output: string;
  confidence: number;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'failed';
}

export interface QueueHierarchy {
  businessFunction: string;
  team: string;
  queue: string;
}

export interface QueueSelection {
  type: 'businessFunction' | 'team' | 'queue';
  businessFunction: string;
  team?: string;
  queue?: string;
}

interface WorklistProps {
  theme: 'dark' | 'light';
  filter?: {
    status?: string;
    priority?: string;
  };
}

export const mockWorkItems: WorkItem[] = [
  {
    id: 'WI-001',
    type: 'email',
    subject: 'Customer refund request - Order #12345',
    from: 'customer@example.com',
    to: 'support@company.com',
    priority: 'high',
    status: 'pending',
    keywords: ['refund', 'order', 'customer-service'],
    createdAt: '2026-02-08T10:30:00Z',
    businessFunction: 'Customer Service',
    team: 'Support Team A',
    queue: 'Refunds & Returns',
    body: 'Dear Support Team,\n\nI would like to request a refund for my recent order #12345. The product arrived damaged and does not match the description on your website.\n\nI have attached photos of the damaged item. Please process my refund as soon as possible.\n\nThank you,\nJohn Smith',
    attachments: ['photo1.jpg', 'photo2.jpg'],
  },
  {
    id: 'WI-002',
    type: 'email',
    subject: 'Account access issue - Unable to login',
    from: 'jane.doe@business.com',
    to: 'support@company.com',
    priority: 'medium',
    status: 'processing',
    assignedAgent: 'Support Agent',
    keywords: ['login', 'account', 'access'],
    createdAt: '2026-02-08T09:15:00Z',
    businessFunction: 'Customer Service',
    team: 'Support Team A',
    queue: 'Account Issues',
    body: 'Hello,\n\nI am unable to access my account. Every time I try to login, I receive an "Invalid credentials" error even though I am certain my password is correct.\n\nCould you please help me resolve this issue?\n\nBest regards,\nJane Doe',
    agentSteps: [
      {
        id: 'step-1',
        agentName: 'Support Agent',
        action: 'Classify Request',
        input: 'Email content and subject analysis',
        output: 'Category: Account Access, Priority: Medium, Sentiment: Neutral',
        confidence: 95,
        timestamp: '2026-02-08T09:16:00Z',
        status: 'completed',
      },
      {
        id: 'step-2',
        agentName: 'Support Agent',
        action: 'Check Account Status',
        input: 'User email: jane.doe@business.com',
        output: 'Account found, Status: Active, No login blocks detected',
        confidence: 98,
        timestamp: '2026-02-08T09:16:30Z',
        status: 'completed',
      },
      {
        id: 'step-3',
        agentName: 'Support Agent',
        action: 'Generate Response',
        input: 'Account status and troubleshooting steps',
        output: 'Draft email with password reset instructions and cache clearing steps',
        confidence: 92,
        timestamp: '2026-02-08T09:17:00Z',
        status: 'in-progress',
      },
    ],
  },
  {
    id: 'WI-003',
    type: 'task',
    subject: 'Review new vendor contract terms',
    priority: 'high',
    status: 'pending',
    keywords: ['contract', 'vendor', 'legal-review'],
    createdAt: '2026-02-08T08:00:00Z',
    businessFunction: 'Finance',
    team: 'Procurement Team',
    queue: 'Contract Review',
    body: 'Please review the attached vendor contract for compliance and approval. Focus on payment terms, SLA commitments, and liability clauses.',
    attachments: ['vendor_contract_v2.pdf'],
  },
  {
    id: 'WI-004',
    type: 'exception',
    subject: 'Payment processing failed - Retry needed',
    priority: 'high',
    status: 'waiting-approval',
    assignedAgent: 'Payment Processor Agent',
    keywords: ['payment', 'failed', 'exception'],
    createdAt: '2026-02-08T11:45:00Z',
    businessFunction: 'Finance',
    team: 'Payments Team',
    queue: 'Payment Exceptions',
    body: 'Automated payment processing failed for invoice INV-5678 due to insufficient funds. Agent recommends sending reminder email and retrying in 24 hours.',
    awaitingInput: true,
    inputRequest: {
      question: 'Should I proceed with sending a payment reminder email to the customer and schedule a retry in 24 hours?',
      type: 'approval',
    },
    agentSteps: [
      {
        id: 'step-1',
        agentName: 'Payment Processor Agent',
        action: 'Process Payment',
        input: 'Invoice: INV-5678, Amount: $1,250.00',
        output: 'Payment failed - Insufficient funds',
        confidence: 100,
        timestamp: '2026-02-08T11:45:00Z',
        status: 'failed',
      },
      {
        id: 'step-2',
        agentName: 'Payment Processor Agent',
        action: 'Analyze Failure Reason',
        input: 'Error code: INSUFFICIENT_FUNDS',
        output: 'Recommended action: Send reminder, retry in 24h',
        confidence: 88,
        timestamp: '2026-02-08T11:45:30Z',
        status: 'completed',
      },
    ],
  },
  {
    id: 'WI-005',
    type: 'email',
    subject: 'Product inquiry - Enterprise pricing',
    from: 'cto@techcorp.com',
    to: 'sales@company.com',
    priority: 'medium',
    status: 'pending',
    keywords: ['sales', 'enterprise', 'pricing'],
    createdAt: '2026-02-08T07:30:00Z',
    businessFunction: 'Sales',
    team: 'Enterprise Sales',
    queue: 'Pricing Inquiries',
    body: 'Hi,\n\nWe are interested in your enterprise plan for our team of 500+ users. Could you provide custom pricing and information about volume discounts?\n\nWe would also like to schedule a demo.\n\nThanks,\nMichael Chen\nCTO, TechCorp',
  },
  {
    id: 'WI-006',
    type: 'email',
    subject: 'Return label request - Order #67890',
    from: 'sarah.johnson@email.com',
    to: 'support@company.com',
    priority: 'low',
    status: 'pending',
    keywords: ['return', 'label', 'shipping'],
    createdAt: '2026-02-08T11:20:00Z',
    businessFunction: 'Customer Service',
    team: 'Support Team A',
    queue: 'Refunds & Returns',
    body: 'Hello,\\n\\nI need to return an item from order #67890. The size doesn\'t fit properly. Could you please send me a prepaid return shipping label?\\n\\nThank you!\\nSarah Johnson',
  },
  {
    id: 'WI-007',
    type: 'email',
    subject: 'Password reset not working',
    from: 'mike.brown@company.net',
    to: 'support@company.com',
    priority: 'medium',
    status: 'pending',
    keywords: ['password', 'reset', 'email'],
    createdAt: '2026-02-08T12:45:00Z',
    businessFunction: 'Customer Service',
    team: 'Support Team A',
    queue: 'Account Issues',
    body: 'Hi Support,\\n\\nI requested a password reset 30 minutes ago but haven\'t received the email yet. I checked my spam folder and it\'s not there either. Can you help?\\n\\nMike Brown',
  },
  {
    id: 'WI-008',
    type: 'email',
    subject: 'Wrong item shipped - Need exchange',
    from: 'emily.davis@mail.com',
    to: 'support@company.com',
    priority: 'high',
    status: 'waiting-approval',
    assignedAgent: 'Returns Agent',
    keywords: ['wrong-item', 'exchange', 'shipping-error'],
    createdAt: '2026-02-08T08:50:00Z',
    businessFunction: 'Customer Service',
    team: 'Support Team A',
    queue: 'Refunds & Returns',
    body: 'I ordered a blue sweater (size M) but received a red dress instead. Order #45678. I need the correct item shipped ASAP as this was a gift. Please arrange an exchange.\\n\\nEmily Davis',
    awaitingInput: true,
    inputRequest: {
      question: 'Customer requested expedited shipping for the replacement. Should we waive the expedited shipping fee?',
      type: 'approval',
    },
  },
  {
    id: 'WI-009',
    type: 'exception',
    subject: 'Multiple failed login attempts detected',
    priority: 'high',
    status: 'processing',
    assignedAgent: 'Security Agent',
    keywords: ['security', 'login-attempts', 'suspicious-activity'],
    createdAt: '2026-02-08T13:10:00Z',
    businessFunction: 'Customer Service',
    team: 'Support Team B',
    queue: 'Technical Support',
    body: 'Automated security alert: User account lisa.white@email.com has had 8 failed login attempts in the past 15 minutes from multiple IP addresses. Agent recommends temporary account lock and verification email.',
    agentSteps: [
      {
        id: 'step-1',
        agentName: 'Security Agent',
        action: 'Detect Anomaly',
        input: 'Login activity monitoring for account: lisa.white@email.com',
        output: 'Anomaly detected: 8 failed attempts, 3 different IPs, 15-minute window',
        confidence: 99,
        timestamp: '2026-02-08T13:10:00Z',
        status: 'completed',
      },
      {
        id: 'step-2',
        agentName: 'Security Agent',
        action: 'Apply Security Measure',
        input: 'Lock account temporarily',
        output: 'Account locked for 1 hour, verification email queued',
        confidence: 100,
        timestamp: '2026-02-08T13:10:30Z',
        status: 'completed',
      },
    ],
  },
  {
    id: 'WI-010',
    type: 'email',
    subject: 'Subscription cancellation request',
    from: 'robert.clark@startup.io',
    to: 'support@company.com',
    priority: 'medium',
    status: 'completed',
    assignedAgent: 'Retention Agent',
    keywords: ['cancellation', 'subscription', 'retention'],
    createdAt: '2026-02-08T06:30:00Z',
    businessFunction: 'Customer Service',
    team: 'Support Team A',
    queue: 'Account Issues',
    body: 'Hi,\\n\\nI\'d like to cancel my monthly subscription. The service has been great, but we\'re cutting costs right now. Please confirm the cancellation and let me know the last billing date.\\n\\nThanks,\\nRobert Clark',
    agentSteps: [
      {
        id: 'step-1',
        agentName: 'Retention Agent',
        action: 'Analyze Cancellation Reason',
        input: 'Email content analysis',
        output: 'Reason: Cost reduction, Sentiment: Positive about service, Retention opportunity: High',
        confidence: 87,
        timestamp: '2026-02-08T06:31:00Z',
        status: 'completed',
      },
      {
        id: 'step-2',
        agentName: 'Retention Agent',
        action: 'Generate Retention Offer',
        input: 'Customer tenure: 8 months, Payment history: Good',
        output: 'Offer: 25% discount for 3 months if customer stays',
        confidence: 82,
        timestamp: '2026-02-08T06:31:30Z',
        status: 'completed',
      },
      {
        id: 'step-3',
        agentName: 'Retention Agent',
        action: 'Send Response',
        input: 'Retention offer email template',
        output: 'Email sent with retention offer and cancellation instructions',
        confidence: 95,
        timestamp: '2026-02-08T06:32:00Z',
        status: 'completed',
      },
    ],
  },
];

export const queueHierarchies: QueueHierarchy[] = [
  { businessFunction: 'Customer Service', team: 'Support Team A', queue: 'Refunds & Returns' },
  { businessFunction: 'Customer Service', team: 'Support Team A', queue: 'Account Issues' },
  { businessFunction: 'Customer Service', team: 'Support Team B', queue: 'Technical Support' },
  { businessFunction: 'Finance', team: 'Procurement Team', queue: 'Contract Review' },
  { businessFunction: 'Finance', team: 'Payments Team', queue: 'Payment Exceptions' },
  { businessFunction: 'Finance', team: 'Payments Team', queue: 'Invoice Processing' },
  { businessFunction: 'Sales', team: 'Enterprise Sales', queue: 'Pricing Inquiries' },
  { businessFunction: 'Sales', team: 'SMB Sales', queue: 'Demo Requests' },
];

export function Worklist({ theme, filter }: WorklistProps) {
  const [selectedQueues, setSelectedQueues] = useState<QueueSelection[]>([
    { type: 'queue', businessFunction: 'Customer Service', team: 'Support Team A', queue: 'Refunds & Returns' }
  ]);
  const [selectedWorkItems, setSelectedWorkItems] = useState<string[]>([]);
  const [previewWorkItem, setPreviewWorkItem] = useState<WorkItem | null>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number>(0);
  const [showPreviewPane, setShowPreviewPane] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>(filter?.priority || 'all');
  const [filterStatus, setFilterStatus] = useState<string>(filter?.status || 'all');
  const [expandedSteps, setExpandedSteps] = useState<{ [key: string]: boolean }>({});
  const [humanInput, setHumanInput] = useState('');
  const [showWorkItemDetails, setShowWorkItemDetails] = useState(true);
  const [showAgentSteps, setShowAgentSteps] = useState(true);
  const [listWidth, setListWidth] = useState(50); // Percentage
  const [isDragging, setIsDragging] = useState(false);

  const filteredWorkItems = mockWorkItems.filter((item) => {
    // Check if item matches any selected queue
    const matchesQueue = selectedQueues.some((selection) => {
      if (selection.type === 'businessFunction') {
        return item.businessFunction === selection.businessFunction;
      } else if (selection.type === 'team') {
        return item.businessFunction === selection.businessFunction && item.team === selection.team;
      } else {
        return (
          item.businessFunction === selection.businessFunction &&
          item.team === selection.team &&
          item.queue === selection.queue
        );
      }
    });

    const matchesSearch =
      searchTerm === '' ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesQueue && matchesSearch && matchesPriority && matchesStatus;
  });

  const handleSelectWorkItem = (id: string) => {
    setSelectedWorkItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedWorkItems.length === filteredWorkItems.length) {
      setSelectedWorkItems([]);
    } else {
      setSelectedWorkItems(filteredWorkItems.map((i) => i.id));
    }
  };

  const handleSubmitToAgent = () => {
    alert(`Submitting ${selectedWorkItems.length} work item(s) to agent for processing...`);
    setSelectedWorkItems([]);
  };

  const handleApproval = (approved: boolean) => {
    alert(approved ? 'Request approved!' : 'Request rejected.');
    setPreviewWorkItem(null);
  };

  const handleSubmitInput = () => {
    alert(`Submitting input: ${humanInput}`);
    setHumanInput('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'waiting-approval':
        return <MessageSquare className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
      case 'processing':
        return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'waiting-approval':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'completed':
        return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'failed':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      default:
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700';
      case 'medium':
        return theme === 'dark' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
      case 'low':
        return theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600';
      default:
        return theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'task':
        return <FileText className="w-4 h-4" />;
      case 'exception':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };



  // Draggable divider handlers
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const container = document.querySelector('.worklist-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 30% and 70%
    if (newWidth >= 30 && newWidth <= 70) {
      setListWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  // Auto-preview first item when preview pane is shown and items are available
  useEffect(() => {
    if (showPreviewPane && filteredWorkItems.length > 0 && !previewWorkItem) {
      setPreviewWorkItem(filteredWorkItems[0]);
      setFocusedItemIndex(0);
    }
  }, [showPreviewPane, filteredWorkItems, previewWorkItem]);

  // Update preview when focused item changes
  useEffect(() => {
    if (showPreviewPane && filteredWorkItems.length > 0 && focusedItemIndex >= 0 && focusedItemIndex < filteredWorkItems.length) {
      setPreviewWorkItem(filteredWorkItems[focusedItemIndex]);
    }
  }, [focusedItemIndex, showPreviewPane, filteredWorkItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredWorkItems.length === 0) return;

      // ESC key to close preview
      if (e.key === 'Escape' && previewWorkItem) {
        e.preventDefault();
        setPreviewWorkItem(null);
        return;
      }

      if (!showPreviewPane || !previewWorkItem) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedItemIndex((prev) => {
          const next = Math.min(prev + 1, filteredWorkItems.length - 1);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedItemIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPreviewPane, filteredWorkItems.length, previewWorkItem]);

  // Reset focused index when filters change
  useEffect(() => {
    setFocusedItemIndex(0);
    if (showPreviewPane && filteredWorkItems.length > 0) {
      setPreviewWorkItem(filteredWorkItems[0]);
    } else {
      setPreviewWorkItem(null);
    }
  }, [searchTerm, filterPriority, filterStatus, selectedQueues]);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold mb-1">Worklist</h2>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage work items and agent tasks
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Preview Toggle */}
            <button
              onClick={() => {
                const newShowPreviewPane = !showPreviewPane;
                setShowPreviewPane(newShowPreviewPane);
                if (newShowPreviewPane && filteredWorkItems.length > 0) {
                  // Auto-preview first item when enabling preview pane
                  setPreviewWorkItem(filteredWorkItems[0]);
                  setFocusedItemIndex(0);
                }
              }}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={showPreviewPane ? 'Hide preview pane' : 'Show preview pane'}
            >
              {showPreviewPane ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRight className="w-4 h-4" />
              )}
            </button>

            {selectedWorkItems.length > 0 && (
              <button
                onClick={handleSubmitToAgent}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                Submit {selectedWorkItems.length} to Agent
              </button>
            )}
          </div>
        </div>

        {/* Queue Filter */}
        <QueueFilter 
          theme={theme}
          selectedQueues={selectedQueues}
          setSelectedQueues={setSelectedQueues}
          allowMultiple={false}
        />

        {/* Filters and Search */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search by subject or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-100 placeholder-gray-500'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-100'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              theme === 'dark'
                ? 'bg-gray-800 text-gray-100'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="waiting-approval">Waiting Approval</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden worklist-container">
        {/* Work Items List */}
        <div 
          className="overflow-y-auto p-4"
          style={{ 
            width: previewWorkItem ? `${listWidth}%` : '100%',
            transition: isDragging ? 'none' : 'width 0.2s'
          }}
        >
          <div className={`rounded-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}>
            {/* Table Header */}
            <div className={`grid grid-cols-11 gap-4 p-3 text-xs font-semibold ${
              theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={selectedWorkItems.length === filteredWorkItems.length && filteredWorkItems.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </div>
              <div className="col-span-1">Type</div>
              <div className="col-span-4">Subject</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-2">Created</div>
            </div>

            {/* Table Body */}
            <div className={`divide-y ${
              theme === 'dark' ? 'divide-gray-800' : 'divide-gray-100'
            }`}>
              {filteredWorkItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setFocusedItemIndex(index);
                    setPreviewWorkItem(item);
                  }}
                  className={`grid grid-cols-11 gap-4 p-3 items-center text-sm transition-colors cursor-pointer ${
                    previewWorkItem?.id === item.id
                      ? theme === 'dark'
                        ? 'bg-cyan-900/30 border-l-2 border-cyan-500'
                        : 'bg-cyan-50 border-l-2 border-cyan-600'
                      : theme === 'dark'
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedWorkItems.includes(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectWorkItem(item.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                  </div>
                  <div className="col-span-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      {getTypeIcon(item.type)}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {item.subject}
                    </div>
                    {item.from && (
                      <div className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        From: {item.from}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {item.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className={`px-2 py-0.5 rounded text-xs ${
                            theme === 'dark'
                              ? 'bg-gray-800 text-gray-400'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className={`flex items-center gap-2 ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="capitalize text-xs">
                        {item.status.replace('-', ' ')}
                      </span>
                    </div>
                    {item.assignedAgent && (
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        <Bot className="w-3 h-3" />
                        {item.assignedAgent}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className={`col-span-2 text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {filteredWorkItems.length === 0 && (
              <div className="p-12 text-center">
                <Inbox className={`w-12 h-12 mx-auto mb-3 ${
                  theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
                }`} />
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  No work items in this queue
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Draggable Divider */}
        {previewWorkItem && (
          <div
            className={`w-1 cursor-col-resize flex-shrink-0 relative group ${
              theme === 'dark' ? 'bg-gray-800 hover:bg-cyan-600' : 'bg-gray-300 hover:bg-cyan-500'
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className={`absolute inset-y-0 -left-1 -right-1 ${isDragging ? 'bg-cyan-500' : ''}`} />
          </div>
        )}

        {/* Preview Panel */}
        {previewWorkItem && (
          <div 
            className={`overflow-y-auto p-4 ${
              theme === 'dark' ? 'bg-black' : 'bg-gray-50'
            }`}
            style={{ 
              width: `${100 - listWidth}%`,
              transition: isDragging ? 'none' : 'width 0.2s'
            }}
          >
            <div className={`rounded-lg p-4 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}>
              {/* Preview Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(previewWorkItem.type)}
                    <h3 className="text-base font-semibold">{previewWorkItem.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getPriorityColor(previewWorkItem.priority)}`}>
                      {previewWorkItem.priority}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(previewWorkItem.status)}`}>
                      {getStatusIcon(previewWorkItem.status)}
                      {previewWorkItem.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewWorkItem(null)}
                  className={`p-2 rounded transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                      : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Work Item Details Section */}
              <div className={`mb-4 rounded-lg overflow-hidden border ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <button
                  onClick={() => setShowWorkItemDetails(!showWorkItemDetails)}
                  className={`w-full flex items-center justify-between p-3 transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-750'
                      : 'bg-gray-100 hover:bg-gray-150'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-semibold text-sm">Work Item Details</span>
                  </div>
                  {showWorkItemDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showWorkItemDetails && (
                  <div className={`p-4 space-y-4 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  }`}>
                    {/* Email Details */}
                    {previewWorkItem.type === 'email' && (
                      <div className={`p-3 rounded text-sm space-y-2 ${
                        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>From:</span>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{previewWorkItem.from}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>To:</span>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{previewWorkItem.to}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>Received:</span>
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {new Date(previewWorkItem.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Body */}
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {previewWorkItem.type === 'email' ? 'Email Body' : 'Description'}
                      </h4>
                      <div className={`p-3 rounded text-sm whitespace-pre-wrap ${
                        theme === 'dark' ? 'bg-black text-gray-300' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {previewWorkItem.body}
                      </div>
                    </div>

                    {/* Attachments */}
                    {previewWorkItem.attachments && previewWorkItem.attachments.length > 0 && (
                      <div>
                        <h4 className={`text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Attachments
                        </h4>
                        <div className="space-y-2">
                          {previewWorkItem.attachments.map((attachment, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 p-2 rounded text-sm ${
                                theme === 'dark' ? 'bg-black' : 'bg-gray-50'
                              }`}
                            >
                              <FileText className="w-4 h-4" />
                              <span>{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Keywords */}
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Keywords
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {previewWorkItem.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                              theme === 'dark'
                                ? 'bg-gray-800 text-gray-400'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Tag className="w-3 h-3" />
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Agent Execution Steps Section */}
              {previewWorkItem.agentSteps && previewWorkItem.agentSteps.length > 0 && (
                <div className={`mb-4 rounded-lg overflow-hidden border ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => setShowAgentSteps(!showAgentSteps)}
                    className={`w-full flex items-center justify-between p-3 transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-750'
                        : 'bg-gray-100 hover:bg-gray-150'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <span className="font-semibold text-sm">Agent Execution Steps</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        theme === 'dark' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
                      }`}>
                        {previewWorkItem.agentSteps.length}
                      </span>
                    </div>
                    {showAgentSteps ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showAgentSteps && (
                    <div className={`p-4 ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}>
                      <div className="space-y-3">
                        {previewWorkItem.agentSteps.map((step, stepIndex) => (
                          <div
                            key={step.id}
                            className={`rounded-lg overflow-hidden border ${
                              step.status === 'completed'
                                ? theme === 'dark'
                                  ? 'border-green-800 bg-green-950/20'
                                  : 'border-green-200 bg-green-50'
                                : step.status === 'in-progress'
                                ? theme === 'dark'
                                  ? 'border-blue-800 bg-blue-950/20'
                                  : 'border-blue-200 bg-blue-50'
                                : theme === 'dark'
                                ? 'border-red-800 bg-red-950/20'
                                : 'border-red-200 bg-red-50'
                            }`}
                          >
                            <button
                              onClick={() =>
                                setExpandedSteps((prev) => ({
                                  ...prev,
                                  [step.id]: !prev[step.id],
                                }))
                              }
                              className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                                theme === 'dark'
                                  ? 'hover:bg-white/5'
                                  : 'hover:bg-black/5'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {/* Step Number Badge */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                  step.status === 'completed'
                                    ? theme === 'dark'
                                      ? 'bg-green-900 text-green-300 border-2 border-green-700'
                                      : 'bg-green-200 text-green-800 border-2 border-green-400'
                                    : step.status === 'in-progress'
                                    ? theme === 'dark'
                                      ? 'bg-blue-900 text-blue-300 border-2 border-blue-700'
                                      : 'bg-blue-200 text-blue-800 border-2 border-blue-400'
                                    : theme === 'dark'
                                    ? 'bg-red-900 text-red-300 border-2 border-red-700'
                                    : 'bg-red-200 text-red-800 border-2 border-red-400'
                                }`}>
                                  {stepIndex + 1}
                                </div>

                                {/* Status Icon */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                                  step.status === 'completed'
                                    ? theme === 'dark'
                                      ? 'bg-green-900/70 text-green-400'
                                      : 'bg-green-200 text-green-700'
                                    : step.status === 'in-progress'
                                    ? theme === 'dark'
                                      ? 'bg-blue-900/70 text-blue-400'
                                      : 'bg-blue-200 text-blue-700'
                                    : theme === 'dark'
                                    ? 'bg-red-900/70 text-red-400'
                                    : 'bg-red-200 text-red-700'
                                }`}>
                                  {step.status === 'in-progress' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : step.status === 'completed' ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4" />
                                  )}
                                </div>

                                {/* Step Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Bot className={`w-4 h-4 ${
                                      theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                                    }`} />
                                    <span className={`font-bold text-sm ${
                                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                      {step.agentName}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      theme === 'dark' 
                                        ? 'bg-gray-800 text-gray-300' 
                                        : 'bg-white text-gray-700'
                                    }`}>
                                      {step.action}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-2">
                                    <div className={`text-xs font-medium ${
                                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                      Confidence: 
                                      <span className={`ml-1 px-2 py-0.5 rounded font-bold ${
                                        step.confidence >= 90
                                          ? theme === 'dark'
                                            ? 'bg-green-900 text-green-300'
                                            : 'bg-green-200 text-green-800'
                                          : step.confidence >= 70
                                          ? theme === 'dark'
                                            ? 'bg-yellow-900 text-yellow-300'
                                            : 'bg-yellow-200 text-yellow-800'
                                          : theme === 'dark'
                                          ? 'bg-red-900 text-red-300'
                                          : 'bg-red-200 text-red-800'
                                      }`}>
                                        {step.confidence}%
                                      </span>
                                    </div>
                                    <div className={`text-xs uppercase font-semibold tracking-wider px-2 py-1 rounded ${
                                      step.status === 'completed'
                                        ? theme === 'dark'
                                          ? 'bg-green-900 text-green-300'
                                          : 'bg-green-200 text-green-800'
                                        : step.status === 'in-progress'
                                        ? theme === 'dark'
                                          ? 'bg-blue-900 text-blue-300'
                                          : 'bg-blue-200 text-blue-800'
                                        : theme === 'dark'
                                        ? 'bg-red-900 text-red-300'
                                        : 'bg-red-200 text-red-800'
                                    }`}>
                                      {step.status.replace('-', ' ')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {expandedSteps[step.id] ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>

                            {expandedSteps[step.id] && (
                              <div className={`px-4 pb-4 space-y-3 text-sm border-t pt-3 ${
                                step.status === 'completed'
                                  ? theme === 'dark'
                                    ? 'border-green-800 bg-green-950/10'
                                    : 'border-green-200 bg-green-50/50'
                                  : step.status === 'in-progress'
                                  ? theme === 'dark'
                                    ? 'border-blue-800 bg-blue-950/10'
                                    : 'border-blue-200 bg-blue-50/50'
                                  : theme === 'dark'
                                  ? 'border-red-800 bg-red-950/10'
                                  : 'border-red-200 bg-red-50/50'
                              }`}>
                                <div>
                                  <div className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    Input
                                  </div>
                                  <div className={`p-3 rounded-lg text-xs font-mono ${
                                    theme === 'dark' 
                                      ? 'bg-gray-900 text-gray-300' 
                                      : 'bg-white text-gray-700'
                                  }`}>
                                    {step.input}
                                  </div>
                                </div>
                                <div>
                                  <div className={`text-xs font-bold mb-2 uppercase tracking-wide ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    Output
                                  </div>
                                  <div className={`p-3 rounded-lg text-xs font-mono ${
                                    theme === 'dark' 
                                      ? 'bg-gray-900 text-gray-300' 
                                      : 'bg-white text-gray-700'
                                  }`}>
                                    {step.output}
                                  </div>
                                </div>
                                <div className={`flex items-center gap-2 text-xs pt-2 ${
                                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  {new Date(step.timestamp).toLocaleString()}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Human Input Request */}
              {previewWorkItem.awaitingInput && previewWorkItem.inputRequest && (
                <div className={`p-4 rounded ${
                  theme === 'dark'
                    ? 'bg-yellow-900/20 border border-yellow-800'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    <MessageSquare className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1 text-yellow-600">
                        {previewWorkItem.inputRequest.type === 'approval'
                          ? 'Approval Required'
                          : previewWorkItem.inputRequest.type === 'input'
                          ? 'Input Required'
                          : 'Additional Context Required'}
                      </h4>
                      <p className={`text-sm mb-3 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {previewWorkItem.inputRequest.question}
                      </p>

                      {previewWorkItem.inputRequest.type === 'approval' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproval(true)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(false)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            value={humanInput}
                            onChange={(e) => setHumanInput(e.target.value)}
                            placeholder="Enter your response..."
                            rows={3}
                            className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                              theme === 'dark'
                                ? 'bg-gray-900 text-gray-100 placeholder-gray-500'
                                : 'bg-white text-gray-900 placeholder-gray-400'
                            }`}
                          />
                          <button
                            onClick={handleSubmitInput}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            Submit Response
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}