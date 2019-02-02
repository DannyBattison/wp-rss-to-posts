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
    public function getFeedUrls()
    {
        return array_map(
            function($feed) {
                return $feed->feedUrl;
            },
            json_decode(get_option(self::OPTION_NAME_CONFIG))
        );
    }

    public function registerHooks()
    {
        add_action(self::CRON_HOOK, [$this, 'importPosts']);
    }

    public function importPosts()
    {
        $importedItems = json_decode(get_option(self::OPTION_NAME_HISTORY), true);

        foreach ($this->getFeedUrls() as $feed) {
            $result = $this->feedIo->read($feed);

            $feedItems = [];
            $importedCount = 0;
            foreach ($result->getFeed() as $item) {
                $rssItem = new RssItem($item);

                $feedItems[] = $rssItem;

                if (!in_array($rssItem->link, $importedItems)) {
                    $this->importItem($rssItem);
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
     */
    private function importItem(RssItem $rssItem)
    {
        $postId = wp_insert_post([
            'post_date' => $rssItem->created,
            'post_content' => $rssItem->content,
            'post_title' => $rssItem->title,
            'post_status' => 'publish',
        ], true);

        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        foreach ($rssItem->mediaUrls as $mediaUrl) {
            $mediaId = media_sideload_image($mediaUrl, $postId, $rssItem->content, 'id');
            set_post_thumbnail($postId, $mediaId);
        }

        $importedItems[] = $rssItem->link;
    }
}
