export const traceData = {
  "resourceSpans": [
    {
      "resource": {
        "attributes": [
          {
            "key": "service.name",
            "value": {
              "stringValue": "multi-agent-support-system"
            }
          },
          {
            "key": "service.version",
            "value": {
              "stringValue": "1.0.0"
            }
          },
          {
            "key": "deployment.environment",
            "value": {
              "stringValue": "production"
            }
          }
        ]
      },
      "scopeSpans": [
        {
          "scope": {
            "name": "langgraph.tracer",
            "version": "0.1.0"
          },
          "spans": [
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0001",
              "name": "SupportOrchestrator.execute",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584400000000000",
              "endTimeUnixNano": "1707584425000000000",
              "attributes": [
                {
                  "key": "agent.type",
                  "value": {
                    "stringValue": "orchestrator"
                  }
                },
                {
                  "key": "agent.name",
                  "value": {
                    "stringValue": "SupportOrchestrator"
                  }
                },
                {
                  "key": "session.id",
                  "value": {
                    "stringValue": "session_12345"
                  }
                },
                {
                  "key": "user.id",
                  "value": {
                    "stringValue": "user_67890"
                  }
                },
                {
                  "key": "user.request",
                  "value": {
                    "stringValue": "I need to cancel my order #ORD-2024-5678 and get a refund"
                  }
                },
                {
                  "key": "workflow.state",
                  "value": {
                    "stringValue": "completed"
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0002",
              "parentSpanId": "span0001",
              "name": "SupportOrchestrator.llm_call",
              "kind": "SPAN_KIND_CLIENT",
              "startTimeUnixNano": "1707584400500000000",
              "endTimeUnixNano": "1707584402800000000",
              "attributes": [
                {
                  "key": "llm.provider",
                  "value": {
                    "stringValue": "openai"
                  }
                },
                {
                  "key": "llm.model",
                  "value": {
                    "stringValue": "gpt-4-turbo"
                  }
                },
                {
                  "key": "llm.request.type",
                  "value": {
                    "stringValue": "chat.completion"
                  }
                },
                {
                  "key": "llm.temperature",
                  "value": {
                    "doubleValue": 0.0
                  }
                },
                {
                  "key": "llm.input.messages",
                  "value": {
                    "stringValue": "[{\"role\":\"system\",\"content\":\"You are a support orchestrator agent...\"},{\"role\":\"user\",\"content\":\"I need to cancel my order #ORD-2024-5678 and get a refund\"}]"
                  }
                },
                {
                  "key": "llm.output.content",
                  "value": {
                    "stringValue": "I'll help you cancel the order and process a refund. Let me route this to the appropriate agents."
                  }
                },
                {
                  "key": "llm.usage.prompt_tokens",
                  "value": {
                    "intValue": 245
                  }
                },
                {
                  "key": "llm.usage.completion_tokens",
                  "value": {
                    "intValue": 28
                  }
                },
                {
                  "key": "llm.usage.total_tokens",
                  "value": {
                    "intValue": 273
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0003",
              "parentSpanId": "span0001",
              "name": "SupportOrchestrator.route_decision",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584402900000000",
              "endTimeUnixNano": "1707584403100000000",
              "attributes": [
                {
                  "key": "routing.decision",
                  "value": {
                    "stringValue": "invoke_policy_checker_agent"
                  }
                },
                {
                  "key": "routing.reason",
                  "value": {
                    "stringValue": "Need to verify cancellation policy before proceeding"
                  }
                },
                {
                  "key": "extracted.order_id",
                  "value": {
                    "stringValue": "ORD-2024-5678"
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0004",
              "parentSpanId": "span0001",
              "name": "PolicyCheckerAgent.execute",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584403200000000",
              "endTimeUnixNano": "1707584410500000000",
              "attributes": [
                {
                  "key": "agent.type",
                  "value": {
                    "stringValue": "specialist"
                  }
                },
                {
                  "key": "agent.name",
                  "value": {
                    "stringValue": "PolicyCheckerAgent"
                  }
                },
                {
                  "key": "agent.role",
                  "value": {
                    "stringValue": "policy_verification"
                  }
                },
                {
                  "key": "input.order_id",
                  "value": {
                    "stringValue": "ORD-2024-5678"
                  }
                },
                {
                  "key": "output.policy_status",
                  "value": {
                    "stringValue": "eligible_for_cancellation"
                  }
                },
                {
                  "key": "output.refund_percentage",
                  "value": {
                    "intValue": 100
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0005",
              "parentSpanId": "span0004",
              "name": "PolicyCheckerAgent.tool_get_order_details",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584403300000000",
              "endTimeUnixNano": "1707584404500000000",
              "attributes": [
                {
                  "key": "tool.name",
                  "value": {
                    "stringValue": "get_order_details"
                  }
                },
                {
                  "key": "tool.input.order_id",
                  "value": {
                    "stringValue": "ORD-2024-5678"
                  }
                },
                {
                  "key": "tool.output",
                  "value": {
                    "stringValue": "{\"order_id\":\"ORD-2024-5678\",\"user_id\":\"user_67890\",\"order_date\":\"2024-02-08T10:30:00Z\",\"status\":\"pending_shipment\",\"total_amount\":129.99,\"items\":[{\"product_id\":\"PROD-123\",\"quantity\":2,\"price\":64.99}]}"
                  }
                },
                {
                  "key": "tool.execution_time_ms",
                  "value": {
                    "intValue": 1200
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0006",
              "parentSpanId": "span0004",
              "name": "PolicyCheckerAgent.tool_check_cancellation_policy",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584404600000000",
              "endTimeUnixNano": "1707584406200000000",
              "attributes": [
                {
                  "key": "tool.name",
                  "value": {
                    "stringValue": "check_cancellation_policy"
                  }
                },
                {
                  "key": "tool.input.order_date",
                  "value": {
                    "stringValue": "2024-02-08T10:30:00Z"
                  }
                },
                {
                  "key": "tool.input.order_status",
                  "value": {
                    "stringValue": "pending_shipment"
                  }
                },
                {
                  "key": "tool.output.eligible",
                  "value": {
                    "boolValue": true
                  }
                },
                {
                  "key": "tool.output.refund_percentage",
                  "value": {
                    "intValue": 100
                  }
                },
                {
                  "key": "tool.output.reason",
                  "value": {
                    "stringValue": "Order placed within 48 hours and not yet shipped - eligible for full refund"
                  }
                },
                {
                  "key": "tool.execution_time_ms",
                  "value": {
                    "intValue": 1600
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0007",
              "parentSpanId": "span0004",
              "name": "PolicyCheckerAgent.llm_call",
              "kind": "SPAN_KIND_CLIENT",
              "startTimeUnixNano": "1707584406300000000",
              "endTimeUnixNano": "1707584410400000000",
              "attributes": [
                {
                  "key": "llm.provider",
                  "value": {
                    "stringValue": "openai"
                  }
                },
                {
                  "key": "llm.model",
                  "value": {
                    "stringValue": "gpt-4-turbo"
                  }
                },
                {
                  "key": "llm.temperature",
                  "value": {
                    "doubleValue": 0.0
                  }
                },
                {
                  "key": "llm.input.messages",
                  "value": {
                    "stringValue": "[{\"role\":\"system\",\"content\":\"You are a policy checker agent...\"},{\"role\":\"user\",\"content\":\"Check policy for order ORD-2024-5678\"},{\"role\":\"function\",\"name\":\"get_order_details\",\"content\":\"...\"},{\"role\":\"function\",\"name\":\"check_cancellation_policy\",\"content\":\"...\"}]"
                  }
                },
                {
                  "key": "llm.output.content",
                  "value": {
                    "stringValue": "Order ORD-2024-5678 is eligible for cancellation with 100% refund. The order was placed 2 days ago and hasn't shipped yet."
                  }
                },
                {
                  "key": "llm.usage.prompt_tokens",
                  "value": {
                    "intValue": 512
                  }
                },
                {
                  "key": "llm.usage.completion_tokens",
                  "value": {
                    "intValue": 42
                  }
                },
                {
                  "key": "llm.usage.total_tokens",
                  "value": {
                    "intValue": 554
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0008",
              "parentSpanId": "span0001",
              "name": "OrderCancellationAgent.execute",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584410600000000",
              "endTimeUnixNano": "1707584416800000000",
              "attributes": [
                {
                  "key": "agent.type",
                  "value": {
                    "stringValue": "specialist"
                  }
                },
                {
                  "key": "agent.name",
                  "value": {
                    "stringValue": "OrderCancellationAgent"
                  }
                },
                {
                  "key": "agent.role",
                  "value": {
                    "stringValue": "order_management"
                  }
                },
                {
                  "key": "input.order_id",
                  "value": {
                    "stringValue": "ORD-2024-5678"
                  }
                },
                {
                  "key": "input.policy_approval",
                  "value": {
                    "boolValue": true
                  }
                },
                {
                  "key": "output.cancellation_status",
                  "value": {
                    "stringValue": "success"
                  }
                },
                {
                  "key": "output.cancellation_id",
                  "value": {
                    "stringValue": "CANCEL-2024-9876"
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0009",
              "parentSpanId": "span0008",
              "name": "OrderCancellationAgent.llm_call",
              "kind": "SPAN_KIND_CLIENT",
              "startTimeUnixNano": "1707584410700000000",
              "endTimeUnixNano": "1707584412500000000",
              "attributes": [
                {
                  "key": "llm.provider",
                  "value": {
                    "stringValue": "openai"
                  }
                },
                {
                  "key": "llm.model",
                  "value": {
                    "stringValue": "gpt-4-turbo"
                  }
                },
                {
                  "key": "llm.temperature",
                  "value": {
                    "doubleValue": 0.0
                  }
                },
                {
                  "key": "llm.function_call",
                  "value": {
                    "stringValue": "cancel_order"
                  }
                },
                {
                  "key": "llm.usage.prompt_tokens",
                  "value": {
                    "intValue": 328
                  }
                },
                {
                  "key": "llm.usage.completion_tokens",
                  "value": {
                    "intValue": 35
                  }
                },
                {
                  "key": "llm.usage.total_tokens",
                  "value": {
                    "intValue": 363
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0010",
              "parentSpanId": "span0008",
              "name": "OrderCancellationAgent.tool_cancel_order",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584412600000000",
              "endTimeUnixNano": "1707584416700000000",
              "attributes": [
                {
                  "key": "tool.name",
                  "value": {
                    "stringValue": "cancel_order"
                  }
                },
                {
                  "key": "tool.input.order_id",
                  "value": {
                    "stringValue": "ORD-2024-5678"
                  }
                },
                {
                  "key": "tool.input.reason",
                  "value": {
                    "stringValue": "customer_request"
                  }
                },
                {
                  "key": "tool.output.status",
                  "value": {
                    "stringValue": "cancelled"
                  }
                },
                {
                  "key": "tool.output.cancellation_id",
                  "value": {
                    "stringValue": "CANCEL-2024-9876"
                  }
                },
                {
                  "key": "tool.output.timestamp",
                  "value": {
                    "stringValue": "2024-02-10T14:13:36Z"
                  }
                },
                {
                  "key": "tool.execution_time_ms",
                  "value": {
                    "intValue": 4100
                  }
                },
                {
                  "key": "db.operation",
                  "value": {
                    "stringValue": "UPDATE orders SET status='cancelled'"
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0011",
              "parentSpanId": "span0001",
              "name": "RefundProcessingAgent.execute",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584416900000000",
              "endTimeUnixNano": "1707584424500000000",
              "attributes": [
                {
                  "key": "agent.type",
                  "value": {
                    "stringValue": "specialist"
                  }
                },
                {
                  "key": "agent.name",
                  "value": {
                    "stringValue": "RefundProcessingAgent"
                  }
                },
                {
                  "key": "agent.role",
                  "value": {
                    "stringValue": "payment_management"
                  }
                },
                {
                  "key": "input.order_id",
                  "value": {
                    "stringValue": "ORD-2024-5678"
                  }
                },
                {
                  "key": "input.cancellation_id",
                  "value": {
                    "stringValue": "CANCEL-2024-9876"
                  }
                },
                {
                  "key": "input.refund_percentage",
                  "value": {
                    "intValue": 100
                  }
                },
                {
                  "key": "output.refund_status",
                  "value": {
                    "stringValue": "processed"
                  }
                },
                {
                  "key": "output.refund_id",
                  "value": {
                    "stringValue": "REFUND-2024-4321"
                  }
                },
                {
                  "key": "output.refund_amount",
                  "value": {
                    "doubleValue": 129.99
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0012",
              "parentSpanId": "span0011",
              "name": "RefundProcessingAgent.tool_get_payment_details",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584417000000000",
              "endTimeUnixNano": "1707584418500000000",
              "attributes": [
                {
                  "key": "tool.name",
                  "value": {
                    "stringValue": "get_payment_details"
                  }
                },
                {
                  "key": "tool.input.order_id",
                  "value": {
                    "stringValue": "ORD-2024-5678"
                  }
                },
                {
                  "key": "tool.output.payment_method",
                  "value": {
                    "stringValue": "credit_card"
                  }
                },
                {
                  "key": "tool.output.payment_id",
                  "value": {
                    "stringValue": "PAY-2024-1111"
                  }
                },
                {
                  "key": "tool.output.amount",
                  "value": {
                    "doubleValue": 129.99
                  }
                },
                {
                  "key": "tool.execution_time_ms",
                  "value": {
                    "intValue": 1500
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0013",
              "parentSpanId": "span0011",
              "name": "RefundProcessingAgent.llm_call",
              "kind": "SPAN_KIND_CLIENT",
              "startTimeUnixNano": "1707584418600000000",
              "endTimeUnixNano": "1707584420800000000",
              "attributes": [
                {
                  "key": "llm.provider",
                  "value": {
                    "stringValue": "openai"
                  }
                },
                {
                  "key": "llm.model",
                  "value": {
                    "stringValue": "gpt-4-turbo"
                  }
                },
                {
                  "key": "llm.temperature",
                  "value": {
                    "doubleValue": 0.0
                  }
                },
                {
                  "key": "llm.function_call",
                  "value": {
                    "stringValue": "process_refund"
                  }
                },
                {
                  "key": "llm.usage.prompt_tokens",
                  "value": {
                    "intValue": 412
                  }
                },
                {
                  "key": "llm.usage.completion_tokens",
                  "value": {
                    "intValue": 38
                  }
                },
                {
                  "key": "llm.usage.total_tokens",
                  "value": {
                    "intValue": 450
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0014",
              "parentSpanId": "span0011",
              "name": "RefundProcessingAgent.tool_process_refund",
              "kind": "SPAN_KIND_INTERNAL",
              "startTimeUnixNano": "1707584420900000000",
              "endTimeUnixNano": "1707584424400000000",
              "attributes": [
                {
                  "key": "tool.name",
                  "value": {
                    "stringValue": "process_refund"
                  }
                },
                {
                  "key": "tool.input.payment_id",
                  "value": {
                    "stringValue": "PAY-2024-1111"
                  }
                },
                {
                  "key": "tool.input.refund_amount",
                  "value": {
                    "doubleValue": 129.99
                  }
                },
                {
                  "key": "tool.input.reason",
                  "value": {
                    "stringValue": "order_cancelled"
                  }
                },
                {
                  "key": "tool.output.refund_id",
                  "value": {
                    "stringValue": "REFUND-2024-4321"
                  }
                },
                {
                  "key": "tool.output.status",
                  "value": {
                    "stringValue": "processed"
                  }
                },
                {
                  "key": "tool.output.estimated_arrival",
                  "value": {
                    "stringValue": "5-7 business days"
                  }
                },
                {
                  "key": "tool.execution_time_ms",
                  "value": {
                    "intValue": 3500
                  }
                },
                {
                  "key": "payment.gateway",
                  "value": {
                    "stringValue": "stripe"
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            },
            {
              "traceId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
              "spanId": "span0015",
              "parentSpanId": "span0001",
              "name": "SupportOrchestrator.final_response",
              "kind": "SPAN_KIND_CLIENT",
              "startTimeUnixNano": "1707584424600000000",
              "endTimeUnixNano": "1707584424900000000",
              "attributes": [
                {
                  "key": "llm.provider",
                  "value": {
                    "stringValue": "openai"
                  }
                },
                {
                  "key": "llm.model",
                  "value": {
                    "stringValue": "gpt-4-turbo"
                  }
                },
                {
                  "key": "llm.temperature",
                  "value": {
                    "doubleValue": 0.7
                  }
                },
                {
                  "key": "llm.input.messages",
                  "value": {
                    "stringValue": "[{\"role\":\"system\",\"content\":\"Summarize the complete workflow...\"},{\"role\":\"assistant\",\"content\":\"Policy check: eligible, Order cancelled: CANCEL-2024-9876, Refund processed: REFUND-2024-4321\"}]"
                  }
                },
                {
                  "key": "llm.output.content",
                  "value": {
                    "stringValue": "I've successfully processed your request! Your order #ORD-2024-5678 has been cancelled (Cancellation ID: CANCEL-2024-9876) and a full refund of $129.99 has been initiated (Refund ID: REFUND-2024-4321). The refund will appear in your account within 5-7 business days. Is there anything else I can help you with?"
                  }
                },
                {
                  "key": "llm.usage.prompt_tokens",
                  "value": {
                    "intValue": 680
                  }
                },
                {
                  "key": "llm.usage.completion_tokens",
                  "value": {
                    "intValue": 68
                  }
                },
                {
                  "key": "llm.usage.total_tokens",
                  "value": {
                    "intValue": 748
                  }
                }
              ],
              "status": {
                "code": "STATUS_CODE_OK"
              }
            }
          ]
        }
      ]
    }
  ]
};
