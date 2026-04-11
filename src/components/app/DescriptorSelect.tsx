'use client'

import { AlertCircle } from 'lucide-react'
import { useAssetStore } from '@/stores/useAssetStore'
import { DEFAULT_DESCRIPTORS } from '@/lib/constants'
import { sanitizeString } from '@/lib/filename'

interface DescriptorSelectProps {
  imageId: string
  groupId: string | null
  currentDescriptor: string | null
  currentCustom: string | null
}

export function DescriptorSelect({
  imageId,
  groupId,
  currentDescriptor,
  currentCustom,
}: DescriptorSelectProps) {
  const getUsedDescriptors = useAssetStore((state) => state.getUsedDescriptors)
  const setImageDescriptor = useAssetStore((state) => state.setImageDescriptor)
  const setCustomDescriptor = useAssetStore((state) => state.setCustomDescriptor)

  const usedDescriptors = groupId ? getUsedDescriptors(groupId) : []

  const handleDescriptorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageDescriptor(imageId, e.target.value)
  }

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDescriptor(imageId, e.target.value)
  }

  return (
    <div className="space-y-2">
      <select
        value={currentDescriptor || ''}
        onChange={handleDescriptorChange}
        className="w-full px-3 py-2 
          bg-white/5 backdrop-blur-sm 
          border border-white/10 
          rounded-lg text-white text-sm
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#915eff] 
          transition-all duration-300"
      >
        <option value="" disabled>
          Select descriptor...
        </option>
        {DEFAULT_DESCRIPTORS.map((desc) => {
          const isUsed =
            desc.value !== 'custom' &&
            usedDescriptors.includes(desc.value) &&
            currentDescriptor !== desc.value
          return (
            <option
              key={desc.value}
              value={desc.value}
              disabled={isUsed}
              className="bg-[#0a0a0a] text-white disabled:text-gray-600"
            >
              {desc.label} {isUsed ? '(used)' : ''}
            </option>
          )
        })}
      </select>

      {currentDescriptor === 'custom' && (
        <>
          <input
            type="text"
            value={currentCustom || ''}
            onChange={handleCustomChange}
            placeholder="Enter custom descriptor..."
            className="w-full px-3 py-2 
              bg-white/5 backdrop-blur-sm 
              border border-white/10 
              rounded-lg text-white text-sm
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#915eff] 
              transition-all duration-300"
          />
          {currentCustom && currentCustom !== sanitizeString(currentCustom) && (
            <div className="flex items-center gap-2 mt-1 text-xs text-yellow-400">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>
                Special characters will be removed. Preview:{' '}
                <code className="text-[#00d4ff] bg-[#00d4ff]/10 px-1 py-0.5 rounded">
                  {sanitizeString(currentCustom)}
                </code>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
