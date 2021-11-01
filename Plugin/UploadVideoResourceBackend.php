<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Albert\Magento\ProductVideo\Model\Plugin;

use Magento\Catalog\Model\ResourceModel\Product\Gallery;

/**
 * Media Resource decorator
 */
class UploadVideoResourceBackend
{
    /**
     * @var \Magento\ProductVideo\Model\ResourceModel\Video
     */
    protected $videoResourceModel;

    /**
     * @param \Magento\ProductVideo\Model\ResourceModel\Video $videoResourceModel
     */
    public function __construct(\Magento\ProductVideo\Model\ResourceModel\Video $videoResourceModel)
    {
        $this->videoResourceModel = $videoResourceModel;
    }

    /**
     * Save data row
     *
     * @param string $table
     * @param array $data
     * @param array $fields
     * @return int
     * @since 101.0.0
     */
    public function beforeSaveDataRow(
        Gallery $originalResourceModel,
        $table,
        array $data
    )
    {
        if ($data['provider'] === 'uploader') {
            var_dump($data);exit;
        }
    }
}
