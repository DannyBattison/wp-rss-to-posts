#!/bin/bash

rsync -av --progress . deploy/trunk --exclude deploy  --exclude admin/node_modules --exclude push.sh

VERSION="$(cat rss-to-posts.php | grep "Version: " -m 1 | tr -d "[:space:]")"

cd deploy
svn add *

svn ci -m "$VERSION"

cd ..

echo "\nSuccessfully uploaded $VERSION to WP SVN"
