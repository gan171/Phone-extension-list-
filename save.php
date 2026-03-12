<?php
/**
 * UBI Services – Phone Directory Backend
 */
header('Content-Type: application/json; charset=utf-8');

$allowedOrigin = getenv('ALLOWED_ORIGIN') ?: '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($allowedOrigin !== '' && $origin === $allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Pin, X-Admin-Actor');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data.json';
$statsFile = __DIR__ . '/stats.json';
$backupDir = __DIR__ . '/backups';
$auditFile = __DIR__ . '/audit.log';
$adminPin = getenv('ADMIN_PIN') ?: '1234';

function jsonFail(int $code, string $message, array $extra = []): void {
    http_response_code($code);
    echo json_encode(array_merge(['status' => 'error', 'message' => $message], $extra));
    exit;
}

function ensureDir(string $dir): void {
    if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
        jsonFail(500, 'Could not create required folder', ['folder' => basename($dir)]);
    }
}

function requireAllowedOrigin(string $allowedOrigin, string $origin): void {
    if ($allowedOrigin !== '' && $origin !== $allowedOrigin) {
        jsonFail(403, 'Origin not allowed');
    }
}

function isAdmin(string $adminPin): bool {
    $provided = $_SERVER['HTTP_X_ADMIN_PIN'] ?? '';
    return hash_equals((string) $adminPin, (string) $provided);
}



function tailFileLines(string $path, int $maxLines = 50): array {
    if (!file_exists($path)) {
        return [];
    }
    $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return [];
    }
    return array_slice($lines, -$maxLines);
}

function readJsonFile(string $path, array $fallback): array {
    if (!file_exists($path)) {
        return $fallback;
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        return $fallback;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $fallback;
}

$action = $_GET['action'] ?? '';


if ($action === 'history') {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonFail(405, 'Method not allowed');
    }
    if (!isAdmin($adminPin)) {
        jsonFail(403, 'Admin access required');
    }

    $backupFiles = [];
    if (is_dir($backupDir)) {
        $files = glob($backupDir . '/data-*.json');
        if (is_array($files)) {
            rsort($files);
            foreach ($files as $file) {
                $backupFiles[] = [
                    'name' => basename($file),
                    'size' => filesize($file) ?: 0,
                    'modified' => gmdate('c', filemtime($file) ?: time()),
                ];
            }
        }
    }

    $auditLines = tailFileLines($auditFile, 100);
    echo json_encode([
        'status' => 'ok',
        'history' => [
            'backups' => $backupFiles,
            'audit' => $auditLines,
        ],
    ]);
    exit;
}

// Stats endpoints
if ($action === 'stats') {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (!isAdmin($adminPin)) {
            jsonFail(403, 'Admin access required');
        }
        $stats = readJsonFile($statsFile, [
            'searches' => ['extensions' => [], 'departments' => [], 'hours' => []],
            'usage' => ['hours' => []],
            'updated' => null,
        ]);
        echo json_encode(['status' => 'ok', 'stats' => $stats]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireAllowedOrigin($allowedOrigin, $origin);
        $raw = file_get_contents('php://input');
        $decoded = json_decode($raw ?: '', true);
        if (!is_array($decoded)) {
            jsonFail(400, 'Invalid JSON');
        }

        ensureDir(dirname($statsFile));
        $stats = readJsonFile($statsFile, [
            'searches' => ['extensions' => [], 'departments' => [], 'hours' => []],
            'usage' => ['hours' => []],
            'updated' => null,
        ]);

        $hour = date('H');
        if (!isset($stats['usage']['hours'][$hour])) {
            $stats['usage']['hours'][$hour] = 0;
        }
        $stats['usage']['hours'][$hour]++;

        $type = $decoded['type'] ?? '';
        if ($type === 'search') {
            $ext = trim((string)($decoded['extension'] ?? ''));
            $dept = trim((string)($decoded['department'] ?? ''));
            if ($ext !== '') {
                if (!isset($stats['searches']['extensions'][$ext])) {
                    $stats['searches']['extensions'][$ext] = 0;
                }
                $stats['searches']['extensions'][$ext]++;
            }
            if ($dept !== '') {
                if (!isset($stats['searches']['departments'][$dept])) {
                    $stats['searches']['departments'][$dept] = 0;
                }
                $stats['searches']['departments'][$dept]++;
            }
        } elseif ($type === 'dept_filter') {
            $dept = trim((string)($decoded['department'] ?? ''));
            if ($dept !== '') {
                if (!isset($stats['searches']['departments'][$dept])) {
                    $stats['searches']['departments'][$dept] = 0;
                }
                $stats['searches']['departments'][$dept]++;
            }
        }

        $stats['updated'] = gmdate('c');
        $ok = file_put_contents($statsFile, json_encode($stats, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        if ($ok === false) {
            jsonFail(500, 'Could not persist stats');
        }

        echo json_encode(['status' => 'ok']);
        exit;
    }

    jsonFail(405, 'Method not allowed');
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        readfile($dataFile);
    } else {
        echo json_encode(['data' => [], 'updated' => null]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAllowedOrigin($allowedOrigin, $origin);

    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        jsonFail(400, 'Empty body');
    }

    $decoded = json_decode($raw, true);
    if ($decoded === null) {
        jsonFail(400, 'Invalid JSON');
    }

    if (!is_array($decoded) || !isset($decoded['data']) || !is_array($decoded['data'])) {
        jsonFail(422, 'Invalid payload. Expected {"data":[],"updated":...}');
    }

    if (count($decoded['data']) > 3000) {
        jsonFail(413, 'Payload too large');
    }

    foreach ($decoded['data'] as $idx => $entry) {
        if (!is_array($entry)) {
            jsonFail(422, 'Entry must be an object', ['index' => $idx]);
        }
        $hasPersons = isset($entry['persons']) && is_array($entry['persons']) && count($entry['persons']) > 0;
        $hasExt = isset($entry['ext']) && trim((string)$entry['ext']) !== '';
        $hasDept = isset($entry['dept']) && trim((string)$entry['dept']) !== '';
        if (!$hasPersons || !$hasExt || !$hasDept) {
            jsonFail(422, 'Each entry requires persons[], ext and dept', ['index' => $idx]);
        }
    }

    ensureDir($backupDir);
    if (file_exists($dataFile)) {
        $stamp = gmdate('Ymd-His');
        $backupFile = $backupDir . '/data-' . $stamp . '.json';
        @copy($dataFile, $backupFile);

        $backups = glob($backupDir . '/data-*.json');
        if (is_array($backups) && count($backups) > 20) {
            sort($backups);
            $removeCount = count($backups) - 20;
            for ($i = 0; $i < $removeCount; $i++) {
                @unlink($backups[$i]);
            }
        }
    }

    $tmp = $dataFile . '.tmp';
    $bytes = file_put_contents($tmp, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    if ($bytes === false) {
        jsonFail(500, 'Could not write file. Check folder permissions.');
    }

    if (!rename($tmp, $dataFile)) {
        @unlink($tmp);
        jsonFail(500, 'Could not finalize write');
    }

    $actor = trim((string)($_SERVER['HTTP_X_ADMIN_ACTOR'] ?? 'unknown'));
    $auditLine = sprintf(
        "%s\t%s\t%s\tentries=%d\tbytes=%d\n",
        gmdate('c'),
        $actor,
        $_SERVER['REMOTE_ADDR'] ?? '-',
        count($decoded['data']),
        $bytes
    );
    @file_put_contents($auditFile, $auditLine, FILE_APPEND);

    echo json_encode(['status' => 'ok', 'bytes' => $bytes]);
    exit;
}

jsonFail(405, 'Method not allowed');
