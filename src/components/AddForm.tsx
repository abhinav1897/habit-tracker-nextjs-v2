'use client'
import { useState, useEffect } from 'react'
import './AddForm.css'
import { usePostHog } from '@posthog/react'

const EMOJIS = ['🌱','💪','🪴','🏃','🧘','🧗','🥗','😴','🎯','✏️','🎸','📖','🚴','🧠','📱','☕','🏋','🧹','🎨','🌿','🏔️','🎵','🐶','🧑‍💻','🌊','💻','🧪','🎭','🎯','🌿']

interface AddFormProps {
  onAdd: (name: string, emoji: string) => Promise<void>
}

function AddForm({ onAdd }: AddFormProps) {
  const posthog = usePostHog()
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🌱')
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (!pickerOpen) return
    const close = () => setPickerOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [pickerOpen])

  async function handleAdd(): Promise<void> {
    const trimmed = name.trim()
    if (!trimmed) return
    posthog?.capture('habit_added', { habit_name: trimmed, habit_emoji: selectedEmoji })
    await onAdd(trimmed, selectedEmoji)
    setName('')
  }

  function handleEmojiSelect(emoji: string): void {
    setSelectedEmoji(emoji)
    setPickerOpen(false)
  }

  return (
    <div className="add-form">
      <div
        className="emoji-btn"
        onClick={e => { e.stopPropagation(); setPickerOpen(v => !v) }}
      >
        <span>{selectedEmoji}</span>
        {pickerOpen && (
          <div className="emoji-picker" onClick={e => e.stopPropagation()}>
            {EMOJIS.map((emoji, i) => (
              <button key={i} onClick={() => handleEmojiSelect(emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      <input
        className="name-input"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
        placeholder="Add a new habit…"
        maxLength={40}
      />
      <button className="add-btn" onClick={handleAdd}>+</button>
    </div>
  )
}

export default AddForm
