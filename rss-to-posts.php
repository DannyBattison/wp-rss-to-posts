<?php
/*
	Plugin Name: RSS to Posts
	Plugin URI: https://danny.gg
	Description: Imports posts from an RSS feed to
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
