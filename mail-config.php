<?php
/**
 * Настройки исходящей почты (SMTP) для send.php. Создано «Редактором сайта» 16.11.2026, 08:37:41.
 * Содержит пароль: не публикуйте файл и не добавляйте его в git.
 * Положите рядом с send.php (или на уровень выше под именем gmh-mail-config.php).
 */
if (!defined('GMH_MAIL')) { http_response_code(403); exit; }

return [
    'host'           => 'exby.atservers.net',
    'port'           => 587,
    'secure'         => 'tls',
    'username'       => 'dmitriy.havron@gmhold.com',
    'password'       => 'Ch01470#',
    'from_email'     => 'dmitriy.havron@gmhold.com',
    'from_name'      => 'ГлобалМеталлХолд',
    'to_email'       => 'dmitriy.havron@minavto.by',
    'subject_prefix' => '[Заявка с сайта]',
    'big_file_mb'    => 21,
    'max_file_mb'    => 15,
    'allowed_ext'    => ['pdf', 'dwg', 'dxf', 'zip', 'rar'],
    'rate_limit'     => 5,
    'rate_window'    => 600,
    'verify_tls'     => true,
];
