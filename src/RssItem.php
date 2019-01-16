<?php

namespace Danny\WordPress\Rss;

use FeedIo\Feed\Item;

/**
 * @todo: hydrator
 */
class RssItem
{
    public $mediaUrls;

    public $title;

    public $content;

    public $created;

    public $categories;

    public function __construct(Item $item)
    {
        $medias = $item->getMedias();
        $this->mediaUrls = [];
        /** @var \FeedIo\Feed\Item\Media $media */
        foreach ($medias as $media) {
            $this->mediaUrls[] = $media->getUrl();
        }

        $this->title = trim($item->getTitle());

        $this->content = trim(str_replace(['<![CDATA[', ']]>'], ['', ''], $item->getDescription()));

        $this->created = $item->getLastModified()->format('Y-m-d H:i:s');

        $itemCategories = $item->getCategories();

        $this->categories = [];
        /** @var \FeedIo\Feed\Node\Category $category */
        foreach ($itemCategories as $category) {
            $this->categories[] = $category->getTerm();
        }
    }
}
