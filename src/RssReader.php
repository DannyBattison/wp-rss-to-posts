<?php

namespace Danny\WordPress\Rss;

class RssReader
{
    /** @var RssReader|null */
    private static $rssReader = null;

    /** @var \FeedIo\FeedIo */
    private $feedIo;

    public static function getInstance()
    {
        if (self::$rssReader === null) {
            self::$rssReader = new RssReader;
        }

        return self::$rssReader;
    }

    public function __construct()
    {
        $this->feedIo = \FeedIo\Factory::create()->getFeedIo();;
    }

    /**
     * @todo: make settings page
     * @return array
     */
    public function getFeedUrls()
    {
        return [
            'https://queryfeed.net/instagram?q=capnhammered',
        ];
    }

    /**
     * @todo: register hooks
     */
    public function registerHooks()
    {
        add_action('init', [$this, 'checkForPosts']);
    }

    /**
     * @todo: cleaner CDATA handling
     * @todo: sideload images
     * @todo: abstract out post creation
     */
    public function checkForPosts()
    {
        foreach ($this->getFeedUrls() as $feed) {
            $result = $this->feedIo->read($feed);
            /** @var \FeedIo\Feed\Item $item */
            foreach($result->getFeed() as $item) {
                $medias = $item->getMedias();
                $mediaUrls = [];
                /** @var \FeedIo\Feed\Item\Media $media */
                foreach ($medias as $media) {
                    $mediaUrls[] = $media->getUrl();
                }

                $body = str_replace(['<![CDATA[', ']]>'], ['', ''], $item->getDescription());

                $created = $item->getLastModified()->format('Y-m-d H:i:s');

                $postId = wp_insert_post([
                    'post_date' => $created,
                    'post_content' => $body,
                    'post_title' => 'Instagram Post',
                    'post_status' => 'publish',
                ], true);

                require_once(ABSPATH . 'wp-admin/includes/media.php');
                require_once(ABSPATH . 'wp-admin/includes/file.php');
                require_once(ABSPATH . 'wp-admin/includes/image.php');

                foreach ($mediaUrls as $mediaUrl) {
                    // magic sideload image returns an HTML image, not an ID
                    $mediaId = media_sideload_image($mediaUrl, $postId, $body, 'id');
                    var_dump(['postId' => $postId, 'mediaId' => $mediaId]);
                    set_post_thumbnail($postId, $mediaId);
                }
                exit;
            }
        }
        exit;
    }
}
