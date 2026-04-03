#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const plist = require('plist');

const DEFAULT_UPLOAD_ENDPOINT =
  'http://14.225.210.29:8002/v1/file/version/upload';
const DEFAULT_VERSION_ENDPOINT =
  'http://14.225.210.29:8000/v2/hub/app-bundle/version';

function parseArgs(argv) {
  const result = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      // skip unknown positional arguments
      continue;
    }
    const key = arg.slice(2);
    const value =
      argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
    if (value === true) {
      result[key] = true;
    } else {
      result[key] = value;
      i += 1;
    }
  }
  return result;
}

function resolveBoolean(value, fallback) {
  if (value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  return value.toString().toLowerCase() === 'true';
}

async function uploadBundle({zipPath, uploadEndpoint, uploadToken}) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(zipPath));

  const headers = {
    ...formData.getHeaders(),
  };
  // if (uploadToken) {
  //   headers.Authorization = `Bearer ${uploadToken}`;
  // }
  headers['api-key'] =
    '62c4608b5e80578b95ff1e6fcc4d1137612e7e5e5747ce85adcc0cbb89e3e6e1';

  const response = await axios.post(uploadEndpoint, formData, {headers});
  const payload = response.data;

  if (!payload || payload.code !== 0 || !payload.data || payload.error) {
    throw new Error(`Upload API error: ${JSON.stringify(payload)}`);
  }

  const {filename, path: downloadPath, size} = payload.data;
  if (!filename || !downloadPath || size === undefined) {
    throw new Error(
      `Upload response missing required fields: ${JSON.stringify(payload.data)}`,
    );
  }

  return {filename, downloadPath, size};
}

async function notifyVersion({versionEndpoint, versionToken, payload}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  // if (versionToken) {
  //   headers.Authorization = `Bearer ${versionToken}`;
  // }
  headers['api-key'] =
    '62c4608b5e80578b95ff1e6fcc4d1137612e7e5e5747ce85adcc0cbb89e3e6e1';

  try {
    const response = await axios.post(versionEndpoint, payload, {headers});
    return response.data;
  } catch (error) {
    console.error('[upload.js] Error:', error?.data);
    return error;
  }
}

function getAndroidVersion(buildGradlePath) {
  const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  const match = buildGradleContent.match(/versionName\s+"([^"]+)"/);
  return match ? match[1] : null;
}

function getIOSVersion(infoPlistPath) {
  const infoPlistContent = fs.readFileSync(infoPlistPath, 'utf8');
  const parsedPlist = plist.parse(infoPlistContent);
  return parsedPlist.CFBundleShortVersionString || null;
}

async function main() {
  const args = parseArgs(process.argv);
  const zipPath = args.zip
    ? path.resolve(args.zip)
    : path.resolve('..', '_bundle', 'bundle.zip');

  if (!fs.existsSync(zipPath)) {
    throw new Error(`Bundle zip not found at ${zipPath}`);
  }

  const uploadEndpoint = DEFAULT_UPLOAD_ENDPOINT;
  const versionEndpoint = DEFAULT_VERSION_ENDPOINT;

  const uploadToken =
    process.env.UPLOAD_API_TOKEN ||
    process.env.API_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpdGllcyI6bnVsbCwiZXhwIjoxNzYzNTQ0MDI4LCJpYXQiOjE3NjM1MzUwMjgsIm9yZ2FuaXphdGlvbiI6bnVsbCwicGxhbiI6MSwicGxhbkF0IjpudWxsLCJwcm9maWxlIjoyLCJyb2xlIjoiUk9MRV9BRE1JTiIsInNlc3Npb24iOjYsInN1YiI6MiwidHlwZSI6IkFDQ0VTUyJ9.5pT5VPl4ddimIyrTCeNA2iReP6q5lTXKlZe7h-60Ioc';
  const versionToken =
    process.env.VERSION_API_TOKEN ||
    process.env.API_TOKEN ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpdGllcyI6bnVsbCwiZXhwIjoxNzYzNTUzNzc0LCJpYXQiOjE3NjM1NDQ3NzQsIm9yZ2FuaXphdGlvbiI6bnVsbCwicGxhbiI6MSwicGxhbkF0IjpudWxsLCJwcm9maWxlIjoyLCJyb2xlIjoiUk9MRV9BRE1JTiIsInNlc3Npb24iOjYsInN1YiI6MiwidHlwZSI6IkFDQ0VTUyJ9.Aw15gp7AF2FN4cSHEanB2jkfMRKg58J-gNyxTSTmQ_g';

  if (!uploadToken) {
    throw new Error(
      'Missing upload token. Please set UPLOAD_API_TOKEN or API_TOKEN.',
    );
  }
  if (!versionToken) {
    throw new Error(
      'Missing version token. Please set VERSION_API_TOKEN or API_TOKEN.',
    );
  }

  const appName = args.appName || process.env.VERSION_APP_NAME || 'QHPro';
  const platform = args.platform || process.env.VERSION_PLATFORM || 'ios';
  let versionName = args.versionName || process.env.VERSION_NAME;

  if (!versionName) {
    if (platform === 'android') {
      const buildGradlePath = path.resolve(
        '..',
        'android',
        'app',
        'build.gradle',
      );
      versionName = getAndroidVersion(buildGradlePath);
      if (!versionName) {
        throw new Error('Could not find Android versionName in build.gradle');
      }
    } else if (platform === 'ios') {
      const infoPlistPath = path.resolve('..', 'ios', 'BADASA', 'Info.plist');
      versionName = getIOSVersion(infoPlistPath);
      if (!versionName) {
        throw new Error(
          'Could not find iOS CFBundleShortVersionString in Info.plist',
        );
      }
    } else {
      throw new Error(
        `Unsupported platform: ${platform}. Cannot automatically determine version.`,
      );
    }
  }

  const forceUpdate = resolveBoolean(
    args.forceUpdate ?? process.env.VERSION_FORCE_UPDATE,
    false,
  );
  const active = resolveBoolean(
    args.active ?? process.env.VERSION_ACTIVE,
    true,
  );
  console.log('UPLOAD....1');
  const {filename, downloadPath, size} = await uploadBundle({
    zipPath,
    uploadEndpoint,
    uploadToken,
  });

  console.log('UPLOAD....');

  const versionPayload = {
    appName,
    platform,
    versionName,
    forceUpdate,
    downloadUrl: downloadPath,
    bundleSize: size,
    bundleName: filename,
    active,
  };

  const versionResponse = await notifyVersion({
    versionEndpoint,
    versionToken,
    payload: versionPayload,
  });

  console.log('Upload succeeded with metadata:', versionPayload);
  console.log('Version API response:', JSON.stringify(versionResponse));
}

main().catch(error => {
  console.error('[upload.js] Error:', error.message);
  process.exit(1);
});
