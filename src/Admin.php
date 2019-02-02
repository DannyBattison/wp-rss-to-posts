<?php

namespace Danny\WordPress\Rss;

class Admin
{
    const JS_PATH = '../admin/build/static/js/';

    /** @var Admin|null */
    private static $adminPage = null;

    /**
     * @return Admin
     */
    public static function getInstance()
    {
        if (self::$adminPage === null) {
            self::$adminPage = new Admin;
        }

        return self::$adminPage;
    }

    /**
     * Register WordPress hooks
     */
    public function registerHooks()
    {
        add_action('wp_ajax_rss2posts_readfeed', [$this, 'readFeed']);
        add_action('wp_ajax_rss2posts_saveconfig', [$this, 'saveConfig']);
        add_action('admin_menu', [$this, 'registerAdminPage']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueScripts']);
    }

    /**
     * Read a feed for admin preview
     */
    public function readFeed()
    {
        $feedIo = \FeedIo\Factory::create()->getFeedIo();
        $result = $feedIo->read($_POST['feedUrl']);

        $feedItems = [];
        foreach ($result->getFeed() as $item) {
            $feedItems[] = new RssItem($item);
        }

        echo json_encode($feedItems);
        wp_die();
    }

    /**
     * Save config to database
     */
    public function saveConfig()
    {
        $jsonData = file_get_contents('php://input');

        update_option(RssReader::OPTION_NAME_CONFIG, $jsonData);

        wp_die();
    }

    /**
     * Register the WordPress admin page
     */
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

    /**
     * Output the admin page
     */
    function adminPage()
    {
        $rssFeeds = get_option(RssReader::OPTION_NAME_CONFIG);

        if (empty($rssFeeds)) {
            $rssFeeds = '[]';
        }

        echo "<div class='wrap'>
                <h2>RSS to Posts</h2>
                <div id='rss2posts-admin' data-rssFeeds='$rssFeeds'></div>
              </div>";
    }

    /**
     * Enqueue admin styles and scripts
     */
    public function enqueueScripts()
    {
        $baseUrl = plugin_dir_url(__FILE__) . self::JS_PATH;
        $files = scandir(plugin_dir_path(__FILE__) . self::JS_PATH);
        foreach ($files as $file) {
            $fileInfo = pathinfo($file);

            if ($fileInfo['extension'] !== 'js') {
                continue;
            }

            wp_enqueue_script('rss2posts-' . $file, $baseUrl . $file);
        }

        wp_enqueue_style(
            'rss2posts-bootstrap',
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
        );

        wp_enqueue_style(
            'rss2posts-bootstrap-theme',
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css'
        );
    }
}
