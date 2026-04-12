'use client'

import { useState } from 'react'
import { Trash2, AlertCircle, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductGroup as ProductGroupType } from '@/types'
import { useAssetStore } from '@/stores/useAssetStore'
import { ImageGridTile } from './ImageGridTile'
import { Button } from '@/components/ui/Button'
import { sanitizeString } from '@/lib/filename'

interface ProductGroupProps {
  group: ProductGroupType
}

export function ProductGroup({ group }: ProductGroupProps) {
  const getGroupImages = useAssetStore((state) => state.getGroupImages)
  const setGroupSku = useAssetStore((state) => state.setGroupSku)
  const deleteGroup = useAssetStore((state) => state.deleteGroup)
  const collapsedGroups = useAssetStore((state) => state.collapsedGroups)
  const toggleGroupCollapse = useAssetStore((state) => state.toggleGroupCollapse)
  const assignImageToGroup = useAssetStore((state) => state.assignImageToGroup)

  const [isDragOver, setIsDragOver] = useState(false)

  const images = getGroupImages(group.id)
  const isCollapsed = collapsedGroups.includes(group.id)

  const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSku(group.id, e.target.value)
  }

  const handleDelete = () => {
    if (confirm(`Delete group "${group.name}"? Images will be moved to ungrouped.`)) {
      deleteGroup(group.id)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const imageId = e.dataTransfer.getData('imageId')
    
    if (imageId) {
      assignImageToGroup(imageId, group.id)
    }
  }

  const completedImages = images.filter(img => img.descriptor !== null).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
    >
      <div 
        className={`px-4 sm:px-6 py-4 flex items-center justify-between border-b transition-all duration-300 ${
          isDragOver 
            ? 'border-treez-purple bg-treez-purple/10 border-2' 
            : 'border-white/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button
          onClick={() => toggleGroupCollapse(group.id)}
          className="flex-1 flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base sm:text-lg font-semibold text-white">{group.name}</h3>
            {images.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full 
                  bg-treez-cyan/20 border border-treez-cyan/30 
                  text-treez-cyan text-xs font-medium">
                  {images.length} {images.length === 1 ? 'image' : 'images'}
                </span>
                {completedImages === images.length && images.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full 
                    bg-success/20 border border-success/30 
                    text-success text-xs font-medium">
                    ✓ Complete
                  </span>
                )}
              </div>
            )}
          </div>
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-error hover:text-error hover:bg-error/10 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div 
              className={`p-4 sm:p-6 transition-all duration-300 ${
                isDragOver ? 'bg-treez-purple/5' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <label htmlFor={`sku-${group.id}`} className="block text-sm text-gray-400 mb-2">
                  Product SKU
                </label>
                <input
                  id={`sku-${group.id}`}
                  type="text"
                  value={group.sku}
                  onChange={handleSkuChange}
                  placeholder="e.g., 63755, AB-100, SKU123"
                  className="w-full px-4 py-3 
                    bg-white/5 backdrop-blur-sm 
                    border border-white/10 
                    rounded-lg text-white 
                    placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-treez-purple 
                    transition-all duration-300"
                />
                {group.sku && group.sku !== sanitizeString(group.sku) && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-yellow-400">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>
                      Special characters will be removed. Preview:{' '}
                      <code className="text-treez-cyan bg-treez-cyan/10 px-1 py-0.5 rounded">
                        {sanitizeString(group.sku)}
                      </code>
                    </span>
                  </div>
                )}
                {(!group.sku || group.sku === sanitizeString(group.sku)) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Lowercase letters, numbers, and hyphens only
                  </p>
                )}
              </div>

              {images.length === 0 ? (
                <div className={`text-center py-8 text-gray-500 border-2 border-dashed rounded-lg transition-all duration-300 ${
                  isDragOver 
                    ? 'border-treez-purple bg-treez-purple/10 scale-[1.02]' 
                    : 'border-white/10'
                }`}>
                  <p className={`mb-2 transition-colors duration-300 ${
                    isDragOver ? 'text-treez-purple' : ''
                  }`}>
                    {isDragOver ? '📥 Drop image here' : 'No images in this group yet'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isDragOver ? 'Release to assign' : 'Drag images here or assign from ungrouped section below'}
                  </p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {images.map((image) => (
                    <motion.div
                      key={image.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                    >
                      <ImageGridTile image={image} groupId={group.id} sku={group.sku} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
