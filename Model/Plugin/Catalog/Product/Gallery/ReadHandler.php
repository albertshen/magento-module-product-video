<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Albert\Magento\ProductVideo\Model\Plugin\Catalog\Product\Gallery;

use Magento\ProductVideo\Model\Plugin\Catalog\Product\Gallery\ReadHandler as ExternalVideoReadHandler;

/**
 * Plugin for catalog product gallery read handler.
 */
class ReadHandler extends ExternalVideoReadHandler
{

    /**
     * @param array $mediaCollection
     * @return array
     */
    protected function collectVideoEntriesIds(array $mediaCollection)
    {
        $ids = [];
        foreach ($mediaCollection as $item) {
            if ($item['media_type'] !== 'image'
                && !isset($item['video_url'])
            ) {
                $ids[] = $item['value_id'];
            }
        }
        return $ids;
    }

}
