'use client'

import { X } from 'lucide-react'
import { AssetImage } from '@/types'
import { useAssetStore } from '@/stores/useAssetStore'
import { DescriptorSelect } from './DescriptorSelect'
import { FilenamePreview } from './FilenamePreview'

interface ImageCardProps {
  image: AssetImage
  sku: string
}

export function ImageCard({ image, sku }: ImageCardProps) {
  const removeImage = useAssetStore((state) => state.removeImage)

  const handleRemove = () => {
    removeImage(image.id)
  }

  return (
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-[#915eff]/30 transition-all duration-300 group">
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-error/20 hover:bg-error/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        title="Remove image"
      >
        <X className="w-4 h-4 text-error" />
      </button>

      <div className="flex gap-4">
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-black/20">
          <img
            src={image.thumbnail}
            alt={image.originalName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <p className="text-xs text-gray-500 truncate" title={image.originalName}>
              {image.originalName}
            </p>
          </div>

          <DescriptorSelect
            imageId={image.id}
            groupId={image.groupId}
            currentDescriptor={image.descriptor}
            currentCustom={image.customDescriptor}
          />

          <FilenamePreview
            sku={sku}
            descriptor={image.descriptor}
            customDescriptor={image.customDescriptor}
            originalFilename={image.originalName}
          />
        </div>
      </div>
    </div>
  )
}
