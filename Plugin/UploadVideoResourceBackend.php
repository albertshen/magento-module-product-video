<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace AlbertMage\ProductVideo\Plugin;

use Magento\Catalog\Model\ResourceModel\Product\Gallery;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Filesystem;

/**
 * Media Resource decorator
 */
class UploadVideoResourceBackend
{
    /**
     * @var Filesystem\Directory\WriteInterface
     */
    private $mediaDirectory;

    /**
     * @param \Magento\ProductVideo\Model\ResourceModel\Video $videoResourceModel
     */
    public function __construct()
    {
        $filesystem = ObjectManager::getInstance()->create(Filesystem::class);
        $this->mediaDirectory = $filesystem->getDirectoryWrite(DirectoryList::MEDIA);
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
        &$data
    )
    {

        if (isset($data['provider']) && $data['provider'] === 'uploader') {
            if ($this->isNewVideo($data['url'])) {
                try {
                    $result = $this->mediaDirectory->copyFile(
                        $this->mediaDirectory->getAbsolutePath($data['url']),
                        $this->mediaDirectory->getAbsolutePath($this->tagetVideoPath($data['url']))
                    );
                    $this->mediaDirectory->delete($this->mediaDirectory->getAbsolutePath($data['url']));
                    $data['url'] = $this->tagetVideoPath($data['url']);
                } catch (\Exception $e) {
                    $result = [
                        'error' => $e->getMessage(),
                        'errorcode' => $e->getCode()
                    ];
                }
            }
        }
    }

    private function isNewVideo($path)
    {
        if (strpos($path, 'tmp/') === 0) {
            return true;
        }
        return false;
    }

    private function tagetVideoPath($path)
    {
        return substr($path, 4);
    }
}
