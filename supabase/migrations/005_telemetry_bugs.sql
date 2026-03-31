-- Anonymous telemetry events from the sudo app
CREATE TABLE IF NOT EXISTS telemetry (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL,
  action TEXT,
  app TEXT,
  success BOOLEAN,
  version TEXT,
  device_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bug reports from users
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT,
  version TEXT,
  os_version TEXT,
  detected_app TEXT,
  connected BOOLEAN,
  action_log JSONB,
  settings JSONB,
  device_id TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for analytics queries
CREATE INDEX idx_telemetry_event ON telemetry(event);
CREATE INDEX idx_telemetry_created ON telemetry(created_at);
CREATE INDEX idx_telemetry_device ON telemetry(device_id);
CREATE INDEX idx_bugs_status ON bug_reports(status);
