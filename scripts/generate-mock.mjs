import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');

const subpageConfigFile = path.join(rootDir, 'subpage-00000000-0000-0000-0000-000000000000.json');
let fullConfig;

if (fs.existsSync(subpageConfigFile)) {
  fullConfig = JSON.parse(fs.readFileSync(subpageConfigFile, 'utf8'));
  console.log('📖 Using Remnawave config from subpage-00000000-0000-0000-0000-000000000000.json');
} else {
  throw new Error('subpage-00000000-0000-0000-0000-000000000000.json not found!');
}

const mockSub = {
  response: {
    isFound: true,
    user: {
      shortUuid: 'mock-sub-8899aabb',
      daysLeft: 25,
      trafficUsed: '18.4 GB',
      trafficLimit: '100 GB',
      lifetimeTrafficUsed: '74.2 GB',
      trafficUsedBytes: '19756849561',
      trafficLimitBytes: '107374182400',
      lifetimeTrafficUsedBytes: '79671197696',
      username: 'custom-preview-user',
      expiresAt: '2026-05-01T00:00:00.000Z',
      isActive: true,
      userStatus: 'ACTIVE',
      trafficLimitStrategy: 'MONTH'
    },
    links: [
      'vless://a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d@nl1.fastvpn.net:443?type=tcp&security=reality&pbk=1234567890abcdef1234567890abcdef1234567890a&fp=chrome&sni=nl1.fastvpn.net&sid=abcd1234&spx=%2F#🇳🇱+Netherlands+Fast',
      'vless://a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d@de1.fastvpn.net:443?type=tcp&security=reality&pbk=1234567890abcdef1234567890abcdef1234567890a&fp=chrome&sni=de1.fastvpn.net&sid=abcd1234&spx=%2F#🇩🇪+Germany+Direct',
      'ss://YWVzLTI1Ni1nY206cGFzc3dvcmRAMTIzNDU2@fi1.fastvpn.net:8443#🇫🇮+Finland+Shadowsocks',
      'hysteria2://mocktoken123@us1.fastvpn.net:443/?sni=us1.fastvpn.net&insecure=0#🇺🇸+USA+HighSpeed'
    ],
    ssConfLinks: {},
    subscriptionUrl: 'http://localhost:3334/sub/mock-sub-8899aabb'
  }
};

const base64 = Buffer.from(JSON.stringify(mockSub)).toString('base64');

const envContent = [
  'PANEL_DATA=' + base64,
  'META_TITLE="' + (fullConfig.baseSettings?.metaTitle || 'TOP VPN') + '"',
  'META_DESCRIPTION="' + (fullConfig.baseSettings?.metaDescription || 'TOP VPN') + '"'
].join('\n');

fs.writeFileSync(path.join(frontendDir, '.env'), envContent);
fs.writeFileSync(
  path.join(frontendDir, 'public/assets/.app-config-v2.json'),
  JSON.stringify(fullConfig, null, 2)
);

console.log('✅ Synchronized frontend/.env and frontend/public/assets/.app-config-v2.json with subpage config!');
