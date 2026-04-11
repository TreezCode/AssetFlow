'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAssetStore } from '@/stores/useAssetStore'
import { Button } from '@/components/ui/Button'

export function GroupManager() {
  const [groupName, setGroupName] = useState('')
  const createGroup = useAssetStore((state) => state.createGroup)

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      createGroup(groupName.trim())
      setGroupName('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateGroup()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Product group name (e.g., Sneakers, Hoodies)"
        className="flex-1 px-4 py-3 
          bg-white/5 backdrop-blur-sm 
          border border-white/10 
          rounded-lg text-white 
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-[#915eff] 
          transition-all duration-300"
      />
      <Button
        variant="primary"
        size="md"
        onClick={handleCreateGroup}
        disabled={!groupName.trim()}
        className="gap-2 whitespace-nowrap"
      >
        <Plus className="w-4 h-4" />
        Create Group
      </Button>
    </div>
  )
}
