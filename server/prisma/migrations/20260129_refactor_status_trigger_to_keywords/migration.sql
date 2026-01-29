-- ============================================
-- REFACTOR: statusTrigger → keywords array
-- ============================================
-- This migration consolidates ORDER_STATUS and PAYMENT_STATUS
-- to use the existing keywords array field instead of statusTrigger

-- ============================================
-- STEP 1: Migrate existing data
-- ============================================
-- Copy statusTrigger values into keywords array
-- for ORDER_STATUS and PAYMENT_STATUS rules

UPDATE "AutoReplyRule"
SET keywords = ARRAY[statusTrigger]
WHERE
  (triggerType = 'ORDER_STATUS' OR triggerType = 'PAYMENT_STATUS')
  AND statusTrigger IS NOT NULL
  AND statusTrigger != ''
  AND (keywords IS NULL OR array_length(keywords, 1) IS NULL OR array_length(keywords, 1) = 0);

-- ============================================
-- STEP 2: Add unique constraint
-- ============================================
-- Prevent duplicate rules per status per tenant
-- This ensures: 1 tenant can only have 1 rule per ORDER_STATUS/PAYMENT_STATUS

ALTER TABLE "AutoReplyRule"
ADD CONSTRAINT "AutoReplyRule_tenantId_triggerType_keywords_key"
UNIQUE ("tenantId", "triggerType", "keywords");

-- ============================================
-- STEP 3: Drop statusTrigger column
-- ============================================
-- Now that data is migrated, we can safely drop the old column

ALTER TABLE "AutoReplyRule"
DROP COLUMN "statusTrigger";
