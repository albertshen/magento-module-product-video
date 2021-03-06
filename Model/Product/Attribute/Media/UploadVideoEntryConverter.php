<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace AlbertMage\ProductVideo\Model\Product\Attribute\Media;

use Magento\ProductVideo\Model\Product\Attribute\Media\ExternalVideoEntryConverter;

/**
 * Converter for External Video media gallery type
 */
class UploadVideoEntryConverter extends ExternalVideoEntryConverter
{
    /**
     * Media Entry type code
     */
    const MEDIA_TYPE_CODE = 'upload-video';
}
