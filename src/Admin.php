<?php

namespace Danny\WordPress\Rss;

class Admin
{
    /** @var RssReader|null */
    private static $adminPage = null;

    public static function getInstance()
    {
        if (self::$adminPage === null) {
            self::$adminPage = new Admin;
        }

        return self::$adminPage;
    }

    /**
     * @todo: register hooks
     */
    public function registerHooks()
    {
        add_action('admin_menu', [$this, 'registerAdminPage']);
    }

    public function registerAdminPage()
    {
        add_menu_page(
            'RSS to Posts',
            'Rss to Posts',
            'manage_options',
            'myplugin/myplugin-admin-page.php',
            [$this, 'adminPage'],
            'dashicons-rss',
            6
        );
    }

    public function adminPage()
    {

    }
}
