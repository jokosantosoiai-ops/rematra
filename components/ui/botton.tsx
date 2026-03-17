"use client"

type Props = {
  text: string
  onClick?: () => void
}

export default function Button({ text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl active:scale-95"
    >
      {text}
    </button>
  )
}