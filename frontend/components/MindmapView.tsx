'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { FileText, Plus, Trash2 } from 'lucide-react'

interface MindmapNodeData {
  label: string
  noteId?: number
  isNote: boolean
}

const nodeTypes: NodeTypes = {
  mindmap: MindmapNode,
}

function MindmapNode({ data }: { data: MindmapNodeData }) {
  const { currentNote, setCurrentNote, notes } = useAppStore()
  const [isHovered, setIsHovered] = useState(false)

  const handleNodeClick = () => {
    if (data.isNote && data.noteId) {
      const note = notes.find(n => n.id === data.noteId)
      if (note) {
        setCurrentNote(note)
      }
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNodeClick}
      className={`mindmap-node ${data.isNote ? 'cursor-pointer' : ''} ${
        currentNote?.id === data.noteId ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-center space-x-2">
        {data.isNote && <FileText className="w-4 h-4 text-blue-500" />}
        <span className="font-medium text-sm">{data.label}</span>
      </div>
      
      {isHovered && data.isNote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
        >
          Click to open note
        </motion.div>
      )}
    </motion.div>
  )
}

export default function MindmapView() {
  const { notes, currentNote } = useAppStore()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Generate mindmap from notes
  const generateMindmap = useCallback(() => {
    if (notes.length === 0) return

    const centerNode: Node<MindmapNodeData> = {
      id: 'center',
      type: 'mindmap',
      position: { x: 400, y: 300 },
      data: { label: 'My Notes', isNote: false },
    }

    const noteNodes: Node<MindmapNodeData>[] = notes.map((note, index) => {
      const angle = (index / notes.length) * 2 * Math.PI
      const radius = 200
      const x = 400 + radius * Math.cos(angle)
      const y = 300 + radius * Math.sin(angle)

      return {
        id: `note-${note.id}`,
        type: 'mindmap',
        position: { x, y },
        data: {
          label: note.title,
          noteId: note.id,
          isNote: true,
        },
      }
    })

    const noteEdges: Edge[] = notes.map((note) => ({
      id: `edge-${note.id}`,
      source: 'center',
      target: `note-${note.id}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }))

    setNodes([centerNode, ...noteNodes])
    setEdges(noteEdges)
  }, [notes])

  useEffect(() => {
    generateMindmap()
  }, [generateMindmap])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowInstance.getBoundingClientRect()
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node<MindmapNodeData> = {
        id: `new-${Date.now()}`,
        type: 'mindmap',
        position,
        data: { label: 'New Node', isNote: false },
      }

      setNodes((nds) => [...nds, newNode])
    },
    [reactFlowInstance, setNodes]
  )

  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            🧠
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No notes to visualize
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create some notes to see them in mindmap view
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap
            nodeStrokeColor={(n) => {
              if (n.type === 'mindmap') {
                const data = n.data as MindmapNodeData
                return data.isNote ? '#3b82f6' : '#6b7280'
              }
              return '#6b7280'
            }}
            nodeColor={(n) => {
              if (n.type === 'mindmap') {
                const data = n.data as MindmapNodeData
                return data.isNote ? '#dbeafe' : '#f3f4f6'
              }
              return '#f3f4f6'
            }}
            nodeBorderRadius={8}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
