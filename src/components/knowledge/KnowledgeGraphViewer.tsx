import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { X, Network, Plus, Edit2, Trash2, Send, GitBranch, Check, XIcon, Save, Download } from 'lucide-react';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'entity' | 'event' | 'rule' | 'attribute';
  description: string;
}

interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
  type: 'has' | 'triggers' | 'requires' | 'affects';
}

interface KnowledgeGraphViewerProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  graphTitle: string;
  graphEndpoint: string;
}

// Sample Corporate Actions Knowledge Graph Data with descriptions
const initialNodes: GraphNode[] = [
  { id: 'ca-1', label: 'Corporate Action', type: 'entity', description: 'A corporate action is an event initiated by a public company that affects the securities issued by the company.' },
  { id: 'div-1', label: 'Dividend', type: 'event', description: 'Distribution of profits to shareholders, typically in cash or additional shares.' },
  { id: 'split-1', label: 'Stock Split', type: 'event', description: 'Division of existing shares into multiple shares to increase liquidity.' },
  { id: 'merger-1', label: 'Merger', type: 'event', description: 'Combination of two companies into a single entity.' },
  { id: 'div-cash', label: 'Cash Dividend', type: 'entity', description: 'Dividend paid in cash to shareholders.' },
  { id: 'div-stock', label: 'Stock Dividend', type: 'entity', description: 'Dividend paid in the form of additional shares.' },
  { id: 'date-ex', label: 'Ex-Dividend Date', type: 'attribute', description: 'The date on or after which a security is traded without a previously declared dividend.' },
  { id: 'date-record', label: 'Record Date', type: 'attribute', description: 'The date by which shareholders must be on record to receive the dividend.' },
  { id: 'date-pay', label: 'Payment Date', type: 'attribute', description: 'The date on which the dividend is actually paid to shareholders.' },
  { id: 'proc-calc', label: 'Entitlement Calculation', type: 'rule', description: 'Process to calculate shareholder entitlements based on holdings.' },
  { id: 'proc-pay', label: 'Payment Processing', type: 'rule', description: 'Execution of dividend payments to entitled shareholders.' },
  { id: 'proc-recon', label: 'Reconciliation', type: 'rule', description: 'Verification that all payments have been correctly processed.' },
  { id: 'issuer', label: 'Issuer', type: 'entity', description: 'The company issuing the securities and declaring corporate actions.' },
  { id: 'holder', label: 'Security Holder', type: 'entity', description: 'Individual or institution holding the securities.' },
];

const initialEdges: GraphEdge[] = [
  { source: 'ca-1', target: 'div-1', label: 'type', type: 'has' },
  { source: 'ca-1', target: 'split-1', label: 'type', type: 'has' },
  { source: 'ca-1', target: 'merger-1', label: 'type', type: 'has' },
  { source: 'div-1', target: 'div-cash', label: 'subtype', type: 'has' },
  { source: 'div-1', target: 'div-stock', label: 'subtype', type: 'has' },
  { source: 'div-cash', target: 'date-ex', label: 'requires', type: 'requires' },
  { source: 'div-cash', target: 'date-record', label: 'requires', type: 'requires' },
  { source: 'div-cash', target: 'date-pay', label: 'requires', type: 'requires' },
  { source: 'date-record', target: 'proc-calc', label: 'triggers', type: 'triggers' },
  { source: 'proc-calc', target: 'proc-pay', label: 'leads to', type: 'triggers' },
  { source: 'proc-pay', target: 'proc-recon', label: 'followed by', type: 'triggers' },
  { source: 'issuer', target: 'ca-1', label: 'announces', type: 'triggers' },
  { source: 'holder', target: 'proc-calc', label: 'entitled', type: 'affects' },
  { source: 'proc-pay', target: 'holder', label: 'pays', type: 'affects' },
];

export function KnowledgeGraphViewer({ theme, onClose, graphTitle, graphEndpoint }: KnowledgeGraphViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hello! I can help you explore and modify this knowledge graph. Try asking me to add nodes, create relationships, or explain concepts.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [showAddRelationModal, setShowAddRelationModal] = useState(false);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddParentNode, setQuickAddParentNode] = useState<GraphNode | null>(null);
  const [quickAddType, setQuickAddType] = useState<'entity' | 'event' | 'rule' | 'attribute'>('entity');

  // Load graph from localStorage on mount
  useEffect(() => {
    const loadGraph = () => {
      try {
        const savedGraph = localStorage.getItem('knowledge-graph-state');
        if (savedGraph) {
          const { nodes: savedNodes, edges: savedEdges, timestamp } = JSON.parse(savedGraph);
          setNodes(savedNodes);
          setEdges(savedEdges);
          setLastSaved(new Date(timestamp));
          
          setChatMessages([
            { role: 'assistant', content: 'Hello! I can help you explore and modify this knowledge graph. Try asking me to add nodes, create relationships, or explain concepts.' },
            { role: 'assistant', content: `✓ Loaded saved graph from ${new Date(timestamp).toLocaleString()}` }
          ]);
        }
      } catch (error) {
        console.error('Error loading graph:', error);
      }
    };
    
    loadGraph();
  }, []);

  // Node form state
  const [nodeForm, setNodeForm] = useState({
    label: '',
    type: 'entity' as GraphNode['type'],
    description: ''
  });

  // Relation form state
  const [relationForm, setRelationForm] = useState({
    source: '',
    target: '',
    label: '',
    type: 'has' as GraphEdge['type']
  });

  const getNodeColor = (type: string) => {
    const colors = {
      entity: theme === 'dark' ? '#3B82F6' : '#2563EB',
      event: theme === 'dark' ? '#A78BFA' : '#7C3AED',
      rule: theme === 'dark' ? '#34D399' : '#059669',
      attribute: theme === 'dark' ? '#FBBF24' : '#D97706',
    };
    return colors[type as keyof typeof colors] || colors.entity;
  };

  const getEdgeColor = (type: string) => {
    const colors = {
      has: theme === 'dark' ? '#60A5FA' : '#3B82F6',
      triggers: theme === 'dark' ? '#A78BFA' : '#8B5CF6',
      requires: theme === 'dark' ? '#34D399' : '#10B981',
      affects: theme === 'dark' ? '#FBBF24' : '#F59E0B',
    };
    return colors[type as keyof typeof colors] || colors.has;
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create container group
    const container = svg.append('g');

    // Setup zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    // Create force simulation with larger collision radius
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(edges)
        .id((d) => d.id)
        .distance(200))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80));

    simulationRef.current = simulation;

    // Create arrow marker
    svg.append('defs').selectAll('marker')
      .data(['end'])
      .enter().append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', theme === 'dark' ? '#9CA3AF' : '#6B7280');

    // Draw edges
    const link = container.append('g')
      .selectAll('g')
      .data(edges)
      .enter()
      .append('g');

    link.append('line')
      .attr('stroke', (d) => getEdgeColor(d.type))
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    link.append('text')
      .attr('class', 'edge-label')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .style('font-size', '10px')
      .style('fill', theme === 'dark' ? '#9CA3AF' : '#6B7280')
      .style('pointer-events', 'none')
      .text((d) => d.label);

    // Draw nodes
    const node = container.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add shapes based on node type - rectangles for non-attributes, circles for attributes
    node.each(function(d) {
      const nodeGroup = d3.select(this);
      
      if (d.type === 'attribute') {
        // Circle for attributes
        nodeGroup.append('circle')
          .attr('r', 40)
          .attr('fill', getNodeColor(d.type))
          .attr('stroke', theme === 'dark' ? '#1F2937' : '#F3F4F6')
          .attr('stroke-width', 3)
          .style('cursor', 'move');
      } else {
        // Rectangle for entity, event, rule
        nodeGroup.append('rect')
          .attr('width', 120)
          .attr('height', 60)
          .attr('x', -60)
          .attr('y', -30)
          .attr('rx', 8)
          .attr('fill', getNodeColor(d.type))
          .attr('stroke', theme === 'dark' ? '#1F2937' : '#F3F4F6')
          .attr('stroke-width', 3)
          .style('cursor', 'move');
      }
    });

    // Add text labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#ffffff')
      .style('pointer-events', 'none')
      .each(function(d) {
        const text = d3.select(this);
        const words = d.label.split(' ');
        
        if (d.type === 'attribute') {
          text.style('font-size', '10px');
          if (words.length > 2) {
            text.text('');
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', '-0.4em')
              .text(words.slice(0, 2).join(' '));
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.1em')
              .text(words.slice(2).join(' '));
          } else {
            text.text(d.label);
          }
        } else {
          if (words.length > 2) {
            text.text('');
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', '-0.4em')
              .text(words.slice(0, 2).join(' '));
            text.append('tspan')
              .attr('x', 0)
              .attr('dy', '1.2em')
              .text(words.slice(2).join(' '));
          } else {
            text.text(d.label);
          }
        }
      });

    // Add hover description group (initially hidden)
    const hoverGroup = node.append('g')
      .attr('class', 'hover-description')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    hoverGroup.append('rect')
      .attr('x', (d) => d.type === 'attribute' ? 50 : 70)
      .attr('y', -35)
      .attr('width', 200)
      .attr('height', 70)
      .attr('rx', 6)
      .attr('fill', theme === 'dark' ? '#1F2937' : '#FFFFFF')
      .attr('stroke', theme === 'dark' ? '#374151' : '#E5E7EB')
      .attr('stroke-width', 2);

    hoverGroup.append('text')
      .attr('x', (d) => d.type === 'attribute' ? 60 : 80)
      .attr('y', -20)
      .style('font-size', '11px')
      .style('font-weight', '600')
      .style('fill', theme === 'dark' ? '#FFFFFF' : '#111827')
      .text((d) => d.label);

    hoverGroup.append('foreignObject')
      .attr('x', (d) => d.type === 'attribute' ? 60 : 80)
      .attr('y', -5)
      .attr('width', 180)
      .attr('height', 60)
      .append('xhtml:div')
      .style('font-size', '10px')
      .style('color', theme === 'dark' ? '#D1D5DB' : '#4B5563')
      .style('line-height', '1.3')
      .text((d) => d.description);

    // Add hover and click events
    node
      .on('mouseenter', function(event, d) {
        setHoveredNode(d);
        
        if (d.type === 'attribute') {
          d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', 45)
            .attr('stroke-width', 4);
        } else {
          d3.select(this).select('rect')
            .transition()
            .duration(200)
            .attr('width', 130)
            .attr('height', 65)
            .attr('x', -65)
            .attr('y', -32.5)
            .attr('stroke-width', 4);
        }
        
        d3.select(this).select('.hover-description')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', function(event, d) {
        setHoveredNode(null);
        
        if (d.type === 'attribute') {
          d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', 40)
            .attr('stroke-width', 3);
        } else {
          d3.select(this).select('rect')
            .transition()
            .duration(200)
            .attr('width', 120)
            .attr('height', 60)
            .attr('x', -60)
            .attr('y', -30)
            .attr('stroke-width', 3);
        }
        
        d3.select(this).select('.hover-description')
          .transition()
          .duration(200)
          .style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        setSelectedNode(d);
        setIsEditingInline(false);
      })
      .on('contextmenu', function(event, d) {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({ x: event.clientX, y: event.clientY, node: d });
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link.select('line')
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      link.select('text')
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = event.x;
      d.fy = event.y;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, theme]);

  const handleAddNode = () => {
    if (!nodeForm.label) return;

    const newNode: GraphNode = {
      id: `node-${Date.now()}`,
      label: nodeForm.label,
      type: nodeForm.type,
      description: nodeForm.description
    };

    setNodes([...nodes, newNode]);
    setNodeForm({ label: '', type: 'entity', description: '' });
    setShowAddNodeModal(false);

    setChatMessages([...chatMessages, 
      { role: 'user', content: `Add node: ${nodeForm.label}` },
      { role: 'assistant', content: `✓ Added new ${nodeForm.type} node: "${nodeForm.label}"` }
    ]);
  };

  const handleSaveInlineEdit = () => {
    if (!selectedNode || !nodeForm.label) return;

    setNodes(nodes.map(n => 
      n.id === selectedNode.id 
        ? { ...n, label: nodeForm.label, type: nodeForm.type, description: nodeForm.description }
        : n
    ));

    setChatMessages([...chatMessages,
      { role: 'user', content: `Edit node: ${selectedNode.label}` },
      { role: 'assistant', content: `✓ Updated node to: "${nodeForm.label}"` }
    ]);

    setIsEditingInline(false);
  };

  const handleStartInlineEdit = () => {
    if (selectedNode) {
      setNodeForm({
        label: selectedNode.label,
        type: selectedNode.type,
        description: selectedNode.description
      });
      setIsEditingInline(true);
    }
  };

  const handleCancelInlineEdit = () => {
    setIsEditingInline(false);
    setNodeForm({ label: '', type: 'entity', description: '' });
  };

  const handleDeleteNode = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => 
      (typeof e.source === 'string' ? e.source : e.source.id) !== nodeId &&
      (typeof e.target === 'string' ? e.target : e.target.id) !== nodeId
    ));
    setSelectedNode(null);
    setIsEditingInline(false);

    setChatMessages([...chatMessages,
      { role: 'user', content: `Delete node: ${node?.label}` },
      { role: 'assistant', content: `✓ Deleted node and all its connections` }
    ]);
  };

  const handleAddRelation = () => {
    if (!relationForm.source || !relationForm.target || !relationForm.label) return;

    const newEdge: GraphEdge = {
      source: relationForm.source,
      target: relationForm.target,
      label: relationForm.label,
      type: relationForm.type
    };

    setEdges([...edges, newEdge]);
    setRelationForm({ source: '', target: '', label: '', type: 'has' });
    setShowAddRelationModal(false);

    const sourceNode = nodes.find(n => n.id === relationForm.source);
    const targetNode = nodes.find(n => n.id === relationForm.target);

    setChatMessages([...chatMessages,
      { role: 'user', content: `Add relation: ${sourceNode?.label} → ${targetNode?.label}` },
      { role: 'assistant', content: `✓ Created "${relationForm.label}" relationship` }
    ]);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages([...chatMessages, { role: 'user', content: userMessage }]);

    setTimeout(() => {
      let response = "I understand you want to work with the graph. You can use the buttons above to add nodes, edit them, or create relationships.";

      if (userMessage.toLowerCase().includes('add node') || userMessage.toLowerCase().includes('create node')) {
        setShowAddNodeModal(true);
        response = "Opening the Add Node form for you. Please fill in the details.";
      } else if (userMessage.toLowerCase().includes('add relation') || userMessage.toLowerCase().includes('create relation')) {
        setShowAddRelationModal(true);
        response = "Opening the Add Relation form. Please select the source and target nodes.";
      } else if (userMessage.toLowerCase().includes('explain') || userMessage.toLowerCase().includes('what is')) {
        if (selectedNode) {
          response = `${selectedNode.label}: ${selectedNode.description}`;
        } else {
          response = "Please select a node on the graph, and I'll explain it to you.";
        }
      } else if (userMessage.toLowerCase().includes('delete') || userMessage.toLowerCase().includes('remove')) {
        if (selectedNode) {
          response = `To delete "${selectedNode.label}", please use the Delete button in the details panel.`;
        } else {
          response = "Please select a node first, then you can delete it using the Delete button.";
        }
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);

    setChatInput('');
  };

  const handleSampleQuestionResponse = (question: string) => {
    setTimeout(() => {
      let response = "";

      if (question.includes('What is a Corporate Action?')) {
        const caNode = nodes.find(n => n.id === 'ca-1');
        response = caNode ? `${caNode.label}: ${caNode.description}` : "Corporate Action is a key entity in this knowledge graph representing events initiated by public companies.";
      } else if (question.includes('Explain the dividend process')) {
        response = "The dividend process involves several key steps:\n\n1. **Ex-Dividend Date**: When securities trade without dividend rights\n2. **Record Date**: Deadline for shareholders to be on record\n3. **Entitlement Calculation**: Computing shareholder entitlements\n4. **Payment Processing**: Executing payments\n5. **Reconciliation**: Verifying all payments\n\nYou can explore these nodes on the graph to see their relationships!";
      } else if (question.includes('Add node')) {
        setShowAddNodeModal(true);
        response = "Opening the Add Node form for you. I suggest adding 'Tax Withholding' as a Process/Rule that connects to Payment Processing.";
      } else if (question.includes('Show me all events')) {
        const events = nodes.filter(n => n.type === 'event');
        response = `Found ${events.length} events in the graph:\n${events.map(e => `• ${e.label}`).join('\n')}\n\nThese are shown in purple on the graph.`;
      } else if (question.includes('What are the key dates')) {
        const dates = nodes.filter(n => n.label.toLowerCase().includes('date'));
        response = `Key dates for dividends:\n${dates.map(d => `• ${d.label}: ${d.description}`).join('\n\n')}`;
      } else if (question.includes('Add relation')) {
        setShowAddRelationModal(true);
        response = "Opening the Add Relation form. Select your source and target nodes to create a new relationship.";
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  const handleContextMenuAction = (action: string, node: GraphNode) => {
    setContextMenu(null);
    setSelectedNode(node);

    switch (action) {
      case 'edit':
        setNodeForm({
          label: node.label,
          type: node.type,
          description: node.description
        });
        setIsEditingInline(true);
        break;
      case 'delete':
        handleDeleteNode(node.id);
        break;
      case 'addRelation':
        setRelationForm({ ...relationForm, source: node.id });
        setShowAddRelationModal(true);
        break;
      case 'addEntity':
        handleQuickAdd(node, 'entity');
        break;
      case 'addEvent':
        handleQuickAdd(node, 'event');
        break;
      case 'addProcess':
        handleQuickAdd(node, 'rule');
        break;
      case 'addAttribute':
        handleQuickAdd(node, 'attribute');
        break;
    }
  };

  const handleQuickAdd = (parentNode: GraphNode, nodeType: 'entity' | 'event' | 'rule' | 'attribute') => {
    setQuickAddParentNode(parentNode);
    setQuickAddType(nodeType);
    setNodeForm({ label: '', type: nodeType, description: '' });
    setShowQuickAddModal(true);
  };

  const handleQuickAddNode = () => {
    if (!nodeForm.label || !quickAddParentNode) return;

    const newNode: GraphNode = {
      id: `node-${Date.now()}`,
      label: nodeForm.label,
      type: nodeForm.type,
      description: nodeForm.description
    };

    // Automatically create relationship based on types
    let relationLabel = 'relates to';
    let relationType: GraphEdge['type'] = 'has';

    if (quickAddParentNode.type === 'entity' && nodeForm.type === 'event') {
      relationLabel = 'has event';
      relationType = 'has';
    } else if (quickAddParentNode.type === 'event' && nodeForm.type === 'rule') {
      relationLabel = 'triggers';
      relationType = 'triggers';
    } else if (nodeForm.type === 'attribute') {
      relationLabel = 'has attribute';
      relationType = 'has';
    } else if (quickAddParentNode.type === 'rule' && nodeForm.type === 'rule') {
      relationLabel = 'leads to';
      relationType = 'triggers';
    } else if (quickAddParentNode.type === 'entity' && nodeForm.type === 'entity') {
      relationLabel = 'contains';
      relationType = 'has';
    }

    const newEdge: GraphEdge = {
      source: quickAddParentNode.id,
      target: newNode.id,
      label: relationLabel,
      type: relationType
    };

    setNodes([...nodes, newNode]);
    setEdges([...edges, newEdge]);
    setNodeForm({ label: '', type: 'entity', description: '' });
    setShowQuickAddModal(false);
    setQuickAddParentNode(null);

    const typeLabels = {
      entity: 'Entity',
      event: 'Event',
      rule: 'Process',
      attribute: 'Attribute'
    };

    setChatMessages([...chatMessages,
      { role: 'user', content: `Add ${typeLabels[nodeForm.type]} to ${quickAddParentNode.label}` },
      { role: 'assistant', content: `✓ Added "${nodeForm.label}" as ${typeLabels[nodeForm.type]} with relationship "${relationLabel}"` }
    ]);
  };

  const handleSaveGraph = () => {
    setIsSaving(true);
    const graphState = {
      nodes,
      edges,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('knowledge-graph-state', JSON.stringify(graphState));
    setLastSaved(new Date());
    setIsSaving(false);

    setChatMessages([...chatMessages,
      { role: 'user', content: 'Save graph' },
      { role: 'assistant', content: `✓ Graph saved at ${new Date().toLocaleString()}` }
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <Network className={`w-6 h-6 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            }`} />
            <div>
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {graphTitle}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {graphEndpoint}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveGraph}
              disabled={isSaving}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-800'
                  : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300'
              }`}
              title={lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : 'Save graph'}
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
              <span className="text-sm">{isSaving ? 'Saving...' : 'Save Graph'}</span>
            </button>
            <button
              onClick={() => setShowAddNodeModal(true)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
              title="Add Node"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Node</span>
            </button>
            <button
              onClick={() => setShowAddRelationModal(true)}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
              title="Add Relation"
            >
              <GitBranch className="w-4 h-4" />
              <span className="text-sm">Add Relation</span>
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

        {/* Graph Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Graph Canvas */}
          <div className={`flex-1 overflow-hidden relative ${
            theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
          }`}>
            <svg
              ref={svgRef}
              className="w-full h-full"
              style={{ cursor: 'grab' }}
            />
            
            {/* Zoom indicator */}
            <div className={`absolute bottom-4 left-4 px-3 py-1 rounded text-sm ${
              theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
            }`}>
              Zoom: {(zoom * 100).toFixed(0)}%
            </div>
          </div>

          {/* Side Panel */}
          <div className={`w-96 border-l flex flex-col ${
            theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
          }`}>
            {/* Node Details Section */}
            {selectedNode && (
              <div className={`border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {isEditingInline ? 'Edit Node' : 'Node Details'}
                    </h4>
                    <button
                      onClick={() => {
                        setSelectedNode(null);
                        setIsEditingInline(false);
                      }}
                      className={`p-1 rounded transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {!isEditingInline ? (
                    <div className="space-y-4">
                      <div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Label
                        </div>
                        <div className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {selectedNode.label}
                        </div>
                      </div>

                      <div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Type
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedNode.type.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className={`text-xs font-medium mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Description
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {selectedNode.description}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleStartInlineEdit}
                          className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                            theme === 'dark'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="text-sm">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteNode(selectedNode.id)}
                          className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                            theme === 'dark'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>

                      {/* Connections */}
                      <div>
                        <div className={`text-xs font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Connections ({edges.filter(e => 
                            (typeof e.source === 'string' ? e.source : e.source.id) === selectedNode.id ||
                            (typeof e.target === 'string' ? e.target : e.target.id) === selectedNode.id
                          ).length})
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {edges
                            .filter(e => 
                              (typeof e.source === 'string' ? e.source : e.source.id) === selectedNode.id ||
                              (typeof e.target === 'string' ? e.target : e.target.id) === selectedNode.id
                            )
                            .map((edge, idx) => {
                              const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
                              const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
                              const otherNodeId = sourceId === selectedNode.id ? targetId : sourceId;
                              const otherNode = nodes.find(n => n.id === otherNodeId);
                              const direction = sourceId === selectedNode.id ? '→' : '←';
                              
                              return (
                                <div
                                  key={idx}
                                  className={`p-2 rounded text-xs ${
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                                  }`}
                                >
                                  <div className={`font-medium mb-1 ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {direction} {otherNode?.label}
                                  </div>
                                  <div className={`${
                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                  }`}>
                                    {edge.label}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className={`text-xs font-medium block mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Label
                        </label>
                        <input
                          type="text"
                          value={nodeForm.label}
                          onChange={(e) => setNodeForm({ ...nodeForm, label: e.target.value })}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>

                      <div>
                        <label className={`text-xs font-medium block mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Type
                        </label>
                        <select
                          value={nodeForm.type}
                          onChange={(e) => setNodeForm({ ...nodeForm, type: e.target.value as GraphNode['type'] })}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="entity">Entity</option>
                          <option value="event">Event</option>
                          <option value="rule">Rule/Process</option>
                          <option value="attribute">Attribute</option>
                        </select>
                      </div>

                      <div>
                        <label className={`text-xs font-medium block mb-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Description
                        </label>
                        <textarea
                          value={nodeForm.description}
                          onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })}
                          rows={4}
                          className={`w-full px-3 py-2 rounded-lg border text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveInlineEdit}
                          className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                            theme === 'dark'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Save</span>
                        </button>
                        <button
                          onClick={handleCancelInlineEdit}
                          className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700 hover:bg-gray-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                          }`}
                        >
                          <XIcon className="w-4 h-4" />
                          <span className="text-sm">Cancel</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Assistant Interface */}
            <div className="flex-1 flex flex-col">
              <div className={`p-4 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <h4 className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  AI Assistant
                </h4>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Ask me to add nodes, create relationships, or explain concepts
                </p>
              </div>

              {/* Sample Questions - Only show when chat is minimal */}
              {chatMessages.length <= 2 && (
                <div className={`px-4 py-3 border-b ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className={`text-xs font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    Try asking:
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      'What is a Corporate Action?',
                      'Explain the dividend process',
                      'Add node: Tax Withholding',
                      'Show me all events',
                      'What are the key dates for dividends?',
                      'Add relation between nodes'
                    ].map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setChatInput(question);
                          setTimeout(() => {
                            setChatMessages([...chatMessages, { role: 'user', content: question }]);
                            handleSampleQuestionResponse(question);
                            setChatInput('');
                          }, 100);
                        }}
                        className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        💬 {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? theme === 'dark'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-cyan-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className={`p-4 border-t ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Type a message..."
                    className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } border focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  />
                  <button
                    onClick={handleChatSend}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className={`px-6 py-3 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-6 flex-wrap">
            <div className={`text-xs font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Legend:
            </div>
            {[
              { type: 'entity', label: 'Entity' },
              { type: 'event', label: 'Event' },
              { type: 'rule', label: 'Rule/Process' },
              { type: 'attribute', label: 'Attribute' }
            ].map(item => (
              <div key={item.type} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getNodeColor(item.type) }}
                />
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
            <div className={`text-xs ml-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              💡 Tip: Drag nodes • Hover for info • Right-click for options
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className={`fixed rounded-lg shadow-lg py-1 min-w-[160px] z-[70] ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleContextMenuAction('edit', contextMenu.node)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            Edit Node
          </button>
          <button
            onClick={() => handleContextMenuAction('delete', contextMenu.node)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-red-400'
                : 'hover:bg-gray-100 text-red-600'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Delete Node
          </button>
          <div className={`h-px my-1 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <button
            onClick={() => handleContextMenuAction('addRelation', contextMenu.node)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Add Relation
          </button>
          <div className={`h-px my-1 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`px-3 py-1 text-xs font-semibold ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Quick Add
          </div>
          <button
            onClick={() => handleContextMenuAction('addEntity', contextMenu.node)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Entity
          </button>
          <button
            onClick={() => handleContextMenuAction('addEvent', contextMenu.node)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
          <button
            onClick={() => handleContextMenuAction('addProcess', contextMenu.node)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Process
          </button>
          <button
            onClick={() => handleContextMenuAction('addAttribute', contextMenu.node)}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-200'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Attribute
          </button>
        </div>
      )}

      {/* Add Node Modal */}
      {showAddNodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowAddNodeModal(false)}>
          <div className={`rounded-lg p-6 w-full max-w-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Add New Node
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Label
                </label>
                <input
                  type="text"
                  value={nodeForm.label}
                  onChange={(e) => setNodeForm({ ...nodeForm, label: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Enter node label"
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Type
                </label>
                <select
                  value={nodeForm.type}
                  onChange={(e) => setNodeForm({ ...nodeForm, type: e.target.value as GraphNode['type'] })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                >
                  <option value="entity">Entity</option>
                  <option value="event">Event</option>
                  <option value="rule">Rule/Process</option>
                  <option value="attribute">Attribute</option>
                </select>
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  value={nodeForm.description}
                  onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Enter node description"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddNode}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                Add Node
              </button>
              <button
                onClick={() => {
                  setShowAddNodeModal(false);
                  setNodeForm({ label: '', type: 'entity', description: '' });
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Relation Modal */}
      {showAddRelationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowAddRelationModal(false)}>
          <div className={`rounded-lg p-6 w-full max-w-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Add New Relation
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Source Node
                </label>
                <select
                  value={relationForm.source}
                  onChange={(e) => setRelationForm({ ...relationForm, source: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                >
                  <option value="">Select source node</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Target Node
                </label>
                <select
                  value={relationForm.target}
                  onChange={(e) => setRelationForm({ ...relationForm, target: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                >
                  <option value="">Select target node</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Relation Label
                </label>
                <input
                  type="text"
                  value={relationForm.label}
                  onChange={(e) => setRelationForm({ ...relationForm, label: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="e.g., triggers, has, requires"
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Relation Type
                </label>
                <select
                  value={relationForm.type}
                  onChange={(e) => setRelationForm({ ...relationForm, type: e.target.value as GraphEdge['type'] })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                >
                  <option value="has">Has</option>
                  <option value="triggers">Triggers</option>
                  <option value="requires">Requires</option>
                  <option value="affects">Affects</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddRelation}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                Add Relation
              </button>
              <button
                onClick={() => {
                  setShowAddRelationModal(false);
                  setRelationForm({ source: '', target: '', label: '', type: 'has' });
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAddModal && quickAddParentNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowQuickAddModal(false)}>
          <div className={`rounded-lg p-6 w-full max-w-md ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Add {quickAddType === 'rule' ? 'Process' : quickAddType.charAt(0).toUpperCase() + quickAddType.slice(1)} to {quickAddParentNode.label}
            </h3>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              A relationship will be automatically created
            </p>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Label
                </label>
                <input
                  type="text"
                  value={nodeForm.label}
                  onChange={(e) => setNodeForm({ ...nodeForm, label: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder={`Enter ${quickAddType === 'rule' ? 'process' : quickAddType} name`}
                  autoFocus
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  value={nodeForm.description}
                  onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleQuickAddNode}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                Add & Connect
              </button>
              <button
                onClick={() => {
                  setShowQuickAddModal(false);
                  setQuickAddParentNode(null);
                  setNodeForm({ label: '', type: 'entity', description: '' });
                }}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}