<?php
/**
 * UBI Services – Phone Directory Backend
 * Place this file alongside index.html and data.json on your Synology NAS.
 *
 * GET  save.php        → returns contents of data.json
 * POST save.php        → writes JSON body to data.json, returns {"status":"ok"}
 */

header('Content-Type: application/json; charset=utf-8');

// Allow only same-origin by default (override with ALLOWED_ORIGIN env var if needed)
$allowedOrigin = getenv('ALLOWED_ORIGIN') ?: '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($allowedOrigin !== '' && $origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
}
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
    if ($allowedOrigin !== '' && $origin !== $allowedOrigin) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Origin not allowed']);
        exit;
    }

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

    if (!is_array($decoded) || !isset($decoded['data']) || !is_array($decoded['data'])) {
        http_response_code(422);
        echo json_encode(['status' => 'error', 'message' => 'Invalid payload. Expected {"data":[],"updated":...}']);
        exit;
    }

    if (count($decoded['data']) > 3000) {
        http_response_code(413);
        echo json_encode(['status' => 'error', 'message' => 'Payload too large']);
        exit;
    }

    foreach ($decoded['data'] as $idx => $entry) {
        if (!is_array($entry)) {
            http_response_code(422);
            echo json_encode(['status' => 'error', 'message' => 'Entry must be an object', 'index' => $idx]);
            exit;
        }
        $hasPersons = isset($entry['persons']) && is_array($entry['persons']) && count($entry['persons']) > 0;
        $hasExt = isset($entry['ext']) && trim((string)$entry['ext']) !== '';
        $hasDept = isset($entry['dept']) && trim((string)$entry['dept']) !== '';
        if (!$hasPersons || !$hasExt || !$hasDept) {
            http_response_code(422);
            echo json_encode([
                'status' => 'error',
                'message' => 'Each entry requires persons[], ext and dept',
                'index' => $idx
            ]);
            exit;
        }
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

    if (!rename($tmp, $dataFile)) {
        @unlink($tmp);
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Could not finalize write']);
        exit;
    }

    echo json_encode(['status' => 'ok', 'bytes' => $bytes]);
    exit;
}

// ── Any other method ─────────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
?>
