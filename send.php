<?php
/**
 * ГлобалМеталлХолд — приём заявок с сайта и отправка на почту через SMTP.
 *
 * Работает на обычном PHP-хостинге (PHP 7.2+, для SSL/TLS нужно расширение openssl).
 * Настройки почты — в mail-config.php (создаётся «Редактором сайта», вкладка «Почта»).
 *
 * Как обрабатывается файл:
 *  - файл до big_file_mb (по умолчанию 15 МБ) прикрепляется к письму прямо из временного файла PHP;
 *  - файл больше этого порога сначала сохраняется в папку files/ под случайным именем,
 *    отправляется на адрес для заявок и сразу удаляется (в том числе при ошибке).
 *  Вложение читается и кодируется кусками, поэтому большие файлы не занимают память.
 */
declare(strict_types=1);

define('GMH_MAIL', 1);
define('FILES_DIR', __DIR__ . '/files');

@ini_set('display_errors', '0');
ignore_user_abort(true);
@set_time_limit(300);
if (function_exists('mb_internal_encoding')) { mb_internal_encoding('UTF-8'); }

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

/* Файлы, которые нужно удалить при любом завершении скрипта (в т.ч. после ошибки) */
$GLOBALS['gmh_cleanup'] = [];
register_shutdown_function(function () {
    foreach ($GLOBALS['gmh_cleanup'] as $f) { if (is_file($f)) { @unlink($f); } }
});

function out(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function log_err(string $msg): void {
    $msg = preg_replace('/[\r\n]+/', ' ', $msg);
    error_log('[gmh-send] ' . $msg);
    if (!is_dir(FILES_DIR)) { return; }
    $log = FILES_DIR . '/send-errors.log';
    if (is_file($log) && filesize($log) > 200000) { @unlink($log); }
    @file_put_contents($log, date('c') . ' ' . $msg . "\n", FILE_APPEND | LOCK_EX);
}

function ini_bytes($v): int {
    $v = trim((string)$v);
    if ($v === '') { return 0; }
    $n = (float)$v;
    $u = strtolower(substr($v, -1));
    if ($u === 'g') { $n *= 1073741824; } elseif ($u === 'm') { $n *= 1048576; } elseif ($u === 'k') { $n *= 1024; }
    return (int)$n;
}

function ensure_files_dir(): bool {
    if (!is_dir(FILES_DIR)) { @mkdir(FILES_DIR, 0750, true); }
    if (!is_dir(FILES_DIR)) { return false; }
    $ht = FILES_DIR . '/.htaccess';
    if (!is_file($ht)) {
        @file_put_contents($ht, "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order deny,allow\n  Deny from all\n</IfModule>\n");
    }
    $ix = FILES_DIR . '/index.html';
    if (!is_file($ix)) { @file_put_contents($ix, ''); }
    return is_writable(FILES_DIR);
}

function load_config(): ?array {
    foreach ([__DIR__ . '/mail-config.php', dirname(__DIR__) . '/gmh-mail-config.php'] as $p) {
        if (is_file($p)) {
            $c = include $p;
            if (is_array($c)) {
                $c += [
                    'host' => '', 'port' => 465, 'secure' => 'ssl', 'username' => '', 'password' => '',
                    'from_email' => '', 'from_name' => 'ГлобалМеталлХолд', 'to_email' => '',
                    'subject_prefix' => '[Заявка с сайта]', 'big_file_mb' => 15, 'max_file_mb' => 20,
                    'allowed_ext' => ['pdf', 'dwg', 'dxf', 'zip', 'rar'],
                    'rate_limit' => 5, 'rate_window' => 600, 'verify_tls' => true,
                ];
                if ($c['host'] === '' || $c['from_email'] === '' || $c['to_email'] === '') { return null; }
                return $c;
            }
        }
    }
    return null;
}

/* Ограничение частоты: не больше $limit запросов за $window секунд для одного ключа */
function rate_ok(string $key, int $limit, int $window): bool {
    $f = FILES_DIR . '/rl_' . sha1($key) . '.json';
    $fp = @fopen($f, 'c+');
    if (!$fp) { return true; }
    flock($fp, LOCK_EX);
    $arr = json_decode((string)stream_get_contents($fp), true);
    if (!is_array($arr)) { $arr = []; }
    $now = time();
    $arr = array_values(array_filter($arr, function ($t) use ($now, $window) { return $t > $now - $window; }));
    $ok = count($arr) < $limit;
    if ($ok) { $arr[] = $now; }
    ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode($arr)); fflush($fp);
    flock($fp, LOCK_UN); fclose($fp);
    return $ok;
}

/* Удаляем «потерянные» временные файлы (если скрипт когда-то был прерван) */
function sweep_files(int $window): void {
    foreach ((array)glob(FILES_DIR . '/upl_*') as $f) { if (is_file($f) && filemtime($f) < time() - 3600) { @unlink($f); } }
    foreach ((array)glob(FILES_DIR . '/rl_*') as $f) { if (is_file($f) && filemtime($f) < time() - max(3600, $window * 2)) { @unlink($f); } }
}

function cut(string $s, int $n): string {
    return function_exists('mb_substr') ? mb_substr($s, 0, $n, 'UTF-8') : substr($s, 0, $n);
}
function clean_line($s, int $max): string {
    $s = preg_replace('/[\p{Cc}\p{Cf}]+/u', ' ', (string)$s);
    return cut(trim((string)$s), $max);
}
function clean_text($s, int $max): string {
    $s = str_replace("\r\n", "\n", (string)$s);
    $s = str_replace("\r", "\n", $s);
    $s = preg_replace('/[^\P{Cc}\n\t]/u', '', $s);
    return cut(trim((string)$s), $max);
}
function safe_filename(string $name, string $ext): string {
    $name = preg_replace('/[\p{Cc}"\\\\\/:*?<>|]+/u', '_', $name);
    $name = cut(trim((string)$name, " ._"), 80);
    return $name !== '' ? $name : 'file.' . $ext;
}

/* Заголовок письма с не-ASCII символами: =?UTF-8?B?...?= (с переносом длинных строк) */
function mime_header(string $s): string {
    if (preg_match('/^[\x20-\x7E]*$/', $s)) { return $s; }
    preg_match_all('/./us', $s, $m);
    $words = []; $buf = '';
    foreach ($m[0] as $ch) {
        if (strlen($buf) + strlen($ch) > 42) { $words[] = $buf; $buf = ''; }
        $buf .= $ch;
    }
    if ($buf !== '') { $words[] = $buf; }
    return implode("\r\n ", array_map(function ($w) { return '=?UTF-8?B?' . base64_encode($w) . '?='; }, $words));
}
function mime_addr(string $name, string $email): string {
    $name = trim($name);
    if ($name === '') { return '<' . $email . '>'; }
    $h = mime_header($name);
    if ($h === $name) { $h = '"' . addcslashes($name, "\"\\") . '"'; }
    return $h . ' <' . $email . '>';
}

/* ---------- Минимальный SMTP-клиент (SSL / STARTTLS / без шифрования, AUTH PLAIN / LOGIN) ---------- */
class GmhSmtp {
    private $c;
    private $fp = null;

    public function __construct(array $cfg) { $this->c = $cfg; }

    private function write(string $s): void {
        $len = strlen($s);
        while ($len > 0) {
            $n = @fwrite($this->fp, $s);
            if ($n === false || $n === 0) { throw new RuntimeException('SMTP: ошибка записи в соединение (таймаут или обрыв)'); }
            if ($n >= $len) { return; }
            $s = substr($s, $n);
            $len -= $n;
        }
    }
    private function read(): array {
        $all = ''; $code = 0;
        while (true) {
            $l = fgets($this->fp, 2048);
            if ($l === false) { throw new RuntimeException('SMTP: соединение прервано или таймаут ответа'); }
            $all .= $l;
            if (strlen($l) < 4 || $l[3] !== '-') { $code = (int)substr($l, 0, 3); break; }
        }
        return [$code, $all];
    }
    private function cmd(string $line, array $ok): string {
        $this->write($line . "\r\n");
        list($code, $resp) = $this->read();
        if (!in_array($code, $ok, true)) { throw new RuntimeException('SMTP ' . $code . ': ' . trim($resp)); }
        return $resp;
    }
    private function ehlo(): string {
        $name = preg_replace('/[^A-Za-z0-9.\-]/', '', (string)($_SERVER['SERVER_NAME'] ?? ''));
        if ($name === '') { $name = 'localhost'; }
        $this->write('EHLO ' . $name . "\r\n");
        list($code, $resp) = $this->read();
        if ($code !== 250) { return $this->cmd('HELO ' . $name, [250]); }
        return $resp;
    }

    private function connect(): void {
        $host = (string)$this->c['host']; $port = (int)$this->c['port']; $secure = (string)$this->c['secure'];
        $verify = !empty($this->c['verify_tls']);
        $ctx = stream_context_create(['ssl' => [
            'verify_peer' => $verify, 'verify_peer_name' => $verify, 'peer_name' => $host, 'SNI_enabled' => true,
        ]]);
        $remote = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
        $this->fp = @stream_socket_client($remote, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $ctx);
        if (!$this->fp) { throw new RuntimeException("Не удалось подключиться к $host:$port ($errno $errstr)"); }
        stream_set_timeout($this->fp, 60);
        list($code, $resp) = $this->read();
        if ($code !== 220) { throw new RuntimeException('SMTP ' . $code . ': ' . trim($resp)); }
        $caps = $this->ehlo();
        if ($secure === 'tls') {
            $this->cmd('STARTTLS', [220]);
            if (!@stream_socket_enable_crypto($this->fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('Не удалось включить TLS (STARTTLS). Проверьте порт и сертификат сервера');
            }
            $caps = $this->ehlo();
        }
        $user = (string)$this->c['username'];
        if ($user !== '') {
            $pass = (string)$this->c['password'];
            if (preg_match('/AUTH[ =][^\r\n]*\bPLAIN\b/i', $caps)) {
                $this->cmd('AUTH PLAIN ' . base64_encode("\0" . $user . "\0" . $pass), [235]);
            } else {
                $this->cmd('AUTH LOGIN', [334]);
                $this->cmd(base64_encode($user), [334]);
                $this->cmd(base64_encode($pass), [235]);
            }
        }
    }

    /**
     * $m: subject, text, reply_to_name, reply_to_email, attachment (['path','name'] или null)
     */
    public function send(array $m): void {
        $from = (string)$this->c['from_email'];
        $rcpts = array_values(array_filter(array_map('trim', preg_split('/[,;]+/', (string)$this->c['to_email']))));
        if (!$rcpts) { throw new RuntimeException('Не указан адрес получателя заявок'); }
        try {
            $this->connect();
            $this->cmd('MAIL FROM:<' . $from . '>', [250]);
            foreach ($rcpts as $r) { $this->cmd('RCPT TO:<' . $r . '>', [250, 251]); }
            $this->cmd('DATA', [354]);

            $b = '=_gmh_' . bin2hex(random_bytes(12));
            $domain = substr((string)strrchr($from, '@'), 1) ?: 'localhost';
            $h = [];
            $h[] = 'Date: ' . date('r');
            $h[] = 'From: ' . mime_addr((string)$this->c['from_name'], $from);
            $h[] = 'To: ' . implode(', ', $rcpts);
            if (!empty($m['reply_to_email'])) { $h[] = 'Reply-To: ' . mime_addr((string)($m['reply_to_name'] ?? ''), $m['reply_to_email']); }
            $h[] = 'Subject: ' . mime_header((string)$m['subject']);
            $h[] = 'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $domain . '>';
            $h[] = 'MIME-Version: 1.0';
            $h[] = 'Content-Type: multipart/mixed; boundary="' . $b . '"';
            $this->write(implode("\r\n", $h) . "\r\n\r\n");

            $this->write('--' . $b . "\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n");
            $this->write(chunk_split(base64_encode((string)$m['text']), 76, "\r\n"));

            if (!empty($m['attachment'])) {
                $a = $m['attachment'];
                $nm = (string)$a['name'];
                $ascii = preg_replace('/[^\x20-\x7E]/', '_', $nm);
                $params = 'name="' . addcslashes($ascii, "\"\\") . '"';
                $dparams = 'filename="' . addcslashes($ascii, "\"\\") . '"';
                if ($ascii !== $nm) { // не-ASCII имя: RFC 2231 (filename*=UTF-8''...)
                    $enc = "UTF-8''" . rawurlencode($nm);
                    $params .= '; name*=' . $enc;
                    $dparams .= '; filename*=' . $enc;
                }
                $this->write('--' . $b . "\r\nContent-Type: application/octet-stream; " . $params .
                    "\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; " . $dparams . "\r\n\r\n");
                $fh = fopen($a['path'], 'rb');
                if (!$fh) { throw new RuntimeException('Не удалось открыть файл для отправки'); }
                $chunk = 57 * 200; // кратно 3 → строки base64 по 76 символов без обрывов
                while (!feof($fh)) {
                    $buf = '';
                    while (strlen($buf) < $chunk && !feof($fh)) {
                        $r = fread($fh, $chunk - strlen($buf));
                        if ($r === false || $r === '') { break; }
                        $buf .= $r;
                    }
                    if ($buf === '') { break; }
                    $this->write(chunk_split(base64_encode($buf), 76, "\r\n"));
                }
                fclose($fh);
            }
            $this->write('--' . $b . "--\r\n.\r\n");
            list($code, $resp) = $this->read();
            if ($code !== 250) { throw new RuntimeException('SMTP ' . $code . ': ' . trim($resp)); }
            try { $this->cmd('QUIT', [221]); } catch (Throwable $e) { /* не критично */ }
        } finally {
            if ($this->fp) { @fclose($this->fp); $this->fp = null; }
        }
    }
}

/* =============================== Обработка запроса =============================== */

$dirOk = ensure_files_dir();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/* Диагностика для редактора: GET send.php?status=1 */
if ($method === 'GET') {
    if (isset($_GET['status'])) {
        out([
            'ok' => true,
            'configured' => load_config() !== null,
            'filesWritable' => $dirOk,
            'openssl' => extension_loaded('openssl'),
            'uploadMaxMb' => round(ini_bytes(ini_get('upload_max_filesize')) / 1048576, 1),
            'postMaxMb' => round(ini_bytes(ini_get('post_max_size')) / 1048576, 1),
            'php' => PHP_VERSION,
        ]);
    }
    out(['ok' => false, 'error' => 'method'], 405);
}
if ($method !== 'POST') { out(['ok' => false, 'error' => 'method'], 405); }

/* Слишком большой запрос: PHP в этом случае вообще не заполняет $_POST/$_FILES */
$postMax = ini_bytes(ini_get('post_max_size'));
if ($postMax > 0 && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > $postMax) { out(['ok' => false, 'error' => 'too_large'], 413); }

$cfg = load_config();
if ($cfg === null) { out(['ok' => false, 'error' => 'not_configured'], 503); }
if (!$dirOk) { log_err('Папка files недоступна для записи'); out(['ok' => false, 'error' => 'server'], 500); }
if (in_array($cfg['secure'], ['ssl', 'tls'], true)) {
    if (!extension_loaded('openssl')) { log_err('Не загружено расширение openssl'); out(['ok' => false, 'error' => 'server'], 500); }
}
sweep_files((int)$cfg['rate_window']);

/* ---- Тестовое письмо из редактора ---- */
if (($_POST['action'] ?? '') === 'test') {
    if (!rate_ok('test', 1, 60)) { out(['ok' => false, 'error' => 'rate_limited'], 429); }
    try {
        (new GmhSmtp($cfg))->send([
            'subject' => $cfg['subject_prefix'] . ' Тестовое письмо',
            'text' => "Это тестовое письмо из редактора сайта.\nЕсли вы его получили — отправка заявок через SMTP настроена правильно.\n\n" . date('c'),
        ]);
        out(['ok' => true]);
    } catch (Throwable $e) {
        log_err('test: ' . $e->getMessage());
        out(['ok' => false, 'error' => 'smtp_failed', 'detail' => $e->getMessage()], 502);
    }
}

/* ---- Заявка ---- */
// Ловушка для ботов: поле «website» невидимо для людей
if (trim((string)($_POST['website'] ?? '')) !== '') { out(['ok' => true]); }

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
if (!rate_ok('ip:' . $ip, max(1, (int)$cfg['rate_limit']), max(60, (int)$cfg['rate_window']))) {
    out(['ok' => false, 'error' => 'rate_limited'], 429);
}

$name = clean_line($_POST['name'] ?? '', 100);
$phone = clean_line($_POST['phone'] ?? '', 30);
$email = clean_line($_POST['email'] ?? '', 254);
$company = clean_line($_POST['company'] ?? '', 150);
$comment = clean_text($_POST['comment'] ?? '', 5000);
$lang = (($_POST['lang'] ?? 'ru') === 'en') ? 'en' : 'ru';

if ((function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name)) < 2
    || !preg_match('/^[+()\-\s\d]{7,20}$/', $phone)
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || !preg_match('/^[^\s<>",;]+$/', $email)) {
    out(['ok' => false, 'error' => 'validation'], 422);
}

$attachment = null;
$file = $_FILES['file'] ?? null;
if (is_array($file) && ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    $err = (int)$file['error'];
    if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) { out(['ok' => false, 'error' => 'too_large'], 413); }
    if ($err !== UPLOAD_ERR_OK || !is_uploaded_file((string)$file['tmp_name'])) {
        log_err('Ошибка загрузки файла, код ' . $err);
        out(['ok' => false, 'error' => 'upload_failed'], 400);
    }
    $orig = basename(str_replace('\\', '/', (string)$file['name']));
    $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
    if (!in_array($ext, array_map('strtolower', (array)$cfg['allowed_ext']), true)) { out(['ok' => false, 'error' => 'bad_type'], 415); }
    $size = (int)filesize((string)$file['tmp_name']);
    if ($size > (int)$cfg['max_file_mb'] * 1048576) { out(['ok' => false, 'error' => 'too_large'], 413); }

    $path = (string)$file['tmp_name'];
    if ($size > (int)$cfg['big_file_mb'] * 1048576) {
        // Большой файл: сохраняем в files/, отправляем оттуда и удаляем (удаление — в shutdown-функции)
        $path = FILES_DIR . '/upl_' . bin2hex(random_bytes(16)) . '.bin';
        $GLOBALS['gmh_cleanup'][] = $path;
        if (!move_uploaded_file((string)$file['tmp_name'], $path)) {
            log_err('Не удалось сохранить файл в files/');
            out(['ok' => false, 'error' => 'server'], 500);
        }
    }
    $attachment = ['path' => $path, 'name' => safe_filename($orig, $ext), 'size' => $size];
}

$text = "Новая заявка с сайта\n\n" .
    "Имя: $name\nТелефон: $phone\nEmail: $email\n" .
    'Компания: ' . ($company !== '' ? $company : '—') . "\n" .
    "Язык сайта: $lang\n\n" .
    "Комментарий:\n" . ($comment !== '' ? $comment : '—') . "\n\n" .
    ($attachment
        ? 'Файл: ' . $attachment['name'] . ' (' . number_format($attachment['size'] / 1048576, 2, '.', '') . " МБ) — во вложении\n"
        : "Файл: не приложен\n");

$subject = trim((string)$cfg['subject_prefix']) . ' ' . $name . ($company !== '' ? ' — ' . $company : '');

try {
    (new GmhSmtp($cfg))->send([
        'subject' => cut($subject, 180),
        'text' => $text,
        'reply_to_name' => $name,
        'reply_to_email' => $email,
        'attachment' => $attachment,
    ]);
} catch (Throwable $e) {
    log_err('send: ' . $e->getMessage());
    out(['ok' => false, 'error' => 'smtp_failed'], 502);
}
out(['ok' => true]);
