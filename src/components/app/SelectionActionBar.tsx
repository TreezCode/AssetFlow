'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Tag, XCircle, CheckSquare } from 'lucide-react'
import { useAssetStore } from '@/stores/useAssetStore'
import { Button } from '@/components/ui/Button'
import { sanitizeString } from '@/lib/filename'

export function SelectionActionBar() {
  const [showSkuInput, setShowSkuInput] = useState(false)
  const [newSku, setNewSku] = useState('')
  
  const images = useAssetStore((state) => state.images)
  const selectedImageIds = useAssetStore((state) => state.selectedImageIds)
  const clearSelection = useAssetStore((state) => state.clearSelection)
  const selectAllInContext = useAssetStore((state) => state.selectAllInContext)
  const removeImage = useAssetStore((state) => state.removeImage)
  const setImageSku = useAssetStore((state) => state.setImageSku)
  const setBulkSku = useAssetStore((state) => state.setBulkSku)
  const showConfirmDialog = useAssetStore((state) => state.showConfirmDialog)
  const addToast = useAssetStore((state) => state.addToast)

  const count = selectedImageIds.length
  
  // Get selected images to determine context
  const selectedImages = images.filter((img) => selectedImageIds.includes(img.id))
  const allHaveSku = selectedImages.every((img) => img.sku)
  const noneHaveSku = selectedImages.every((img) => !img.sku)
  
  // Determine the current selection context (SKU or no-SKU)
  const selectionContext = selectedImages[0]?.sku || null // null means no-SKU section
  
  // Get total images in current context
  const contextImages = selectionContext 
    ? images.filter((img) => img.sku === selectionContext)
    : images.filter((img) => !img.sku)
  const totalInContext = contextImages.length
  const allSelectedInContext = count === totalInContext && totalInContext > 0
  
  // Get existing SKUs for dropdown
  const existingSkus = Array.from(
    new Set(images.filter((img) => img.sku).map((img) => img.sku as string))
  ).sort()

  if (count === 0) return null

  const handleDelete = () => {
    showConfirmDialog({
      title: 'Delete selected images?',
      description: `${count} image(s) will be permanently removed. This cannot be undone.`,
      variant: 'danger',
      confirmLabel: 'Delete',
      onConfirm: () => {
        selectedImageIds.forEach((id) => removeImage(id))
        addToast('success', `${count} image(s) deleted`)
        clearSelection()
      },
    })
  }

  const handleRemoveSku = () => {
    showConfirmDialog({
      title: 'Remove SKU from selected images?',
      description: `SKU will be removed from ${count} image(s). You can reassign them later.`,
      variant: 'warning',
      confirmLabel: 'Remove SKU',
      onConfirm: () => {
        selectedImageIds.forEach((id) => setImageSku(id, ''))
        addToast('success', `SKU removed from ${count} image(s)`)
        clearSelection()
      },
    })
  }

  const handleAssignSku = (skuValue: string) => {
    const sanitized = sanitizeString(skuValue)
    
    if (!sanitized) {
      addToast('warning', 'Please enter a valid SKU')
      return
    }

    setBulkSku(selectedImageIds, sanitized)
    addToast('success', `SKU "${sanitized}" assigned to ${count} image(s)`)
    setNewSku('')
    setShowSkuInput(false)
    clearSelection()
  }

  const handleQuickAssign = () => {
    handleAssignSku(newSku)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="sticky top-16 sm:top-20 z-30 mb-4 sm:mb-6"
      >
        <div className="bg-treez-purple/95 backdrop-blur-xl border border-treez-purple/50 
          rounded-lg sm:rounded-xl p-2.5 sm:p-4 shadow-lg shadow-treez-purple/20">
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Selection Count - Compact on mobile */}
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{count}</span>
                </div>
                <span className="text-white font-medium text-sm sm:text-base">
                  {count} selected
                </span>
              </div>
              
              {/* Select All button - compact on mobile */}
              {!allSelectedInContext && totalInContext > 1 && (
                <button
                  onClick={() => selectAllInContext(selectionContext || undefined)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md
                    bg-white/10 hover:bg-white/20 text-white text-xs
                    transition-colors duration-200 border border-white/20"
                >
                  <CheckSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Select All</span>
                  <span className="sm:hidden">All</span> ({totalInContext})
                </button>
              )}
            </div>

            {/* Actions - Compact grid on mobile */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {!showSkuInput ? (
                <>
                  <button
                    onClick={() => setShowSkuInput(true)}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg
                      bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm
                      transition-colors duration-200"
                  >
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{noneHaveSku ? 'Assign SKU' : 'Change SKU'}</span>
                    <span className="sm:hidden">SKU</span>
                  </button>

                  {/* Only show Remove SKU if ALL selected images have SKU */}
                  {allHaveSku && (
                    <button
                      onClick={handleRemoveSku}
                      className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg
                        bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm
                        transition-colors duration-200"
                    >
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}

                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg
                      bg-error/20 hover:bg-error/30 text-white text-xs sm:text-sm
                      transition-colors duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>

                  <button
                    onClick={clearSelection}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg
                      bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm
                      transition-colors duration-200"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </>
              ) : (
                <>
                  {existingSkus.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value === '__new__') {
                          return // Stay in input mode
                        }
                        handleAssignSku(e.target.value)
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20
                        text-white text-sm
                        focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                      <option value="" className="bg-deep-space">Select existing SKU...</option>
                      {existingSkus.map((sku) => (
                        <option key={sku} value={sku} className="bg-deep-space">
                          {sku}
                        </option>
                      ))}
                      <option value="__new__" className="bg-deep-space">+ New SKU</option>
                    </select>
                  )}
                  
                  <span className="text-white/50 text-sm">or</span>
                  
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAssign()}
                    placeholder="Type new SKU..."
                    autoFocus
                    className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20
                      text-white placeholder-white/50 text-sm
                      focus:outline-none focus:ring-2 focus:ring-white/30
                      w-40"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleQuickAssign}
                    disabled={!newSku.trim()}
                  >
                    Apply
                  </Button>
                  <button
                    onClick={() => {
                      setShowSkuInput(false)
                      setNewSku('')
                    }}
                    className="text-white/70 hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
