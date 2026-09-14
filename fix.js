const fs = require('fs');

// Fix EvidencePage
let ev = fs.readFileSync('apps/web/src/pages/EvidencePage.tsx', 'utf8');
if (!ev.includes('import { Link }')) {
  ev = ev.replace('import React', "import { Link } from 'react-router-dom';\nimport React");
}
ev = ev.replace(/<button onClick=\{\(\) => window\.location\.href=\`\/cases\/\$\{ev\.inspectionId\}\`\} style=\{\{ background: \"none\", border: \"none\", color: \"var\(--text\)\", textDecoration: \"underline\", padding: 0, cursor: \"pointer\", fontSize: \"11px\" \}\}>\{ev\.inspectionId\}<\/button>/g, '<Link to={`/cases/${ev.inspectionId}`} style={{ color: \'var(--text)\', textDecoration: \'underline\' }}>{ev.inspectionId}</Link>');
ev = ev.replace(/<a href=\{\`\/cases\/\$\{ev\.inspectionId\}\`\} style=\{\{ color: 'var\(--text\)', textDecoration: 'underline' \}\}>\{ev\.inspectionId\}<\/a>/g, '<Link to={`/cases/${ev.inspectionId}`} style={{ color: \'var(--text)\', textDecoration: \'underline\' }}>{ev.inspectionId}</Link>');
fs.writeFileSync('apps/web/src/pages/EvidencePage.tsx', ev);

// Fix AuditLogPage
let au = fs.readFileSync('apps/web/src/pages/AuditLogPage.tsx', 'utf8');
if (!au.includes('import { Link }')) {
  au = au.replace('import React', "import { Link } from 'react-router-dom';\nimport React");
}
au = au.replace(/<a href=\{\`\/cases\/\$\{log\.targetId\}\`\} style=\{\{ color: 'var\(--text\)', textDecoration: 'underline' \}\}>\{log\.targetId\}<\/a>/g, '<Link to={`/cases/${log.targetId}`} style={{ color: \'var(--text)\', textDecoration: \'underline\' }}>{log.targetId}</Link>');
fs.writeFileSync('apps/web/src/pages/AuditLogPage.tsx', au);

// Fix AnalyticsPage
let an = fs.readFileSync('apps/web/src/pages/AnalyticsPage.tsx', 'utf8');
if (!an.includes('useNavigate')) {
  an = an.replace("import React from 'react';", "import React from 'react';\nimport { useNavigate } from 'react-router-dom';");
}
if (!an.includes('const navigate = useNavigate();')) {
  an = an.replace('export default function AnalyticsPage() {', 'export default function AnalyticsPage() {\n  const navigate = useNavigate();');
}
an = an.replace(/<a href=\"\/audit\"><button className=\"outline\" style=\{\{height:'28px',padding:'0 9px'\}\}>View all<\/button><\/a>/g, "<button className=\"outline\" style={{height:'28px',padding:'0 9px'}} onClick={() => navigate('/audit')}>View all</button>");
an = an.replace(/<a href=\"\/cases\"><button className=\"outline\" style=\{\{height:'30px'\}\}>Open cases<\/button><\/a>/g, "<button className=\"outline\" style={{height:'30px'}} onClick={() => navigate('/cases')}>Open cases</button>");
fs.writeFileSync('apps/web/src/pages/AnalyticsPage.tsx', an);

console.log('Fixed navigation links');
