'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useAssetStore } from '@/stores/useAssetStore'
import { CompactImageTile } from './CompactImageTile'
import { ProductGroup } from '@/types'

interface UngroupedGalleryProps {
  ungroupedImages: { id: string; thumbnail: string; originalName: string; groupId: string | null; file: File; extension: string; descriptor: string | null; customDescriptor: string | null }[]
  groups: ProductGroup[]
}

export function UngroupedGallery({ ungroupedImages, groups }: UngroupedGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const assignImageToGroup = useAssetStore((state) => state.assignImageToGroup)

  if (ungroupedImages.length === 0) {
    return null
  }

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId)
  }

  const handleGroupSelect = (groupId: string) => {
    if (selectedImageId) {
      assignImageToGroup(selectedImageId, groupId)
      setSelectedImageId(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-6 py-4 flex items-center justify-between 
          hover:bg-white/5 transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Ungrouped Images
          </h3>
          <span className="px-2 py-0.5 rounded-full 
            bg-yellow-500/20 border border-yellow-500/30 
            text-yellow-400 text-xs font-medium">
            {ungroupedImages.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-treez-purple" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-6 pt-0">
              {groups.length > 0 ? (
                <>
                  <p className="text-sm text-gray-400 mb-4">
                    {selectedImageId 
                      ? 'Select a group to assign the image to:' 
                      : 'Click an image, then select a group to assign it'}
                  </p>

                  {selectedImageId && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {groups.map((group) => (
                        <button
                          key={group.id}
                          onClick={() => handleGroupSelect(group.id)}
                          className="px-4 py-2 rounded-lg 
                            bg-linear-to-r from-treez-purple to-treez-pink
                            text-white font-medium text-sm
                            hover:scale-105 hover:shadow-lg hover:shadow-treez-purple/30
                            transition-all duration-300"
                        >
                          → {group.name}
                        </button>
                      ))}
                      <button
                        onClick={() => setSelectedImageId(null)}
                        className="px-4 py-2 rounded-lg 
                          border border-white/20 text-gray-400 text-sm
                          hover:border-error hover:text-error
                          transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

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
                    {ungroupedImages.map((image) => (
                      <motion.div
                        key={image.id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                        className={selectedImageId === image.id ? 'ring-2 ring-treez-purple rounded-lg' : ''}
                      >
                        <CompactImageTile
                          image={image}
                          onClick={() => handleImageClick(image.id)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              ) : (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-lg">
                  <p className="text-gray-400 mb-2">Create a product group first</p>
                  <p className="text-sm text-gray-500">Then you can assign these images to it</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
