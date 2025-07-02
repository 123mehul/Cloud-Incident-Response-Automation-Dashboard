import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Server, Cloud, Bell, Activity, Lock, Eye, CheckCircle, XCircle, Clock, TrendingUp, Database, Mail, Settings } from 'lucide-react';

interface EC2Instance {
  id: string;
  name: string;
  status: 'running' | 'isolated' | 'terminated';
  region: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
  ipAddress: string;
}

interface GuardDutyFinding {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  instanceId: string;
  timestamp: string;
  description: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface IncidentLog {
  id: string;
  timestamp: string;
  action: string;
  instanceId: string;
  status: 'success' | 'pending' | 'failed';
  details: string;
}

function App() {
  const [instances, setInstances] = useState<EC2Instance[]>([
    {
      id: 'i-0123456789abcdef0',
      name: 'WebServer-Prod-01',
      status: 'running',
      region: 'us-east-1',
      threatLevel: 'high',
      lastActivity: '2 min ago',
      ipAddress: '10.0.1.15'
    },
    {
      id: 'i-0987654321fedcba0',
      name: 'Database-Prod-02',
      status: 'isolated',
      region: 'us-west-2',
      threatLevel: 'critical',
      lastActivity: '15 min ago',
      ipAddress: '10.0.2.22'
    },
    {
      id: 'i-0abcdef123456789',
      name: 'API-Server-03',
      status: 'running',
      region: 'us-east-1',
      threatLevel: 'low',
      lastActivity: '1 min ago',
      ipAddress: '10.0.1.33'
    }
  ]);

  const [findings, setFindings] = useState<GuardDutyFinding[]>([
    {
      id: 'gdfd-001',
      title: 'Cryptocurrency Mining Activity',
      severity: 'CRITICAL',
      type: 'CryptoCurrency:EC2/BitcoinTool.B!DNS',
      instanceId: 'i-0987654321fedcba0',
      timestamp: '2024-01-15T10:30:00Z',
      description: 'EC2 instance is querying a domain name associated with cryptocurrency mining.',
      status: 'investigating'
    },
    {
      id: 'gdfd-002',
      title: 'Suspicious Network Activity',
      severity: 'HIGH',
      type: 'Backdoor:EC2/C&CActivity.B!DNS',
      instanceId: 'i-0123456789abcdef0',
      timestamp: '2024-01-15T10:45:00Z',
      description: 'EC2 instance is communicating with a remote host known for malicious activities.',
      status: 'active'
    },
    {
      id: 'gdfd-003',
      title: 'Unusual API Call Pattern',
      severity: 'MEDIUM',
      type: 'Policy:IAMUser/RootCredentialUsage',
      instanceId: 'i-0abcdef123456789',
      timestamp: '2024-01-15T09:15:00Z',
      description: 'Root credentials are being used to make API calls.',
      status: 'resolved'
    }
  ]);

  const [logs, setLogs] = useState<IncidentLog[]>([
    {
      id: 'log-001',
      timestamp: '2024-01-15T10:47:00Z',
      action: 'Instance Isolation Triggered',
      instanceId: 'i-0987654321fedcba0',
      status: 'success',
      details: 'Lambda function executed successfully - Security group updated'
    },
    {
      id: 'log-002',
      timestamp: '2024-01-15T10:46:30Z',
      action: 'GuardDuty Alert Processed',
      instanceId: 'i-0987654321fedcba0',
      status: 'success',
      details: 'CloudWatch alarm triggered automated response'
    },
    {
      id: 'log-003',
      timestamp: '2024-01-15T10:46:00Z',
      action: 'Email Notification Sent',
      instanceId: 'i-0123456789abcdef0',
      status: 'pending',
      details: 'Notifying security team of suspicious activity'
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isolateInstance = (instanceId: string) => {
    setInstances(prev => prev.map(instance => 
      instance.id === instanceId 
        ? { ...instance, status: 'isolated' as const }
        : instance
    ));
    
    const newLog: IncidentLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Manual Instance Isolation',
      instanceId,
      status: 'success',
      details: 'Instance isolated via security dashboard'
    };
    
    setLogs(prev => [newLog, ...prev]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'LOW': return 'text-green-400 bg-green-900/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const threatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const activeCriticalThreats = findings.filter(f => f.severity === 'CRITICAL' && f.status === 'active').length;
  const isolatedInstances = instances.filter(i => i.status === 'isolated').length;
  const totalIncidents = findings.length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-xl font-bold text-white">CloudGuard SOC</h1>
                <p className="text-sm text-gray-400">Incident Response Automation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-400">Current Time</p>
              <p className="font-mono text-cyan-400">{currentTime.toLocaleString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Systems Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critical Threats</p>
                <p className="text-3xl font-bold text-red-400">{activeCriticalThreats}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-red-400">+2 this hour</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Isolated Instances</p>
                <p className="text-3xl font-bold text-orange-400">{isolatedInstances}</p>
              </div>
              <Lock className="w-8 h-8 text-orange-400" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Activity className="w-4 h-4 text-orange-400 mr-1" />
              <span className="text-orange-400">Auto-isolation active</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Incidents</p>
                <p className="text-3xl font-bold text-cyan-400">{totalIncidents}</p>
              </div>
              <Eye className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">1 resolved today</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Response Time</p>
                <p className="text-3xl font-bold text-green-400">1.3s</p>
              </div>
              <Cloud className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400">98.7% uptime</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* EC2 Instances */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Server className="w-5 h-5 mr-2 text-cyan-400" />
                EC2 Instances
              </h2>
              <span className="text-sm text-gray-400">{instances.length} total</span>
            </div>
            
            <div className="space-y-4">
              {instances.map((instance) => (
                <div key={instance.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${threatLevelColor(instance.threatLevel)}`}></div>
                      <div>
                        <p className="font-medium text-white">{instance.name}</p>
                        <p className="text-sm text-gray-400">{instance.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        instance.status === 'running' ? 'bg-green-900/30 text-green-400' :
                        instance.status === 'isolated' ? 'bg-orange-900/30 text-orange-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {instance.status}
                      </span>
                      {instance.status === 'running' && instance.threatLevel !== 'low' && (
                        <button
                          onClick={() => isolateInstance(instance.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors duration-200"
                        >
                          Isolate
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Region</p>
                      <p className="text-white">{instance.region}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">IP Address</p>
                      <p className="text-white font-mono">{instance.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Activity</p>
                      <p className="text-white">{instance.lastActivity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GuardDuty Findings */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2 text-cyan-400" />
                GuardDuty Findings
              </h2>
              <span className="text-sm text-gray-400">{findings.length} findings</span>
            </div>
            
            <div className="space-y-4">
              {findings.map((finding) => (
                <div key={finding.id} className={`rounded-lg p-4 border ${getSeverityColor(finding.severity)} bg-opacity-10`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          finding.status === 'active' ? 'bg-red-900/30 text-red-400' :
                          finding.status === 'investigating' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-green-900/30 text-green-400'
                        }`}>
                          {finding.status}
                        </span>
                      </div>
                      <h3 className="font-medium text-white mb-1">{finding.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{finding.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Instance: {finding.instanceId}</span>
                        <span>{new Date(finding.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <AlertTriangle className={`w-5 h-5 ${
                      finding.severity === 'CRITICAL' ? 'text-red-400' :
                      finding.severity === 'HIGH' ? 'text-orange-400' :
                      finding.severity === 'MEDIUM' ? 'text-yellow-400' :
                      'text-green-400'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident Response Logs */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Database className="w-5 h-5 mr-2 text-cyan-400" />
              Incident Response Logs
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400">S3 Logging Active</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400">Email Alerts Enabled</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Timestamp</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Instance</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-3 px-4 text-sm font-mono text-gray-300">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-white font-medium">{log.action}</td>
                    <td className="py-3 px-4 text-sm font-mono text-cyan-400">{log.instanceId}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(log.status)}
                        <span className={`text-sm capitalize ${
                          log.status === 'success' ? 'text-green-400' :
                          log.status === 'pending' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>AWS Lambda Functions: Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>CloudWatch: Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>GuardDuty: Active</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Last Updated: {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
