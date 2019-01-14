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

    public function registerHooks()
    {
        add_action('admin_menu', [$this, 'registerAdminPage']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueScripts']);
    }

    public function registerAdminPage()
    {
        add_menu_page(
            'RSS to Posts',
            'RSS to Posts',
            'manage_options',
            'rss2posts',
            [$this, 'adminPage'],
            'dashicons-rss',
            6
        );
    }

    function adminPage()
    {
        echo '<div class="wrap">
                <h2>RSS to Posts</h2>
                <div id="rss2posts-admin"></div>
              </div>';
    }

    public function enqueueScripts()
    {
        $baseUrl = plugin_dir_url(__FILE__) . '../admin/build/static/js/';
        $files = scandir(plugin_dir_path(__FILE__) . '../admin/build/static/js');
        foreach ($files as $file) {
            if ($file[0] === '.') {
                continue;
            }

            wp_enqueue_script('rss2posts-' . $file, $baseUrl . $file);
        }
    }
}
