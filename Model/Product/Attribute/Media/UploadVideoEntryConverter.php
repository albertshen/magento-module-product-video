<?php
/**
 * Copyright © PHPDigital, Inc. All rights reserved.
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

    /**
     * @return string
     */
    public function getMediaEntryType()
    {
        return self::MEDIA_TYPE_CODE;
    }
}
