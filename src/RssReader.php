<?php

namespace Danny\WordPress\Rss;

class RssReader
{
    const CRON_HOOK = 'rss2posts_import';
    const OPTION_NAME_CONFIG = 'rss2posts-config';
    const OPTION_NAME_HISTORY = 'rss2posts-history';
    const MAX_PER_IMPORT = 5;

    /** @var RssReader|null */
    private static $rssReader = null;

    /** @var \FeedIo\FeedIo */
    private $feedIo;

    /**
     * @return RssReader
     */
    public static function getInstance()
    {
        if (self::$rssReader === null) {
            self::$rssReader = new RssReader;
        }

        return self::$rssReader;
    }

    public function __construct()
    {
        $this->feedIo = \FeedIo\Factory::create()->getFeedIo();
    }

    /**
     * @return array
     */
    public function getFeeds()
    {
        return json_decode(get_option(self::OPTION_NAME_CONFIG));
    }

    public function registerHooks()
    {
        add_action(self::CRON_HOOK, [$this, 'importPosts']);
    }

    public function importPosts()
    {
        require_once(ABSPATH . 'wp-admin/includes/taxonomy.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        $importedItems = json_decode(get_option(self::OPTION_NAME_HISTORY), true);

        foreach ($this->getFeeds() as $feed) {
            $result = $this->feedIo->read($feed->feedUrl);

            $feedItems = [];
            $importedCount = 0;
            foreach ($result->getFeed() as $item) {
                $rssItem = new RssItem($item);

                $feedItems[] = $rssItem;

                if (!in_array($rssItem->link, $importedItems)) {
                    $this->importItem($rssItem, $feed);
                    $importedItems[] = $rssItem->link;

                    if (++$importedCount >= self::MAX_PER_IMPORT) {
                        break;
                    }
                }
            }
        }

        update_option(self::OPTION_NAME_HISTORY, json_encode($importedItems));
    }

    /**
     * @param RssItem $rssItem
     * @param stdClass $feed
     */
    private function importItem(RssItem $rssItem, $feed)
    {
        $categories = array_map(
            function ($category) {
                return \wp_create_category(trim($category));
            },
            explode(',', $this->prepareString($rssItem, $feed->postCategories))
        );

        $postId = wp_insert_post([
            'post_date' => $rssItem->created,
            'post_title' => $this->prepareString($rssItem, $feed->postTitle),
            'post_content' => $this->prepareString($rssItem, $feed->postContent),
            'post_category' => $categories,
            'post_status' => 'publish',
        ], true);

        foreach ($rssItem->mediaUrls as $mediaUrl) {
            $mediaId = media_sideload_image($mediaUrl, $postId, $rssItem->content, 'id');
            set_post_thumbnail($postId, $mediaId);
        }

        $importedItems[] = $rssItem->link;
    }

    /**
     * @param RssItem $rssItem
     * @param string $format
     * @return string
     */
    private function prepareString(RssItem $rssItem, $format)
    {
        return str_replace(
            ['%TITLE%', '%CONTENT%', '%CATEGORIES%'],
            [$rssItem->title, $rssItem->content, implode(',', $rssItem->categories)],
            $format
        );
    }
}
