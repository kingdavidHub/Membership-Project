/**
 * Report API Types
 */

export interface SendMembersMessageRequest {
  subject: string
  body: string
  memberIds: string[]
}

export interface SendMembersMessageResponse {
  status: string
  message: string
}
