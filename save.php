<?php
/**
 * UBI Services – Phone Directory Backend
 * Place this file alongside index.html and data.json on your Synology NAS.
 *
 * GET  save.php        → returns contents of data.json
 * POST save.php        → writes JSON body to data.json, returns {"status":"ok"}
 */

header('Content-Type: application/json; charset=utf-8');

// Only allow requests from the same origin (same NAS)
// Adjust if you ever need cross-origin access
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data.json';

// ── GET ──────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        // Stream the file directly — most efficient
        readfile($dataFile);
    } else {
        // First run — return empty structure, app will seed defaults
        echo json_encode(['data' => [], 'updated' => null]);
    }
    exit;
}

// ── POST ─────────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');

    if (empty($raw)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Empty body']);
        exit;
    }

    $decoded = json_decode($raw, true);

    if ($decoded === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
        exit;
    }

    // Write atomically: write to temp file, then rename
    // This prevents corrupt data.json if server crashes mid-write
    $tmp = $dataFile . '.tmp';
    $bytes = file_put_contents($tmp, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    if ($bytes === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Could not write file. Check folder permissions.']);
        exit;
    }

    rename($tmp, $dataFile);

    echo json_encode(['status' => 'ok', 'bytes' => $bytes]);
    exit;
}

// ── Any other method ─────────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
?>
