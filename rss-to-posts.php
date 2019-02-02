<?php
/*
	Plugin Name: RSS to Posts
	Plugin URI: https://danny.gg/rss-to-posts-wordpress-plugin/
	Description: Imports posts from an RSS feed into WordPress posts.
	Version: 1.0
	Author: Danny Battison
	Author URI: https://danny.gg
	License: GPL2
*/

require "vendor/autoload.php";

use Danny\WordPress\Rss\RssReader;
use Danny\WordPress\Rss\Admin;

$rssReader = RssReader::getInstance();
$rssReader->registerHooks();

$admin = Admin::getInstance();
$admin->registerHooks();

register_activation_hook(__FILE__, function () {
    if (! wp_next_scheduled (RssReader::CRON_HOOK)) {
        wp_schedule_event(time(), 'hourly', RssReader::CRON_HOOK);
    }
});

register_deactivation_hook(__FILE__, function () {
    wp_clear_scheduled_hook(RssReader::CRON_HOOK);
});
