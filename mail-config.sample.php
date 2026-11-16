<?php
/**
 * Пример файла настроек почты. Обычно его не нужно править вручную:
 * «Редактор сайта» → вкладка «Почта» → «Скачать mail-config.php».
 *
 * Положите готовый файл рядом с send.php (или на уровень выше под именем gmh-mail-config.php).
 * Файл содержит пароль — не публикуйте его и не добавляйте в git.
 */
if (!defined('GMH_MAIL')) { http_response_code(403); exit; }

return [
    'host'           => 'smtp.example.com',
    'port'           => 465,            // 465 — SSL, 587 — STARTTLS, 25 — без шифрования
    'secure'         => 'ssl',          // 'ssl' | 'tls' (STARTTLS) | 'none'
    'username'       => 'sales@example.com',
    'password'       => '',
    'from_email'     => 'sales@example.com',   // адрес отправителя (обычно совпадает с логином)
    'from_name'      => 'ГлобалМеталлХолд',
    'to_email'       => 'sales@example.com',   // куда приходят заявки (можно несколько через запятую)
    'subject_prefix' => '[Заявка с сайта]',
    'big_file_mb'    => 15,             // файлы больше — проходят через папку files/ и удаляются после отправки
    'max_file_mb'    => 20,             // максимальный размер файла
    'allowed_ext'    => ['pdf', 'dwg', 'dxf', 'zip', 'rar'],
    'rate_limit'     => 5,              // не больше N заявок
    'rate_window'    => 600,            // …за столько секунд с одного IP
    'verify_tls'     => true,
];
