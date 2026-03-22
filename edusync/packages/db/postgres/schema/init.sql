/*
  EduSync Nexus Karma Ledger
  Designed for financial integrity and immutable audit logs across MOU nodes.
*/

CREATE TABLE IF NOT EXISTS karma_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_uid VARCHAR(128) NOT NULL,
  receiver_uid VARCHAR(128) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  transaction_reason VARCHAR(256) NOT NULL,
  mou_agreement_id UUID,
   institutional_node VARCHAR(32) NOT NULL,
  transaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  block_sequence_id SERIAL, -- Sequence for ordering across distributed nodes
  digest_hash CHAR(64) -- Hash of (previous_hash, sender, receiver, amount) for manual anchoring
);

CREATE INDEX idx_sender ON karma_ledger (sender_uid);
CREATE INDEX idx_receiver ON karma_ledger (receiver_uid);
CREATE INDEX idx_timestamp ON karma_ledger (transaction_timestamp);

CREATE TABLE IF NOT EXISTS mou_handshake_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiating_campus VARCHAR(32) NOT NULL,
  accepting_campus VARCHAR(32) NOT NULL,
  agreement_terms TEXT,
  signature_hash TEXT,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  "isActive" BOOLEAN DEFAULT TRUE,
  mou_reference_number VARCHAR(50),
  credit_exchange_rate NUMERIC(5,2) DEFAULT 1.0,
  max_cross_connections INTEGER DEFAULT 100,
  data_share_level VARCHAR(20) DEFAULT 'profiles_only',
  total_cross_swaps INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  proposed_by VARCHAR(128),
  accepted_by VARCHAR(128),
  status VARCHAR(20) DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_mou_initiating ON mou_handshake_log(initiating_campus);
CREATE INDEX IF NOT EXISTS idx_mou_accepting ON mou_handshake_log(accepting_campus);
CREATE INDEX IF NOT EXISTS idx_mou_status ON mou_handshake_log(status, "isActive");
CREATE INDEX IF NOT EXISTS idx_mou_expiry ON mou_handshake_log(valid_until) WHERE valid_until IS NOT NULL;

CREATE TABLE IF NOT EXISTS nexus_transparency_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swap_id VARCHAR(128) NOT NULL,
  requester_id VARCHAR(128) NOT NULL,
  responder_id VARCHAR(128) NOT NULL,
  requester_campus_id VARCHAR(32) NOT NULL,
  responder_campus_id VARCHAR(32) NOT NULL,
  action VARCHAR(32) NOT NULL, -- 'swap_requested', 'swap_accepted', 'swap_completed'
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ntl_swap_id ON nexus_transparency_log(swap_id);
CREATE INDEX IF NOT EXISTS idx_ntl_requester ON nexus_transparency_log(requester_id);
CREATE INDEX IF NOT EXISTS idx_ntl_responder ON nexus_transparency_log(responder_id);
CREATE INDEX IF NOT EXISTS idx_ntl_timestamp ON nexus_transparency_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ntl_campuses ON nexus_transparency_log(requester_campus_id, responder_campus_id);

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);
