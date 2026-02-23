// Mock trace data - multiple traces for the table view
export const allTracesData = [
  {
    traceId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    sessionId: "session_12345",
    timestamp: Date.now() - 15 * 60 * 1000, // 15 minutes ago
    userRequest: "I need to cancel my order #ORD-2024-5678 and get a refund",
    agentName: "SupportOrchestrator",
    status: "STATUS_CODE_OK"
  },
  {
    traceId: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7",
    sessionId: "session_12346",
    timestamp: Date.now() - 45 * 60 * 1000, // 45 minutes ago
    userRequest: "What's the status of my order #ORD-2024-4321?",
    agentName: "OrderStatusAgent",
    status: "STATUS_CODE_OK"
  },
  {
    traceId: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8",
    sessionId: "session_12347",
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    userRequest: "I need help with a return for order #ORD-2024-8765",
    agentName: "ReturnAgent",
    status: "STATUS_CODE_ERROR"
  },
  {
    traceId: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9",
    sessionId: "session_12348",
    timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    userRequest: "Can I change the shipping address for order #ORD-2024-1111?",
    agentName: "ShippingAgent",
    status: "STATUS_CODE_OK"
  },
  {
    traceId: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    sessionId: "session_12349",
    timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    userRequest: "My payment failed for order #ORD-2024-2222",
    agentName: "PaymentAgent",
    status: "STATUS_CODE_ERROR"
  },
  {
    traceId: "f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
    sessionId: "session_12350",
    timestamp: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
    userRequest: "I want to track my order #ORD-2024-3333",
    agentName: "TrackingAgent",
    status: "STATUS_CODE_OK"
  },
  {
    traceId: "g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2",
    sessionId: "session_12345",
    timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    userRequest: "Question about warranty for order #ORD-2024-4444",
    agentName: "WarrantyAgent",
    status: "STATUS_CODE_OK"
  },
  {
    traceId: "h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3",
    sessionId: "session_12351",
    timestamp: Date.now() - 18 * 60 * 60 * 1000, // 18 hours ago
    userRequest: "How do I apply a discount code to order #ORD-2024-5555?",
    agentName: "DiscountAgent",
    status: "STATUS_CODE_OK"
  },
  {
    traceId: "i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4",
    sessionId: "session_12352",
    timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    userRequest: "Need to update email address for order #ORD-2024-6666",
    agentName: "ProfileAgent",
    status: "STATUS_CODE_OK"
  },
  {
    traceId: "j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5",
    sessionId: "session_12353",
    timestamp: Date.now() - 30 * 60 * 60 * 1000, // 30 hours ago
    userRequest: "Cancel subscription and refund for order #ORD-2024-7777",
    agentName: "SubscriptionAgent",
    status: "STATUS_CODE_ERROR"
  }
];

// Keep the existing detailed trace data
export { traceData } from './traces';
